import { prisma } from '@/lib/prisma';
import Storefront from '@/components/Storefront';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, branding] = await Promise.all([
    prisma.product.findMany({
      include: { media: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.branding.findUnique({ where: { id: 'single' } }),
  ]);

  return <Storefront initialProducts={products} logoUrl={branding?.logoUrl ?? null} />;
}