"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { Heart, Star, Plus, Minus, Check, ShoppingBag } from "lucide-react";

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
  category,
  shortDescription,
  image,
  price,
  mrp,
  rating = 4.7,
  reviewCount = 120,
  stock = 15,
  isBestSeller = false,
  isNewArrival = false,
}: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const isWishlisted = isInWishlist(id);
  const cartItem = items.find((i) => i.productId === id);
  const isOutOfStock = stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({ id, name, slug, image, price, mrp }, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const optimizedImage = image.includes("images.unsplash.com")
    ? image.replace(/w=\d+/, "w=400").replace(/q=\d+/, "q=75")
    : image;

  return (
    <div className="group relative bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <Link href={`/product/${slug}`} className="block relative bg-[#F7F7F7] pt-[100%] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimizedImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#FF5A36] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {isBestSeller && (
            <span className="bg-[#111111] text-amber-300 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
              Bestseller
            </span>
          )}
          {isNewArrival && !isBestSeller && (
            <span className="bg-emerald-700 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-xs tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-red-500 hover:scale-110 shadow-xs transition-all z-10"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-neutral-500 hover:text-red-500"
            }`}
          />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-neutral-800 text-white text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {category && (
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
              {category}
            </span>
          )}

          <Link href={`/product/${slug}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-[#111111] line-clamp-2 hover:text-[#FF5A36] transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {shortDescription && (
            <p className="text-[11px] text-neutral-600 truncate mt-0.5">
              {shortDescription}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-[#111111]">{rating}</span>
            <span className="text-[11px] text-neutral-600">({reviewCount})</span>
          </div>
        </div>

        {/* Price and Cart Action */}
        <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-[#111111]">
                {formatPrice(price)}
              </span>
              {mrp > price && (
                <span className="text-[11px] text-neutral-600 line-through">
                  {formatPrice(mrp)}
                </span>
              )}
            </div>
            {stock <= 5 && stock > 0 && (
              <span className="text-[10px] font-semibold text-amber-600">
                Only {stock} left!
              </span>
            )}
          </div>

          {/* Add to Cart Stepper / Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : cartItem ? (
            <div className="flex items-center bg-[#111111] text-white rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={handleDecrease}
                className="px-2 py-1.5 hover:bg-neutral-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold select-none">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="px-2 py-1.5 hover:bg-neutral-800 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                justAdded
                  ? "bg-[#16803C] text-white"
                  : "bg-[#FF5A36] text-white hover:bg-[#e04f2e]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
