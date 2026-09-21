"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TownKartLogo } from "@/components/common/TownKartLogo";
import { SearchOverlay } from "@/components/storefront/SearchOverlay";
import { useCart } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { useAuth } from "@/components/providers/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { items, openCart, total } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;


  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "New Arrivals", href: "/shop?filter=new" },
    { name: "Best Sellers", href: "/shop?filter=bestseller" },
    { name: "Offers", href: "/offers" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              className="lg:hidden p-1.5 text-neutral-700 hover:bg-neutral-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <TownKartLogo size="md" />

            {/* Local Hub Location Badge */}
            <div className="hidden xl:flex items-center gap-2 bg-[#F7F7F5] border border-neutral-200/80 rounded-xl px-3 py-1.5 ml-3">
              <MapPin className="w-3.5 h-3.5 text-[#FF5A36] flex-shrink-0" />
              <div className="text-left text-xs leading-tight">
                <div className="font-bold text-[#111111] flex items-center gap-1">
                  <span>Civil Lines, Ward 12</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </div>
                <div className="text-[10px] text-[#16803C] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16803C] inline-block animate-pulse" />
                  Hub #04 • 30 mins delivery
                </div>
              </div>
            </div>
          </div>

          {/* Center: Search Trigger Input Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between bg-[#F7F7F5] hover:bg-neutral-100 border border-neutral-200 text-neutral-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-neutral-500 group-hover:text-[#FF5A36] transition-colors" />
                <span className="text-neutral-500 font-medium">
                  Search &ldquo;Headphones&rdquo;, &ldquo;Milk&rdquo;, &ldquo;Atta&rdquo;...
                </span>
              </div>
              <kbd className="hidden sm:inline-block bg-white text-neutral-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-neutral-200">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive
                      ? "text-[#FF5A36]"
                      : "text-neutral-700 hover:text-[#FF5A36]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5A36] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search (mobile), Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-xl"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-neutral-700 hover:text-[#FF5A36] hover:bg-neutral-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF5A36] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Account — shows Login when unauthenticated */}
            {mounted && isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-neutral-700 hover:text-[#FF5A36] hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1.5">
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline text-xs font-bold text-neutral-800">
                    {user!.name.split(" ")[0]}
                  </span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <Link href="/account" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 border-b border-neutral-100">
                    <User className="w-4 h-4" /> My Account
                  </Link>
                  <Link href="/account/orders" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 border-b border-neutral-100">
                    <Sparkles className="w-4 h-4" /> My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-neutral-700 hover:text-[#FF5A36] hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1.5"
                title="Sign In"
              >
                <User className="w-5 h-5" />
                <span className="hidden xl:inline text-xs font-bold text-neutral-800">Login</span>
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="flex items-center gap-2.5 bg-[#111111] hover:bg-[#222222] text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF5A36] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#111111]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {cartCount === 0 ? "Cart" : formatPrice(total)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 bg-[#F7F7F5] rounded-xl p-3 text-xs mb-3">
              <MapPin className="w-4 h-4 text-[#FF5A36]" />
              <div>
                <span className="font-bold text-[#111111]">Civil Lines, Ward 12</span>
                <p className="text-[11px] text-[#16803C] font-semibold">
                  Express 30 mins delivery
                </p>
              </div>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-neutral-800 py-2 hover:text-[#FF5A36]"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-neutral-100 flex gap-2">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-700"
              >
                Hub Operations
              </Link>
              <Link
                href="/delivery/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-[#FF5A36]/10 text-[#FF5A36] rounded-lg text-xs font-bold"
              >
                Rider App
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Live Search Modal Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
