"use client";
import React, { useState, useEffect } from "react";
import { Settings, Store, Truck, CreditCard, CheckCircle2, Save, RefreshCw } from "lucide-react";

interface SettingsMap { [key: string]: string; }

const DEFAULT_SETTINGS: SettingsMap = {
  store_name: "TownKart",
  store_tagline: "Everything you need. Right around the corner.",
  support_phone: "+91 80099 22444",
  hub_address: "Sector 4 Fulfillment Hub, Civil Lines, Anand Vihar",
  free_delivery_threshold: "499",
  base_delivery_fee: "30",
  min_order_amount: "99",
  estimated_delivery_minutes: "30",
  cod_enabled: "true",
  store_open_time: "07:00",
  store_close_time: "22:00",
  max_order_qty: "10",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && Object.keys(data.data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      } catch {/* use defaults */}
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  const update = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return (
    <div className="p-8 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-neutral-100 rounded-3xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Configuration & Parameters</span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">Store & Delivery Settings</h1>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#16803C] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> <span>Settings Saved!</span>
          </div>
        )}
        {error && <p className="text-xs font-bold text-[#C62828]">{error}</p>}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Store Profile */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <Store className="w-4 h-4 text-[#F7D928]" /> <span>Brand & Local Hub Identity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Store Name", key: "store_name" },
              { label: "Tagline", key: "store_tagline" },
              { label: "Support Helpline", key: "support_phone" },
              { label: "Dark Store / Hub Address", key: "hub_address" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-bold text-neutral-600 block mb-1">{f.label}</label>
                <input type="text" value={settings[f.key] ?? ""} onChange={(e) => update(f.key, e.target.value)}
                  className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F7D928]" />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Config */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <Truck className="w-4 h-4 text-[#F7D928]" /> <span>Delivery Configuration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Free Delivery Threshold (₹)", key: "free_delivery_threshold", type: "number" },
              { label: "Base Delivery Fee (₹)", key: "base_delivery_fee", type: "number" },
              { label: "Minimum Order Amount (₹)", key: "min_order_amount", type: "number" },
              { label: "Estimated Delivery (minutes)", key: "estimated_delivery_minutes", type: "number" },
              { label: "Max Order Qty per Item", key: "max_order_qty", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-bold text-neutral-600 block mb-1">{f.label}</label>
                <input type={f.type ?? "text"} value={settings[f.key] ?? ""} onChange={(e) => update(f.key, e.target.value)}
                  className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F7D928]" />
              </div>
            ))}
          </div>
        </div>

        {/* Store Hours */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <Settings className="w-4 h-4 text-[#F7D928]" /> <span>Operating Hours</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">Opening Time</label>
              <input type="time" value={settings.store_open_time ?? "07:00"} onChange={(e) => update("store_open_time", e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F7D928]" />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">Closing Time</label>
              <input type="time" value={settings.store_close_time ?? "22:00"} onChange={(e) => update("store_close_time", e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F7D928]" />
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#111111] pb-2 border-b border-neutral-100">
            <CreditCard className="w-4 h-4 text-[#F7D928]" /> <span>Payments — COD Only</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#F7F7F5] rounded-2xl">
            <div>
              <span className="font-bold text-xs text-[#111111]">Cash on Delivery (COD)</span>
              <p className="text-[11px] text-neutral-500">Customers pay cash to rider at doorstep</p>
            </div>
            <div className="relative">
              <input type="checkbox" id="cod" checked={settings.cod_enabled === "true"}
                onChange={(e) => update("cod_enabled", e.target.checked ? "true" : "false")}
                className="w-5 h-5 accent-[#F7D928] cursor-pointer" />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold">
            ⚠️ TownKart is COD-only by design. Online payment gateways (UPI, cards, wallets) are not supported and must not be enabled.
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-sm transition-colors disabled:opacity-60">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving…" : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
