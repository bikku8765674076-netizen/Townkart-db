"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { Plus, Trash2, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";

interface Address {
  id: string;
  type: string;
  fullName: string;
  phone: string;
  houseBuilding: string;
  street: string;
  landmark?: string | null;
  town: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [newAddr, setNewAddr] = useState({
    type: "HOME",
    fullName: "",
    phone: "",
    houseBuilding: "",
    street: "",
    landmark: "",
    town: "Civil Lines, Ward 12",
    pincode: "272001",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/addresses");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAddresses(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseBuilding || !newAddr.street || !newAddr.fullName || !newAddr.phone) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddr),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsAdding(false);
        setNewAddr({
          type: "HOME",
          fullName: "",
          phone: "",
          houseBuilding: "",
          street: "",
          landmark: "",
          town: "Civil Lines, Ward 12",
          pincode: "272001",
          isDefault: false,
        });
        fetchAddresses();
      } else {
        setError(json.error || "Failed to save address");
      }
    } catch {
      setError("Network error saving address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery address?")) return;
    try {
      await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      fetchAddresses();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Account</span>
        </Link>

        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl font-black text-[#111111]">
              Saved Delivery Addresses
            </h1>
            <p className="text-xs text-neutral-500">
              Town delivery addresses configured for 10-15 minute dispatch
            </p>
          </div>
          <button
            onClick={() => setIsAdding((p) => !p)}
            className="flex items-center gap-2 bg-[#0C831F] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-[#0a6f1a] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Add Address Form Drawer/Card */}
        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="mt-6 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
          >
            <h3 className="font-extrabold text-sm text-[#111111] pb-2 border-b border-neutral-100">
              New Delivery Address Details
            </h3>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl font-bold">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              {["HOME", "WORK", "OTHER"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewAddr({ ...newAddr, type: t })}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                    newAddr.type === t
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "border-neutral-200 text-neutral-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Sharma"
                  value={newAddr.fullName}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, fullName: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={newAddr.phone}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, phone: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  House / Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Greenfield Heights"
                  value={newAddr.houseBuilding}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, houseBuilding: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Street / Ward / Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Main Market, Civil Lines"
                  value={newAddr.street}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, street: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Town Hall"
                  value={newAddr.landmark}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, landmark: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Town PIN Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 272001"
                  value={newAddr.pincode}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, pincode: e.target.value })
                  }
                  className="w-full text-xs font-semibold p-2.5 border border-neutral-200 rounded-xl focus:outline-[#0C831F]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#0C831F] hover:bg-[#0a6f1a] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        )}

        {/* Addresses List */}
        <div className="mt-6 space-y-4">
          {loading && addresses.length === 0 ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-white border border-neutral-200 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-10 text-center">
              <p className="text-xs font-bold text-neutral-500 mb-3">
                No addresses saved yet
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs font-bold text-[#0C831F] hover:underline"
              >
                + Add your first town delivery address
              </button>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-[#0C831F] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Default Address
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-[#111111]">
                    {addr.fullName}{" "}
                    <span className="text-neutral-400 font-normal">
                      • {addr.phone}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {addr.houseBuilding}, {addr.street}
                    {addr.landmark ? `, Near ${addr.landmark}` : ""}
                  </p>
                  <p className="text-xs text-neutral-500 font-medium">
                    {addr.town} — PIN {addr.pincode}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
