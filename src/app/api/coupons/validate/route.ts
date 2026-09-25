import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase().trim();
  const phone = req.nextUrl.searchParams.get('phone')?.trim();

  if (!code) return NextResponse.json({ valid: false, message: 'No code provided' });

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon' });
  }

  if (coupon.firstOrderOnly && phone) {
    const existing = await prisma.customer.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ valid: false, message: 'This coupon is for first-time customers only' });
    }
  }

  return NextResponse.json({
    valid: true,
    percentOff: coupon.percentOff,
    dollarOff: coupon.dollarOff,
    code: coupon.code,
  });
}