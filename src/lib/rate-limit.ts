import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const hasRedisCredentials =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedisCredentials
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Mock limiter that always allows requests if Redis is unconfigured
const fallbackLimiter = {
  limit: async () => ({
    success: true,
    limit: 100,
    remaining: 100,
    reset: 0,
    pending: Promise.resolve(),
  }),
};

export const adminRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '10 s'),
      analytics: true,
      prefix: 'rl:admin',
    })
  : fallbackLimiter;

export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'rl:api',
    })
  : fallbackLimiter;

export const orderRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: true,
      prefix: 'rl:order',
    })
  : fallbackLimiter;