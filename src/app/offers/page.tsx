"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { Tag, Copy, Check, Sparkles, ArrowRight } from "lucide-react";

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: "WELCOME10",
      title: "10% Instant Discount",
      desc: "Get 10% off up to ₹150 on your shopping order. Valid on all grocery and electronics.",
      minOrder: "₹299",
      tag: "NEW USER",
    },
    {
      code: "SAVE100",
      title: "Flat ₹100 Off Big Basket",
      desc: "Save flat ₹100 on orders above ₹999 across all departments.",
      minOrder: "₹999",
      tag: "SUPER SAVER",
    },
    {
      code: "TOWNEXPRESS",
      title: "Free Delivery + ₹50 Off",
      desc: "Get free express delivery and ₹50 instant cashback on orders above ₹499.",
      minOrder: "₹499",
      tag: "EXPRESS PERK",
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Town Deals &amp; Discounts
          </span>
          <h1 className="text-3xl font-black text-[#111111] mt-2">
            Active TownKart Coupons
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Apply these verified promo codes at checkout for instant savings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-4 hover:shadow-hover transition-all"
            >
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-[#16803C] px-2 py-0.5 rounded">
                  {c.tag}
                </span>
                <h3 className="text-base font-extrabold text-[#111111] mt-2">
                  {c.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {c.desc}
                </p>
                <div className="text-[11px] text-neutral-400 font-semibold mt-2">
                  Min. Order: <span className="text-black">{c.minOrder}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className="font-mono font-black text-sm text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-1 rounded-lg">
                  {c.code}
                </span>
                <button
                  onClick={() => handleCopy(c.code)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#16803C]" />
                      <span className="text-[#16803C]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-7 py-3.5 rounded-xl text-xs font-bold shadow-soft hover:bg-neutral-800"
          >
            <span>Start Shopping with Coupons</span>
            <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
          </Link>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
