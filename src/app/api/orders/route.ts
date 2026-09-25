import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderSchema } from '@/lib/validation';
import { orderRateLimit } from '@/lib/rate-limit';
import { calculateDelivery, calculatePointsEarned, calculatePointsDiscount, lineTotal } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await orderRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many orders. Please wait before ordering again.' }, { status: 429 });
    }

    const body = await req.json();
    const { customerName, phone, address, paymentMethod, items, couponCode, redeemPoints } = body;

    const validated = orderSchema.parse({ customerName, phone, address, paymentMethod });

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.id);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let subtotal = 0;
    const lineItems: { name: string; quantity: number; total: number }[] = [];

    for (const item of items) {
      const p = products.find((p) => p.id === item.id);
      if (!p) return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 400 });
      if (!p.stock) return NextResponse.json({ error: `Out of stock: ${p.name}` }, { status: 400 });

      const total = lineTotal(p.price, item.quantity, p.bulkPrice, p.bulkQty);
      subtotal += total;
      lineItems.push({ name: p.name, quantity: item.quantity, total });
    }

    let customer = await prisma.customer.findUnique({ where: { phone: validated.phone } });
    const isFirstOrder = !customer;
    if (!customer) {
      customer = await prisma.customer.create({
        data: { phone: validated.phone, name: validated.customerName },
      });
    }

    let discount = 0;
    let appliedCoupon: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase().trim() } });
      if (coupon && coupon.active) {
        if (coupon.firstOrderOnly && !isFirstOrder) {
          return NextResponse.json({ error: 'This coupon is for first-time customers only' }, { status: 400 });
        }
        let couponDiscount = 0;
        if (coupon.percentOff) couponDiscount = Math.max(couponDiscount, subtotal * (coupon.percentOff / 100));
        if (coupon.dollarOff) couponDiscount = Math.max(couponDiscount, coupon.dollarOff);
        discount += couponDiscount;
        appliedCoupon = coupon.code;
      }
    }

    let pointsUsed = 0;
    if (redeemPoints && customer.points >= 100) {
      const maxRedeemable = Math.floor(customer.points / 100) * 100;
      pointsUsed = Math.min(Number(redeemPoints), maxRedeemable);
      discount += calculatePointsDiscount(pointsUsed);
    }

    const afterDiscount = Math.max(0, subtotal - discount);
    const deliveryFee = calculateDelivery(afterDiscount);
    const total = afterDiscount + deliveryFee;
    const pointsEarned = calculatePointsEarned(total);

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        customerName: validated.customerName,
        phone: validated.phone,
        address: validated.address,
        paymentMethod: validated.paymentMethod,
        items: JSON.stringify(lineItems),
        subtotal,
        deliveryFee,
        discount,
        pointsUsed,
        pointsEarned,
        total,
        couponCode: appliedCoupon,
      },
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        points: { increment: pointsEarned - pointsUsed },
        totalSpent: { increment: total },
        name: validated.customerName,
      },
    });

    return NextResponse.json(
      {
        order,
        lineItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        pointsEarned,
        couponCode: appliedCoupon,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}