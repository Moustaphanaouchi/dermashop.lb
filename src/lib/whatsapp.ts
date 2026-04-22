import { WHATSAPP_NUMBER_WA_ME } from "@/state/catalog";
import { formatUsd, type CartLine, computeCartPricing, getProductById } from "@/state/store";
import type { Product } from "@/state/catalog";

export type PaymentMethod = "Cash on Delivery" | "WishPay";

export type CheckoutDetails = {
  fullName: string;
  deliveryAddress: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  wishPayAccountNumber: string;
  appliedCouponCode?: string;
  couponDiscountUsd?: number;
};

export function buildWhatsAppOrderText(
  products: Product[],
  cart: CartLine[],
  details: CheckoutDetails,
  pricingOverride?: {
    subtotalUsd: number;
    serumDiscountUsd: number;
    couponDiscountUsd: number;
    totalUsd: number;
  }
) {
  const pricing = computeCartPricing(products, cart);
  const subtotalUsd = pricingOverride?.subtotalUsd ?? pricing.subtotalUsd;
  const serumDiscountUsd = pricingOverride?.serumDiscountUsd ?? pricing.serumDiscountUsd;
  const couponDiscountUsd = pricingOverride?.couponDiscountUsd ?? (details.couponDiscountUsd ?? 0);
  const totalUsd = pricingOverride?.totalUsd ?? pricing.totalUsd;

  const lines: string[] = [];
  lines.push("Dermashop LB — Order Request");
  lines.push("");
  lines.push("Items:");

  for (const l of pricing.lines) {
    const unit = l.product.priceUsd;
    lines.push(`- ${l.product.name} x${l.quantity} (${formatUsd(unit)} each)`);
  }

  lines.push("");
  lines.push(`Subtotal: ${formatUsd(subtotalUsd)}`);
  if (serumDiscountUsd > 0) {
    lines.push(`Serum Deal Discount: -${formatUsd(serumDiscountUsd)} (3 for $16)`);
  }
  if (couponDiscountUsd > 0 && details.appliedCouponCode) {
    lines.push(`Coupon (${details.appliedCouponCode}): -${formatUsd(couponDiscountUsd)}`);
  }
  lines.push(`Total: ${formatUsd(totalUsd)}`);
  lines.push("");
  lines.push("Customer Details:");
  lines.push(`Full Name: ${details.fullName}`);
  lines.push(`Delivery Address: ${details.deliveryAddress}`);
  lines.push(`Phone Number: ${details.phoneNumber}`);
  lines.push("");
  lines.push(`Payment Method: ${details.paymentMethod}`);
  if (details.paymentMethod === "WishPay") {
    lines.push(`WishPay Account Number to Pay: ${details.wishPayAccountNumber}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppCheckoutUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER_WA_ME}?text=${encodeURIComponent(message)}`;
}

export function canCheckout(products: Product[], cart: CartLine[]) {
  if (cart.length === 0) return false;
  for (const line of cart) {
    const p = getProductById(products, line.productId);
    if (!p || !p.inStock) return false;
  }
  return true;
}

