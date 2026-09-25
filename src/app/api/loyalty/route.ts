import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.trim();
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { phone } });
  if (!customer) return NextResponse.json({ points: 0, isFirstOrder: true });

  return NextResponse.json({ points: customer.points, isFirstOrder: false });
}