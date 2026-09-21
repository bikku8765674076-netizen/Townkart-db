"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FeaturedCollectionBanner() {
  return (
    <section className="py-10 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#F7F7F5] rounded-3xl p-6 sm:p-10 border border-neutral-200/80">
          {/* Image */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
              alt="Everyday Essentials Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#111111] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
              New Collection
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4 sm:p-4">
            <span className="text-xs font-extrabold text-[#FF5A36] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Town Exclusive Line
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              Fresh Styles. Everyday Essentials.
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Thoughtfully selected home goods, apparel, and daily staples crafted for comfort and enduring everyday use. Sourced locally with zero packaging compromise.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-800 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all hover:gap-3"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
