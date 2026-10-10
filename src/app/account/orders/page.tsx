"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { formatPrice } from "@/lib/utils";
import { Clock, ChevronRight, Package, RefreshCw, ShoppingBag } from "lucide-react";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  deliverySlot?: string;
  deliveryOtp: string;
  createdAt: string;
  items: {
    productName?: string;
    product?: { name: string };
    quantity: number;
  }[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  CONFIRMED: { label: "Confirmed", color: "bg-blue-50 text-blue-700" },
  PROCESSING: { label: "Processing at Hub", color: "bg-purple-50 text-purple-700" },
  PACKING: { label: "Packing", color: "bg-violet-50 text-violet-700" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-amber-50 text-amber-700" },
  ASSIGNED: { label: "Rider Assigned", color: "bg-indigo-50 text-indigo-700" },
  PICKED_UP: { label: "Picked Up", color: "bg-orange-50 text-orange-700" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-amber-100 text-amber-800" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-[#0C831F]" },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700" },
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-0.5">
              My Town Orders
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 text-neutral-500 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#0C831F] hover:underline"
            >
              Start New Order →
            </Link>
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-6 space-y-4">
          {loading && orders.length === 0 ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-white border border-neutral-200 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-base text-[#111111]">
                No orders placed yet
              </h3>
              <p className="text-xs text-neutral-500 mt-1 mb-6">
                Fresh groceries, staples, and daily essentials delivered to your door in 10-15 minutes.
              </p>
              <Link
                href="/shop"
                className="bg-[#0C831F] hover:bg-[#0a6f1a] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || {
                label: order.status,
                color: "bg-neutral-100 text-neutral-700",
              };
              const itemsList = order.items
                .map((i) => i.productName || i.product?.name || "Item")
                .join(", ");

              return (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-base text-[#111111]">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${statusCfg.color}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 font-medium line-clamp-1">
                      {itemsList || "Daily essentials"}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>•</span>
                      <span>{order.items.length} Items</span>
                      <span>•</span>
                      <span className="font-bold text-[#111111]">
                        {formatPrice(order.totalAmount)} (COD)
                      </span>
                    </div>
                  </div>

                  {/* Right side: OTP and Tracking */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {order.deliveryOtp && order.status !== "DELIVERED" && (
                      <div className="text-right mr-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl">
                        <span className="text-[9px] text-neutral-400 uppercase font-black block">
                          Delivery OTP
                        </span>
                        <span className="font-mono font-black text-xs text-[#0C831F]">
                          {order.deliveryOtp}
                        </span>
                      </div>
                    )}
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="flex items-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
