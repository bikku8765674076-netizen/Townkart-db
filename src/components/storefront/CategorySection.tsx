"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategorySection() {
  const categories = [
    {
      name: "Grocery",
      slug: "grocery",
      count: "12k+ products",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Fruits & Vegetables",
      slug: "fruits-vegetables",
      count: "8k+ products",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Electronics",
      slug: "electronics",
      count: "5k+ products",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Fashion",
      slug: "fashion",
      count: "9k+ products",
      image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
      count: "3k+ products",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Home & Living",
      slug: "home-living",
      count: "4k+ products",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Sports & Fitness",
      slug: "sports-fitness",
      count: "2k+ products",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
    },
    {
      name: "Accessories",
      slug: "accessories",
      count: "3k+ products",
      image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#FF5A36] uppercase tracking-wider">
              Browse Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Explore handpicked town essentials curated for your daily lifestyle.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF5A36] hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group bg-[#F7F7F5] rounded-2xl overflow-hidden border border-neutral-200/70 hover:border-[#FF5A36]/40 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col"
            >
              {/* Category Image */}
              <div className="relative pt-[75%] overflow-hidden bg-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Category Info */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between bg-white">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111111] group-hover:text-[#FF5A36] transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {cat.count}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#F7F7F5] group-hover:bg-[#FF5A36] group-hover:text-white text-neutral-500 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
