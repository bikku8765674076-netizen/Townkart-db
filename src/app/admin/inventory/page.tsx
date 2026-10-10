"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Plus, Check } from "lucide-react";

interface StockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: string;
  category: { name: string };
  images: { url: string }[];
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [adjustments, setAdjustments] = useState<Record<string, { qty: string; reason: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory?filter=${filter}`);
      const data = await res.json();
      setProducts(data.data ?? []);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const handleAdjust = async (productId: string) => {
    const adj = adjustments[productId];
    if (!adj?.qty || !adj?.reason) return;
    setSaving(productId);
    try {
      await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, adjustment: parseInt(adj.qty), reason: adj.reason }),
      });
      setSaved(productId);
      setAdjustments((prev) => { const n = { ...prev }; delete n[productId]; return n; });
      setTimeout(() => setSaved(null), 2000);
      await fetchInventory();
    } finally { setSaving(null); }
  };

  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Stock Management</span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">Inventory Control</h1>
        </div>
        <div className="flex items-center gap-2">
          {lowCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5" /> {lowCount} Low Stock
            </span>
          )}
          {outCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#C62828] bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
              {outCount} Out of Stock
            </span>
          )}
          <button onClick={fetchInventory} className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "low", "out"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${filter === f ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"}`}>
            {f === "all" ? "All Products" : f === "low" ? "Low Stock" : "Out of Stock"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Adjust (+/-)</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="py-4 px-4"><div className="h-4 bg-neutral-100 rounded animate-pulse" /></td></tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-neutral-400 font-semibold">No products found</td></tr>
              ) : (
                products.map((p) => {
                  const adj = adjustments[p.id];
                  const isSaving = saving === p.id;
                  const isSaved = saved === p.id;
                  const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className={`hover:bg-[#F9F9F9] transition-colors ${isOut ? "bg-red-50/30" : isLow ? "bg-amber-50/30" : ""}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                            {p.images[0]?.url ? (
                              <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="40px" />
                            ) : <div className="w-full h-full flex items-center justify-center">📦</div>}
                          </div>
                          <span className="font-bold text-[#111111] line-clamp-2 max-w-[160px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">{p.sku}</td>
                      <td className="py-3 px-4">{p.category.name}</td>
                      <td className="py-3 px-4">
                        <span className={`font-black text-sm ${isOut ? "text-[#C62828]" : isLow ? "text-amber-600" : "text-[#111111]"}`}>{p.stock}</span>
                        {isLow && <span className="ml-1 text-[9px] font-bold text-amber-600">LOW</span>}
                        {isOut && <span className="ml-1 text-[9px] font-bold text-[#C62828]">OUT</span>}
                      </td>
                      <td className="py-3 px-4">
                        {p.status === "ACTIVE" ? <span className="bg-emerald-50 text-[#16803C] font-extrabold text-[10px] px-2 py-0.5 rounded">Active</span>
                          : p.status === "OUT_OF_STOCK" ? <span className="bg-red-50 text-[#C62828] font-extrabold text-[10px] px-2 py-0.5 rounded">Out of Stock</span>
                          : <span className="bg-neutral-100 text-neutral-500 font-extrabold text-[10px] px-2 py-0.5 rounded">{p.status}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" placeholder="+10 or -5" value={adj?.qty ?? ""}
                          onChange={(e) => setAdjustments((prev) => ({ ...prev, [p.id]: { ...prev[p.id], qty: e.target.value } }))}
                          className="w-24 text-xs font-bold border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#F7D928] text-center" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" placeholder="Reason…" value={adj?.reason ?? ""}
                          onChange={(e) => setAdjustments((prev) => ({ ...prev, [p.id]: { ...prev[p.id], reason: e.target.value } }))}
                          className="w-40 text-xs font-medium border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#F7D928]" />
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleAdjust(p.id)} disabled={!adj?.qty || !adj?.reason || isSaving}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${isSaved ? "bg-[#16803C] text-white" : "bg-[#111111] hover:bg-[#FF5A36] text-white disabled:bg-neutral-200 disabled:text-neutral-400"}`}>
                          {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
