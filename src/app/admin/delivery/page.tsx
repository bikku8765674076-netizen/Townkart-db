"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Truck,
  Bike,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  Award,
} from "lucide-react";

interface RiderRow {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  number: string;
  status: "ONLINE" | "DELIVERING" | "OFFLINE";
  rating: number;
  completedToday: number;
  activeOrder?: string;
}

const INITIAL_RIDERS: RiderRow[] = [
  {
    id: "rider-1",
    name: "Dinesh Kumar",
    phone: "+91 98765 11001",
    vehicle: "Hero Splendor Plus",
    number: "UP-32-DK-8910",
    status: "DELIVERING",
    rating: 4.9,
    completedToday: 12,
    activeOrder: "#TK-7492 (Civil Lines, 0.5km away)",
  },
  {
    id: "rider-2",
    name: "Meena Sharma",
    phone: "+91 98765 11002",
    vehicle: "Honda Activa 6G",
    number: "UP-32-MS-4521",
    status: "ONLINE",
    rating: 4.85,
    completedToday: 9,
  },
  {
    id: "rider-3",
    name: "Rahul Verma",
    phone: "+91 98765 11003",
    vehicle: "TVS iQube EV",
    number: "UP-32-RV-9921",
    status: "ONLINE",
    rating: 4.95,
    completedToday: 15,
  },
  {
    id: "rider-4",
    name: "Anand Shukla",
    phone: "+91 98765 11004",
    vehicle: "Bajaj Pulsar 150",
    number: "UP-32-AS-1192",
    status: "DELIVERING",
    rating: 4.75,
    completedToday: 8,
    activeOrder: "#TK-9828 (Ward 12)",
  },
];

export default function AdminDeliveryPage() {
  const [riders, setRiders] = useState<RiderRow[]>(INITIAL_RIDERS);
  const [assignedMsg, setAssignedMsg] = useState<string | null>(null);

  const handleAssignRider = (riderName: string) => {
    setAssignedMsg(`Dispatched order #TK-9829 to ${riderName}!`);
    setTimeout(() => setAssignedMsg(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Logistics &amp; Fleet Operations
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Rider Fleet Radar (18 Active)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/delivery/dashboard"
            className="text-xs font-bold bg-[#111111] text-white px-4 py-2 rounded-xl shadow-soft"
          >
            Launch Rider Mobile View →
          </Link>
        </div>
      </div>

      {assignedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{assignedMsg}</span>
        </div>
      )}

      {/* Rider Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {riders.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-soft space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-neutral-400">
                  {r.vehicle}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    r.status === "ONLINE"
                      ? "bg-emerald-50 text-[#16803C]"
                      : r.status === "DELIVERING"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#111111]">{r.name}</h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                {r.number} • {r.phone}
              </p>

              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-amber-500 font-black">⭐ {r.rating}</span>
                <span className="font-bold text-neutral-600">
                  {r.completedToday} drops today
                </span>
              </div>

              {r.activeOrder && (
                <div className="mt-2 bg-[#F7F7F5] rounded-xl p-2.5 text-[11px] text-neutral-600">
                  <span className="font-bold text-black block mb-0.5">In Transit:</span>
                  <p>{r.activeOrder}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleAssignRider(r.name)}
              className="w-full bg-[#FF5A36] hover:bg-[#e04f2e] text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Assign Next Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
