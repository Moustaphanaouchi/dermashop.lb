"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { DEFAULT_PRODUCTS, SERUM_BUNDLE, type Coupon, type Product } from "@/state/catalog";
import { safeJsonParse, STORAGE_KEYS } from "@/state/storage";

export type CartLine = {
  productId: string;
  quantity: number;
};

type State = {
  products: Product[];
  coupons: Coupon[];
  appliedCouponCode: string;
  brand: {
    logoUrl: string;
  };
  cart: CartLine[];
  cartOpen: boolean;
};

type Action =
  | { type: "cart/open"; open: boolean }
  | { type: "cart/add"; productId: string; quantity?: number }
  | { type: "cart/setQty"; productId: string; quantity: number }
  | { type: "cart/remove"; productId: string }
  | { type: "cart/clear" }
  | { type: "products/set"; products: Product[] }
  | { type: "coupons/set"; coupons: Coupon[] }
  | { type: "coupon/apply"; code: string }
  | { type: "coupon/clear" }
  | { type: "brand/setLogoUrl"; logoUrl: string };

const initialState: State = {
  products: DEFAULT_PRODUCTS,
  coupons: [
    { code: "WELCOME5", title: "Welcome $5", amountOffUsd: 5, active: true },
    { code: "DERMA10", title: "10% Off", percentOff: 10, active: true }
  ],
  appliedCouponCode: "",
  brand: {
    logoUrl: ""
  },
  cart: [],
  cartOpen: false
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "cart/open":
      return { ...state, cartOpen: action.open };
    case "cart/add": {
      const qty = action.quantity ?? 1;
      const existing = state.cart.find((l) => l.productId === action.productId);
      const nextCart = existing
        ? state.cart.map((l) =>
            l.productId === action.productId ? { ...l, quantity: l.quantity + qty } : l
          )
        : [...state.cart, { productId: action.productId, quantity: qty }];
      return { ...state, cart: nextCart, cartOpen: true };
    }
    case "cart/setQty": {
      const nextQty = Math.max(0, Math.floor(action.quantity));
      const nextCart =
        nextQty === 0
          ? state.cart.filter((l) => l.productId !== action.productId)
          : state.cart.map((l) =>
              l.productId === action.productId ? { ...l, quantity: nextQty } : l
            );
      return { ...state, cart: nextCart };
    }
    case "cart/remove":
      return { ...state, cart: state.cart.filter((l) => l.productId !== action.productId) };
    case "cart/clear":
      return { ...state, cart: [], cartOpen: false };
    case "products/set":
      return { ...state, products: action.products };
    case "coupons/set":
      return { ...state, coupons: action.coupons };
    case "coupon/apply":
      return { ...state, appliedCouponCode: action.code };
    case "coupon/clear":
      return { ...state, appliedCouponCode: "" };
    case "brand/setLogoUrl":
      return { ...state, brand: { ...state.brand, logoUrl: action.logoUrl } };
    default:
      return state;
  }
}

type Store = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  appliedCouponCode: string;
  applyCoupon: (code: string) => void;
  clearCoupon: () => void;
  brand: {
    logoUrl: string;
  };
  setLogoUrl: (logoUrl: string) => void;
  cartOpen: boolean;
  openCart: (open: boolean) => void;
  cart: CartLine[];
  addToCart: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<Store | null>(null);

function normalizeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  const cleaned: Product[] = [];
  for (const p of products) {
    if (!p?.id || typeof p.id !== "string") continue;
    const id = p.id.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    cleaned.push({
      id,
      name: String(p.name ?? "").trim() || id,
      category: (p.category ?? "Skin") as Product["category"],
      priceUsd: Number.isFinite(p.priceUsd) ? Math.max(0, Number(p.priceUsd)) : 0,
      inStock: Boolean(p.inStock),
      description: typeof p.description === "string" ? p.description : "",
      media: Array.isArray(p.media) ? p.media : [],
      badge: typeof p.badge === "string" ? p.badge : undefined
    });
  }
  return cleaned.length ? cleaned : DEFAULT_PRODUCTS;
}

function normalizeCoupons(coupons: Coupon[]): Coupon[] {
  const cleaned: Coupon[] = [];
  const seen = new Set<string>();
  for (const c of coupons) {
    const code = String(c.code ?? "").trim().toUpperCase();
    if (!code || seen.has(code)) continue;
    seen.add(code);
    const percentOff = c.percentOff != null ? Number(c.percentOff) : undefined;
    const amountOffUsd = c.amountOffUsd != null ? Number(c.amountOffUsd) : undefined;
    cleaned.push({
      code,
      title: typeof c.title === "string" ? c.title : undefined,
      active: Boolean(c.active),
      percentOff: Number.isFinite(percentOff) ? Math.min(100, Math.max(0, percentOff!)) : undefined,
      amountOffUsd: Number.isFinite(amountOffUsd) ? Math.max(0, amountOffUsd!) : undefined
    });
  }
  return cleaned;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedProducts = safeJsonParse<Product[]>(localStorage.getItem(STORAGE_KEYS.products));
    const storedCoupons = safeJsonParse<Coupon[]>(localStorage.getItem(STORAGE_KEYS.coupons));
    const storedBrand = safeJsonParse<{ logoUrl?: string }>(localStorage.getItem(STORAGE_KEYS.brand));
    const applied = safeJsonParse<{ code: string }>(localStorage.getItem(STORAGE_KEYS.appliedCoupon))?.code ?? "";

    // Migration: old overrides -> merge into defaults then persist full products
    const overrides = safeJsonParse<Record<string, Partial<Pick<Product, "priceUsd" | "inStock">>>>(
      localStorage.getItem(STORAGE_KEYS.productOverrides)
    );
    const cart = safeJsonParse<CartLine[]>(localStorage.getItem(STORAGE_KEYS.cart));
    if (storedProducts) dispatch({ type: "products/set", products: normalizeProducts(storedProducts) });
    else if (overrides) {
      const migrated = DEFAULT_PRODUCTS.map((p) => ({ ...p, ...(overrides[p.id] ?? {}) }));
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(migrated));
      dispatch({ type: "products/set", products: migrated });
    }

    if (storedCoupons) dispatch({ type: "coupons/set", coupons: normalizeCoupons(storedCoupons) });
    if (applied) dispatch({ type: "coupon/apply", code: String(applied).trim().toUpperCase() });
    if (storedBrand?.logoUrl != null) dispatch({ type: "brand/setLogoUrl", logoUrl: String(storedBrand.logoUrl) });

    if (cart) {
      for (const line of cart) {
        dispatch({ type: "cart/add", productId: line.productId, quantity: line.quantity });
      }
      dispatch({ type: "cart/open", open: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products));
  }, [state.products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.coupons, JSON.stringify(state.coupons));
  }, [state.coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appliedCoupon, JSON.stringify({ code: state.appliedCouponCode }));
  }, [state.appliedCouponCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.brand, JSON.stringify(state.brand));
  }, [state.brand]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  }, [state.cart]);

  const products = useMemo(() => normalizeProducts(state.products), [state.products]);

  const store = useMemo<Store>(
    () => ({
      products,
      setProducts: (products) => dispatch({ type: "products/set", products: normalizeProducts(products) }),
      coupons: state.coupons,
      setCoupons: (coupons) => dispatch({ type: "coupons/set", coupons: normalizeCoupons(coupons) }),
      appliedCouponCode: state.appliedCouponCode,
      applyCoupon: (code) => dispatch({ type: "coupon/apply", code: code.trim().toUpperCase() }),
      clearCoupon: () => dispatch({ type: "coupon/clear" }),
      brand: state.brand,
      setLogoUrl: (logoUrl) => dispatch({ type: "brand/setLogoUrl", logoUrl }),
      cartOpen: state.cartOpen,
      openCart: (open) => dispatch({ type: "cart/open", open }),
      cart: state.cart,
      addToCart: (productId) => dispatch({ type: "cart/add", productId }),
      setQty: (productId, quantity) => dispatch({ type: "cart/setQty", productId, quantity }),
      removeFromCart: (productId) => dispatch({ type: "cart/remove", productId }),
      clearCart: () => dispatch({ type: "cart/clear" })
    }),
    [products, state.cartOpen, state.cart, state.coupons, state.appliedCouponCode, state.brand]
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function getProductById(products: Product[], id: string) {
  return products.find((p) => p.id === id) ?? null;
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function computeCartPricing(
  products: Product[],
  cart: CartLine[],
  opts?: {
    coupon: Coupon | null;
  }
) {
  const lines = cart
    .map((l) => {
      const product = getProductById(products, l.productId);
      if (!product) return null;
      return {
        product,
        quantity: l.quantity,
        lineSubtotalUsd: product.priceUsd * l.quantity
      };
    })
    .filter(Boolean) as Array<{ product: Product; quantity: number; lineSubtotalUsd: number }>;

  const subtotalUsd = lines.reduce((acc, l) => acc + l.lineSubtotalUsd, 0);

  const serumQty = lines
    .filter((l) => l.product.category === "Serums")
    .reduce((acc, l) => acc + l.quantity, 0);
  const serumRegularUsd = lines
    .filter((l) => l.product.category === "Serums")
    .reduce((acc, l) => acc + l.lineSubtotalUsd, 0);

  const groups = Math.floor(serumQty / SERUM_BUNDLE.groupSize);
  const remainder = serumQty % SERUM_BUNDLE.groupSize;
  const serumDealUsd = groups * SERUM_BUNDLE.groupPriceUsd + remainder * SERUM_BUNDLE.unitPriceUsdDefault;

  const serumDiscountUsd = Math.max(0, serumRegularUsd - serumDealUsd);
  const afterSerumUsd = Math.max(0, subtotalUsd - serumDiscountUsd);

  const couponDiscountUsd = computeCouponDiscountUsd({
    subtotalUsd: afterSerumUsd,
    coupon: opts?.coupon ?? null
  });
  const totalUsd = Math.max(0, afterSerumUsd - couponDiscountUsd);

  return {
    lines,
    subtotalUsd,
    serumDiscountUsd,
    couponDiscountUsd,
    totalUsd,
    serumQty,
    serumGroups: groups
  };
}

export function getCouponByCode(coupons: Coupon[], code: string) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  return coupons.find((c) => c.code.toUpperCase() === normalized) ?? null;
}

export function computeCouponDiscountUsd(params: {
  subtotalUsd: number;
  coupon: Coupon | null;
}) {
  const { subtotalUsd, coupon } = params;
  if (!coupon || !coupon.active) return 0;
  const percent = coupon.percentOff != null ? Math.min(100, Math.max(0, coupon.percentOff)) : 0;
  const amount = coupon.amountOffUsd != null ? Math.max(0, coupon.amountOffUsd) : 0;

  const percentValue = (subtotalUsd * percent) / 100;
  const raw = Math.max(percentValue, amount);
  return Math.min(subtotalUsd, raw);
}

