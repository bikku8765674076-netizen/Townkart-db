"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    sku: "",
    sellingPrice: "",
    mrp: "",
    stock: "50",
    lowStockThreshold: "5",
    maxOrderQty: "10",
    shortDescription: "",
    description: "",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
          if (json.data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: json.data[0].id }));
          }
        }
      } catch {
        // fallback
      }
    };
    fetchCats();
  }, []);

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, name: val, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.categoryId || !formData.sku) {
      setError("Please fill all required fields");
      return;
    }
    if (parseFloat(formData.sellingPrice) > parseFloat(formData.mrp)) {
      setError("Selling price cannot exceed MRP");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || `sku-${Date.now()}`,
        categoryId: formData.categoryId,
        sku: formData.sku,
        sellingPrice: formData.sellingPrice,
        mrp: formData.mrp,
        stock: formData.stock,
        lowStockThreshold: formData.lowStockThreshold,
        maxOrderQty: formData.maxOrderQty,
        shortDescription: formData.shortDescription,
        description: formData.description,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to create product");
        setSubmitting(false);
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Network error creating product");
      setSubmitting(false);
    }
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
              placeholder="e.g. Aashirvaad Shudh Chakki Atta 5kg"
              value={formData.name}
              onChange={(e) => handleTitleChange(e.target.value)}
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
              placeholder="aashirvaad-shudh-chakki-atta-5kg"
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
              placeholder="e.g. GR-044"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 240"
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
              placeholder="e.g. 290"
              value={formData.mrp}
              onChange={(e) =>
                setFormData({ ...formData, mrp: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Initial Stock Units *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 50"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Primary Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full text-xs font-semibold p-3 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 block mb-1">
              Weight / Pack Unit (Short Info)
            </label>
            <input
              type="text"
              placeholder="e.g. 500 g or 1 litre"
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
              placeholder="Key specifications, origin, warranty, ingredients..."
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
            {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? "Publishing..." : "Publish Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
