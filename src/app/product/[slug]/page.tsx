"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCart } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { formatPrice } from "@/lib/utils";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  sku: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
  rating?: number;
  reviewCount?: number;
  shortDescription?: string;
  description?: string;
  category: { name: string; slug: string };
  brand?: { name: string; slug: string };
  images: { url: string; alt?: string }[];
  variants?: { id: string; name: string; price: number; stock: number }[];
  related?: {
    id: string;
    name: string;
    slug: string;
    sellingPrice: number;
    mrp: number;
    stock: number;
    images: { url: string }[];
  }[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { items, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
          const firstImg =
            json.data.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80";
          setSelectedImage(firstImg);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-white rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded-xl w-3/4 animate-pulse" />
              <div className="h-6 bg-neutral-200 rounded-xl w-1/3 animate-pulse" />
              <div className="h-24 bg-neutral-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-neutral-300 mb-3" />
          <h2 className="text-lg font-black text-[#111111]">
            Product Not Found
          </h2>
          <p className="text-xs text-neutral-500 mt-1 mb-6">
            The item you are looking for is unavailable or out of catalog.
          </p>
          <Link
            href="/shop"
            className="bg-[#0C831F] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cartItem = items.find((i) => i.productId === product.id);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent =
    product.mrp > product.sellingPrice
      ? Math.round(
          ((product.mrp - product.sellingPrice) / product.mrp) * 100
        )
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-black"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-[#111111] truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Grid: Left Image, Right Info */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Gallery */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-square bg-[#FBFBFB] rounded-2xl overflow-hidden border border-neutral-100 flex items-center justify-center p-4">
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs z-10">
                  {discountPercent}% OFF
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-[#FBFBFB] flex-shrink-0 transition-all ${
                      selectedImage === img.url
                        ? "border-[#0C831F] ring-2 ring-[#0C831F]/20"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Price, ADD button, Delivery details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0C831F] bg-[#0C831F]/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {product.category.name}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#111111] leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  {product.shortDescription || "1 unit • Packed with care"}
                </p>
              </div>

              {/* Delivery Timing Badge */}
              <div className="inline-flex items-center gap-2 bg-[#F7F7F5] border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold text-[#111111]">
                <Clock className="w-4 h-4 text-[#0C831F]" />
                <span>10–15 Minutes Express Delivery</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-[#111111]">
                  {formatPrice(product.sellingPrice)}
                </span>
                {product.mrp > product.sellingPrice && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through font-semibold">
                    {formatPrice(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-black text-[#0C831F]">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                {product.stock <= 0 ? (
                  <span className="bg-red-50 text-red-600 font-black text-xs px-4 py-2.5 rounded-xl border border-red-200">
                    Out of Stock
                  </span>
                ) : cartItem ? (
                  <div className="flex items-center bg-[#0C831F] text-white rounded-xl px-2 py-1.5 font-black text-sm shadow-xs">
                    <button
                      onClick={() =>
                        updateQuantity(cartItem.id, cartItem.quantity - 1)
                      }
                      className="p-1.5 hover:bg-black/15 rounded transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm">{cartItem.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(cartItem.id, cartItem.quantity + 1)
                      }
                      className="p-1.5 hover:bg-black/15 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      addToCart(
                        {
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          image:
                            product.images[0]?.url ||
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
                          price: product.sellingPrice,
                          mrp: product.mrp,
                        },
                        1
                      )
                    }
                    className="bg-[#0C831F] hover:bg-[#0a6f1a] text-white font-black text-xs sm:text-sm px-8 py-3 rounded-xl shadow-xs transition-transform active:scale-95"
                  >
                    ADD TO CART
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                  }`}
                  title="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-red-600" : ""}`}
                  />
                </button>
              </div>

              {/* Why shop from TownKart */}
              <div className="pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-600 font-semibold">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0C831F] flex-shrink-0" />
                  <span>10-15 Min Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0C831F] flex-shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#0C831F] flex-shrink-0" />
                  <span>Doorstep Return</span>
                </div>
              </div>

              {/* Full Description */}
              {product.description && (
                <div className="pt-4 border-t border-neutral-100 space-y-1">
                  <h3 className="font-extrabold text-xs text-[#111111]">
                    Product Details
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.related && product.related.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-black text-[#111111]">
              Customers Also Bought
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {product.related.map((rel) => (
                <ProductCard
                  key={rel.id}
                  id={rel.id}
                  name={rel.name}
                  slug={rel.slug}
                  category={product.category.name}
                  image={
                    rel.images[0]?.url ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80"
                  }
                  price={rel.sellingPrice}
                  mrp={rel.mrp}
                  stock={rel.stock}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
