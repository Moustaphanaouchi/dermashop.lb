'use client';

import React from 'react';

interface Props {
  product: any;
  onAdd: (id: string, qty?: number) => void;
  onQuickView: (product: any) => void;
}

const CATEGORY_ICON: Record<string, string> = {
  serums: '🧴',
  skin: '✨',
  hair: '💆‍♀️',
  tools: '🔄',
};

export default function ProductCard({ product, onAdd, onQuickView }: Props) {
  const media = product.media?.[0];
  const hasBundle = product.bulkPrice && product.bulkQty;
  const singlePrice = Number(product.price) || 0;
  const bundlePrice = Number(product.bulkPrice) || 0;
  const bundleQty = Number(product.bulkQty) || 2;
  const bundleSavings = (singlePrice * bundleQty - bundlePrice).toFixed(0);

  return (
    <div className="group bg-white rounded-3xl p-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.08)] border border-rose-100/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Clickable Image Container */}
      <div
        onClick={() => onQuickView(product)}
        className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-[#fdfbf9] to-[#f7f3ee] flex items-center justify-center overflow-hidden p-6 cursor-pointer"
      >
        {media?.url ? (
          <img
            src={media.url}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 drop-shadow-xs"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl">
            {CATEGORY_ICON[product.category] || '✨'}
          </div>
        )}

        {/* Quick View Floating Hint */}
        <span className="absolute bottom-2.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
          Quick View 🔍
        </span>

        {/* Out of Stock Overlay */}
        {!product.stock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-zinc-700 bg-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border border-zinc-200">
              Sold Out
            </span>
          </div>
        )}

        {/* Promotional / Status Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="px-2 pt-3.5 pb-1 flex-1 flex flex-col justify-between">
        <div onClick={() => onQuickView(product)} className="cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
              {product.category || 'Skincare'}
            </span>
            {product.size && (
              <span className="text-[10px] text-zinc-400 font-medium">{product.size}</span>
            )}
          </div>
          <h3 className="font-semibold text-zinc-900 text-base leading-snug line-clamp-1 group-hover:text-rose-900 transition-colors mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'Clinical formula designed for targeted daily results.'}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 mt-2 border-t border-zinc-100 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-zinc-900 tracking-tight">
                ${singlePrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => onAdd(product.id, 1)}
              disabled={!product.stock}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs ${
                product.stock
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              Add +
            </button>
          </div>

          {/* Clickable Volume Bundle Offer */}
          {hasBundle && (
            <button
              onClick={() => onAdd(product.id, bundleQty)}
              disabled={!product.stock}
              className="w-full py-1.5 px-2.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/90 text-rose-900 flex items-center justify-between text-[11px] font-medium transition-colors border border-rose-100"
            >
              <span>Get {bundleQty} Pack (${bundlePrice.toFixed(2)})</span>
              <span className="font-bold text-[10px] bg-rose-200/80 px-1.5 py-0.5 rounded-md text-rose-900">
                Save ${bundleSavings}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}