"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/CartContext";
import { ArrowRight, Star, Plus, ShieldCheck, Sparkles } from "lucide-react";

export function HeroSection() {
  const { addToCart } = useCart();

  const floatingCards = [
    {
      id: "wh-01",
      name: "Wireless Headphones",
      slug: "townkart-studio-wireless-headphones",
      price: 1499,
      mrp: 1899,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80",
      position: "top-4 -left-6 sm:-left-10",
      animation: "animate-float-1",
    },
    {
      id: "sw-02",
      name: "Smart Watch",
      slug: "noise-colorfit-ultra-smart-watch",
      price: 2999,
      mrp: 4999,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80",
      position: "top-12 -right-6 sm:-right-8",
      animation: "animate-float-2",
    },
    {
      id: "rs-02",
      name: "Running Shoes",
      slug: "mens-aerostrider-running-shoes",
      price: 1999,
      mrp: 2999,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
      position: "bottom-12 -left-6 sm:-left-8",
      animation: "animate-float-3",
    },
    {
      id: "wb-03",
      name: "Water Bottle 1L",
      slug: "insulated-stainless-steel-water-bottle-1l",
      price: 499,
      mrp: 799,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop&q=80",
      position: "bottom-4 -right-4 sm:-right-6",
      animation: "animate-float-1",
    },
  ];

  return (
    <section className="relative bg-[#F7F7F5] overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-[#E8E8E8]">
      {/* Subtle decorative background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF5A36]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-neutral-200/80 rounded-full px-3.5 py-1 text-xs font-extrabold text-[#FF5A36] uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF5A36]" />
              <span>Shop Local • Live Better</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] leading-[1.12] tracking-tight">
              Everything You Need, <br className="hidden sm:inline" />
              <span className="text-[#FF5A36]">Right Around</span> the Corner.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover everyday essentials, fresh groceries, fashion, electronics, and beauty products — delivered conveniently to your doorstep from your town hub in 30 minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FF5A36] text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base shadow-soft hover:bg-[#e04f2e] hover:gap-3.5 transition-all active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?tab=categories"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-neutral-200 text-[#111111] hover:border-neutral-400 px-7 py-4 rounded-xl font-bold text-sm sm:text-base transition-colors shadow-xs"
              >
                Explore Categories
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-left">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Customer"
                />
              </div>
              <div className="text-xs text-neutral-600">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-[#111111] ml-1">4.9/5</span>
                </div>
                <p className="font-medium text-neutral-600">
                  Trusted by <strong className="text-[#111111]">5,000+ local families</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Floating Product Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Main Lifestyle Image Container */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80"
                alt="TownKart Lifestyle Express Shopping"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="bg-[#16803C] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  Same-Day Express
                </span>
                <p className="font-bold text-sm mt-1">Sector 4 Fulfillment Hub • Civil Lines</p>
              </div>
            </div>

            {/* 4 Interactive Floating Product Cards */}
            {floatingCards.map((card) => (
              <div
                key={card.id}
                className={`absolute ${card.position} ${card.animation} hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 pr-3.5 rounded-2xl shadow-hover border border-neutral-100 z-20 transition-transform hover:scale-105 select-none`}
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-[#111111] line-clamp-1 max-w-[110px]">
                    {card.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-extrabold text-[#FF5A36]">
                      {formatPrice(card.price)}
                    </span>
                    <span className="text-[10px] text-neutral-400 line-through">
                      {formatPrice(card.mrp)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(card, 1)}
                  className="w-7 h-7 rounded-lg bg-[#111111] text-white hover:bg-[#FF5A36] transition-colors flex items-center justify-center flex-shrink-0 ml-1 shadow-xs"
                  title="Quick Add to Cart"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
