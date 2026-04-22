"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { buildWhatsAppCheckoutUrl, buildWhatsAppOrderText, canCheckout, type PaymentMethod } from "@/lib/whatsapp";
import { SERUM_BUNDLE, WHATSAPP_NUMBER_E164 } from "@/state/catalog";
import { computeCartPricing, formatUsd, getCouponByCode, getProductById, useStore } from "@/state/store";

function QtyButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-800 ring-1 ring-zinc-900/10 hover:bg-zinc-50"
    >
      {children}
    </button>
  );
}

export function CartDrawer() {
  const { cartOpen, openCart, cart, products, coupons, appliedCouponCode, applyCoupon, clearCoupon, setQty, removeFromCart, clearCart } =
    useStore();
  const coupon = getCouponByCode(coupons, appliedCouponCode);
  const pricing = computeCartPricing(products, cart, { coupon });
  const checkoutEnabled = canCheckout(products, cart);

  const [fullName, setFullName] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("Cash on Delivery");
  const [couponInput, setCouponInput] = React.useState(appliedCouponCode);

  const wishPayAccountNumber = WHATSAPP_NUMBER_E164;

  const detailsFilled =
    fullName.trim().length > 1 && deliveryAddress.trim().length > 6 && phoneNumber.trim().length > 5;

  const whatsappText = buildWhatsAppOrderText(
    products,
    cart,
    {
    fullName: fullName.trim(),
    deliveryAddress: deliveryAddress.trim(),
    phoneNumber: phoneNumber.trim(),
    paymentMethod,
    wishPayAccountNumber,
    appliedCouponCode: coupon?.active ? coupon.code : "",
      couponDiscountUsd: pricing.couponDiscountUsd
    },
    {
      subtotalUsd: pricing.subtotalUsd,
      serumDiscountUsd: pricing.serumDiscountUsd,
      couponDiscountUsd: pricing.couponDiscountUsd,
      totalUsd: pricing.totalUsd
    }
  );
  const whatsappUrl = buildWhatsAppCheckoutUrl(whatsappText);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => openCart(false)}
          />

          <motion.aside
            key="drawer"
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-hidden bg-white shadow-luxe"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            aria-label="Shopping cart"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-zinc-200/70 px-5 py-4">
                <div>
                  <div className="text-base font-semibold tracking-tight">Your Cart</div>
                  <div className="text-xs text-zinc-500">Totals in USD • Pay via Wish Money</div>
                </div>
                <button
                  className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-900/5"
                  onClick={() => openCart(false)}
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-auto px-5 py-4">
                {cart.length === 0 ? (
                  <div className="rounded-3xl bg-blush-50 p-6 ring-1 ring-zinc-900/5">
                    <div className="text-sm font-semibold">Your cart is empty.</div>
                    <div className="mt-1 text-sm text-zinc-600">Add products and checkout via WhatsApp in seconds.</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((line) => {
                      const product = getProductById(products, line.productId);
                      if (!product) return null;

                      return (
                        <div
                          key={line.productId}
                          className={cn(
                            "rounded-3xl bg-white p-4 shadow-luxeSoft ring-1 ring-zinc-900/5",
                            !product.inStock && "opacity-70"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold tracking-tight">{product.name}</div>
                              <div className="mt-1 text-xs text-zinc-500">{formatUsd(product.priceUsd)} each</div>
                              {!product.inStock ? (
                                <div className="mt-2 text-xs font-semibold text-maroon-800">
                                  Out of stock — remove to checkout
                                </div>
                              ) : null}
                            </div>
                            <button
                              className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-900/5"
                              onClick={() => removeFromCart(line.productId)}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <QtyButton onClick={() => setQty(line.productId, line.quantity - 1)}>-</QtyButton>
                              <div className="min-w-9 text-center text-sm font-semibold">{line.quantity}</div>
                              <QtyButton onClick={() => setQty(line.productId, line.quantity + 1)}>+</QtyButton>
                            </div>
                            <div className="text-sm font-bold">{formatUsd(product.priceUsd * line.quantity)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 rounded-3xl bg-blush-50 p-5 ring-1 ring-zinc-900/5">
                  <div className="text-sm font-semibold">Serum Bundle Offer</div>
                  <div className="mt-1 text-sm text-zinc-700">
                    Any 3 serums for <span className="font-bold">${SERUM_BUNDLE.groupPriceUsd}</span> (otherwise{" "}
                    <span className="font-semibold">${SERUM_BUNDLE.unitPriceUsdDefault} each</span>).
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200/70 px-5 py-4">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Subtotal</span>
                    <span className="font-semibold">{formatUsd(pricing.subtotalUsd)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Serum deal</span>
                    <span
                      className={cn("font-semibold", pricing.serumDiscountUsd > 0 ? "text-emerald-700" : "text-zinc-500")}
                    >
                      -{formatUsd(pricing.serumDiscountUsd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Coupon</span>
                    <span
                      className={cn(
                        "font-semibold",
                        pricing.couponDiscountUsd > 0 ? "text-emerald-700" : "text-zinc-500"
                      )}
                    >
                      -{formatUsd(pricing.couponDiscountUsd)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">{formatUsd(pricing.totalUsd)}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-zinc-900/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold tracking-tight">Coupon code</div>
                      <div className="mt-1 text-xs text-zinc-500">Apply a promo code before checkout.</div>
                    </div>
                    {appliedCouponCode ? (
                      <button
                        onClick={() => {
                          clearCoupon();
                          setCouponInput("");
                        }}
                        className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-900/5"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. WELCOME5"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => applyCoupon(couponInput)}
                      disabled={couponInput.trim().length < 3}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCouponCode && !coupon ? (
                    <div className="mt-2 text-xs font-semibold text-maroon-800">Invalid coupon code.</div>
                  ) : null}
                  {coupon && !coupon.active ? (
                    <div className="mt-2 text-xs font-semibold text-maroon-800">This coupon is inactive.</div>
                  ) : null}
                  {coupon && coupon.active ? (
                    <div className="mt-2 text-xs font-semibold text-emerald-700">
                      Applied: {coupon.code}
                      {coupon.title ? ` — ${coupon.title}` : ""}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-zinc-900/5">
                  <div className="text-sm font-semibold tracking-tight">Delivery details</div>
                  <div className="mt-3 space-y-2">
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
                    />
                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      inputMode="tel"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
                    />
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Delivery Address (Area, Street, Building, Floor, Notes...)"
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-maroon-800/40 focus:ring-2 focus:ring-maroon-800/15"
                    />
                  </div>

                  <div className="mt-4 text-sm font-semibold tracking-tight">Payment</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod("Cash on Delivery")}
                      className={cn(
                        "rounded-2xl px-3 py-3 text-sm font-semibold ring-1 ring-zinc-900/10 transition",
                        paymentMethod === "Cash on Delivery"
                          ? "bg-maroon-800 text-white"
                          : "bg-white text-zinc-800 hover:bg-zinc-50"
                      )}
                    >
                      Cash on Delivery
                    </button>
                    <button
                      onClick={() => setPaymentMethod("WishPay")}
                      className={cn(
                        "rounded-2xl px-3 py-3 text-sm font-semibold ring-1 ring-zinc-900/10 transition",
                        paymentMethod === "WishPay" ? "bg-maroon-800 text-white" : "bg-white text-zinc-800 hover:bg-zinc-50"
                      )}
                    >
                      WishPay
                    </button>
                  </div>

                  {paymentMethod === "WishPay" ? (
                    <div className="mt-3 rounded-2xl bg-blush-50 p-3 text-xs text-zinc-700 ring-1 ring-zinc-900/5">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          Send payment to this WishPay account number:{" "}
                          <span className="font-semibold text-zinc-900">{wishPayAccountNumber}</span>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(wishPayAccountNumber);
                            } catch {
                              // ignore
                            }
                          }}
                          className="shrink-0 rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-900/10 hover:bg-zinc-50"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl bg-blush-50 p-3 text-xs text-zinc-700 ring-1 ring-zinc-900/5">
                      Pay on delivery (cash). We’ll confirm availability and delivery by WhatsApp.
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => {
                      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                    }}
                    disabled={!checkoutEnabled || !detailsFilled}
                  >
                    Complete Order via WhatsApp
                  </Button>
                  <Button variant="ghost" onClick={() => clearCart()} disabled={cart.length === 0}>
                    Clear cart
                  </Button>
                </div>

                {!checkoutEnabled && cart.length > 0 ? (
                  <div className="mt-3 text-xs font-semibold text-maroon-800">
                    Please remove out-of-stock items before checkout.
                  </div>
                ) : null}

                {checkoutEnabled && cart.length > 0 && !detailsFilled ? (
                  <div className="mt-3 text-xs font-semibold text-maroon-800">
                    Please fill your name, phone number, and delivery address to continue.
                  </div>
                ) : null}
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

