import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validation';
import { authOptions } from '@/lib/auth';
import { adminRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = req.ip ?? '127.0.0.1';
  const { success } = await adminRateLimit.limit(ip);
  if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const body = await req.json();
    const validated = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        category: validated.category,
        price: validated.price,
        bulkPrice: validated.bulkPrice ?? null,
        bulkQty: validated.bulkQty ?? null,
        stock: validated.stock,
        badge: validated.badge ?? null,
        description: validated.description,
        media: {
          create: validated.media.map((m, i) => ({ type: m.type, url: m.url, order: i })),
        },
      },
      include: { media: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message }, { status: 400 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}