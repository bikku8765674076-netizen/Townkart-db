"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

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
    mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const cartItem = items.find((i) => i.productId === id);
  const isOutOfStock = stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || loading) return;
    setLoading(true);
    addToCart({ id, name, slug, image, price, mrp }, 1);
    setTimeout(() => setLoading(false), 200);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity < stock) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
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
    <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-[#E8E8E8] bg-white p-2.5 transition-colors hover:border-neutral-300 sm:p-3">
      <div>
        <div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-xl bg-[#FBFBFB]">
          {discountPercent > 0 && (
            <span className="absolute left-1.5 top-1.5 z-10 rounded bg-[#2563EB] px-1.5 py-1 text-[10px] font-bold text-white">
              {discountPercent}% OFF
            </span>
          )}

          <Link
            href={`/product/${slug}`}
            className="block h-full w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C831F]"
            aria-label={`View ${name} details`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizedImage}
              alt={name}
              className="h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <Link href={`/product/${slug}`} className="block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0C831F]">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#171717] group-hover:text-[#0C831F]">
            {name}
          </h3>
          <p className="mt-1 truncate text-xs font-medium text-neutral-500">
            {shortDescription || "1 unit"}
          </p>
        </Link>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5">
        <div className="min-w-0">
          <div className="text-sm font-extrabold leading-tight text-[#171717]">
            {formatPrice(price)}
          </div>
          {mrp > price && (
            <div className="mt-0.5 text-xs font-medium leading-none text-neutral-400 line-through">
              {formatPrice(mrp)}
            </div>
          )}
        </div>

        {isOutOfStock ? (
          <span className="shrink-0 rounded-md bg-red-50 px-2 py-2 text-[11px] font-bold text-[#C62828]">
            Out of stock
          </span>
        ) : cartItem ? (
          <div className="flex min-h-10 shrink-0 items-center rounded-lg bg-[#0C831F] px-1 text-white shadow-xs">
            <button
              onClick={handleDecrease}
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-black/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label={`Decrease ${name} quantity`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-6 text-center text-sm font-bold" aria-live="polite">
              {cartItem.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={cartItem.quantity >= stock}
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-black/15 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label={`Increase ${name} quantity`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={loading}
            className="min-h-10 min-w-[68px] shrink-0 rounded-lg border border-[#0C831F] bg-[#0C831F]/5 px-3 text-xs font-extrabold text-[#0C831F] transition-colors hover:bg-[#0C831F] hover:text-white active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C831F]"
            aria-label={`Add ${name} to cart`}
          >
            {loading ? "Adding…" : "ADD"}
          </button>
        )}
      </div>
    </article>
  );
}
