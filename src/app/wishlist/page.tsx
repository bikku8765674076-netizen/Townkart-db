"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { useWishlist } from "@/components/providers/WishlistContext";
import { useCart } from "@/components/providers/CartContext";
import { formatPrice } from "@/lib/utils";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const SAMPLE_CATALOG = [
  {
    id: "wh-01",
    name: "TownKart Studio Wireless Headphones",
    slug: "townkart-studio-wireless-headphones",
    price: 1499,
    mrp: 1899,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: "sw-02",
    name: "Noise ColorFit Ultra Smart Watch",
    slug: "noise-colorfit-ultra-smart-watch",
    price: 2999,
    mrp: 4999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
  },
  {
    id: "rs-02",
    name: "Men's AeroStrider Running Shoes",
    slug: "mens-aerostrider-running-shoes",
    price: 1999,
    mrp: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    category: "Fashion",
  },
  {
    id: "wb-03",
    name: "Insulated Stainless Steel Water Bottle 1L",
    slug: "insulated-stainless-steel-water-bottle-1l",
    price: 499,
    mrp: 799,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    category: "Sports & Fitness",
  },
];

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Filter items in wishlist or fallback to default sample items
  const wishlistedItems = SAMPLE_CATALOG.filter(
    (item) => wishlistIds.length === 0 || wishlistIds.includes(item.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Page Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#111111]">
                My Wishlist ({wishlistedItems.length} Products)
              </h1>
              <p className="text-xs text-neutral-500">
                Items saved for convenient town re-ordering.
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#FF5A36] hover:underline"
          >
            Explore Catalog →
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between"
            >
              <div className="relative pt-[80%] bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-neutral-400 hover:text-red-500 shadow-xs"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#FF5A36] uppercase">
                    {item.category}
                  </span>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-xs font-bold text-[#111111] line-clamp-1 hover:text-[#FF5A36]">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-extrabold text-[#111111]">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(item.mrp)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item, 1)}
                  className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#FF5A36] text-white py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
