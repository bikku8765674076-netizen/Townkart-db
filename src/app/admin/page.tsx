"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  IndianRupee,
  Package,
  Bike,
  AlertTriangle,
  Zap,
  TrendingUp,
  RefreshCw,
  Sliders,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  User,
  ExternalLink,
} from "lucide-react";

export default function AdminHubCommandCenter() {
  const [dateRange, setDateRange] = useState<"7days" | "30days">("30days");
  const [autoDispatch, setAutoDispatch] = useState(true);

  // 5 Top KPI Telemetry Cards (from Image 3)
  const kpis = [
    {
      title: "TODAY'S GMV",
      val: "₹1,42,850",
      sub: "+18.4% vs y'day",
      note: "AOV: ₹296",
      icon: IndianRupee,
      color: "bg-emerald-50 text-[#16803C]",
    },
    {
      title: "TOTAL ORDERS",
      val: "482 orders",
      sub: "94.2% On-Time",
      note: "Target 95%",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "DELIVERY FLEET",
      val: "18 online riders",
      sub: "14 In Transit",
      note: "4 Idle at Hub",
      icon: Bike,
      color: "bg-red-50 text-[#FF5A36]",
    },
    {
      title: "STOCK HEALTH",
      val: "7 Critical Stockouts",
      sub: "Amul Milk, Onion 1kg +5",
      note: "Action required",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "HUB SPEED",
      val: "8.4 min packing avg",
      sub: "Target < 9.0 min",
      note: "Civil Lines #04",
      icon: Zap,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const recentOrders = [
    { id: "TK-9835", customer: "Pooja Verma", amount: 378, status: "Pending Payment", time: "2m ago" },
    { id: "TK-9833", customer: "Ankit Trivedi", amount: 195, status: "Confirmed", time: "1m ago" },
    { id: "TK-9831", customer: "Amit Sharma", amount: 425, status: "Packing (Dinesh #2)", time: "4m ago" },
    { id: "TK-9829", customer: "Rahul G.", amount: 220, status: "Ready at Bay B-04", time: "6m ago" },
    { id: "TK-7492", customer: "Amit Sharma", amount: 199.3, status: "Out for Delivery", time: "12m ago" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header Bar: Telemetry, Hub speed & Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-[#16803C] animate-pulse" />
            <span>LIVE HUB TELEMETRY</span>
            <span>•</span>
            <span className="text-[#111111]">
              Civil Lines Fulfilment Hub #04 (Sector 4, Ward 12)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-1">
            Hub Command Center
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs">
            <span className="text-neutral-500 font-semibold">Auto-Dispatch:</span>
            <button
              onClick={() => setAutoDispatch(!autoDispatch)}
              className={`px-2 py-0.5 rounded font-black text-[10px] uppercase transition-colors ${
                autoDispatch
                  ? "bg-[#16803C] text-white"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {autoDispatch ? "Engaged" : "Paused"}
            </button>
          </div>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-soft transition-colors"
          >
            <span>Live Dispatch Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 5 Top KPI Cards Grid (Matches Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#111111] leading-tight">
                  {kpi.val}
                </h3>
                <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-neutral-100 font-medium text-neutral-500">
                  <span className="text-[#16803C] font-bold">{kpi.sub}</span>
                  <span>{kpi.note}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Graph & Live Feed (Matches Image 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Revenue Overview Chart */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Financial Operations
              </span>
              <h2 className="text-lg font-black text-[#111111]">
                Revenue &amp; Orders Velocity (Last 30 Days)
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F7F7F5] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setDateRange("7days")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  dateRange === "7days"
                    ? "bg-white text-black shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateRange("30days")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  dateRange === "30days"
                    ? "bg-white text-black shadow-xs"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* SVG High-Res Area Graph */}
          <div className="relative h-64 w-full pt-4">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF5A36" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#F1F1F1" strokeWidth="1" />
              <line x1="0" y1="110" x2="800" y2="110" stroke="#F1F1F1" strokeWidth="1" />
              <line x1="0" y1="170" x2="800" y2="170" stroke="#F1F1F1" strokeWidth="1" />
              <line x1="0" y1="230" x2="800" y2="230" stroke="#F1F1F1" strokeWidth="1" />

              {/* Revenue Curve (Blue) */}
              <path
                d="M 0,210 Q 150,180 250,110 T 500,60 T 700,40 T 800,90 L 800,240 L 0,240 Z"
                fill="url(#revenueGrad)"
              />
              <path
                d="M 0,210 Q 150,180 250,110 T 500,60 T 700,40 T 800,90"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
              />

              {/* Orders Velocity Curve (Orange) */}
              <path
                d="M 0,220 Q 150,200 250,150 T 500,100 T 700,70 T 800,120 L 800,240 L 0,240 Z"
                fill="url(#orderGrad)"
              />
              <path
                d="M 0,220 Q 150,200 250,150 T 500,100 T 700,70 T 800,120"
                fill="none"
                stroke="#FF5A36"
                strokeWidth="3"
                strokeDasharray="4 3"
              />

              {/* Keypoint Node */}
              <circle cx="500" cy="60" r="5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            <div className="flex justify-between text-[11px] text-neutral-400 font-semibold pt-2">
              <span>Day 1</span>
              <span>Day 8</span>
              <span>Day 15 (Peak: ₹1,45,200)</span>
              <span>Day 22</span>
              <span>Day 30 (Today)</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-neutral-100 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
              <span className="text-neutral-700">Gross Sales (₹)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5A36]" />
              <span className="text-neutral-700">Orders Processed (Count)</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Order Feed & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#111111]">
                Live Hub Dispatch Feed
              </h3>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-[#FF5A36] hover:underline"
              >
                Board View →
              </Link>
            </div>

            <div className="divide-y divide-neutral-100">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#111111]">#{ord.id}</span>
                      <span className="text-[10px] text-neutral-400">{ord.time}</span>
                    </div>
                    <p className="text-neutral-500 font-medium text-[11px] mt-0.5">
                      {ord.customer} • {ord.status}
                    </p>
                  </div>
                  <span className="font-black text-neutral-900">
                    {formatPrice(ord.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hub Tools */}
          <div className="bg-[#111111] text-white rounded-3xl p-5 shadow-soft space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Supervisor Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href="/admin/products/new"
                className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-center transition-colors"
              >
                + Add Product
              </Link>
              <Link
                href="/admin/inventory"
                className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-center transition-colors"
              >
                Restock Alert (7)
              </Link>
              <Link
                href="/admin/delivery"
                className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-center transition-colors"
              >
                Assign Riders
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-center transition-colors"
              >
                Delivery Zones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
