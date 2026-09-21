"use client";

import React, { useState } from "react";
import { Tag, Plus, CheckCircle2, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    {
      code: "WELCOME10",
      type: "10% Percentage",
      minOrder: "₹299",
      maxDiscount: "₹150",
      usages: 184,
      status: "ACTIVE",
    },
    {
      code: "SAVE100",
      type: "Flat ₹100",
      minOrder: "₹999",
      maxDiscount: "₹100",
      usages: 92,
      status: "ACTIVE",
    },
    {
      code: "TOWNEXPRESS",
      type: "Flat ₹50 + Free Delivery",
      minOrder: "₹499",
      maxDiscount: "₹50",
      usages: 312,
      status: "ACTIVE",
    },
  ]);

  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState("Flat ₹50");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    setCoupons([
      ...coupons,
      {
        code: newCode.toUpperCase(),
        type: newType,
        minOrder: "₹399",
        maxDiscount: "₹100",
        usages: 0,
        status: "ACTIVE",
      },
    ]);
    setNewCode("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Promotions &amp; Discounts
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Town Coupons Engine
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleAddCoupon}
        className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-soft flex flex-col sm:flex-row gap-3 items-center"
      >
        <input
          type="text"
          placeholder="New Coupon Code (e.g. DIWALI50)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="w-full sm:w-64 text-xs font-bold p-3 border border-neutral-200 rounded-xl uppercase"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="text-xs font-bold p-3 border border-neutral-200 rounded-xl bg-white"
        >
          <option value="Flat ₹50">Flat ₹50 Off</option>
          <option value="Flat ₹100">Flat ₹100 Off</option>
          <option value="15% Percentage">15% Off</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto bg-[#FF5A36] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-soft"
        >
          Create Coupon
        </button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-3xl shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount Type</th>
              <th className="py-3 px-4">Min. Order</th>
              <th className="py-3 px-4">Total Usages</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-[#F9F9F9]">
                <td className="py-3 px-4 font-mono font-black text-sm text-[#FF5A36]">
                  {c.code}
                </td>
                <td className="py-3 px-4 font-bold">{c.type}</td>
                <td className="py-3 px-4">{c.minOrder}</td>
                <td className="py-3 px-4 font-bold">{c.usages} applied</td>
                <td className="py-3 px-4">
                  <span className="bg-emerald-50 text-[#16803C] font-extrabold text-[10px] px-2 py-0.5 rounded">
                    Active
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() =>
                      setCoupons(coupons.filter((i) => i.code !== c.code))
                    }
                    className="text-neutral-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
