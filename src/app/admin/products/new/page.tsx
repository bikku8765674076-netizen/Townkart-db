"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Check, UploadCloud } from "lucide-react";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "Grocery",
    sku: "",
    price: "",
    mrp: "",
    stock: "",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/products");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-2xl font-black text-[#111111]">
          Add New Town Product
        </h1>
        <p className="text-xs text-neutral-500">
          Publish a new SKU directly into the Sector 4 Fulfillment Hub dark store.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Product Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aashirvaad Shudh Chakki Atta 5kg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            >
              <option value="Grocery">Grocery</option>
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              SKU Code
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GR-044"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Selling Price (₹)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 1499"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              MRP (₹)
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 1899"
              value={formData.mrp}
              onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Initial Stock Units
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 50"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Primary Image URL
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              placeholder="Key specifications, origin, warranty, ingredients..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#FF5A36]"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#FF5A36] hover:bg-[#e04f2e] text-white rounded-xl text-xs font-bold shadow-soft"
          >
            Publish Product
          </button>
        </div>
      </form>
    </div>
  );
}
