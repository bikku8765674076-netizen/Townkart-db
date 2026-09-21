"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { useAuth } from "@/components/providers/AuthContext";
import {
  User,
  Package,
  MapPin,
  Heart,
  Tag,
  LogOut,
  Shield,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function AccountPage() {
  const { user, logout } = useAuth();

  const adminRoles = [
    "SUPER_ADMIN",
    "SUPERVISOR",
    "ADMIN",
    "INVENTORY_MANAGER",
    "ORDER_MANAGER",
    "DELIVERY_MANAGER",
    "CONTENT_MANAGER",
  ];

  const isAdmin = user && adminRoles.includes(user.role);
  const isRider = user?.role === "DELIVERY_PARTNER";

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* User Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt={user?.name ?? "User"}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FF5A36] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#111111]">
                  {user?.name ?? "My Account"}
                </h1>
                <span className="bg-[#16803C]/10 text-[#16803C] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  {user?.role ?? "CUSTOMER"}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{user?.phone}</p>
              <p className="text-xs text-neutral-400">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 bg-[#111111] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Admin Hub</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </Link>
            )}
            {isRider && (
              <Link
                href="/delivery/dashboard"
                className="inline-flex items-center gap-1.5 bg-[#FF5A36] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#e04f2e] transition-colors"
              >
                <span>Rider App</span>
                <ExternalLink className="w-3 h-3 text-white/80" />
              </Link>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "My Orders",
              desc: "Track active shipments, view invoices and re-order",
              href: "/account/orders",
              icon: Package,
              count: "3 Orders",
            },
            {
              title: "Saved Addresses",
              desc: "Manage home, work and local delivery points",
              href: "/account/addresses",
              icon: MapPin,
              count: "2 Saved",
            },
            {
              title: "My Wishlist",
              desc: "Saved items and favorites for fast re-stocking",
              href: "/wishlist",
              icon: Heart,
              count: "4 Items",
            },
            {
              title: "Coupons & Offers",
              desc: "Exclusive town promo codes: WELCOME10, SAVE100",
              href: "/offers",
              icon: Tag,
              count: "3 Active",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-soft hover:shadow-hover transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#F7F7F5] group-hover:bg-[#FF5A36]/10 text-neutral-700 group-hover:text-[#FF5A36] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                    {item.count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-[#FF5A36] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
