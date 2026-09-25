export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9613448482').replace(/\D/g, '');
export const WISH_ACCOUNT = process.env.NEXT_PUBLIC_WISH_ACCOUNT || '03448482';

interface OrderMessageInput {
  items: { name: string; quantity: number; total: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'wishpay';
  couponCode?: string | null;
  pointsEarned: number;
}

export function buildWhatsAppMessage(o: OrderMessageInput): string {
  let msg = `🛍️ *DERMASHOP LB - New Order*\n\n📦 *ORDER DETAILS:*\n━━━━━━━━━━━━━━━\n\n`;

  o.items.forEach((item) => {
    msg += `• ${item.name}\n  Qty: ${item.quantity} — $${item.total.toFixed(2)}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `Subtotal: $${o.subtotal.toFixed(2)}\n`;
  if (o.discount > 0) {
    msg += `Discount: -$${o.discount.toFixed(2)}${o.couponCode ? ` (${o.couponCode})` : ''}\n`;
  }
  msg += `Delivery: ${o.deliveryFee === 0 ? 'FREE ✅' : `$${o.deliveryFee.toFixed(2)}`}\n`;
  msg += `*TOTAL: $${o.total.toFixed(2)}*\n\n`;

  msg += `👤 *Full Name:* ${o.customerName}\n`;
  msg += `📞 *Phone:* ${o.phone}\n`;
  msg += `📍 *Delivery Address:* ${o.address}\n\n`;

  msg += `💳 *Payment Method:* ${o.paymentMethod === 'cash' ? 'Cash on Delivery' : 'WishPay'}\n`;
  if (o.paymentMethod === 'wishpay') {
    msg += `Please send payment to Wish Money number: *${WISH_ACCOUNT}*\n\n`;
  } else {
    msg += `\n`;
  }

  msg += `🎁 You earned *${o.pointsEarned} loyalty points* on this order!\n\n`;
  msg += `Thank you for choosing Dermashop LB! 🌟`;

  return encodeURIComponent(msg);
}

export function whatsappUrl(encodedMessage: string): string {
  const cleanPhone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9613448482').replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}