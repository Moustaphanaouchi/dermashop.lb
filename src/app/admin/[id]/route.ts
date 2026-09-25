import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/lib/validation';
import { authOptions } from '@/lib/auth';
import { adminRateLimit } from '@/lib/rate-limit';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = req.ip ?? '127.0.0.1';
  const { success } = await adminRateLimit.limit(ip);
  if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

  try {
    const body = await req.json();
    const validated = productSchema.partial().parse(body);

    const updateData: any = { ...validated };
    delete updateData.media;

    const product = await prisma.$transaction(async (tx) => {
      if (validated.media) {
        await tx.media.deleteMany({ where: { productId: params.id } });
        await tx.media.createMany({
          data: validated.media.map((m, i) => ({ productId: params.id, type: m.type, url: m.url, order: i })),
        });
      }
      return tx.product.update({
        where: { id: params.id },
        data: updateData,
        include: { media: { orderBy: { order: 'asc' } } },
      });
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}