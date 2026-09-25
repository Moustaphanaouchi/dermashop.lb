import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (req.headers.get('x-real-ip') ?? '127.0.0.1');
    const { success } = await apiRateLimit.limit(ip);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const products = await prisma.product.findMany({
      include: { media: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}