"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Users, Search, ShoppingBag, MapPin, Phone } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers] = useState([
    {
      id: "cust-1",
      name: "Amit Sharma",
      phone: "+91 98765 43210",
      email: "amit.sharma@example.com",
      area: "Civil Lines, Greenfield Heights",
      totalOrders: 14,
      totalSpend: 18450,
      status: "ACTIVE",
    },
    {
      id: "cust-2",
      name: "Pooja Verma",
      phone: "+91 98765 43211",
      email: "pooja.verma@example.com",
      area: "Ward 12, Kalyani Nagar",
      totalOrders: 9,
      totalSpend: 9240,
      status: "ACTIVE",
    },
    {
      id: "cust-3",
      name: "Rakesh Malhotra",
      phone: "+91 98765 43212",
      email: "rakesh.malhotra@example.com",
      area: "Town Market, Main Street",
      totalOrders: 21,
      totalSpend: 34100,
      status: "VIP",
    },
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Customer Directory
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Town Customer Accounts ({customers.length})
          </h1>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Phone / Email</th>
              <th className="py-3.5 px-4">Town Area</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Lifetime Spend</th>
              <th className="py-3.5 px-4">Segment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-[#F9F9F9]">
                <td className="py-3 px-4 font-bold text-[#111111]">{c.name}</td>
                <td className="py-3 px-4 text-neutral-500">
                  <p>{c.phone}</p>
                  <p className="text-[10px]">{c.email}</p>
                </td>
                <td className="py-3 px-4 text-neutral-600">{c.area}</td>
                <td className="py-3 px-4 font-bold">{c.totalOrders} orders</td>
                <td className="py-3 px-4 font-black text-black">
                  {formatPrice(c.totalSpend)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`font-extrabold text-[10px] px-2 py-0.5 rounded ${
                      c.status === "VIP"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-[#16803C]"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
