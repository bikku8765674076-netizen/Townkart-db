"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TownKartLogo } from "@/components/common/TownKartLogo";
import { LocationModal } from "@/components/storefront/LocationModal";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";

const PLACEHOLDER_SUGGESTIONS = [
  'Search "milk"',
  'Search "atta"',
  'Search "paneer"',
  'Search "chips"',
  'Search "curd"',
  'Search "soft drinks"',
];

export function Header() {
  const router = useRouter();
  const { items, openCart, total } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locality, setLocality] = useState("Civil Lines, Ward 12");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("townkart_locality");
    if (stored) setLocality(stored);

    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSelectLocality = (name: string) => {
    setLocality(name);
    try {
      localStorage.setItem("townkart_locality", name);
    } catch {
      // ignore
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const cartCount = mounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E8E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo & Delivery Locality */}
          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center">
              <TownKartLogo size="md" />
            </Link>

            {/* Location selector dropdown button */}
            <button
              onClick={() => setIsLocationOpen(true)}
              className="text-left flex flex-col justify-center max-w-[130px] sm:max-w-[200px] hover:opacity-85 transition-opacity"
            >
              <div className="text-xs sm:text-sm font-black text-[#171717] leading-tight">
                Delivery in 10-15 minutes
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 font-medium truncate flex items-center gap-1 mt-0.5">
                <span className="truncate">{locality}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              </div>
            </button>
          </div>

          {/* Center: Search Bar (Blinkit Style) */}
          <div className="flex-1 max-w-2xl mx-1 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="flex items-center bg-[#F7F7F5] border border-neutral-200/90 rounded-xl sm:rounded-2xl px-3.5 py-2 sm:py-2.5 focus-within:border-[#0C831F] focus-within:bg-white transition-all shadow-xs">
                <Search className="w-4 h-4 text-neutral-500 mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={PLACEHOLDER_SUGGESTIONS[placeholderIdx]}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#171717] placeholder-neutral-400 outline-none font-medium"
                />
              </div>
            </form>
          </div>

          {/* Right: Login/Profile & "My Cart" Button */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {mounted && isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#171717] hover:text-[#0C831F] px-2 py-1.5 rounded-lg transition-colors">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {user?.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-1">
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    <span>Delivery Addresses</span>
                  </Link>
                  {["SUPER_ADMIN", "ADMIN", "SUPERVISOR"].includes(
                    user?.role ?? ""
                  ) && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FF5A36] hover:bg-neutral-50"
                    >
                      <span>Admin Hub</span>
                    </Link>
                  )}
                  {user?.role === "DELIVERY_PARTNER" && (
                    <Link
                      href="/delivery/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0C831F] hover:bg-neutral-50"
                    >
                      <span>Rider Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-t border-neutral-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs sm:text-sm font-bold text-[#171717] hover:text-[#0C831F] px-2 py-1.5 transition-colors"
              >
                Login
              </Link>
            )}

            {/* My Cart Pill Button */}
            <button
              onClick={openCart}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-xs transition-transform active:scale-95 ${
                cartCount > 0
                  ? "bg-[#0C831F] text-white hover:bg-[#0a6f1a]"
                  : "bg-[#0C831F]/10 text-[#0C831F] hover:bg-[#0C831F]/20"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 ? (
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] font-bold text-white/90">
                    {cartCount} item{cartCount > 1 ? "s" : ""}
                  </span>
                  <span className="text-xs font-black">{formatPrice(total)}</span>
                </div>
              ) : (
                <span>My Cart</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentLocality={locality}
        onSelectLocality={handleSelectLocality}
      />
    </>
  );
}
