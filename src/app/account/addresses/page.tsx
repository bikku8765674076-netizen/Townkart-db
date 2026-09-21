"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { MapPin, Plus, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      type: "HOME",
      fullName: "Amit Sharma",
      phone: "+91 98765 43210",
      houseBuilding: "Flat 402, Greenfield Heights",
      street: "Near Main Market, Civil Lines",
      landmark: "Opposite Town Hall",
      town: "Civil Lines, Ward 12",
      pincode: "272206",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "WORK",
      fullName: "Amit Sharma",
      phone: "+91 98765 43210",
      houseBuilding: "Office Suite #12, Commercial Hub",
      street: "Sector 4 Main Road",
      landmark: "Near Axis Bank ATM",
      town: "Anand Vihar",
      pincode: "272206",
      isDefault: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    type: "HOME",
    fullName: "Amit Sharma",
    phone: "+91 98765 43210",
    houseBuilding: "",
    street: "",
    landmark: "",
    town: "Civil Lines",
    pincode: "272206",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseBuilding || !newAddr.street) return;
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        ...newAddr,
        isDefault: false,
      },
    ]);
    setIsAdding(false);
    setNewAddr({
      type: "HOME",
      fullName: "Amit Sharma",
      phone: "+91 98765 43210",
      houseBuilding: "",
      street: "",
      landmark: "",
      town: "Civil Lines",
      pincode: "272206",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
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
              Town delivery addresses configured for express dispatch
            </p>
          </div>
          <button
            onClick={() => setIsAdding((p) => !p)}
            className="flex items-center gap-2 bg-[#FF5A36] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-soft hover:bg-[#e04f2e]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="mt-6 bg-white border border-neutral-200 rounded-3xl p-6 shadow-soft space-y-4"
          >
            <h3 className="font-extrabold text-sm text-[#111111]">
              Add Town Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                  House / Flat / Building
                </label>
                <input
                  type="text"
                  required
                  value={newAddr.houseBuilding}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, houseBuilding: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-xl"
                  placeholder="e.g. House 44, Block C"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                  Street / Area
                </label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, street: e.target.value })
                  }
                  className="w-full text-xs p-2.5 border border-neutral-200 rounded-xl"
                  placeholder="e.g. Civil Lines Main Road"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#111111] text-white rounded-xl text-xs font-bold"
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-[#16803C] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-[#111111]">
                  {addr.fullName}
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  {addr.houseBuilding}, {addr.street}
                </p>
                <p className="text-xs text-neutral-600">
                  {addr.town} • {addr.pincode}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{addr.phone}</p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex justify-end">
                <button
                  onClick={() =>
                    setAddresses(addresses.filter((a) => a.id !== addr.id))
                  }
                  className="text-neutral-400 hover:text-red-500 text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
