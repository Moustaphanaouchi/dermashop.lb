'use client';

import React, { useState } from 'react';

interface CartItem {
  id: string;
  quantity: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: any[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onOrderComplete: () => void;
}

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9613448482').replace(/\D/g, '');

const LEBANON_REGIONS = [
  'Beirut (Administrative)',
  'Mount Lebanon (Metn / Keserwan / Baabda)',
  'Tripoli & North Lebanon',
  'Saida & South Lebanon',
  'Bekaa & Zahle',
  'Nabatieh & South',
];

export default function CartDrawer({
  open,
  onClose,
  cart,
  products,
  onUpdateQty,
  onRemove,
  onOrderComplete,
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState(LEBANON_REGIONS[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'whish'>('cod');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!open) return null;

  // Calculate pricing
  const cartDetails = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const subtotal = cartDetails.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const deliveryFee = 3.0; // Standard across Lebanon
  const total = Math.max(0, subtotal - discountAmount + (cart.length > 0 ? deliveryFee : 0));

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();

    if (clean === 'WELCOME10') {
      setAppliedDiscount({ code: 'WELCOME10', percent: 10 });
      setCouponCode('');
    } else {
      setCouponError('Invalid promo code');
    }
  }

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert('Please fill in your name, phone number, and detailed address.');
      return;
    }

    // Build the formatted WhatsApp order text
    const itemsList = cartDetails
      .map((item) => `• ${item.name} x${item.quantity} — $${(Number(item.price) * item.quantity).toFixed(2)}`)
      .join('\n');

    let message = `*🌸 New Order from Dermashop LB*\n\n`;
    message += `*Customer Details:*\n`;
    message += `• Name: ${name}\n`;
    message += `• Phone: ${phone}\n`;
    message += `• Region: ${region}\n`;
    message += `• Address: ${address}\n`;
    message += `• Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery (USD / LBP)' : 'Whish Money Transfer'}\n\n`;

    message += `*Order Items:*\n${itemsList}\n\n`;
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;

    if (appliedDiscount) {
      message += `Discount (${appliedDiscount.code}): -$${discountAmount.toFixed(2)}\n`;
    }

    message += `Delivery Fee: $${deliveryFee.toFixed(2)}\n`;
    message += `*Total Amount: $${total.toFixed(2)}*\n\n`;
    message += `_Please confirm my order and estimated delivery time._`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    onOrderComplete();
    window.open(waUrl, '_blank');
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-pink-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <span>Your Shopping Bag</span>
              <span className="text-xs bg-rose-50 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </h2>
            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 transition">
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartDetails.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-4xl block mb-2">🛍️</span>
                <p className="text-zinc-500 text-sm">Your bag is empty.</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-5 py-2 bg-rose-50 text-rose-800 text-xs font-semibold rounded-full hover:bg-rose-100 transition"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cartDetails.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center p-1 border border-zinc-200/60 shrink-0 overflow-hidden">
                    {item.media?.[0]?.url ? (
                      <img src={item.media[0].url} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">🧴</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-900 truncate">{item.name}</h4>
                    <p className="text-xs font-bold text-zinc-800 mt-0.5">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-zinc-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-[11px] text-zinc-400 hover:text-rose-600 ml-auto transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Promo Code Input Box */}
            {cart.length > 0 && (
              <div className="pt-2">
                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <span className="font-semibold flex items-center gap-1">
                      <span>✓ Code applied:</span>
                      <strong className="tracking-wide">{appliedDiscount.code}</strong> (10% OFF)
                    </span>
                    <button
                      onClick={() => setAppliedDiscount(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-1.5 text-xs border border-zinc-200 rounded-xl uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-zinc-800 hover:bg-black text-white text-xs font-semibold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>
            )}

            {/* Checkout Form */}
            {cart.length > 0 && (
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-3 border-t border-zinc-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Delivery Details (Lebanon)
                </h3>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name *"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                />

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp Mobile (+961 XX XXX XXX) *"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                />

                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                >
                  {LEBANON_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Detailed Address (Street, Building, Floor) *"
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 resize-none"
                />

                {/* Payment Option */}
                <div className="pt-1">
                  <label className="text-[11px] font-semibold text-zinc-600 block mb-1.5">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 rounded-xl text-left border text-xs transition ${
                        paymentMethod === 'cod'
                          ? 'border-zinc-900 bg-zinc-50 font-bold text-zinc-900'
                          : 'border-zinc-200 text-zinc-500'
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('whish')}
                      className={`p-2 rounded-xl text-left border text-xs transition ${
                        paymentMethod === 'whish'
                          ? 'border-rose-600 bg-rose-50/50 font-bold text-rose-900'
                          : 'border-zinc-200 text-zinc-500'
                      }`}
                    >
                      📱 Whish Money
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-pink-100 bg-stone-50/50 space-y-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-500">
                  <span>Delivery across Lebanon</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-zinc-900 pt-1 border-t border-zinc-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full mt-3 py-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white rounded-2xl text-xs font-bold tracking-wide uppercase shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Confirm Order via WhatsApp</span>
                <span>💬</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}