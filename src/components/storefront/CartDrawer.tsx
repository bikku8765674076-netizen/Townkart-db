"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  CheckCircle2,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode("");
  };

  const progressPercent =
    freeDeliveryThreshold > 0
      ? Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))
      : 100;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        onClick={closeCart}
        aria-label="Close cart"
        className="fixed inset-0 cursor-default bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="townkart-cart-title"
        className="relative z-10 flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300 sm:h-full sm:max-h-none sm:max-w-md"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-3 sm:p-5">
          <div className="flex min-w-0 items-center gap-2">
            <ShoppingBag className="h-5 w-5 shrink-0 text-[#FF5A36]" />
            <h3 id="townkart-cart-title" className="text-lg font-extrabold text-[#111111]">
              Your Cart
            </h3>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-600">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close shopping cart"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="shrink-0 border-b border-neutral-200 bg-[#F7F7F5] px-4 py-3 sm:px-5">
          <div className="mb-1.5 flex items-start justify-between gap-3 text-xs font-medium">
            <span className="flex min-w-0 items-start gap-1.5 text-neutral-700">
              <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF5A36]" />
              {amountNeededForFreeDelivery === 0 ? (
                <strong className="font-semibold text-[#16803C]">
                  🎉 You unlocked FREE Local Delivery!
                </strong>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-[#FF5A36]">
                    {formatPrice(amountNeededForFreeDelivery)}
                  </strong>{" "}
                  more for free delivery
                </span>
              )}
            </span>
            <span className="shrink-0 font-bold text-neutral-500">{progressPercent}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
            role="progressbar"
            aria-label="Progress toward free delivery"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressPercent >= 100 ? "bg-[#16803C]" : "bg-[#FF5A36]"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 divide-y divide-neutral-100 overflow-y-auto overscroll-contain px-4 sm:p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-[#111111]">
                Your cart is waiting for something good
              </h4>
              <p className="mt-1 max-w-xs text-sm text-neutral-500">
                Explore daily essentials, fresh produce, and town electronics.
              </p>
              <button
                onClick={closeCart}
                className="mt-5 min-h-11 rounded-xl bg-[#FF5A36] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e04f2e]"
              >
                Start Shopping →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 py-4">
                <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 text-sm font-semibold text-[#111111]">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-xs font-medium text-neutral-500">
                        Variant: {item.variantName}
                      </span>
                    )}
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#111111]">
                        {formatPrice(item.price)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-h-10 items-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-10 w-10 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-100"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-7 text-center text-sm font-bold text-[#111111]" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-10 w-10 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-100"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${item.name} from cart`}
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="max-h-[54dvh] shrink-0 overflow-y-auto overscroll-contain border-t border-neutral-100 bg-[#FAFAFA] px-4 pt-3 sm:max-h-none sm:p-5" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
            <div className="mb-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  <div className="flex min-w-0 items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="break-words">Coupon &apos;{appliedCoupon}&apos; applied (−{formatPrice(discount)})</span>
                  </div>
                  <button onClick={removeCoupon} className="shrink-0 font-semibold text-emerald-700 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      aria-label="Coupon code"
                      className="min-h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm font-semibold uppercase text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-10 shrink-0 rounded-xl bg-[#111111] px-4 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && (
                <p className={`mt-1 text-xs font-medium ${couponMsg.isError ? "text-red-600" : "text-emerald-700"}`} role="status">
                  {couponMsg.text}
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-sm text-neutral-600">
              <div className="flex justify-between gap-3">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111111]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Local delivery</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-[#16803C]">FREE</span>
                ) : (
                  <span className="font-semibold text-[#111111]">{formatPrice(deliveryFee)}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-3 text-[#16803C]">
                  <span>Discount</span>
                  <span className="font-bold">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3 border-t border-neutral-200 pt-2 text-base font-extrabold text-[#111111]">
                <span>Total amount</span>
                <span className="text-lg text-[#FF5A36]">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A36] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#e04f2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A36]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </footer>
        )}
      </section>
    </div>
  );
}
