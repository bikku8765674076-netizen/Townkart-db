"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
  rating: number;
  reviewCount: number;
  shortDescription?: string;
  category: { name: string; slug: string };
  brand?: { name: string };
  images: { url: string; alt?: string }[];
}

const RECENT_SEARCHES_KEY = "tk_recent_searches";
const POPULAR_SEARCHES = ["atta", "milk", "tomatoes", "headphones", "paneer", "oil", "salt", "soap"];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const saveSearch = useCallback((q: string) => {
    setRecentSearches((prev) => {
      const updated = [q, ...prev.filter((s) => s !== q)].slice(0, 8);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]); setTotal(0); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
      if (query.trim().length >= 2) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      } else if (!query) {
        router.replace("/search", { scroll: false });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, doSearch, router]);

  useEffect(() => {
    if (initialQ) { doSearch(initialQ); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      {/* Search Header */}
      <div className="bg-white border-b border-[#E7E7E7] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#686868] hover:text-[#171717] flex-shrink-0 p-1">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <div className="flex-1 flex items-center bg-[#F7F7F5] rounded-xl border border-[#E7E7E7] px-3 py-2.5 gap-2">
              <Search className="w-4 h-4 text-[#686868] flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && query.trim().length >= 2) saveSearch(query.trim()); }}
                placeholder="Search for groceries, brands, products…"
                className="flex-1 bg-transparent text-sm text-[#171717] placeholder-[#686868] outline-none font-medium"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults([]); router.replace("/search"); }} className="text-[#686868] hover:text-[#171717]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {!query && (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#686868]" /> Recent Searches
                  </h3>
                  <button
                    onClick={() => { setRecentSearches([]); try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch {} }}
                    className="text-xs text-[#FF5A36] font-semibold"
                  >Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button key={s} onClick={() => setQuery(s)}
                      className="bg-white border border-[#E7E7E7] text-sm font-medium text-[#171717] px-3 py-1.5 rounded-full hover:border-[#F7D928] transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#F7D928]" /> Popular in TownKart
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((s) => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="bg-[#F7D928]/10 border border-[#F7D928]/30 text-sm font-medium text-[#171717] px-3 py-1.5 rounded-full hover:bg-[#F7D928]/20 transition-colors capitalize">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
                <div className="w-16 h-16 bg-[#E7E7E7] rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#E7E7E7] rounded w-3/4" />
                  <div className="h-3 bg-[#E7E7E7] rounded w-1/2" />
                  <div className="h-4 bg-[#E7E7E7] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && query && (
          <>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-[#171717] mb-2">No results for &quot;{query}&quot;</h3>
                <p className="text-sm text-[#686868] mb-6">Try different keywords or browse categories</p>
                <Link href="/shop" className="bg-[#FF5A36] text-white font-bold text-sm px-6 py-3 rounded-xl inline-block">
                  Browse All Products
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-[#686868] mb-4 uppercase tracking-wider">
                  {total} result{total !== 1 ? "s" : ""} for &quot;{query}&quot;
                </p>
                <div className="space-y-3">
                  {results.map((product) => (
                    <Link key={product.id} href={`/product/${product.slug}`}
                      className="bg-white rounded-2xl p-4 flex gap-4 border border-[#E7E7E7] hover:border-[#F7D928] hover:shadow-sm transition-all group block">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F7F7F5] flex-shrink-0 relative">
                        {product.images[0]?.url ? (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#686868] mb-0.5">{product.category.name}</p>
                        <h4 className="text-sm font-bold text-[#171717] line-clamp-2 group-hover:text-[#FF5A36] transition-colors">{product.name}</h4>
                        {product.shortDescription && (
                          <p className="text-xs text-[#686868] mt-0.5 line-clamp-1">{product.shortDescription}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-sm font-black text-[#171717]">{formatPrice(product.sellingPrice)}</span>
                          {product.mrp > product.sellingPrice && (
                            <span className="text-xs text-[#686868] line-through">{formatPrice(product.mrp)}</span>
                          )}
                          {product.stock === 0 && (
                            <span className="text-xs font-bold text-[#C62828] bg-red-50 px-1.5 py-0.5 rounded">Out of Stock</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#686868] self-center flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { Suspense } from "react";
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="animate-pulse text-[#686868] text-sm">Loading search…</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
