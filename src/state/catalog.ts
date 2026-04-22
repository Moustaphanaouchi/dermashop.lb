export type Category = "Skin" | "Hair" | "Tools" | "Serums";

export type ProductMedia =
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string; posterUrl?: string };

export type Product = {
  id: string;
  name: string;
  category: Category;
  priceUsd: number;
  inStock: boolean;
  description?: string;
  media?: ProductMedia[];
  badge?: string;
};

export type Coupon = {
  code: string;
  title?: string;
  percentOff?: number; // 0-100
  amountOffUsd?: number; // fixed
  active: boolean;
};

export const WHATSAPP_NUMBER_E164 = "+9613448482";
export const WHATSAPP_NUMBER_WA_ME = "9613448482";

export const SERUM_BUNDLE = {
  groupSize: 3,
  groupPriceUsd: 16,
  unitPriceUsdDefault: 8
} as const;

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "serum-vitc",
    name: "Vitamin C Serum",
    category: "Serums",
    priceUsd: 8,
    inStock: true,
    description: "Brightens and supports an even-looking tone.",
    media: []
  },
  {
    id: "serum-ha",
    name: "Hyaluronic Acid Serum",
    category: "Serums",
    priceUsd: 8,
    inStock: true,
    description: "Hydration-focused serum for a plumper look.",
    media: []
  },
  {
    id: "serum-collagen",
    name: "Collagen Serum",
    category: "Serums",
    priceUsd: 8,
    inStock: true,
    description: "Helps support a firmer-looking complexion.",
    media: []
  },

  {
    id: "skin-pc-whitening",
    name: "Pierre Cardin Whitening Cream",
    category: "Skin",
    priceUsd: 13,
    inStock: true,
    description: "Premium cream for a brighter, more even look.",
    media: []
  },
  {
    id: "skin-clay-mask",
    name: "Detoxifying Clay Mask",
    category: "Skin",
    priceUsd: 13,
    inStock: true,
    description: "Deep-cleansing mask for a refreshed feel.",
    media: []
  },
  {
    id: "skin-sun-cream",
    name: "Sun Cream",
    category: "Skin",
    priceUsd: 11,
    inStock: true,
    description: "Daily sun protection for confident wear.",
    media: []
  },

  {
    id: "hair-anti-loss-spray",
    name: "Anti-Hair Loss Spray",
    category: "Hair",
    priceUsd: 12,
    inStock: true,
    description: "Targeted spray to support healthier-looking hair.",
    media: []
  },
  {
    id: "hair-fiber",
    name: "Hair Fiber",
    category: "Hair",
    priceUsd: 15,
    inStock: true,
    description: "Instant look of fuller hair (quick coverage).",
    media: []
  },
  {
    id: "hair-scalp-massager",
    name: "Scalp Massager",
    category: "Hair",
    priceUsd: 5,
    inStock: true,
    description: "Comfortable tool for scalp stimulation and care.",
    media: []
  },

  {
    id: "tool-derma-roller",
    name: "Derma Roller",
    category: "Tools",
    priceUsd: 8,
    inStock: true,
    description: "Beauty tool for your routine (use as directed).",
    media: []
  }
];

