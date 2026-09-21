"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TownKartLogo } from "@/components/common/TownKartLogo";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  Truck,
  Users,
  Tag,
  BarChart3,
  Settings,
  ShieldAlert,
  Bell,
  ArrowUpRight,
  Menu,
  X,
  Store,
  RefreshCw,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: "Hub Command Center", href: "/admin", icon: LayoutDashboard },
    { label: "Live Dispatch Queue", href: "/admin/orders", icon: Package, badge: "26" },
    { label: "Products Catalog", href: "/admin/products", icon: Boxes },
    { label: "Stock & Inventory", href: "/admin/inventory", icon: Layers, alert: "7" },
    { label: "Rider Fleet Radar", href: "/admin/delivery", icon: Truck },
    { label: "Town Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons & Promos", href: "/admin/coupons", icon: Tag },
    { label: "Analytics & SLA", href: "/admin/analytics", icon: BarChart3 },
    { label: "Hub & Zone Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col lg:flex-row text-[#111111]">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-[#111111] text-white px-4 py-3 flex items-center justify-between z-40">
        <TownKartLogo inverted size="sm" />
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[11px] bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded"
          >
            Storefront
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 text-neutral-300"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Dark Sidebar (Matches Image 1, 3, 4) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 w-64 bg-[#111111] text-white flex flex-col justify-between z-50 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Hub Badge */}
          <div className="space-y-3">
            <TownKartLogo inverted size="md" href="/admin" />
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-300">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-500">
                <span>Active Hub</span>
                <span className="text-[#16803C] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16803C] animate-pulse" />
                  94% SLA
                </span>
              </div>
              <p className="font-extrabold text-white mt-0.5">Anand Vihar Hub #04</p>
              <span className="text-[11px] text-neutral-400">Sector 4, Ward 12</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#FF5A36] text-white shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.alert}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Supervisor Profile & Storefront Exit */}
        <div className="p-5 border-t border-neutral-800/80 space-y-3 bg-neutral-950/40">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Sunil Deshmukh"
              className="w-9 h-9 rounded-full object-cover border border-[#FF5A36]"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                Sunil Deshmukh
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Town Supervisor
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 py-2 rounded-lg transition-colors"
            >
              <span>Storefront</span>
              <ArrowUpRight className="w-3 h-3 text-[#FF5A36]" />
            </Link>
            <Link
              href="/delivery/dashboard"
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 hover:bg-[#FF5A36]/20 py-2 rounded-lg transition-colors"
            >
              <span>Rider App</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
