"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Layers,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  Search,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  status: "OK" | "LOW_STOCK" | "OUT_OF_STOCK";
  image: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "wh-01",
    name: "TownKart Studio Wireless Headphones",
    sku: "WH-001",
    stock: 42,
    minStock: 10,
    status: "OK",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "rs-02",
    name: "Men's AeroStrider Running Shoes",
    sku: "RS-002",
    stock: 15,
    minStock: 10,
    status: "LOW_STOCK",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "wb-03",
    name: "Insulated Stainless Steel Water Bottle 1L",
    sku: "WB-003",
    stock: 120,
    minStock: 20,
    status: "OK",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "bp-04",
    name: "TownCommute Anti-Theft Laptop Backpack",
    sku: "BP-004",
    stock: 8,
    minStock: 10,
    status: "LOW_STOCK",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "sg-05",
    name: "Classic Polarized Wayfarer Sunglasses",
    sku: "SG-005",
    stock: 0,
    minStock: 10,
    status: "OUT_OF_STOCK",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "gr-02",
    name: "Amul Taaza Fresh Toned Milk 1L",
    sku: "GR-002",
    stock: 3,
    minStock: 15,
    status: "LOW_STOCK",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80",
  },
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustReason, setAdjustReason] = useState("Purchase Stock In");

  const handleAdjust = () => {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== selectedItem.id) return i;
        const newStock = Math.max(0, i.stock + adjustQty);
        let newStatus: "OK" | "LOW_STOCK" | "OUT_OF_STOCK" = "OK";
        if (newStock === 0) newStatus = "OUT_OF_STOCK";
        else if (newStock <= i.minStock) newStatus = "LOW_STOCK";
        return { ...i, stock: newStock, status: newStatus };
      })
    );
    setSelectedItem(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Sector 4 Dark Store
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Inventory Control &amp; Stockouts
          </h1>
        </div>
      </div>

      {/* Critical Stockout Alert Banner (from Image 3) */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-amber-900">
              7 Critical Stockouts Detected in Anand Vihar Hub #04
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Amul Milk (3 left), Sunglasses (0), Backpacks (8 left). Please trigger supplier restocking.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedItem(items.find((i) => i.sku === "GR-002") || items[0]);
            setAdjustQty(50);
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap shadow-xs"
        >
          Quick Restock Amul Milk (+50)
        </button>
      </div>

      {/* Inventory Table (Matches Image 1) */}
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Min. Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-10 h-10 rounded-xl object-cover bg-neutral-100 border border-neutral-100"
                    />
                    <span className="font-bold text-[#111111]">{it.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">
                    {it.sku}
                  </td>
                  <td className="py-3 px-4 font-black text-sm text-black">
                    {it.stock} units
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-500">
                    {it.minStock} units
                  </td>
                  <td className="py-3 px-4">
                    {it.status === "OK" && (
                      <span className="bg-emerald-50 text-[#16803C] font-extrabold text-[10px] px-2.5 py-0.5 rounded">
                        OK
                      </span>
                    )}
                    {it.status === "LOW_STOCK" && (
                      <span className="bg-amber-50 text-amber-600 font-extrabold text-[10px] px-2.5 py-0.5 rounded">
                        Low Stock
                      </span>
                    )}
                    {it.status === "OUT_OF_STOCK" && (
                      <span className="bg-red-50 text-red-600 font-extrabold text-[10px] px-2.5 py-0.5 rounded">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(it);
                        setAdjustQty(20);
                      }}
                      className="bg-[#111111] hover:bg-[#FF5A36] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                    >
                      Stock In / Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Dialog */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-black text-base text-[#111111]">
              Adjust Stock for {selectedItem.name}
            </h3>
            <p className="text-xs text-neutral-500">
              Current Stock: <strong className="text-black">{selectedItem.stock}</strong> units
            </p>

            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Adjustment Quantity (+ / -)
              </label>
              <input
                type="number"
                value={adjustQty}
                onChange={(e) => setAdjustQty(Number(e.target.value))}
                className="w-full text-xs font-bold p-3 border border-neutral-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">
                Reason / Reference
              </label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl"
              >
                <option value="Purchase Stock In">Purchase PO Stock In</option>
                <option value="Damaged Stock Write-off">Damaged Stock Write-off</option>
                <option value="Customer Return Restock">Customer Return Restock</option>
                <option value="Cycle Count Audit">Cycle Count Audit Adjustment</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                className="px-5 py-2 bg-[#FF5A36] text-white rounded-xl text-xs font-bold shadow-soft"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
