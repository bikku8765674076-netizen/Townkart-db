"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Clock, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
}

const SAMPLE_SEARCH_CATALOG: SearchResultItem[] = [
  {
    id: "wh-01",
    name: "TownKart Studio Wireless Headphones",
    slug: "townkart-studio-wireless-headphones",
    category: "Electronics",
    price: 1499,
    mrp: 1899,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "sw-02",
    name: "Noise ColorFit Ultra Smart Watch",
    slug: "noise-colorfit-ultra-smart-watch",
    category: "Electronics",
    price: 2999,
    mrp: 4999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "rs-02",
    name: "Men's AeroStrider Running Shoes",
    slug: "mens-aerostrider-running-shoes",
    category: "Fashion",
    price: 1999,
    mrp: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "wb-03",
    name: "Insulated Stainless Steel Water Bottle 1L",
    slug: "insulated-stainless-steel-water-bottle-1l",
    category: "Sports & Fitness",
    price: 499,
    mrp: 799,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "gr-01",
    name: "Aashirvaad Shudh Chakki Whole Wheat Atta 5kg",
    slug: "aashirvaad-shudh-chakki-whole-wheat-atta-5kg",
    category: "Grocery",
    price: 245,
    mrp: 285,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "gr-02",
    name: "Amul Taaza Fresh Toned Milk 1L",
    slug: "amul-taaza-fresh-toned-milk-1l",
    category: "Grocery",
    price: 52,
    mrp: 54,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "gr-03",
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    slug: "fortune-sunlite-refined-sunflower-oil-1l",
    category: "Grocery",
    price: 142,
    mrp: 165,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "fv-01",
    name: "Farm Fresh Hybrid Tomatoes 1kg",
    slug: "farm-fresh-hybrid-tomatoes-1kg",
    category: "Fruits & Vegetables",
    price: 35,
    mrp: 45,
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb7?w=300&auto=format&fit=crop&q=80",
  },
];

const RECENT_SEARCHES = ["Wireless Headphones", "Amul Milk", "Running Shoes", "Aashirvaad Atta"];
const TRENDING_SEARCHES = ["Daily Essentials", "Electronics", "Fresh Vegetables", "Bestsellers", "Audio"];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const filtered = SAMPLE_SEARCH_CATALOG.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
      setResults(filtered);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
          {/* Top Search Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center px-5 py-4 border-b border-neutral-100 gap-3"
          >
            <Search className="w-5 h-5 text-[#FF5A36] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, groceries, electronics..."
              className="w-full text-base sm:text-lg bg-transparent text-[#111111] placeholder-neutral-400 focus:outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2.5 py-1.5 rounded-lg font-medium transition-colors ml-2"
            >
              ESC
            </button>
          </form>

          {/* Body Content */}
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-neutral-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#FF5A36]" />
                <span className="text-sm">Searching town catalog...</span>
              </div>
            ) : query.trim() ? (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  <span>Search Results ({results.length})</span>
                  {results.length > 0 && (
                    <button
                      onClick={handleSubmit}
                      className="text-[#FF5A36] hover:underline flex items-center gap-1 normal-case font-medium"
                    >
                      View all results <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-neutral-700 font-medium">
                      No products found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Try searching for &ldquo;Headphones&rdquo;, &ldquo;Milk&rdquo;, or &ldquo;Atta&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 py-3 hover:bg-neutral-50 rounded-xl px-2 transition-colors group"
                      >
                        <div className="relative w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold text-[#FF5A36] uppercase tracking-wide">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-semibold text-[#111111] truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-[#111111]">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPrice(item.mrp)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF5A36] group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RECENT_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span>Trending in Civil Lines Hub</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="text-xs border border-neutral-200 hover:border-[#FF5A36] hover:text-[#FF5A36] text-neutral-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
