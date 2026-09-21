"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Wallet, TrendingUp, Calendar, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";

export default function DeliveryEarningsPage() {
  const history = [
    { orderId: "TK-7492", time: "Today, 1:00 PM", amount: 85.0, distance: "3.2 km", status: "COMPLETED" },
    { orderId: "TK-7488", time: "Today, 11:45 AM", amount: 65.0, distance: "2.1 km", status: "COMPLETED" },
    { orderId: "TK-7482", time: "Today, 10:10 AM", amount: 95.0, distance: "4.5 km", status: "COMPLETED" },
    { orderId: "TK-7476", time: "Yesterday", amount: 820.0, distance: "32 km (10 orders)", status: "SETTLED" },
  ];

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between pt-2">
        <Link href="/delivery/dashboard" className="flex items-center gap-1 text-xs font-bold text-neutral-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <span className="text-xs font-black text-[#111111]">Payouts Ledger</span>
      </div>

      {/* Main Total Balance Box */}
      <div className="bg-[#111111] text-white rounded-3xl p-6 shadow-soft space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Current Unsettled Balance
        </span>
        <h1 className="text-3xl font-black">₹1,150.75</h1>
        <p className="text-xs text-[#16803C] font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Auto-transfer scheduled tonight to HDFC Bank (•••• 4910)</span>
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-soft">
          <span className="text-neutral-400 block font-medium">Trips Today</span>
          <strong className="text-lg font-black text-[#111111]">12 Deliveries</strong>
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-soft">
          <span className="text-neutral-400 block font-medium">Fleet Incentives</span>
          <strong className="text-lg font-black text-[#16803C]">₹150.00</strong>
        </div>
      </div>

      {/* Trip List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">
          Completed Trips
        </h3>

        <div className="space-y-2.5">
          {history.map((h, i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-soft flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-[#111111]">
                    #{h.orderId}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-[#16803C] font-extrabold px-2 py-0.5 rounded">
                    {h.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {h.time} • {h.distance}
                </p>
              </div>
              <span className="font-black text-sm text-[#16803C]">
                +{formatPrice(h.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
