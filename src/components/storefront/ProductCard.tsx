"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { formatPrice } from "@/lib/utils";
import { Clock, Plus, Minus } from "lucide-react";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category?: string;
  brand?: string;
  shortDescription?: string;
  image: string;
  price: number;
  mrp: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  shortDescription,
  image,
  price,
  mrp,
  stock = 15,
}: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  const discountPercent =
    mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const cartItem = items.find((i) => i.productId === id);
  const isOutOfStock = stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setLoading(true);
    addToCart({ id, name, slug, image, price, mrp }, 1);
    setTimeout(() => setLoading(false), 200);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) updateQuantity(cartItem.id, cartItem.quantity - 1);
  };

  const optimizedImage = image.includes("images.unsplash.com")
    ? image.replace(/w=\d+/, "w=350").replace(/q=\d+/, "q=75")
    : image;

  return (
    <div className="group relative bg-white border border-[#E8E8E8] hover:border-neutral-300 rounded-2xl p-3 flex flex-col justify-between transition-all hover:shadow-sm">
      {/* Top Image & Badges */}
      <div>
        <div className="relative w-full aspect-square bg-[#FBFBFB] rounded-xl overflow-hidden mb-2.5">
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-1.5 left-1.5 z-10 bg-[#2563EB] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {/* Delivery Timer Badge (Blinkit Style) */}
          <div className="absolute top-1.5 right-1.5 z-10 bg-white/90 backdrop-blur-xs text-[#171717] text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1 border border-neutral-100">
            <Clock className="w-2.5 h-2.5 text-neutral-500" />
            <span>10 MINS</span>
          </div>

          <Link href={`/product/${slug}`} className="block w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizedImage}
              alt={name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Product Details */}
        <Link href={`/product/${slug}`} className="block">
          <h3 className="font-bold text-xs text-[#171717] line-clamp-2 leading-snug group-hover:text-[#0C831F] transition-colors">
            {name}
          </h3>
          <p className="text-[11px] text-neutral-500 font-medium mt-1 truncate">
            {shortDescription || "1 unit • Fresh stock"}
          </p>
        </Link>
      </div>

      {/* Bottom Price & ADD Button */}
      <div className="mt-3 pt-2 flex items-center justify-between gap-2 border-t border-neutral-100">
        <div>
          <div className="text-xs font-black text-[#171717] leading-tight">
            {formatPrice(price)}
          </div>
          {mrp > price && (
            <div className="text-[10px] text-neutral-400 line-through font-medium leading-none mt-0.5">
              {formatPrice(mrp)}
            </div>
          )}
        </div>

        {/* Quick Add or Quantity Selector */}
        {isOutOfStock ? (
          <span className="text-[10px] font-bold text-[#C62828] bg-red-50 px-2 py-1 rounded-md">
            Out of Stock
          </span>
        ) : cartItem ? (
          <div className="flex items-center bg-[#0C831F] text-white rounded-lg px-1.5 py-1 font-black text-xs shadow-xs">
            <button
              onClick={handleDecrease}
              className="p-1 hover:bg-black/15 rounded transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 min-w-[20px] text-center text-xs">
              {cartItem.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1 hover:bg-black/15 rounded transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={loading}
            className="border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white font-black text-xs px-3.5 py-1.5 rounded-lg bg-[#0C831F]/5 transition-all active:scale-95 shadow-2xs"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
}
