'use client';

import React, { useState } from 'react';

interface Props {
  product: any | null;
  onClose: () => void;
  onAdd: (id: string, qty?: number) => void;
}

export default function ProductDetailModal({ product, onClose, onAdd }: Props) {
  const [selectedPack, setSelectedPack] = useState<'single' | 'bundle'>('single');

  if (!product) return null;

  const media = product.media?.[0];
  const hasBundle = product.bulkPrice && product.bulkQty;
  const singlePrice = Number(product.price) || 0;
  const bundlePrice = Number(product.bulkPrice) || 0;
  const bundleQty = Number(product.bulkQty) || 2;
  const bundleSavings = (singlePrice * bundleQty - bundlePrice).toFixed(2);

  function handleAdd() {
    if (selectedPack === 'bundle') {
      onAdd(product.id, bundleQty);
    } else {
      onAdd(product.id, 1);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-zinc-600 hover:text-black hover:scale-105 transition"
        >
          ✕
        </button>

        {/* Product Visual */}
        <div className="md:w-1/2 bg-gradient-to-b from-[#fdfbf9] to-[#f7f3ee] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-rose-100/60">
          {media?.url ? (
            <img
              src={media.url}
              alt={product.name}
              className="max-h-64 md:max-h-80 w-auto object-contain mix-blend-multiply drop-shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-5xl">
              🧴
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {product.category || 'Clinical Care'}
              </span>
              {product.size && (
                <span className="text-[11px] text-zinc-400 font-medium">{product.size}</span>
              )}
            </div>

            <h2 className="text-xl font-bold text-zinc-900 leading-snug">{product.name}</h2>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              {product.description || 'Targeted clinical skincare formulation.'}
            </p>

            {/* Clinical Highlights */}
            {product.benefits && (
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <h4 className="text-xs font-semibold text-zinc-900 mb-1.5">Key Highlights:</h4>
                <ul className="text-[11px] text-zinc-600 space-y-1">
                  {product.benefits.map((b: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to Use */}
            {product.usage && (
              <div className="mt-3 pt-3 border-t border-zinc-100">
                <h4 className="text-xs font-semibold text-zinc-900 mb-1">How to Use:</h4>
                <p className="text-[11px] text-zinc-500 leading-normal">{product.usage}</p>
              </div>
            )}

            {/* Volume Deal Selector */}
            {hasBundle && (
              <div className="mt-5 space-y-2">
                <label className="text-xs font-semibold text-zinc-900 block">Choose Option:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPack('single')}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      selectedPack === 'single'
                        ? 'border-zinc-900 bg-zinc-50 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="text-[11px] text-zinc-500 font-medium">Single Item</div>
                    <div className="text-sm font-bold text-zinc-900 mt-0.5">
                      ${singlePrice.toFixed(2)}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPack('bundle')}
                    className={`relative p-2.5 rounded-2xl border text-left transition-all ${
                      selectedPack === 'bundle'
                        ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                        : 'border-rose-200 hover:border-rose-300'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                      Save ${bundleSavings}
                    </span>
                    <div className="text-[11px] text-rose-900 font-semibold">
                      Pack of {bundleQty}
                    </div>
                    <div className="text-sm font-bold text-rose-900 mt-0.5">
                      ${bundlePrice.toFixed(2)}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-6 mt-4 border-t border-zinc-100">
            <button
              onClick={handleAdd}
              disabled={!product.stock}
              className={`w-full py-3 rounded-2xl text-xs font-bold tracking-wide uppercase shadow-sm transition-all ${
                product.stock
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-98'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {product.stock
                ? selectedPack === 'bundle'
                  ? `Add Pack of ${bundleQty} • $${bundlePrice.toFixed(2)}`
                  : `Add to Cart • $${singlePrice.toFixed(2)}`
                : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}