"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { formatPrice } from "@/lib/utils";
import { Package, ArrowRight, Clock, CheckCircle2, ChevronRight } from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Default sample orders
    const initialOrders = [
      {
        orderNumber: "TK-7492",
        date: "Today, 10:15 AM",
        status: "OUT_FOR_DELIVERY",
        statusLabel: "Out for Delivery",
        statusColor: "bg-amber-100 text-amber-800",
        totalAmount: 199.3,
        itemsCount: 4,
        firstItemName: "Premium Fresh Milk 1L, Fresh Tomatoes 1kg",
        otp: "849201",
      },
      {
        orderNumber: "TK-9831",
        date: "Today, 09:40 AM",
        status: "PACKING",
        statusLabel: "Packing at Hub",
        statusColor: "bg-blue-100 text-blue-800",
        totalAmount: 425.0,
        itemsCount: 3,
        firstItemName: "Fresh Paneer 200g, Shimla Mirch",
        otp: "632190",
      },
      {
        orderNumber: "TK-7491",
        date: "18 Sep 2026",
        status: "DELIVERED",
        statusLabel: "Delivered",
        statusColor: "bg-emerald-100 text-emerald-800",
        totalAmount: 1399.0,
        itemsCount: 1,
        firstItemName: "TownKart Studio Wireless Headphones",
        otp: "112233",
      },
    ];

    try {
      const stored = JSON.parse(localStorage.getItem("townkart_orders") || "[]");
      if (stored && stored.length > 0) {
        setOrders([...stored, ...initialOrders]);
      } else {
        setOrders(initialOrders);
      }
    } catch {
      setOrders(initialOrders);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
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
          <Link
            href="/shop"
            className="text-xs font-bold text-[#FF5A36] hover:underline"
          >
            Start New Order →
          </Link>
        </div>

        {/* Orders List */}
        <div className="mt-6 space-y-4">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-base text-[#111111]">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                      order.statusColor || "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {order.statusLabel || order.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 font-medium line-clamp-1">
                  {order.firstItemName || "Town essentials & groceries"}
                </p>

                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span>{order.date}</span>
                  <span>•</span>
                  <span>{order.itemsCount || 2} Items</span>
                  <span>•</span>
                  <span className="font-bold text-[#111111]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                {order.otp && order.status !== "DELIVERED" && (
                  <div className="text-right hidden md:block mr-2">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                      OTP
                    </span>
                    <span className="font-mono font-bold text-xs bg-neutral-100 px-2 py-0.5 rounded">
                      {order.otp}
                    </span>
                  </div>
                )}
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="flex items-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  <span>Track Order</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
