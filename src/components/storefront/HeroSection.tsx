"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Main Hero Landscape Banner (Blinkit Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white p-6 sm:p-10 lg:p-12 shadow-sm min-h-[220px] sm:min-h-[260px] flex items-center justify-between">
        <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Stock up on daily essentials
          </h1>
          <p className="text-xs sm:text-base text-white/90 font-medium leading-relaxed max-w-md">
            Get farm-fresh goodness & a range of exotic fruits, vegetables, dairy, eggs & pantry staples delivered in 10-15 minutes.
          </p>
          <div className="pt-1">
            <Link
              href="/shop?category=grocery"
              className="inline-flex items-center gap-2 bg-white text-[#171717] hover:bg-neutral-100 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative Grocery Collage Image */}
        <div className="hidden md:block absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-[340px] lg:w-[420px] h-[220px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
            alt="Fresh Groceries"
            className="w-full h-full object-cover rounded-2xl opacity-90 shadow-lg border border-white/20"
          />
        </div>
      </div>

      {/* 3 Mini Feature Promo Cards (Blinkit Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Pharmacy Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00A896] to-[#028090] text-white p-5 flex flex-col justify-between min-h-[150px] shadow-xs group">
          <div className="relative z-10 space-y-1 max-w-[65%]">
            <h3 className="font-black text-sm sm:text-base leading-snug">
              Pharmacy at your doorstep!
            </h3>
            <p className="text-[11px] text-white/80 font-medium line-clamp-2">
              Pain relief, wellness, cough syrups & essentials.
            </p>
          </div>
          <div className="relative z-10 mt-3">
            <Link
              href="/shop?category=pharmacy"
              className="inline-block bg-[#111111] hover:bg-black text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Order Now
            </Link>
          </div>
          <div className="absolute right-2 bottom-2 w-24 h-24 opacity-80 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80"
              alt="Pharmacy"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Pet Care Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white p-5 flex flex-col justify-between min-h-[150px] shadow-xs group">
          <div className="relative z-10 space-y-1 max-w-[65%]">
            <h3 className="font-black text-sm sm:text-base leading-snug">
              Pet care supplies at your door
            </h3>
            <p className="text-[11px] text-white/80 font-medium line-clamp-2">
              Food, treats, toys, grooming & more.
            </p>
          </div>
          <div className="relative z-10 mt-3">
            <Link
              href="/shop?category=pet-care"
              className="inline-block bg-[#111111] hover:bg-black text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Order Now
            </Link>
          </div>
          <div className="absolute right-2 bottom-2 w-24 h-24 opacity-80 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80"
              alt="Pet Supplies"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Baby Care Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] text-white p-5 flex flex-col justify-between min-h-[150px] shadow-xs group">
          <div className="relative z-10 space-y-1 max-w-[65%]">
            <h3 className="font-black text-sm sm:text-base leading-snug">
              No time for a diaper run?
            </h3>
            <p className="text-[11px] text-white/80 font-medium line-clamp-2">
              Get baby care essentials, wipes & formulas.
            </p>
          </div>
          <div className="relative z-10 mt-3">
            <Link
              href="/shop?category=baby-care"
              className="inline-block bg-[#111111] hover:bg-black text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Order Now
            </Link>
          </div>
          <div className="absolute right-2 bottom-2 w-24 h-24 opacity-80 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&auto=format&fit=crop&q=80"
              alt="Baby Care"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
