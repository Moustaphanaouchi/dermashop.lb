"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useStore } from "@/state/store";

export function Header() {
  const { cart, openCart, brand } = useStore();
  const count = cart.reduce((acc, l) => acc + l.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt="Dermashop LB logo"
              className="h-9 w-9 rounded-2xl bg-white object-cover ring-1 ring-zinc-900/10"
            />
          ) : (
            <span className="h-9 w-9 rounded-2xl bg-blush-100 ring-1 ring-zinc-900/5" />
          )}
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Dermashop LB</div>
            <div className="text-[11px] text-zinc-500">Luxury Clinical Care</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-900/5"
          >
            Admin
          </Link>
          <Button variant="secondary" onClick={() => openCart(true)} aria-label="Open cart">
            Cart
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-maroon-800 ring-1 ring-zinc-900/10">
              {count}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

