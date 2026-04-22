export const STORAGE_KEYS = {
  productOverrides: "dermashop:product-overrides:v1",
  products: "dermashop:products:v2",
  coupons: "dermashop:coupons:v1",
  appliedCoupon: "dermashop:applied-coupon:v1",
  brand: "dermashop:brand:v1",
  adminAuthed: "dermashop:admin-authed:v1",
  cart: "dermashop:cart:v1"
} as const;

export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

