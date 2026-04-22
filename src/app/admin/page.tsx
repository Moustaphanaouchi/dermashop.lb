"use client";

import React from "react";
import Link from "next/link";
import { AdminGate } from "@/components/AdminGate";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { DEFAULT_PRODUCTS, type Category, type Coupon, type Product, type ProductMedia } from "@/state/catalog";
import { useStore } from "@/state/store";

type AdminTab = "products" | "coupons" | "branding";

function slugifyId(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return base || `product-${Date.now()}`;
}

function NumberInput({
  value,
  onChange,
  className
}: {
  value: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  return (
    <input
      inputMode="decimal"
      value={Number.isFinite(value) ? String(value) : ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(
        "w-28 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15",
        className
      )}
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  className
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15",
        className
      )}
    />
  );
}

export default function AdminPage() {
  const { products, setProducts, coupons, setCoupons, brand, setLogoUrl } = useStore();
  const [tab, setTab] = React.useState<AdminTab>("products");
  const [query, setQuery] = React.useState("");
  const [createProductOpen, setCreateProductOpen] = React.useState(false);
  const [createProductName, setCreateProductName] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${p.id} ${p.category}`.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <AdminGate>
      <div className="min-h-screen bg-white">
        <div className="border-b border-zinc-200/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div>
              <div className="text-lg font-semibold tracking-tight">Admin Dashboard</div>
              <div className="text-sm text-zinc-600">Create, edit, and delete products. Add images/videos. Manage coupons.</div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-900/5"
              >
                Back to site
              </Link>
              <Button
                variant="secondary"
                onClick={() => {
                  if (!confirm("Reset products + coupons to defaults on this browser?")) return;
                  setProducts(DEFAULT_PRODUCTS);
                  setCoupons([
                    { code: "WELCOME5", title: "Welcome $5", amountOffUsd: 5, active: true },
                    { code: "DERMA10", title: "10% Off", percentOff: 10, active: true }
                  ]);
                }}
              >
                Reset to defaults
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("products")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-zinc-900/10 transition",
                  tab === "products" ? "bg-maroon-800 text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"
                )}
              >
                Products
              </button>
              <button
                onClick={() => setTab("coupons")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-zinc-900/10 transition",
                  tab === "coupons" ? "bg-maroon-800 text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"
                )}
              >
                Coupons
              </button>
              <button
                onClick={() => setTab("branding")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-zinc-900/10 transition",
                  tab === "branding" ? "bg-maroon-800 text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"
                )}
              >
                Branding
              </button>
            </div>

            {tab === "products" ? (
              <div className="flex w-full max-w-md items-center gap-2 sm:justify-end">
                <TextInput value={query} onChange={setQuery} placeholder="Search products..." />
                <Button
                  onClick={() => {
                    setCreateProductName("");
                    setCreateProductOpen(true);
                  }}
                >
                  + New
                </Button>
              </div>
            ) : tab === "coupons" ? (
              <div className="flex w-full max-w-md items-center gap-2 sm:justify-end">
                <Button
                  onClick={() => {
                    const code = prompt("Coupon code (e.g. SAVE10)?");
                    if (!code) return;
                    const normalized = code.trim().toUpperCase();
                    if (coupons.some((c) => c.code.toUpperCase() === normalized)) {
                      alert("Coupon code already exists.");
                      return;
                    }
                    const next: Coupon = { code: normalized, title: "", percentOff: 10, active: true };
                    setCoupons([next, ...coupons]);
                    setTab("coupons");
                  }}
                >
                  + New Coupon
                </Button>
              </div>
            ) : (
              <div className="w-full sm:w-auto" />
            )}
          </div>

          <div className="mt-5">
            {tab === "products" ? (
              <ProductsPanel
                products={filteredProducts}
                onChange={(next) => {
                  // keep original order except for filtered set: we rebuild by id
                  const byId = new Map(next.map((p) => [p.id, p]));
                  const merged = products.map((p) => byId.get(p.id) ?? p);
                  // include brand new products created within filtered view
                  for (const p of next) {
                    if (!products.some((x) => x.id === p.id)) merged.unshift(p);
                  }
                  setProducts(merged);
                }}
                onDelete={(id) => {
                  if (!confirm("Delete this product?")) return;
                  setProducts(products.filter((p) => p.id !== id));
                }}
              />
            ) : tab === "coupons" ? (
              <CouponsPanel
                coupons={coupons}
                onChange={(next) => setCoupons(next)}
                onDelete={(code) => {
                  if (!confirm("Delete this coupon?")) return;
                  setCoupons(coupons.filter((c) => c.code !== code));
                }}
              />
            ) : (
              <BrandingPanel
                logoUrl={brand.logoUrl}
                onChangeLogoUrl={(url) => setLogoUrl(url)}
                onUploadLogo={async (file) => {
                  if (file.size > 2 * 1024 * 1024) {
                    alert("Logo file too large. Please use an image URL, or upload a smaller logo (<= 2MB).");
                    return;
                  }
                  const dataUrl = await readFileAsDataUrl(file);
                  setLogoUrl(dataUrl);
                }}
                onRemoveLogo={() => setLogoUrl("")}
              />
            )}
          </div>

          <div className="mt-6 rounded-3xl bg-blush-50 p-5 text-sm text-zinc-700 ring-1 ring-zinc-900/5">
            Tip: Changes persist in <span className="font-semibold">localStorage</span>, so they apply across the whole site
            on this device/browser.
          </div>
        </div>
      </div>

      {createProductOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[2px]"
            onClick={() => setCreateProductOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-xl rounded-t-[2.5rem] bg-white p-6 shadow-luxe ring-1 ring-zinc-900/10 sm:inset-0 sm:my-auto sm:rounded-[2.5rem]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold tracking-tight">Create new product</div>
                <div className="mt-1 text-sm text-zinc-600">Enter a product name. You can edit everything after creating.</div>
              </div>
              <button
                className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-900/5"
                onClick={() => setCreateProductOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <TextInput value={createProductName} onChange={setCreateProductName} placeholder="Product name" />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const name = createProductName.trim();
                    if (!name) return;
                    const id = slugifyId(name);
                    if (products.some((p) => p.id === id)) {
                      alert("A product with the same ID already exists. Try a different name.");
                      return;
                    }
                    const next: Product = {
                      id,
                      name,
                      category: "Skin",
                      priceUsd: 0,
                      inStock: true,
                      description: "",
                      media: []
                    };
                    setProducts([next, ...products]);
                    setCreateProductOpen(false);
                    setTab("products");
                  }}
                  disabled={createProductName.trim().length < 2}
                >
                  Create
                </Button>
                <Button variant="secondary" onClick={() => setCreateProductOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminGate>
  );
}

function ProductsPanel({
  products,
  onChange,
  onDelete
}: {
  products: Product[];
  onChange: (next: Product[]) => void;
  onDelete: (id: string) => void;
}) {
  const categories: Category[] = ["Skin", "Hair", "Tools", "Serums"];

  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-sm text-zinc-600 ring-1 ring-zinc-900/5">
          No products match your search.
        </div>
      ) : null}

      {products.map((p) => (
        <div key={p.id} className="rounded-3xl bg-white p-5 shadow-luxeSoft ring-1 ring-zinc-900/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-zinc-900">{p.name}</div>
              <div className="mt-1 text-xs text-zinc-500">
                ID: <span className="font-mono">{p.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onChange(products.map((x) => (x.id === p.id ? { ...x, inStock: !x.inStock } : x)))
                }
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-zinc-900/10 transition",
                  p.inStock
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                )}
              >
                {p.inStock ? "In Stock" : "Out of Stock"}
              </button>
              <Button variant="ghost" onClick={() => onDelete(p.id)}>
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</div>
              <div className="mt-2">
                <TextInput
                  value={p.name}
                  onChange={(name) => onChange(products.map((x) => (x.id === p.id ? { ...x, name } : x)))}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Category</div>
              <div className="mt-2">
                <select
                  value={p.category}
                  onChange={(e) =>
                    onChange(products.map((x) => (x.id === p.id ? { ...x, category: e.target.value as Category } : x)))
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Price (USD)</div>
              <div className="mt-2">
                <NumberInput
                  value={p.priceUsd}
                  onChange={(next) => {
                    const priceUsd = Number.isFinite(next) ? Math.max(0, Math.round(next * 100) / 100) : p.priceUsd;
                    onChange(products.map((x) => (x.id === p.id ? { ...x, priceUsd } : x)));
                  }}
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Badge (optional)</div>
              <div className="mt-2">
                <TextInput
                  value={p.badge ?? ""}
                  onChange={(badge) => onChange(products.map((x) => (x.id === p.id ? { ...x, badge } : x)))}
                  placeholder="e.g. Best Seller"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</div>
            <textarea
              value={p.description ?? ""}
              onChange={(e) => onChange(products.map((x) => (x.id === p.id ? { ...x, description: e.target.value } : x)))}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
              placeholder="Short, conversion-focused description..."
            />
          </div>

          <div className="mt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Media</div>
                <div className="mt-1 text-xs text-zinc-500">Add images/videos via URL, or upload a file (saved in this browser).</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const url = prompt("Image URL?");
                    if (!url) return;
                    const media: ProductMedia[] = [...(p.media ?? []), { type: "image", url: url.trim(), alt: p.name }];
                    onChange(products.map((x) => (x.id === p.id ? { ...x, media } : x)));
                  }}
                >
                  + Image URL
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const url = prompt("Video URL? (mp4/webm or a hosted link)");
                    if (!url) return;
                    const media: ProductMedia[] = [...(p.media ?? []), { type: "video", url: url.trim() }];
                    onChange(products.map((x) => (x.id === p.id ? { ...x, media } : x)));
                  }}
                >
                  + Video URL
                </Button>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blush-100 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-luxeSoft ring-1 ring-zinc-900/5 hover:bg-blush-200">
                  Upload
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 8 * 1024 * 1024) {
                        alert("File is too large for browser storage. Please use a URL instead (recommended).");
                        e.target.value = "";
                        return;
                      }
                      const asDataUrl = await readFileAsDataUrl(file);
                      const type: ProductMedia["type"] = file.type.startsWith("video/") ? "video" : "image";
                      const media: ProductMedia[] = [...(p.media ?? []), { type, url: asDataUrl }];
                      onChange(products.map((x) => (x.id === p.id ? { ...x, media } : x)));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(p.media ?? []).length === 0 ? (
                <div className="rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-600 ring-1 ring-zinc-900/5">
                  No media yet.
                </div>
              ) : null}
              {(p.media ?? []).map((m, idx) => (
                <div key={`${p.id}-${idx}`} className="rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-900/5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-900">{m.type.toUpperCase()}</div>
                      <div className="mt-1 break-all text-[11px] text-zinc-600">{m.url.slice(0, 180)}</div>
                    </div>
                    <button
                      onClick={() => {
                        const media = (p.media ?? []).filter((_, i) => i !== idx);
                        onChange(products.map((x) => (x.id === p.id ? { ...x, media } : x)));
                      }}
                      className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-900/5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CouponsPanel({
  coupons,
  onChange,
  onDelete
}: {
  coupons: Coupon[];
  onChange: (next: Coupon[]) => void;
  onDelete: (code: string) => void;
}) {
  return (
    <div className="space-y-3">
      {coupons.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-sm text-zinc-600 ring-1 ring-zinc-900/5">No coupons yet.</div>
      ) : null}

      {coupons.map((c) => (
        <div key={c.code} className="rounded-3xl bg-white p-5 shadow-luxeSoft ring-1 ring-zinc-900/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                <span className="font-mono">{c.code}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-500">Use either % off or $ off (we’ll take the bigger value).</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChange(coupons.map((x) => (x.code === c.code ? { ...x, active: !x.active } : x)))}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-zinc-900/10 transition",
                  c.active ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                )}
              >
                {c.active ? "Active" : "Inactive"}
              </button>
              <Button variant="ghost" onClick={() => onDelete(c.code)}>
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Title (optional)</div>
              <div className="mt-2">
                <TextInput
                  value={c.title ?? ""}
                  onChange={(title) => onChange(coupons.map((x) => (x.code === c.code ? { ...x, title } : x)))}
                  placeholder="e.g. Ramadan Special"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">% Off</div>
                <div className="mt-2">
                  <NumberInput
                    value={c.percentOff ?? 0}
                    onChange={(percentOff) =>
                      onChange(coupons.map((x) => (x.code === c.code ? { ...x, percentOff } : x)))
                    }
                  />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">$ Off</div>
                <div className="mt-2">
                  <NumberInput
                    value={c.amountOffUsd ?? 0}
                    onChange={(amountOffUsd) =>
                      onChange(coupons.map((x) => (x.code === c.code ? { ...x, amountOffUsd } : x)))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function BrandingPanel({
  logoUrl,
  onChangeLogoUrl,
  onUploadLogo,
  onRemoveLogo
}: {
  logoUrl: string;
  onChangeLogoUrl: (url: string) => void;
  onUploadLogo: (file: File) => Promise<void>;
  onRemoveLogo: () => void;
}) {
  const [draftUrl, setDraftUrl] = React.useState(logoUrl);

  React.useEffect(() => {
    setDraftUrl(logoUrl);
  }, [logoUrl]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-luxeSoft ring-1 ring-zinc-900/5">
      <div className="text-lg font-semibold tracking-tight">Branding</div>
      <div className="mt-1 text-sm text-zinc-600">Upload your logo or paste a logo image URL. You can remove it anytime.</div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Logo preview</div>
          <div className="mt-3 flex items-center gap-4 rounded-3xl bg-blush-50 p-5 ring-1 ring-zinc-900/5">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo preview" className="h-16 w-16 rounded-3xl bg-white object-cover ring-1 ring-zinc-900/10" />
            ) : (
              <div className="h-16 w-16 rounded-3xl bg-white ring-1 ring-zinc-900/10" />
            )}
            <div className="text-sm text-zinc-700">
              <div className="font-semibold">Header logo</div>
              <div className="mt-1 text-xs text-zinc-500">Recommended: square image, 256×256.</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Set logo</div>
          <div className="mt-3 space-y-2">
            <TextInput value={draftUrl} onChange={setDraftUrl} placeholder="https://.../logo.png" />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  onChangeLogoUrl(draftUrl.trim());
                }}
                disabled={draftUrl.trim().length < 5}
              >
                Save URL
              </Button>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blush-100 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-luxeSoft ring-1 ring-zinc-900/5 hover:bg-blush-200">
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await onUploadLogo(file);
                    e.target.value = "";
                  }}
                />
              </label>
              <Button variant="ghost" onClick={() => onRemoveLogo()} disabled={!logoUrl}>
                Remove logo
              </Button>
            </div>
            <div className="text-xs text-zinc-500">
              Tip: Using a URL is best for real production. Upload saves the image in this browser only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

