"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Boxes,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "LOW_STOCK" | "OUT_OF_STOCK";
  image: string;
}

const INITIAL_PRODUCTS: ProductRow[] = [
  {
    id: "wh-01",
    name: "TownKart Studio Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    price: 1499,
    stock: 42,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "rs-02",
    name: "Men's AeroStrider Running Shoes",
    sku: "RS-002",
    category: "Fashion",
    price: 1999,
    stock: 15,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "wb-03",
    name: "Insulated Stainless Steel Water Bottle 1L",
    sku: "WB-003",
    category: "Sports",
    price: 499,
    stock: 120,
    status: "ACTIVE",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "bp-04",
    name: "TownCommute Anti-Theft Laptop Backpack",
    sku: "BP-004",
    category: "Accessories",
    price: 1299,
    stock: 8,
    status: "LOW_STOCK",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "sg-05",
    name: "Classic Polarized Wayfarer Sunglasses",
    sku: "SG-005",
    category: "Accessories",
    price: 899,
    stock: 0,
    status: "OUT_OF_STOCK",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "gr-02",
    name: "Amul Taaza Fresh Toned Milk 1L",
    sku: "GR-002",
    category: "Grocery",
    price: 52,
    stock: 3,
    status: "LOW_STOCK",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>(INITIAL_PRODUCTS);
  const [tab, setTab] = useState<"ALL" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    if (tab === "LOW_STOCK" && p.status !== "LOW_STOCK") return false;
    if (tab === "OUT_OF_STOCK" && p.status !== "OUT_OF_STOCK") return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Catalog Management
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Town Products ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#FF5A36] hover:bg-[#e04f2e] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl p-1 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setTab("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              tab === "ALL" ? "bg-[#111111] text-white" : "text-neutral-500 hover:text-black"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setTab("LOW_STOCK")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              tab === "LOW_STOCK" ? "bg-amber-500 text-white" : "text-neutral-500 hover:text-black"
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setTab("OUT_OF_STOCK")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              tab === "OUT_OF_STOCK" ? "bg-red-500 text-white" : "text-neutral-500 hover:text-black"
            }`}
          >
            Out of Stock
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, SKU..."
            className="text-xs pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl font-medium w-full sm:w-64 focus:outline-[#FF5A36]"
          />
        </div>
      </div>

      {/* Product Table (Matches Image 1) */}
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-soft overflow-hidden">
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
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="py-3 px-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-11 h-11 rounded-xl object-cover bg-neutral-100 border border-neutral-100"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-[#111111]">
                    {prod.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500 text-[11px]">
                    {prod.sku}
                  </td>
                  <td className="py-3 px-4">{prod.category}</td>
                  <td className="py-3 px-4 font-black text-black">
                    {formatPrice(prod.price)}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {prod.stock} units
                  </td>
                  <td className="py-3 px-4">
                    {prod.status === "ACTIVE" && (
                      <span className="bg-emerald-50 text-[#16803C] font-extrabold text-[10px] px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                    {prod.status === "LOW_STOCK" && (
                      <span className="bg-amber-50 text-amber-600 font-extrabold text-[10px] px-2 py-0.5 rounded">
                        ⚠️ Low Stock
                      </span>
                    )}
                    {prod.status === "OUT_OF_STOCK" && (
                      <span className="bg-red-50 text-red-600 font-extrabold text-[10px] px-2 py-0.5 rounded">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-neutral-400">
                      <button
                        title="Edit"
                        className="hover:text-black p-1 hover:bg-neutral-100 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() =>
                          setProducts(products.filter((p) => p.id !== prod.id))
                        }
                        className="hover:text-red-500 p-1 hover:bg-neutral-100 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
