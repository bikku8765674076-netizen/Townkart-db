"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bell,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Satellite,
} from "lucide-react";
import { RiderSatelliteMap } from "@/components/delivery/RiderSatelliteMap";

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [assignmentAccepted, setAssignmentAccepted] = useState(false);

  const handleAccept = () => {
    setAssignmentAccepted(true);
    setTimeout(() => {
      router.push("/delivery/orders/order-7492");
    }, 400);
  };

  return (
    <div className="p-5 space-y-5">
      {/* Top Header: Location, Online toggle, Notification Bell */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
            <MapPin className="w-4 h-4 text-[#FF5A36]" />
          </div>
          <span className="text-xs font-bold text-[#111111]">
            Civil Lines Hub #04
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Online / Offline Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold transition-colors shadow-xs ${
              isOnline
                ? "bg-[#16803C] text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            <span>{isOnline ? "ONLINE" : "OFFLINE"}</span>
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                isOnline ? "translate-x-0.5" : "-translate-x-0.5"
              }`}
            />
          </button>

          <button
            aria-label="Notifications"
            className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5A36]" />
          </button>
        </div>
      </div>

      {/* Today's Earnings Card */}
      <div className="bg-gradient-to-br from-white to-[#F7F7F5] border border-neutral-200 rounded-3xl p-5 shadow-soft">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Today&apos;s Earnings
            </span>
            <h2 className="text-3xl font-black text-[#111111] mt-1">
              ₹1,150.75
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-[#16803C] font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs yesterday • 12 Orders</span>
            </div>
          </div>

          {/* Mini Wave Graph */}
          <div className="w-20 h-10 flex items-end gap-1 text-[#FF5A36]">
            <div className="w-2.5 bg-[#FF5A36]/20 h-4 rounded-t" />
            <div className="w-2.5 bg-[#FF5A36]/40 h-6 rounded-t" />
            <div className="w-2.5 bg-[#FF5A36]/60 h-5 rounded-t" />
            <div className="w-2.5 bg-[#FF5A36]/80 h-8 rounded-t" />
            <div className="w-2.5 bg-[#FF5A36] h-10 rounded-t" />
          </div>
        </div>
      </div>

      {/* Live Satellite Delivery Radar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold text-neutral-600 uppercase tracking-wider">
              Live Satellite GPS Radar
            </span>
          </div>
          <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Satellite className="w-3 h-3 text-[#FF5A36]" /> Civil Lines Sector
          </span>
        </div>

        <RiderSatelliteMap
          height="260px"
          zoom={15}
          riderLocation={{ lat: 26.7898, lng: 82.198 }}
          customerLocation={{
            lat: 26.7938,
            lng: 82.2025,
            name: "Order #TK-7492 Destination",
            address: "Civil Lines, Ward 12",
          }}
          hubLocation={{
            lat: 26.7865,
            lng: 82.1932,
            name: "Civil Lines Hub #04",
          }}
          showControls={true}
        />
      </div>

      {/* Pending Order Assignment Card (From Image 5!) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">
            Pending Order Assignment
          </span>
          <span className="text-[10px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded">
            Live Task
          </span>
        </div>

        <div className="bg-white border-2 border-[#FF5A36] rounded-3xl p-5 shadow-hover space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase">
                Order ID
              </span>
              <h3 className="text-lg font-black text-[#111111]">#TK-7492</h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-neutral-400 uppercase">
                Est. Earning
              </span>
              <p className="text-lg font-black text-[#16803C]">₹85.00</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#F7F7F5] rounded-2xl p-3 text-xs">
            <div>
              <span className="text-neutral-400 block font-medium">Distance:</span>
              <strong className="text-neutral-800 font-bold">3.2 km</strong>
            </div>
            <div>
              <span className="text-neutral-400 block font-medium">Customer Area:</span>
              <strong className="text-neutral-800 font-bold">Civil Lines, Ward 12</strong>
            </div>
          </div>

          <button
            onClick={handleAccept}
            className="w-full bg-[#FF5A36] hover:bg-[#e04f2e] text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-glow active:scale-95 transition-all"
          >
            {assignmentAccepted ? "Accepting Task..." : "ACCEPT DELIVERY"}
          </button>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">
            Recent Orders
          </span>
          <Link
            href="/delivery/earnings"
            className="text-xs font-bold text-[#FF5A36] hover:underline"
          >
            See All →
          </Link>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-soft flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#111111]">
                  #TK-7492
                </span>
                <span className="text-[10px] text-neutral-400">1:00 pm</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Fresh Tomatoes, Milk 1L x 2
              </p>
            </div>
            <span className="text-xs font-black text-[#111111]">₹1,199.30</span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-soft flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#111111]">
                  #TK-7488
                </span>
                <span className="text-[10px] text-neutral-400">11:45 am</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Aashirvaad Atta 5kg, Fortune Oil
              </p>
            </div>
            <span className="text-xs font-black text-[#111111]">₹640.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
