"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthContext";
import { Truck, Zap, Phone, LayoutDashboard, Bike } from "lucide-react";

export function AnnouncementBar() {
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin =
    mounted &&
    isAuthenticated &&
    user &&
    [
      "SUPER_ADMIN",
      "SUPERVISOR",
      "ADMIN",
      "INVENTORY_MANAGER",
      "ORDER_MANAGER",
      "DELIVERY_MANAGER",
      "CONTENT_MANAGER",
    ].includes(user.role);

  const isRider = mounted && isAuthenticated && user?.role === "DELIVERY_PARTNER";

  return (
    <div className="bg-[#111111] text-white text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Delivery highlights */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-neutral-200">
            <Truck className="w-3.5 h-3.5 text-[#FF5A36]" />
            Free Delivery Above <strong className="text-white font-semibold">₹499</strong>
          </span>
          <span className="hidden sm:inline-block text-neutral-600">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-neutral-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Same-Day Local Express: <span className="text-white font-semibold">30–45 Mins</span>
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Role-based portal shortcuts */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/30 rounded-lg px-2 py-0.5 text-[11px] font-semibold hover:bg-[#FF5A36]/30 transition-colors"
            >
              <LayoutDashboard className="w-3 h-3" />
              Hub Admin
            </Link>
          )}
          {isRider && (
            <Link
              href="/delivery/dashboard"
              className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg px-2 py-0.5 text-[11px] font-semibold hover:bg-blue-500/30 transition-colors"
            >
              <Bike className="w-3 h-3" />
              Rider App
            </Link>
          )}

          <span className="hidden lg:flex items-center gap-1 text-neutral-400 hover:text-white transition-colors">
            <Phone className="w-3 h-3 text-neutral-400" />
            <span>Town Helpline: +91 80099 22444</span>
          </span>
        </div>
      </div>
    </div>
  );
}
