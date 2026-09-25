'use client';

import React from 'react';

const PERKS = [
  {
    icon: '🛡️',
    title: '100% Authentic',
    desc: 'Original clinical & dermatological formulas',
  },
  {
    icon: '🚚',
    title: 'Lebanon-Wide Delivery',
    desc: '2–4 days to Beirut, North, South & Bekaa',
  },
  {
    icon: '💵',
    title: 'Flexible Payment',
    desc: 'Cash on Delivery (USD/LBP) or Whish Money',
  },
  {
    icon: '💬',
    title: 'Direct WhatsApp Support',
    desc: 'Expert skin & hair guidance before buying',
  },
];

export default function TrustBadges() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/70 backdrop-blur-xs rounded-3xl border border-rose-100/60 shadow-xs">
        {PERKS.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center p-2">
            <span className="text-2xl mb-2">{item.icon}</span>
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight">{item.title}</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}