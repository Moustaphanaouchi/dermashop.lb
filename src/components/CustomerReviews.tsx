'use client';

import React from 'react';

const REVIEWS = [
  {
    name: 'Nour K.',
    city: 'Beirut',
    rating: 5,
    date: 'Verified Buyer',
    product: 'Scalp Massager & Anti-Hair Loss Spray',
    comment:
      'I was skeptical at first, but using the massager with the spray consistently gave my roots noticeable strength in 3 weeks. Very fast delivery to Achrafieh!',
  },
  {
    name: 'Rami S.',
    city: 'Tripoli',
    rating: 5,
    date: 'Verified Buyer',
    product: 'Hair Fiber & Derma Roller',
    comment:
      'The hair fiber covers hairline thinning completely naturally without clumping. Delivery courier was polite and paid cash on delivery smoothly.',
  },
  {
    name: 'Maya H.',
    city: 'Jounieh',
    rating: 5,
    date: 'Verified Buyer',
    product: 'Detoxifying Clay Mask',
    comment:
      'Genuine Pierre Cardin formula! Cleared up my pores without stripping moisture. 10/10 customer care on WhatsApp when I asked for recommendations.',
  },
];

export default function CustomerReviews() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 border-t border-rose-100/50">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full">
          Real Results
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mt-2">
          Trusted by Customers Across Lebanon
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Read verified experiences from our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white border border-rose-100/70 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  ✓ {rev.date}
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-zinc-100">
              <p className="text-xs font-bold text-zinc-900">
                {rev.name} <span className="text-zinc-400 font-normal">({rev.city})</span>
              </p>
              <p className="text-[10px] text-rose-800 font-medium mt-0.5">
                Purchased: {rev.product}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}