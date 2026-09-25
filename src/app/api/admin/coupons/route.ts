import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { couponSchema } from '@/lib/validation';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = couponSchema.parse({ ...body, code: body.code?.toUpperCase().trim() });

    const coupon = await prisma.coupon.create({ data: validated });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message }, { status: 400 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}