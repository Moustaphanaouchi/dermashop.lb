'use client';
import { buildWhatsAppMessage, whatsappUrl } from '@/lib/whatsapp';
import { useState, useEffect } from 'react';
import { lineTotal, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/lib/pricing';

interface Props {
  open: boolean;
  onClose: () => void;
  cart: { id: string; quantity: number }[];
  products: any[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onOrderComplete: () => void;
}

export default function CartDrawer({ open, onClose, cart, products, onUpdateQty, onRemove, onOrderComplete }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wishpay'>('cash');
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; percentOff?: number; dollarOff?: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = cart.map((c) => {
    const p = products.find((p) => p.id === c.id)!;
    return { ...c, product: p, total: lineTotal(p.price, c.quantity, p.bulkPrice, p.bulkQty) };
  });

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);

  let discount = 0;
  if (couponApplied) {
    if (couponApplied.percentOff) discount = Math.max(discount, subtotal * (couponApplied.percentOff / 100));
    if (couponApplied.dollarOff) discount = Math.max(discount, couponApplied.dollarOff);
  }
  if (redeemPoints && loyaltyPoints >= 100) {
    discount += Math.floor(loyaltyPoints / 100) * 5;
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const deliveryFee = afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = afterDiscount + deliveryFee;

  useEffect(() => {
    if (phone.length >= 8) {
      fetch(`/api/loyalty?phone=${encodeURIComponent(phone)}`)
        .then((r) => r.json())
        .then((d) => setLoyaltyPoints(d.points || 0))
        .catch(() => {});
    }
  }, [phone]);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponInput)}&phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    if (data.valid) {
      setCouponApplied({ code: data.code, percentOff: data.percentOff, dollarOff: data.dollarOff });
      setCouponMessage(`✅ ${data.code} applied`);
    } else {
      setCouponApplied(null);
      setCouponMessage(`❌ ${data.message}`);
    }
  }

  async function handleCheckout() {
    setError('');
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your name, phone, and delivery address.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          paymentMethod,
          items: cart,
          couponCode: couponApplied?.code,
          redeemPoints: redeemPoints ? loyaltyPoints : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      
      const message = buildWhatsAppMessage({
        items: data.lineItems,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        discount: data.discount,
        total: data.total,
        customerName: name,
        phone,
        address,
        paymentMethod,
        couponCode: data.couponCode,
        pointsEarned: data.pointsEarned,
      });

      window.location.href = whatsappUrl(message);
      onOrderComplete();
      onClose();
    } catch (e) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b bg-blush">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && <p className="text-center text-zinc-400 py-10">Your cart is empty</p>}

          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-blush/40 rounded-xl p-3">
              <div>
                <p className="font-semibold text-sm">{item.product.name}</p>
                <p className="text-xs text-zinc-500">${item.product.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-white border">−</button>
                <span className="w-5 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-white border">+</button>
                <button onClick={() => onRemove(item.id)} className="text-red-500 text-xs ml-2">✕</button>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <>
              <div className="border-t pt-4 space-y-3">
                <input
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <textarea
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Delivery Address (full details)"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                {loyaltyPoints > 0 && (
                  <label className="flex items-center gap-2 text-sm bg-green-50 border border-green-200 rounded-lg p-2">
                    <input type="checkbox" checked={redeemPoints} onChange={(e) => setRedeemPoints(e.target.checked)} />
                    You have {loyaltyPoints} points — redeem for ${Math.floor(loyaltyPoints / 100) * 5} off
                  </label>
                )}

                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded-lg p-2 text-sm uppercase"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button onClick={applyCoupon} className="px-3 py-2 bg-zinc-800 text-white rounded-lg text-sm">Apply</button>
                </div>
                {couponMessage && <p className="text-xs">{couponMessage}</p>}

                <div>
                  <p className="text-sm font-semibold mb-2">Payment Method</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex-1 py-2 rounded-lg text-sm border ${paymentMethod === 'cash' ? 'bg-maroon text-white' : 'bg-white'}`}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      onClick={() => setPaymentMethod('wishpay')}
                      className={`flex-1 py-2 rounded-lg text-sm border ${paymentMethod === 'wishpay' ? 'bg-maroon text-white' : 'bg-white'}`}
                    >
                      WishPay
                    </button>
                  </div>
                  {paymentMethod === 'wishpay' && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Send payment to Wish Money account: <strong>03448482</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-zinc-400">Free delivery on orders over ${FREE_DELIVERY_THRESHOLD}</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span><span className="text-maroon">${total.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t">
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {submitting ? 'Placing order...' : 'Complete Order via WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}