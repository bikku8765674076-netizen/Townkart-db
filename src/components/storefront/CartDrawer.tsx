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

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF5A36]" />
            <h3 className="font-extrabold text-lg text-[#111111]">Your Cart</h3>
            <span className="bg-neutral-100 text-neutral-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#F7F7F5] px-5 py-3 border-b border-neutral-200">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-neutral-700">
              <Truck className="w-3.5 h-3.5 text-[#FF5A36]" />
              {amountNeededForFreeDelivery === 0 ? (
                <strong className="text-[#16803C] font-semibold">
                  🎉 You unlocked FREE Local Delivery!
                </strong>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-[#FF5A36]">
                    {formatPrice(amountNeededForFreeDelivery)}
                  </strong>{" "}
                  more for FREE Delivery
                </span>
              )}
            </span>
            <span className="text-neutral-500 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent >= 100 ? "bg-[#16803C]" : "bg-[#FF5A36]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#111111]">
                Your cart is waiting for something good
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Explore daily essentials, fresh produce, and town electronics.
              </p>
              <button
                onClick={closeCart}
                className="mt-5 bg-[#FF5A36] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#e04f2e] transition-colors"
              >
                Start Shopping →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-3.5 group">
                {/* Image */}
                <div className="w-18 h-18 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] line-clamp-1">
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <span className="text-[11px] text-neutral-500 font-medium">
                        Variant: {item.variantName}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
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

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-[#FAFAFA] space-y-3.5">
            {/* Coupon Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon &apos;{appliedCoupon}&apos; Applied (-₹{discount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon: WELCOME10, SAVE100"
                      className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl uppercase font-semibold text-[#111111] focus:outline-[#FF5A36]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#111111] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111111]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Town Delivery</span>
                {deliveryFee === 0 ? (
                  <span className="text-[#16803C] font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-[#111111]">{formatPrice(deliveryFee)}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#16803C]">
                  <span>Discount</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-[#111111] pt-2 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="text-base text-[#FF5A36]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 bg-[#FF5A36] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#e04f2e] transition-all hover:gap-3"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
