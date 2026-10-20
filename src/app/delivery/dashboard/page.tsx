"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, MapPin, PackageCheck, Truck, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: { productName: string; quantity: number }[];
  address: {
    fullName: string;
    phone: string;
    houseBuilding: string;
    street: string;
    town: string;
    pincode: string;
  };
  user: { name: string; phone: string | null };
}
interface Assignment {
  id: string;
  orderId: string;
  assignedAt: string;
  order: DeliveryOrder;
}

export default function DeliveryDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/delivery/orders", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || "Sign in with an approved delivery-partner account to see assignments.");
        setAssignments([]);
        return;
      }
      setAssignments(payload.data ?? []);
    } catch {
      setError("Unable to load deliveries. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  const pickedUp = assignments.filter((a) => ["PICKED_UP", "OUT_FOR_DELIVERY"].includes(a.order.status)).length;
  const ready = assignments.filter((a) => ["ASSIGNED", "READY_FOR_PICKUP"].includes(a.order.status)).length;

  return (
    <main className="min-h-full bg-[#F7F7F5] p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-neutral-500">TownKart · Last-mile operations</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111] mt-1">Delivery desk<span className="text-[#F7D928]">.</span></h1>
          <p className="text-xs text-neutral-500 mt-2">Your assigned orders, customer addresses and delivery verification.</p>
        </div>
        <button onClick={loadAssignments} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] text-white px-4 py-3 text-xs font-extrabold disabled:opacity-50">
          <RefreshCw className={"w-4 h-4 " + (loading ? "animate-spin" : "")} /> Refresh assignments
        </button>
      </header>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><p>{error}</p></div>}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4"><p className="text-xs text-neutral-500">Active assignments</p><p className="text-3xl font-black mt-2">{assignments.length}</p></div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4"><p className="text-xs text-neutral-500">Ready for pickup</p><p className="text-3xl font-black mt-2">{ready}</p></div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-4"><p className="text-xs text-neutral-500">Picked up / in transit</p><p className="text-3xl font-black mt-2">{pickedUp}</p></div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="font-black text-lg">My assigned orders</h2><span className="text-[10px] font-bold text-neutral-500">{assignments.length} active</span></div>
        {loading ? <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center text-sm text-neutral-500">Loading assignments…</div> :
          assignments.length === 0 ? <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center"><PackageCheck className="w-9 h-9 mx-auto text-neutral-300" /><h3 className="font-black mt-3">No active assignments</h3><p className="text-xs text-neutral-500 mt-2">New orders assigned by the TownKart dispatch team will appear here.</p></div> :
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{assignments.map((assignment) => {
            const order = assignment.order;
            return <article key={assignment.id} className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-wider font-black text-neutral-400">Order number</p><h3 className="text-lg font-black mt-1">#{order.orderNumber}</h3><p className="text-[10px] text-neutral-500 mt-1">Assigned {new Date(assignment.assignedAt).toLocaleString("en-IN")}</p></div><span className="rounded-full bg-[#FFF6BE] px-3 py-1.5 text-[10px] font-black">{order.status.replaceAll("_", " ")}</span></div>
              <div className="rounded-xl bg-[#F7F7F5] p-3"><p className="text-[10px] uppercase tracking-wider text-neutral-500 font-black">Items</p><p className="text-xs font-bold mt-2">{order.items.map((item) => item.productName + " × " + item.quantity).join(" · ")}</p><div className="flex justify-between border-t border-neutral-200 mt-3 pt-3 text-xs"><span className="text-neutral-500">Order total</span><b>{formatPrice(order.totalAmount)}</b></div></div>
              <div className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-[#A48B00] shrink-0" /><div className="min-w-0"><p className="text-sm font-extrabold">{order.address.fullName || order.user.name}</p><p className="text-xs text-neutral-600 mt-1">{[order.address.houseBuilding, order.address.street, order.address.town, order.address.pincode].filter(Boolean).join(", ")}</p>{(order.address.phone || order.user.phone) && <a className="inline-block text-xs font-bold underline mt-2" href={"tel:" + (order.address.phone || order.user.phone)}>{order.address.phone || order.user.phone}</a>}</div></div>
              <Link href={"/delivery/orders/" + order.id} className="flex items-center justify-center gap-2 rounded-xl bg-[#111111] text-white px-4 py-3 text-xs font-extrabold">Open delivery task <ArrowRight className="w-4 h-4" /></Link>
            </article>;
          })}</div>}
      </section>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4 flex gap-3"><Clock className="w-5 h-5 text-neutral-500 shrink-0" /><div><p className="text-xs font-extrabold">Delivery completion requires customer verification</p><p className="text-xs text-neutral-500 mt-1">For COD orders, collect the amount and enter the customer's six-digit OTP in the task screen. The order is marked paid only after verification.</p></div><Truck className="w-5 h-5 text-[#A48B00] shrink-0 ml-auto" /></div>
    </main>
  );
}
