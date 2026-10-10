"use client";
import React, { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Plus, RefreshCw, Tag, CheckCircle2, XCircle } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  endDate?: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  isFirstOrder: boolean;
  _count: { usages: number };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "", description: "", discountType: "FIXED", discountValue: "",
    minOrderAmount: "0", maxDiscountAmount: "", endDate: "",
    usageLimit: "1000", perUserLimit: "1", isFirstOrder: false,
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create coupon"); return; }
      setShowForm(false);
      setForm({ code: "", description: "", discountType: "FIXED", discountValue: "", minOrderAmount: "0", maxDiscountAmount: "", endDate: "", usageLimit: "1000", perUserLimit: "1", isFirstOrder: false });
      fetchCoupons();
    } finally { setCreating(false); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    fetchCoupons();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Promotions Engine</span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">Coupons & Offers</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCoupons} className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50">
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => { setShowForm(!showForm); setError(""); }}
            className="inline-flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-[#111111] pb-2 border-b border-neutral-100">Create New Coupon</h3>
          {error && <p className="text-xs font-bold text-[#C62828] bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Coupon Code *", key: "code", type: "text", placeholder: "SAVE50", transform: (v: string) => v.toUpperCase() },
              { label: "Discount Value *", key: "discountValue", type: "number", placeholder: "50" },
              { label: "Min Order (₹)", key: "minOrderAmount", type: "number", placeholder: "0" },
              { label: "Max Discount Cap (₹)", key: "maxDiscountAmount", type: "number", placeholder: "No cap" },
              { label: "Expiry Date", key: "endDate", type: "date", placeholder: "" },
              { label: "Usage Limit", key: "usageLimit", type: "number", placeholder: "1000" },
              { label: "Per-User Limit", key: "perUserLimit", type: "number", placeholder: "1" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-bold text-neutral-600 block mb-1">{field.label}</label>
                <input required={field.label.includes("*")} type={field.type} placeholder={field.placeholder}
                  value={(form as Record<string, string | boolean>)[field.key] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: field.transform ? field.transform(e.target.value) : e.target.value }))}
                  className="w-full text-xs font-semibold border border-neutral-200 rounded-xl p-2.5 focus:outline-none focus:border-[#F7D928]" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">Discount Type *</label>
              <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                className="w-full text-xs font-semibold border border-neutral-200 rounded-xl p-2.5 focus:outline-none focus:border-[#F7D928]">
                <option value="FIXED">Fixed Amount (₹)</option>
                <option value="PERCENTAGE">Percentage (%)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-neutral-600 block mb-1">Description</label>
              <input type="text" placeholder="e.g. 10% off for new customers" value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full text-xs font-semibold border border-neutral-200 rounded-xl p-2.5 focus:outline-none focus:border-[#F7D928]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#111111] cursor-pointer">
              <input type="checkbox" checked={form.isFirstOrder} onChange={(e) => setForm((f) => ({ ...f, isFirstOrder: e.target.checked }))} className="accent-[#F7D928]" />
              First Order Only
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="px-4 py-2 text-xs font-bold border border-neutral-200 rounded-xl hover:bg-neutral-50">Cancel</button>
            <button type="submit" disabled={creating}
              className="px-6 py-2 text-xs font-bold bg-[#FF5A36] hover:bg-[#e04f2e] text-white rounded-xl shadow-sm disabled:opacity-60 flex items-center gap-2">
              {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Create Coupon
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Usage</th>
                <th className="py-3.5 px-4">Expires</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                [...Array(3)].map((_, i) => <tr key={i}><td colSpan={8} className="py-4 px-4"><div className="h-4 bg-neutral-100 rounded animate-pulse" /></td></tr>)
              ) : coupons.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-neutral-400">No coupons yet. Create one above!</td></tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#F7D928]" />
                        <span className="font-black font-mono text-[#111111]">{c.code}</span>
                      </div>
                      {c.description && <p className="text-[10px] text-neutral-400 mt-0.5">{c.description}</p>}
                      {c.isFirstOrder && <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">First Order</span>}
                    </td>
                    <td className="py-3 px-4 font-semibold">{c.discountType === "PERCENTAGE" ? "Percentage" : "Fixed"}</td>
                    <td className="py-3 px-4 font-black text-[#111111]">
                      {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                      {c.maxDiscountAmount && <span className="text-[10px] text-neutral-400 block">Max {formatPrice(c.maxDiscountAmount)}</span>}
                    </td>
                    <td className="py-3 px-4">{formatPrice(c.minOrderAmount)}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold">{c.usageCount}</span>
                      <span className="text-neutral-400">/{c.usageLimit}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {c.endDate ? new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No expiry"}
                    </td>
                    <td className="py-3 px-4">
                      {c.active ? (
                        <span className="flex items-center gap-1 text-[#16803C] font-bold text-[10px]"><CheckCircle2 className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#C62828] font-bold text-[10px]"><XCircle className="w-3 h-3" /> Inactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => toggleActive(c.id, c.active)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${c.active ? "bg-red-50 text-[#C62828] hover:bg-red-100" : "bg-emerald-50 text-[#16803C] hover:bg-emerald-100"}`}>
                        {c.active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
