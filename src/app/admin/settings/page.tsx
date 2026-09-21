"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Settings,
  Store,
  Truck,
  CreditCard,
  CheckCircle2,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [storeName, setStoreName] = useState("TownKart");
  const [tagline, setTagline] = useState(
    "Everything you need. Right around the corner."
  );
  const [phone, setPhone] = useState("+91 80099 22444");
  const [hubAddress, setHubAddress] = useState(
    "Sector 4 Fulfillment Hub, Civil Lines, Anand Vihar"
  );
  const [freeThreshold, setFreeThreshold] = useState("499");
  const [baseFee, setBaseFee] = useState("30");
  const [codEnabled, setCodEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Configuration &amp; Parameters
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Store &amp; Delivery Zone Settings
          </h1>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#16803C] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Store Profile */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <Store className="w-4 h-4 text-[#FF5A36]" />
            <span>Brand &amp; Local Hub Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Support Helpline
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Dark Store Fulfillment Center Address
              </label>
              <input
                type="text"
                value={hubAddress}
                onChange={(e) => setHubAddress(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Hyperlocal Delivery Zones & Fees */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <Truck className="w-4 h-4 text-[#FF5A36]" />
            <span>Hyper-local Delivery Zones &amp; Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Standard Zone Base Fee (₹)
              </label>
              <input
                type="number"
                value={baseFee}
                onChange={(e) => setBaseFee(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              />
            </div>
          </div>

          <div className="bg-[#F7F7F5] rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-black block">Configured Town Radius:</span>
            <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
              <span>Zone A (0–3 km) — Town Center</span>
              <strong className="text-[#16803C]">FREE (Orders &gt; ₹299)</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
              <span>Zone B (3–7 km) — Civil Lines &amp; Ward 12</span>
              <strong className="text-black">₹30 (FREE &gt; ₹499)</strong>
            </div>
            <div className="flex justify-between py-1 text-neutral-600">
              <span>Zone C (7–15 km) — Outer Suburbs</span>
              <strong className="text-black">₹50 (FREE &gt; ₹799)</strong>
            </div>
          </div>
        </div>

        {/* Payments & COD Settings */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <CreditCard className="w-4 h-4 text-[#FF5A36]" />
            <span>Payments &amp; Gateway Mode</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F7F7F5] rounded-2xl">
            <div>
              <span className="font-bold text-xs text-[#111111]">
                Enable Cash on Delivery (COD)
              </span>
              <p className="text-[11px] text-neutral-500">
                Allow customers to pay cash or QR code to the rider at doorstep
              </p>
            </div>
            <input
              type="checkbox"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#FF5A36] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-soft transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Hub Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
