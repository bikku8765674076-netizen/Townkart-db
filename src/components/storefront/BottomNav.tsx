"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, Package, User } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";

export function BottomNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Hide bottom nav in admin or rider interfaces
  if (pathname.startsWith("/admin") || pathname.startsWith("/delivery")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Grid },
    {
      label: "Search",
      action: () => setIsSearchOpen(true),
      icon: Search,
    },
    { label: "Orders", href: "/account/orders", icon: Package },
    { label: "Account", href: "/account", icon: User },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E8E8] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center justify-center p-1.5 text-neutral-500 hover:text-[#FF5A36] transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
                isActive
                  ? "text-[#FF5A36] font-bold"
                  : "text-neutral-500 hover:text-[#FF5A36]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
