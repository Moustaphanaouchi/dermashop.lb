"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { Section } from "@/components/Section";
import { SERUM_BUNDLE, WHATSAPP_NUMBER_E164 } from "@/state/catalog";
import { useStore } from "@/state/store";

export default function Page() {
  const { products, openCart } = useStore();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartDrawer />

      <main>
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,#FCE4EC_0%,transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(128,0,0,0.10)_0%,transparent_55%)]" />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Section className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-900/5">
                Luxury Clinical • Lebanon • Worldwide Shipping
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Premium hair & skin solutions, delivered with confidence.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Carefully selected products for results-driven care. Order in seconds via WhatsApp—no credit card forms.
                Payments accepted via <span className="font-semibold text-zinc-900">Wish Money</span>.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>
                  Shop Products
                </Button>
                <Button variant="secondary" onClick={() => openCart(true)}>
                  Open Cart
                </Button>
                <Button variant="ghost" onClick={() => document.getElementById("shipping")?.scrollIntoView({ behavior: "smooth" })}>
                  Worldwide
                </Button>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-zinc-900/5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Serum Offer</div>
                  <div className="mt-1 font-semibold">
                    3 serums for ${SERUM_BUNDLE.groupPriceUsd} <span className="text-zinc-500">(any mix)</span>
                  </div>
                </div>
                <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-zinc-900/5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Fast Checkout</div>
                  <div className="mt-1 font-semibold">WhatsApp: {WHATSAPP_NUMBER_E164}</div>
                </div>
              </div>
            </Section>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-b from-white/60 to-white/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-luxe ring-1 ring-zinc-900/5">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/hero.png"
                    alt="Dermashop LB"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-5">
                  <div className="text-sm font-semibold tracking-tight">High-performance essentials</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    Skin, hair, and tools curated for quality and results.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Section id="shop" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Shop</div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Pick your favorites</h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Tap “Quick Add” to build your cart. Your total updates instantly in USD.
              </p>
            </div>
            <div className="rounded-3xl bg-blush-50 p-4 text-sm text-zinc-700 ring-1 ring-zinc-900/5">
              <span className="font-semibold text-zinc-900">Payments:</span> Wish Money • Checkout via WhatsApp
            </div>
          </div>

          <div className="mt-7">
            <ProductGrid products={products} />
          </div>
        </Section>

        <Section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Trusted & Professional",
                body: "Luxury clinical vibe with a clean, high-quality experience."
              },
              {
                title: "Transparent Pricing",
                body: "Totals calculated in USD, with the serum deal applied automatically."
              },
              {
                title: "No Credit Card Gate",
                body: "Complete your order via WhatsApp and pay using Wish Money."
              }
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-3xl bg-white p-6 shadow-luxeSoft ring-1 ring-zinc-900/5"
              >
                <div className="text-base font-semibold tracking-tight">{x.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-zinc-600">{x.body}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="shipping" className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
          <div className="rounded-[2.5rem] bg-blush-50 p-8 ring-1 ring-zinc-900/5">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Worldwide Shipping</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">We ship worldwide.</div>
            <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
              Delivery times and fees depend on your location. Checkout via WhatsApp and we’ll confirm availability, shipping cost,
              and ETA before delivery.
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

