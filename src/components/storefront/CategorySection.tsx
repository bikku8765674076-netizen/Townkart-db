"use client";

import React from "react";
import Link from "next/link";

const QUICK_COMMERCE_CATEGORIES = [
  {
    name: "Dairy, Bread & Eggs",
    slug: "dairy-bread-eggs",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Cold Drinks & Juices",
    slug: "cold-drinks-juices",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Snacks & Munchies",
    slug: "snacks-munchies",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Breakfast & Instant Food",
    slug: "breakfast-instant-food",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Sweet Tooth",
    slug: "sweet-tooth",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Bakery & Biscuits",
    slug: "bakery-biscuits",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Tea, Coffee & Milk Drinks",
    slug: "tea-coffee-milk-drinks",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Atta, Rice & Dal",
    slug: "atta-rice-dal",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Masala, Oil & More",
    slug: "masala-oil-more",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Sauces & Spreads",
    slug: "sauces-spreads",
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Organic & Healthy Living",
    slug: "organic-healthy-living",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Baby Care",
    slug: "baby-care",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Pharma & Wellness",
    slug: "pharma-wellness",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Cleaning Essentials",
    slug: "cleaning-essentials",
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Home & Office",
    slug: "home-office",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Pet Care",
    slug: "pet-care",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80",
  },
];

export function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5 sm:gap-3.5">
        {QUICK_COMMERCE_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center text-center p-2 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all group shadow-2xs"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F0F5FA] overflow-hidden flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain mix-blend-multiply"
                loading="lazy"
              />
            </div>
            <span className="text-[11px] font-bold text-[#171717] leading-tight line-clamp-2 px-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
