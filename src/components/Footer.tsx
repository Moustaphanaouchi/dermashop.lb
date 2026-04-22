"use client";

import Link from "next/link";
import { WHATSAPP_NUMBER_E164 } from "@/state/catalog";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <div className="text-sm font-semibold">Dermashop LB</div>
          <div className="mt-2 text-sm text-zinc-600">
            Premium hair & skin solutions in Lebanon — luxury clinical, fast WhatsApp ordering.
          </div>
          <div className="mt-4 text-sm text-zinc-700">
            <span className="font-semibold">Payment:</span> Wish Money
          </div>
        </div>

        <div className="sm:justify-self-end">
          <div className="text-sm font-semibold">Links</div>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link
              className="text-zinc-700 underline-offset-4 hover:underline"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </Link>
            <Link
              className="text-zinc-700 underline-offset-4 hover:underline"
              href={`https://wa.me/9613448482`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp ({WHATSAPP_NUMBER_E164})
            </Link>
            <Link className="text-zinc-700 underline-offset-4 hover:underline" href="/admin">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200/70 py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Dermashop LB. All rights reserved.
      </div>
    </footer>
  );
}

