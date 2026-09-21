"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Wallet, User, ArrowLeft } from "lucide-react";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/delivery/dashboard", icon: Home },
    { label: "Tasks", href: "/delivery/orders/order-7492", icon: MapPin },
    { label: "Earnings", href: "/delivery/earnings", icon: Wallet },
    { label: "Profile", href: "/delivery/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center py-0 sm:py-6">
      {/* Mobile Device Shell */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] sm:rounded-3xl sm:shadow-2xl flex flex-col border border-neutral-200 overflow-hidden relative">
        {/* Top Operational Switch Bar */}
        <div className="bg-[#111111] text-white px-4 py-2 flex items-center justify-between text-xs z-30">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <span className="font-extrabold text-[#FF5A36]">
            TownKart Rider Fleet App
          </span>
          <Link
            href="/admin"
            className="text-neutral-400 hover:text-white text-[11px]"
          >
            Admin Hub
          </Link>
        </div>

        {/* Screen Content */}
        <div className="flex-1 pb-16 overflow-y-auto">{children}</div>

        {/* Mobile Bottom Tab Bar */}
        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 px-6 flex items-center justify-between z-30 shadow-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center transition-colors ${
                  isActive ? "text-[#FF5A36]" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
