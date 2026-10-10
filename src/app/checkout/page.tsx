"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  MapPin,
  Truck,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, deliveryFee, discount, total, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [address, setAddress] = useState({
    type: "HOME",
    fullName: user?.name ?? "Amit Sharma",
    phone: user?.phone ?? "+91 98765 43210",
    houseBuilding: "Flat 402, Greenfield Heights",
    street: "Near Main Market, Civil Lines",
    landmark: "Opposite Town Hall",
    town: "Civil Lines, Ward 12",
    pincode: "272001",
  });

  const [deliveryOption, setDeliveryOption] = useState<"express" | "standard">(
    "express"
  );

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
            Add some fresh essentials or local staples before checking out.
          </p>
          <Link
            href="/shop"
            className="bg-[#0C831F] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs"
          >
            Explore Catalog →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setErrorMsg("");
    setIsPlacing(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: (i as unknown as { variantId?: string }).variantId,
          quantity: i.quantity,
        })),
        address: {
          fullName: address.fullName,
          phone: address.phone,
          houseBuilding: address.houseBuilding,
          street: address.street,
          landmark: address.landmark,
          town: address.town,
          state: "Uttar Pradesh",
          pincode: address.pincode,
          type: address.type,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/checkout`);
          return;
        }
        setErrorMsg(data.error || "Failed to place order. Please try again.");
        setIsPlacing(false);
        return;
      }

      const orderNumber = data.data?.orderNumber || data.data?.order?.orderNumber;
      const deliveryOtp = data.data?.order?.deliveryOtp || "849201";

      clearCart();
      setIsPlacing(false);
      router.push(
        `/checkout/success?orderNumber=${orderNumber}&otp=${deliveryOtp}&total=${total}`
      );
    } catch {
      setErrorMsg("Network error placing order. Please try again.");
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Step Progress Tracker */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0C831F] z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: "Address", icon: MapPin },
              { num: 2, label: "Delivery", icon: Truck },
              { num: 3, label: "Payment", icon: Banknote },
              { num: 4, label: "Review", icon: CheckCircle2 },
            ].map((s) => {
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                      isDone
                        ? "bg-[#0C831F] text-white"
                        : isCurrent
                        ? "bg-[#0C831F] text-white ring-4 ring-[#0C831F]/20"
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

        {errorMsg && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step Content & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Active Step Form */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            {/* STEP 1: Address */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="text-xl font-extrabold text-[#111111]">
                    Step 1: Delivery Address
                  </h2>
                  <span className="text-xs text-neutral-600 font-semibold">
                    Civil Lines Town Hub
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
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
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
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
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
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Street / Ward / Colony
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
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
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      Town PIN Code
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-[#0C831F] hover:bg-[#0a6f1a] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-xs"
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
                    Step 2: Choose Delivery Speed
                  </h2>
                  <span className="text-xs text-[#0C831F] font-bold">
                    Hub Dispatched
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Express Delivery */}
                  <label
                    onClick={() => setDeliveryOption("express")}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "express"
                        ? "border-[#0C831F] bg-[#0C831F]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#0C831F] mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#111111]">
                            10–15 Minutes Express Delivery
                          </span>
                          <span className="bg-[#0C831F] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Dispatched directly by TownKart rider from nearest local hub
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-[#0C831F]">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </label>

                  {/* Scheduled Delivery */}
                  <label
                    onClick={() => setDeliveryOption("standard")}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryOption === "standard"
                        ? "border-[#0C831F] bg-[#0C831F]/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-neutral-600 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-sm text-[#111111]">
                          Scheduled Evening Delivery (6 PM – 8 PM)
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Arrives today evening at your doorstep
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-[#0C831F]">
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
                    className="flex items-center gap-2 bg-[#0C831F] hover:bg-[#0a6f1a] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-xs"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method (COD ONLY per non-negotiable PRD) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h2 className="text-xl font-extrabold text-[#111111]">
                    Step 3: Payment Method
                  </h2>
                  <span className="flex items-center gap-1 text-xs text-[#0C831F] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>COD Guaranteed</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-5 rounded-2xl border-2 border-[#0C831F] bg-[#0C831F]/5 flex items-start justify-between">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#0C831F]/15 flex items-center justify-center text-[#0C831F] flex-shrink-0">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-[#111111]">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                          Pay cash to the delivery rider at your doorstep upon receiving your sealed package. 100% risk-free.
                        </p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-[#0C831F] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0C831F]" />
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] text-neutral-500 leading-relaxed">
                    💡 Per our local town quick-commerce policy, we currently accept Cash on Delivery only. You do not need to enter any card or bank account details online.
                  </div>
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
                    className="flex items-center gap-2 bg-[#0C831F] hover:bg-[#0a6f1a] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-xs"
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
                  <span className="text-xs font-bold text-[#0C831F]">
                    Ready to Dispatch
                  </span>
                </div>

                {/* Summaries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-neutral-200">
                    <span className="font-extrabold text-neutral-400 uppercase text-[10px] block mb-1">
                      Deliver To
                    </span>
                    <p className="font-bold text-[#111111]">{address.fullName}</p>
                    <p className="text-neutral-500 mt-0.5">
                      {address.houseBuilding}, {address.street}
                    </p>
                    <p className="text-neutral-500">
                      {address.town} • PIN {address.pincode}
                    </p>
                    <p className="text-neutral-500 mt-1">Phone: {address.phone}</p>
                  </div>

                  <div className="p-4 bg-[#F7F7F5] rounded-2xl border border-neutral-200">
                    <span className="font-extrabold text-neutral-400 uppercase text-[10px] block mb-1">
                      Payment &amp; Delivery
                    </span>
                    <p className="font-bold text-[#111111]">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-neutral-500 mt-0.5">
                      Speed: 10–15 Minutes Express
                    </p>
                    <p className="text-neutral-500">
                      Payment: Pay {formatPrice(total)} upon arrival
                    </p>
                  </div>
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
                    className="flex items-center gap-2 bg-[#0C831F] hover:bg-[#0a6f1a] text-white px-8 py-3.5 rounded-xl font-extrabold text-xs shadow-xs disabled:opacity-50"
                  >
                    <span>
                      {isPlacing ? "Placing Order..." : `Place Order • ${formatPrice(total)}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-[#111111]">
                Order Summary ({items.length} items)
              </h3>

              <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#111111] line-clamp-1 max-w-[130px]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#111111]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#111111]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#0C831F]">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#0C831F]">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-100 flex justify-between text-sm font-black text-[#111111]">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
