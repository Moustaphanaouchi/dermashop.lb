export const DELIVERY_FEE = 4;
export const FREE_DELIVERY_THRESHOLD = 49;
export const POINTS_PER_DOLLAR = 1;
export const POINTS_REDEMPTION_RATE = 100;
export const POINTS_REDEMPTION_VALUE = 5;

export function calculateDelivery(amountAfterDiscount: number): number {
  return amountAfterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function calculatePointsEarned(total: number): number {
  return Math.floor(total * POINTS_PER_DOLLAR);
}

export function calculatePointsDiscount(pointsToRedeem: number): number {
  const redemptions = Math.floor(pointsToRedeem / POINTS_REDEMPTION_RATE);
  return redemptions * POINTS_REDEMPTION_VALUE;
}

export function lineTotal(
  price: number,
  quantity: number,
  bulkPrice?: number | null,
  bulkQty?: number | null
): number {
  if (bulkPrice && bulkQty && quantity >= bulkQty) {
    const sets = Math.floor(quantity / bulkQty);
    const remaining = quantity % bulkQty;
    return sets * bulkPrice + remaining * price;
  }
  return price * quantity;
}