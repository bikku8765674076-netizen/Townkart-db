"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle, Save } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    sku: "",
    sellingPrice: "",
    mrp: "",
    stock: "0",
    lowStockThreshold: "5",
    maxOrderQty: "10",
    shortDescription: "",
    description: "",
    status: "ACTIVE",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/admin/products?limit=100`),
        ]);

        const catsJson = await catsRes.json();
        if (catsJson.success && Array.isArray(catsJson.data)) {
          setCategories(catsJson.data);
        }

        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data)) {
          const found = prodJson.data.find((p: any) => p.id === id);
          if (found) {
            setFormData({
              name: found.name,
              slug: found.slug,
              categoryId: found.categoryId,
              sku: found.sku,
              sellingPrice: String(found.sellingPrice),
              mrp: String(found.mrp),
              stock: String(found.stock),
              lowStockThreshold: String(found.lowStockThreshold || 5),
              maxOrderQty: String(found.maxOrderQty || 10),
              shortDescription: found.shortDescription || "",
              description: found.description || "",
              status: found.status || "ACTIVE",
              isFeatured: Boolean(found.isFeatured),
              isBestSeller: Boolean(found.isBestSeller),
              isNewArrival: Boolean(found.isNewArrival),
            });
          }
        }
      } catch {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) {
      setError("Selling price cannot exceed MRP");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to update product");
        setSubmitting(false);
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Network error updating product");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl space-y-4">
        <div className="h-6 w-32 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="h-10 w-64 bg-neutral-100 rounded-xl animate-pulse" />
        <div className="h-96 bg-neutral-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

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
          Edit Product: {formData.name}
        </h1>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">
          SKU: {formData.sku} • ID: {id}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Product Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F] font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Department / Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              SKU Code *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.sellingPrice}
              onChange={(e) =>
                setFormData({ ...formData, sellingPrice: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              MRP (₹) *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.mrp}
              onChange={(e) =>
                setFormData({ ...formData, mrp: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Current Stock Units *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) =>
                setFormData({ ...formData, lowStockThreshold: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Weight / Pack Unit (Short Info)
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) =>
                setFormData({ ...formData, isBestSeller: e.target.checked })
              }
              className="accent-[#0C831F]"
            />
            <span>Best Seller</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="accent-[#0C831F]"
            />
            <span>Featured on Homepage</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#0C831F] hover:bg-[#0a6f1a] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{submitting ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
