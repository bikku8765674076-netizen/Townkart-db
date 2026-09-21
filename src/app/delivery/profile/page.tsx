"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Phone, ShieldCheck, Bike, Award } from "lucide-react";

export default function DeliveryProfilePage() {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between pt-2">
        <Link href="/delivery/dashboard" className="flex items-center gap-1 text-xs font-bold text-neutral-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <span className="text-xs font-black text-[#111111]">Partner Profile</span>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft text-center space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
          alt="Dinesh Kumar"
          className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#FF5A36] shadow-md"
        />
        <div>
          <h2 className="text-lg font-black text-[#111111]">Dinesh Kumar</h2>
          <span className="text-xs text-[#16803C] font-bold bg-emerald-50 px-3 py-0.5 rounded-full inline-block mt-1">
            ⭐ 4.9 Rating • 142 Deliveries Completed
          </span>
        </div>
      </div>

      {/* Vehicle & Hub Info */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-soft space-y-3 text-xs">
        <div className="flex items-center justify-between py-2 border-b border-neutral-100">
          <span className="text-neutral-500 font-medium">Assigned Hub</span>
          <strong className="text-black">Sector 4 Fulfillment Hub, Civil Lines</strong>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-neutral-100">
          <span className="text-neutral-500 font-medium">Vehicle Details</span>
          <strong className="text-black">Hero Splendor Plus (UP-32-DK-8910)</strong>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-neutral-100">
          <span className="text-neutral-500 font-medium">Contact Phone</span>
          <strong className="text-black">+91 98765 11001</strong>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-neutral-500 font-medium">Verification Status</span>
          <strong className="text-[#16803C] font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Aadhaar &amp; DL Verified
          </strong>
        </div>
      </div>
    </div>
  );
}
