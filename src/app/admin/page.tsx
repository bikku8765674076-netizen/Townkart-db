"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  IndianRupee, Package, Bike, AlertTriangle, Zap,
  RefreshCw, ArrowRight,
} from "lucide-react";

interface DashboardData {
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
  gmv: number;
  discountsGranted: number;
  deliveryFees: number;
  lowStock: { id: string; name: string; stock: number }[];
  totalCustomers: number;
  totalProducts: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: { name: string };
    items: { productName: string }[];
  }[];
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKING: "Packing",
  READY_FOR_PICKUP: "Ready at Hub",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) { setData(json.data); setLastRefresh(new Date()); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const kpis = data ? [
    {
      title: "TODAY'S GMV",
      val: formatPrice(data.gmv),
      sub: `${data.todayOrders} orders today`,
      note: `${data.delivered} delivered`,
      icon: IndianRupee, color: "bg-emerald-50 text-[#16803C]",
    },
    {
      title: "PENDING",
      val: `${data.pendingOrders} orders`,
      sub: `${data.processingOrders} in processing/packing`,
      note: `${data.cancelled} cancelled today`,
      icon: Package, color: "bg-blue-50 text-blue-600",
    },
    {
      title: "OUT FOR DELIVERY",
      val: `${data.outForDelivery} in transit`,
      sub: `${data.delivered} delivered today`,
      note: "COD on delivery",
      icon: Bike, color: "bg-red-50 text-[#FF5A36]",
    },
    {
      title: "STOCK ALERTS",
      val: `${data.lowStock.length} Products`,
      sub: data.lowStock.slice(0, 1).map((p) => p.name.split(" ").slice(0, 3).join(" ")).join("") || "All levels OK",
      note: "Need restocking",
      icon: AlertTriangle, color: "bg-amber-50 text-amber-600",
    },
    {
      title: "CATALOG & CUSTOMERS",
      val: `${data.totalProducts} Products`,
      sub: `${data.totalCustomers} customers`,
      note: `${formatPrice(data.discountsGranted)} discounts today`,
      icon: Zap, color: "bg-purple-50 text-purple-600",
    },
  ] : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-[#16803C] animate-pulse" />
            <span>LIVE HUB TELEMETRY</span>
            <span>•</span>
            <span className="text-[#111111]">Civil Lines Fulfilment Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-1">Hub Command Center</h1>
          <p className="text-xs text-neutral-400 mt-1">Last updated: {lastRefresh.toLocaleTimeString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchDashboard} disabled={loading}
            className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-bold hover:bg-neutral-50 transition-colors disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <Link href="/admin/orders"
            className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors">
            <span>Live Dispatch Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      {loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-4 h-28 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">{kpi.title}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#111111] leading-tight">{kpi.val}</h3>
                  <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-neutral-100 font-medium text-neutral-500">
                    <span className="text-[#16803C] font-bold">{kpi.sub}</span>
                    <span>{kpi.note}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-[#111111]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-[#FF5A36] hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {data?.recentOrders.length ? data.recentOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#111111]">#{ord.orderNumber}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${ord.status === "DELIVERED" ? "bg-emerald-50 text-[#16803C]" : ord.status === "CANCELLED" ? "bg-red-50 text-[#C62828]" : "bg-blue-50 text-blue-600"}`}>
                      {STATUS_LABEL[ord.status] ?? ord.status}
                    </span>
                  </div>
                  <p className="text-neutral-500 font-medium text-[11px] mt-0.5">
                    {ord.user?.name} • {ord.items[0]?.productName ?? "—"}
                  </p>
                </div>
                <span className="font-black text-neutral-900">{formatPrice(ord.totalAmount)}</span>
              </div>
            )) : (
              [...Array(5)].map((_, i) => <div key={i} className="py-3"><div className="h-8 bg-neutral-100 rounded animate-pulse" /></div>)
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          {data && data.lowStock.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alert
              </h4>
              {data.lowStock.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900 line-clamp-1 flex-1 mr-2">{p.name}</span>
                  <span className="font-black text-[#C62828]">{p.stock} left</span>
                </div>
              ))}
              <Link href="/admin/inventory" className="text-xs font-bold text-amber-700 hover:underline block text-right">Manage Inventory →</Link>
            </div>
          )}

          <div className="bg-[#111111] text-white rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                { href: "/admin/products/new", label: "+ Add Product" },
                { href: "/admin/inventory", label: "Restock Alert" },
                { href: "/admin/orders", label: "Dispatch Board" },
                { href: "/admin/coupons", label: "Add Coupon" },
                { href: "/admin/customers", label: "Customers" },
                { href: "/admin/settings", label: "Settings" },
              ].map((action) => (
                <Link key={action.href} href={action.href}
                  className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-center transition-colors">
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
