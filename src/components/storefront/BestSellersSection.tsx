"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { ArrowRight, Flame } from "lucide-react";

export function BestSellersSection({ products }: { products: ProductCardProps[] }) {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#FF5A36] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-[#FF5A36] text-[#FF5A36]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-1">
              Town Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?filter=bestseller"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF5A36] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} {...p} isBestSeller={true} />
          ))}
        </div>
      </div>
    </section>
  );
}
