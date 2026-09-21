"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { BarChart3, TrendingUp, Clock, CheckCircle2, Zap } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Telemetry &amp; Fulfillment Performance
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Town SLA &amp; Speed Analytics
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase">
            Packing &amp; Bagging SLA
          </span>
          <h2 className="text-3xl font-black text-[#111111]">8.4 mins avg</h2>
          <p className="text-xs text-[#16803C] font-bold">
            ✓ Target: &lt; 9.0 mins (Pass)
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase">
            Rider Transit Time
          </span>
          <h2 className="text-3xl font-black text-[#111111]">14.2 mins avg</h2>
          <p className="text-xs text-[#16803C] font-bold">
            ✓ Target: &lt; 20 mins (Pass)
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase">
            Customer CSAT Rating
          </span>
          <h2 className="text-3xl font-black text-amber-500">4.9 / 5.0</h2>
          <p className="text-xs text-neutral-500">Based on 1,420 town reviews</p>
        </div>
      </div>
    </div>
  );
}
