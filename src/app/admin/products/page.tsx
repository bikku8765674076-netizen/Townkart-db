"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  Boxes, Plus, Search, Edit, Archive, RefreshCw,
} from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: { name: string };
  brand?: { name: string };
  sellingPrice: number;
  mrp: number;
  stock: number;
  status: string;
  images: { url: string }[];
  _count: { variants: number; orderItems: number };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ALL" | "ACTIVE" | "OUT_OF_STOCK" | "DRAFT">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [archiving, setArchiving] = useState<string | null>(null);
  const [searchDebounce, setSearchDebounce] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (tab !== "ALL") params.set("status", tab);
      if (searchDebounce) params.set("q", searchDebounce);
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [tab, searchDebounce, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounce(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleArchive = async (id: string) => {
    if (!confirm("Archive this product? It will be hidden from customers.")) return;
    setArchiving(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      await fetchProducts();
    } finally { setArchiving(null); }
  };

  const statusBadge = (status: string) => {
    if (status === "ACTIVE") return <span className="bg-emerald-50 text-[#16803C] font-extrabold text-[10px] px-2 py-0.5 rounded">Active</span>;
    if (status === "OUT_OF_STOCK") return <span className="bg-red-50 text-[#C62828] font-extrabold text-[10px] px-2 py-0.5 rounded">Out of Stock</span>;
    if (status === "DRAFT") return <span className="bg-neutral-100 text-neutral-500 font-extrabold text-[10px] px-2 py-0.5 rounded">Draft</span>;
    return <span className="bg-neutral-100 text-neutral-400 font-extrabold text-[10px] px-2 py-0.5 rounded">{status}</span>;
  };

  const TABS = ["ALL", "ACTIVE", "OUT_OF_STOCK", "DRAFT"] as const;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Catalog Management</span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5 flex items-center gap-2">
            <Boxes className="w-6 h-6" /> Products ({total})
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProducts} className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-xl p-1 text-xs font-bold overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${tab === t ? "bg-[#111111] text-white" : "text-neutral-500 hover:text-black"}`}>
              {t === "ALL" ? "All" : t === "OUT_OF_STOCK" ? "Out of Stock" : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, SKU…"
            className="text-xs pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl font-medium w-full sm:w-64 focus:outline-none focus:border-[#F7D928]" />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((__, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-4 bg-neutral-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-neutral-400 font-semibold">No products found</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
                        {prod.images[0]?.url ? (
                          <Image src={prod.images[0].url} alt={prod.name} fill className="object-cover" sizes="44px" />
                        ) : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#111111] max-w-[180px]">
                      <p className="line-clamp-2">{prod.name}</p>
                      {prod._count.variants > 0 && (
                        <span className="text-[10px] text-neutral-400">{prod._count.variants} variant{prod._count.variants !== 1 ? "s" : ""}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">{prod.sku}</td>
                    <td className="py-3 px-4">{prod.category.name}</td>
                    <td className="py-3 px-4 font-black text-black">{formatPrice(prod.sellingPrice)}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className={prod.stock <= 5 ? "text-[#C62828]" : prod.stock <= 10 ? "text-amber-600" : "text-[#111111]"}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">{statusBadge(prod.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-neutral-400">
                        <Link href={`/admin/products/${prod.id}/edit`} title="Edit"
                          className="hover:text-black p-1 hover:bg-neutral-100 rounded">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button title="Archive" onClick={() => handleArchive(prod.id)}
                          disabled={archiving === prod.id}
                          className="hover:text-amber-500 p-1 hover:bg-neutral-100 rounded disabled:opacity-50">
                          {archiving === prod.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">Showing {(page-1)*20+1}–{Math.min(page*20, total)} of {total}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1}
                className="text-xs font-bold px-3 py-1.5 border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50">← Prev</button>
              <button onClick={() => setPage((p) => p+1)} disabled={page*20 >= total}
                className="text-xs font-bold px-3 py-1.5 border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
