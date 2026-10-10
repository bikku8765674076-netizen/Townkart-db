"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Search, RefreshCw, Users } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  _count: { orders: number };
  orders: { totalAmount: number }[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [page, setPage] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchDebounce) params.set("q", searchDebounce);
      const res = await fetch(`/api/admin/customers?${params}`);
      const data = await res.json();
      setCustomers(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
    } finally { setLoading(false); }
  }, [page, searchDebounce]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounce(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Customer Intelligence</span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5 flex items-center gap-2">
            <Users className="w-6 h-6" /> Customers ({total})
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone…"
              className="text-xs pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl font-medium w-56 focus:outline-none focus:border-[#F7D928]" />
          </div>
          <button onClick={fetchCustomers} className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50">
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Value</th>
                <th className="py-3.5 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="h-4 bg-neutral-100 rounded animate-pulse" /></td></tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-neutral-400">No customers found</td></tr>
              ) : (
                customers.map((c) => {
                  const ltv = c.orders.reduce((s, o) => s + o.totalAmount, 0);
                  return (
                    <tr key={c.id} className="hover:bg-[#F9F9F9] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F7D928]/20 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                            {c.avatar ? (
                              <Image src={c.avatar} alt={c.name} fill className="object-cover" sizes="36px" />
                            ) : (
                              <span className="text-sm font-black text-[#171717]">{c.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <span className="font-bold text-[#111111]">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{c.email ?? "—"}</td>
                      <td className="py-3 px-4 text-neutral-500">{c.phone ?? "—"}</td>
                      <td className="py-3 px-4 font-black text-[#111111]">{c._count.orders}</td>
                      <td className="py-3 px-4 font-black text-[#111111]">{formatPrice(ltv)}</td>
                      <td className="py-3 px-4 text-neutral-400">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">Page {page} of {Math.ceil(total / 20)}</span>
            <div className="flex gap-2">
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
