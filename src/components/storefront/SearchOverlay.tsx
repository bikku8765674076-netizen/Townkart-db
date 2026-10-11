"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  image: string | null;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  category?: { name?: string | null } | null;
  images?: Array<{ url?: string | null; alt?: string | null }>;
}

const RECENT_SEARCHES = ["Milk", "Atta", "Vegetables", "Rice"];
const TRENDING_SEARCHES = ["Daily Essentials", "Fresh Vegetables", "Bestsellers", "Household"];

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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!isOpen || trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=8`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Search request failed");
        const payload: { success?: boolean; data?: ApiProduct[] } = await response.json();
        const products = Array.isArray(payload.data) ? payload.data : [];
        setResults(
          products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.category?.name || "Everyday essentials",
            price: Number(product.sellingPrice) || 0,
            mrp: Number(product.mrp) || Number(product.sellingPrice) || 0,
            image: product.images?.[0]?.url || null,
          }))
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setResults([]);
        setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, query]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const chooseSearch = (value: string) => setQuery(value);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start overflow-y-auto overscroll-contain">
      <button
        type="button"
        aria-label="Close search overlay"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 mx-auto mt-3 w-full min-w-0 max-w-3xl px-3 pb-3 sm:mt-16 sm:px-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search TownKart products"
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
        >
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 items-center gap-2 border-b border-neutral-100 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4"
          >
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#FF5A36]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands, groceries..."
              aria-label="Search products"
              autoComplete="off"
              className="w-full min-w-0 bg-transparent text-sm font-medium text-[#111111] placeholder-neutral-400 focus:outline-none sm:text-lg"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-10 shrink-0 items-center rounded-lg bg-neutral-100 px-3 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
            >
              Close
            </button>
          </form>

          <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto p-4 sm:max-h-[70vh] sm:p-5">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-neutral-400" role="status">
                <Loader2 className="h-5 w-5 animate-spin text-[#FF5A36]" />
                <span className="text-sm">Searching TownKart products…</span>
              </div>
            ) : query.trim().length >= 2 ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  <span>Search results ({results.length})</span>
                  {results.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex items-center gap-1 font-medium normal-case text-[#FF5A36] hover:underline"
                    >
                      View all results <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {hasError ? (
                  <div className="py-10 text-center">
                    <p className="font-medium text-neutral-700">Search is temporarily unavailable.</p>
                    <button type="button" onClick={() => setQuery((value) => value + " ")} className="mt-2 text-sm text-[#FF5A36] underline">
                      Try again
                    </button>
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="font-medium text-neutral-700">No products found for “{query}”</p>
                    <p className="mt-1 text-xs text-neutral-400">Try a product name, brand, or category.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={onClose}
                        className="group flex min-w-0 items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A36] sm:gap-4"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain" />
                          ) : (
                            <Search aria-hidden="true" className="h-5 w-5 text-neutral-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#FF5A36]">{item.category}</span>
                          <h4 className="truncate text-sm font-semibold text-[#111111]">{item.name}</h4>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-sm font-bold text-[#111111]">{formatPrice(item.price)}</span>
                            {item.mrp > item.price && (
                              <span className="text-xs text-neutral-400 line-through">{formatPrice(item.mrp)}</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-[#FF5A36]" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : query.trim().length === 1 ? (
              <p className="py-5 text-center text-sm text-neutral-500">Type one more character to search.</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Quick searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RECENT_SEARCHES.map((item) => (
                      <button key={item} type="button" onClick={() => chooseSearch(item)} className="min-h-9 rounded-full bg-neutral-100 px-3 py-2 text-xs text-neutral-700 transition-colors hover:bg-neutral-200">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <TrendingUp className="h-3.5 w-3.5 text-[#FF5A36]" />
                    <span>Popular searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((item) => (
                      <button key={item} type="button" onClick={() => chooseSearch(item)} className="min-h-9 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-700 transition-colors hover:border-[#FF5A36] hover:text-[#FF5A36]">
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
