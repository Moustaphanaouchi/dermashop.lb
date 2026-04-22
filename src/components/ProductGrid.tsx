"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import type { Category, Product } from "@/state/catalog";
import { formatUsd, useStore } from "@/state/store";

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active ? "bg-maroon-800 text-white shadow-luxeSoft" : "bg-white text-zinc-700 ring-1 ring-zinc-900/10"
      )}
    >
      {label}
    </button>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { addToCart } = useStore();
  const disabled = !p.inStock;
  const thumb = (p.media ?? [])[0] ?? null;

  return (
    <motion.div
      layout
      className="group relative overflow-hidden rounded-3xl bg-white p-5 shadow-luxeSoft ring-1 ring-zinc-900/5"
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blush-50 to-transparent" />
      <div className="relative">
        {thumb ? (
          <div className="mb-4 overflow-hidden rounded-3xl bg-zinc-50 ring-1 ring-zinc-900/5">
            <div className="relative aspect-[16/10] w-full">
              {thumb.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb.url}
                  alt={thumb.alt ?? p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush-50 to-white">
                  <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-900/10">
                    Video
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{p.category}</div>
            <div className="mt-1 text-base font-semibold tracking-tight text-zinc-900">{p.name}</div>
            {p.description ? <div className="mt-2 text-sm text-zinc-600">{p.description}</div> : null}
          </div>
          {p.badge ? (
            <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-maroon-800">
              {p.badge}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight text-zinc-900">{formatUsd(p.priceUsd)}</div>
          <div
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
            )}
          >
            {p.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Button className="w-full" onClick={() => addToCart(p.id)} disabled={disabled}>
            Quick Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useStore();
  const categories: Array<{ key: Category | "All"; label: string }> = [
    { key: "All", label: "All" },
    { key: "Skin", label: "Skin" },
    { key: "Hair", label: "Hair" },
    { key: "Tools", label: "Tools" },
    { key: "Serums", label: "Serums" }
  ];

  const [active, setActive] = React.useState<(typeof categories)[number]["key"]>("All");

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);
  const [activeProduct, setActiveProduct] = React.useState<Product | null>(null);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <CategoryPill key={c.key} label={c.label} active={active === c.key} onClick={() => setActive(c.key)} />
        ))}
      </div>

      <motion.div layout className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="relative">
            <ProductCard p={p} />
            <button
              className="absolute right-6 top-6 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-luxeSoft ring-1 ring-zinc-900/10 backdrop-blur hover:bg-white"
              onClick={() => setActiveProduct(p)}
            >
              Details
            </button>
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {activeProduct ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-zinc-900/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl rounded-t-[2.5rem] bg-white p-5 shadow-luxe ring-1 ring-zinc-900/10 sm:inset-0 sm:my-auto sm:rounded-[2.5rem]"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{activeProduct.category}</div>
                  <div className="mt-1 text-lg font-semibold tracking-tight">{activeProduct.name}</div>
                </div>
                <button
                  className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-900/5"
                  onClick={() => setActiveProduct(null)}
                >
                  Close
                </button>
              </div>

              {activeProduct.description ? (
                <div className="mt-3 text-sm leading-relaxed text-zinc-600">{activeProduct.description}</div>
              ) : null}

              <div className="mt-4 grid gap-3">
                {(activeProduct.media ?? []).slice(0, 6).map((m, idx) => (
                  <div key={`${activeProduct.id}-${idx}`} className="overflow-hidden rounded-3xl bg-zinc-50 ring-1 ring-zinc-900/5">
                    {m.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={m.alt ?? activeProduct.name} className="h-auto w-full object-cover" />
                    ) : (
                      <video
                        src={m.url}
                        poster={"posterUrl" in m ? m.posterUrl : undefined}
                        controls
                        className="h-auto w-full"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{formatUsd(activeProduct.priceUsd)}</div>
                  <div className={cn("mt-1 text-xs font-semibold", activeProduct.inStock ? "text-emerald-700" : "text-maroon-800")}>
                    {activeProduct.inStock ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    addToCart(activeProduct.id);
                    setActiveProduct(null);
                  }}
                  disabled={!activeProduct.inStock}
                >
                  Quick Add
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

