"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/components/providers/CartContext";
import { formatPrice, generateOrderNumber, generateOtp } from "@/lib/utils";
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, discount, total, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [address, setAddress] = useState({
    type: "HOME",
    fullName: "Amit Sharma",
    phone: "+91 98765 43210",
    houseBuilding: "Flat 402, Greenfield Heights",
    street: "Near Main Market, Civil Lines",
    landmark: "Opposite Town Hall",
    town: "Civil Lines, Ward 12",
    pincode: "272206",
  });

  const [deliveryOption, setDeliveryOption] = useState<
    "standard" | "same-day" | "pickup"
  >("same-day");

  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "CARD" | "NETBANKING" | "COD"
  >("COD");

  const [isPlacing, setIsPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#111111]">
            Your shopping cart is empty
          </h2>
          <p className="text-xs text-neutral-500 mt-1 mb-6">
            Add some town essentials or audio gadgets before checking out.
          </p>
          <Link
            href="/shop"
            className="bg-[#FF5A36] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-soft"
          >
            Explore Catalog →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    const orderNumber = generateOrderNumber();
    const deliveryOtp = generateOtp();

    // Store in localStorage for instant tracking demo
    const newOrder = {
      orderNumber,
      deliveryOtp,
      date: new Date().toISOString(),
      items,
      address,
      deliveryOption,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      totalAmount: total,
      status: "CONFIRMED",
      estimatedDelivery: "Today, 5:00 PM – 8:00 PM",
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("townkart_orders") || "[]"
      );
      localStorage.setItem(
        "townkart_orders",
        JSON.stringify([newOrder, ...existing])
      );
    } catch {
      // ignore
    }

    // Call API / Server Action in background to persist
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      clearCart();
      setIsPlacing(false);
      router.push(
        `/checkout/success?orderNumber=${orderNumber}&otp=${deliveryOtp}&total=${total}`
      );
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Step Progress Tracker */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FF5A36] z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: "Address", icon: MapPin },
              { num: 2, label: "Delivery", icon: Truck },
              { num: 3, label: "Payment", icon: CreditCard },
              { num: 4, label: "Review", icon: CheckCircle2 },
            ].map((s) => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                      isDone
                        ? "bg-[#16803C] text-white"
                        : isCurrent
                        ? "bg-[#FF5A36] text-white ring-4 ring-[#FF5A36]/20"
                        : "bg-white text-neutral-400 border border-neutral-300"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-1.5 ${
                      isCurrent ? "text-[#111111]" : "text-neutral-600"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Active Step Form */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-soft">
            {/* STEP 1: Address */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="text-xl font-extrabold text-[#111111]">
                    Step 1: Delivery Address
                  </h2>
                  <span className="text-xs text-neutral-600 font-semibold">
                    Civil Lines Town Zone
                  </span>
                </div>

                {/* Address Type */}
                <div className="flex gap-3">
                  {["HOME", "WORK", "OTHER"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddress({ ...address, type: t })}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border transition-colors ${
                        address.type === t
                          ? "bg-[#111111] text-white border-[#111111]"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      House / Flat / Building
                    </label>
                    <input
                      type="text"
                      value={address.houseBuilding}
                      onChange={(e) =>
                        setAddress({ ...address, houseBuilding: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Street / Area / Ward
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) =>
                        setAddress({ ...address, landmark: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Town Pincode
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-soft"
                  >
                    <span>Proceed to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Options */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="text-xl font-extrabold text-[#111111]">
                    Step 2: Choose Delivery Option
                  </h2>
                  <span className="text-xs text-[#16803C] font-bold">
                    Zone B Available
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Same Day */}
                  <label
                    onClick={() => setDeliveryOption("same-day")}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "same-day"
                        ? "border-[#FF5A36] bg-[#FF5A36]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-[#FF5A36] mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#111111]">
                            Same-Day Express Delivery
                          </span>
                          <span className="bg-[#FF5A36] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Delivery today between <strong>5:00 PM – 8:00 PM</strong>
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-[#16803C]">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </label>

                  {/* Standard */}
                  <label
                    onClick={() => setDeliveryOption("standard")}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "standard"
                        ? "border-[#FF5A36] bg-[#FF5A36]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-sm text-[#111111]">
                          Standard Scheduled Delivery
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Delivery tomorrow between 10:00 AM – 1:00 PM
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-[#16803C]">
                      FREE
                    </span>
                  </label>

                  {/* Store Pickup */}
                  <label
                    onClick={() => setDeliveryOption("pickup")}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "pickup"
                        ? "border-[#FF5A36] bg-[#FF5A36]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Store className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-sm text-[#111111]">
                          Store Dark-Hub Pickup
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Pick up directly from Sector 4 Fulfillment Hub in 20 mins
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-[#16803C]">
                      FREE
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Address</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-soft"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="text-xl font-extrabold text-[#111111]">
                    Step 3: Select Payment Mode
                  </h2>
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <ShieldCheck className="w-4 h-4 text-[#16803C]" />
                    <span>100% Encrypted</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "COD",
                      name: "Cash on Delivery (COD)",
                      desc: "Pay cash or scan QR upon delivery at doorstep",
                    },
                    {
                      id: "UPI",
                      name: "Instant UPI (Google Pay, PhonePe, Paytm)",
                      desc: "Razorpay secure instant UPI intent & QR payment",
                    },
                    {
                      id: "CARD",
                      name: "Credit / Debit Cards (RuPay, Visa, Mastercard)",
                      desc: "Safe 3D secure card payment",
                    },
                    {
                      id: "NETBANKING",
                      name: "Net Banking (SBI, HDFC, ICICI, Axis)",
                      desc: "Direct net banking transfer",
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? "border-[#FF5A36] bg-[#FF5A36]/5"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-sm text-[#111111]">
                          {m.name}
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">{m.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === m.id
                            ? "border-[#FF5A36]"
                            : "border-neutral-300"
                        }`}
                      >
                        {paymentMethod === m.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Delivery</span>
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-soft"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Final Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="text-xl font-extrabold text-[#111111]">
                    Step 4: Final Review &amp; Confirm
                  </h2>
                  <span className="text-xs font-bold text-[#16803C]">
                    All Systems Ready
                  </span>
                </div>

                {/* Summaries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-neutral-200">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Deliver To:
                    </span>
                    <p className="font-bold text-[#111111]">{address.fullName}</p>
                    <p className="text-neutral-600 mt-0.5">
                      {address.houseBuilding}, {address.street}
                    </p>
                    <p className="text-neutral-600">
                      {address.town} • {address.pincode}
                    </p>
                    <p className="font-medium text-[#111111] mt-1">{address.phone}</p>
                  </div>

                  <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-neutral-200">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      Payment &amp; Speed:
                    </span>
                    <p className="font-bold text-[#111111]">
                      {paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : `${paymentMethod} Online Payment`}
                    </p>
                    <p className="text-[#16803C] font-semibold mt-1">
                      ⚡ Same-Day Delivery: Today, 5:00 PM – 8:00 PM
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-1">
                      A 6-digit verification OTP will be generated on confirmation.
                    </p>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-100"
                        />
                        <div>
                          <p className="font-bold text-[#111111] line-clamp-1">
                            {item.name}
                          </p>
                          <span className="text-neutral-500 text-[11px]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#111111]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Payment</span>
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-8 py-4 rounded-xl font-black text-sm shadow-soft transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span>{isPlacing ? "Processing Order..." : `Place Order • ${formatPrice(total)}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky Order Summary Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-4">
              <h3 className="font-extrabold text-base text-[#111111]">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-[#111111]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Local Express Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-[#16803C]">FREE</span>
                  ) : (
                    <span className="font-semibold text-[#111111]">
                      {formatPrice(deliveryFee)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#16803C]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#111111] pt-3 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="text-[#FF5A36]">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-[#F7F7F5] rounded-xl p-3 text-[11px] text-neutral-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16803C]" />
                  <span>Town Consumer Guarantee</span>
                </div>
                <p>
                  No payment deduction until order is confirmed by town hub. Returns accepted at doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
