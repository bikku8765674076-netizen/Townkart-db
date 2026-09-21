"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Package,
  Clock,
  KeyRound,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "TK-9833";
  const otp = searchParams.get("otp") || "849201";
  const total = parseFloat(searchParams.get("total") || "1499");

  useEffect(() => {
    // Trigger confetti on success
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF5A36", "#16803C", "#FFD700"],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      {/* Celebration Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#16803C] flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <span className="text-xs font-black uppercase tracking-widest text-[#16803C] bg-emerald-50 px-3 py-1 rounded-full">
        Order Confirmed
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-[#111111] mt-3 tracking-tight">
        Thank you for your order!
      </h1>

      <p className="text-sm text-neutral-600 mt-2">
        Your order <strong className="text-black">#{orderNumber}</strong> has been received by the Sector 4 Fulfillment Hub and sent to packing.
      </p>

      {/* Details Box */}
      <div className="mt-8 bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft text-left space-y-4">
        {/* OTP Highlight */}
        <div className="bg-[#F7F7F5] border border-neutral-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-neutral-600 uppercase">
                Delivery Verification OTP
              </span>
              <p className="text-2xl font-mono font-black text-[#111111] tracking-widest">
                {otp}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-neutral-600 max-w-[140px] text-right font-medium">
            Share with delivery partner upon arrival
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <span className="text-neutral-600 font-semibold block">Expected Delivery:</span>
            <strong className="text-sm text-[#111111] font-bold">
              Today, 5:00 PM – 8:00 PM
            </strong>
          </div>
          <div>
            <span className="text-neutral-600 font-semibold block">Total Amount:</span>
            <strong className="text-sm text-[#FF5A36] font-extrabold">
              {formatPrice(total)}
            </strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/orders/${orderNumber}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] text-white px-7 py-3.5 rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors shadow-soft"
        >
          <Package className="w-4 h-4" />
          <span>Track Live Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-neutral-300 text-neutral-800 px-6 py-3.5 rounded-xl font-bold text-xs hover:bg-neutral-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Hub Operations Preview Button */}
      <div className="mt-10 pt-6 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-center gap-2">
        <span>Want to see how this order looks in the business operations pipeline?</span>
        <Link
          href="/admin/orders"
          className="text-[#FF5A36] font-bold hover:underline inline-flex items-center gap-1"
        >
          Open Hub Pipeline <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="p-12 text-center text-sm">Loading order confirmation...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
