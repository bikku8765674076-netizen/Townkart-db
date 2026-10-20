"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin, Phone, Package, Truck, ShieldCheck, AlertCircle, LoaderCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: { productName: string; quantity: number; unitPrice: number; totalAmount: number }[];
  address: { fullName: string; phone: string; houseBuilding: string; street: string; landmark?: string | null; town: string; state: string; pincode: string; latitude?: number | null; longitude?: number | null };
  user: { name: string; phone: string | null };
}
interface Assignment {
  id: string;
  orderId: string;
  order: DeliveryOrder;
}

export default function DeliveryOrderTaskPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params.id;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const loadTask = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/delivery/orders", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || "Sign in with an approved delivery-partner account.");
        return;
      }
      const found = (payload.data ?? []).find((item: Assignment) => item.orderId === orderId);
      if (!found) {
        setAssignment(null);
        setError("This order is not currently assigned to your account, or it has already been completed.");
        return;
      }
      setAssignment(found);
    } catch {
      setError("Unable to load this delivery task. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { loadTask(); }, [loadTask]);

  const updateStatus = async (status: "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED") => {
    if (!assignment) return;
    if (status === "DELIVERED" && !/^\\d{6}$/.test(otp)) {
      setError("Enter the customer's six-digit OTP.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/delivery/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: assignment.orderId, status, ...(status === "DELIVERED" ? { otp } : {}) }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || "Could not update delivery status.");
        return;
      }
      setAssignment((current) => current ? {
        ...current,
        order: { ...current.order, status: payload.data.status, paymentStatus: payload.data.paymentStatus },
      } : current);
      if (status === "DELIVERED") setCompleted(true);
    } catch {
      setError("Network error updating this delivery. Please retry.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <main className="min-h-full bg-[#F7F7F5] p-8 flex items-center justify-center text-sm text-neutral-500"><LoaderCircle className="w-4 h-4 animate-spin mr-2" /> Loading delivery task…</main>;

  if (!assignment) return <main className="min-h-full bg-[#F7F7F5] p-5 sm:p-8"><div className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-2xl p-7 text-center"><AlertCircle className="w-9 h-9 mx-auto text-amber-600" /><h1 className="font-black text-xl mt-3">Delivery task unavailable</h1><p className="text-xs text-neutral-500 mt-2">{error}</p><div className="flex gap-2 justify-center mt-5"><button onClick={loadTask} className="rounded-xl bg-[#111111] text-white px-4 py-3 text-xs font-bold">Retry</button><Link href="/delivery/dashboard" className="rounded-xl border border-neutral-200 px-4 py-3 text-xs font-bold">Back to dashboard</Link></div></div></main>;

  const order = assignment.order;
  const addressText = [order.address.houseBuilding, order.address.street, order.address.landmark, order.address.town, order.address.state, order.address.pincode].filter(Boolean).join(", ");
  const mapQuery = order.address.latitude != null && order.address.longitude != null
    ? order.address.latitude + "," + order.address.longitude
    : addressText;
  const contactPhone = order.address.phone || order.user.phone;
  const currentStatus = order.status;
  const nextAction = currentStatus === "ASSIGNED" || currentStatus === "READY_FOR_PICKUP"
    ? { label: "Confirm pickup", status: "PICKED_UP" as const }
    : currentStatus === "PICKED_UP"
      ? { label: "Start delivery", status: "OUT_FOR_DELIVERY" as const }
      : null;

  return <main className="min-h-full bg-[#F7F7F5] p-4 sm:p-6 lg:p-8">
    <div className="max-w-3xl mx-auto space-y-5">
      <Link href="/delivery/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black"><ArrowLeft className="w-4 h-4" /> Back to delivery desk</Link>
      {completed ? <section className="bg-white border border-emerald-200 rounded-3xl p-8 text-center"><div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8" /></div><p className="text-[10px] uppercase tracking-widest font-black text-emerald-700 mt-5">Delivery verified</p><h1 className="text-2xl font-black mt-2">Order completed</h1><p className="text-sm text-neutral-500 mt-2">Order #{order.orderNumber} is marked delivered. COD payment status: {order.paymentMethod === "COD" ? "PAID" : order.paymentStatus}.</p><Link href="/delivery/dashboard" className="inline-flex items-center justify-center rounded-xl bg-[#111111] text-white px-5 py-3 text-xs font-bold mt-6">Return to delivery desk</Link></section> :
      <>
        <header className="flex flex-wrap justify-between items-start gap-3"><div><p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Delivery task</p><h1 className="text-2xl sm:text-3xl font-black mt-1">#{order.orderNumber}</h1><p className="text-xs text-neutral-500 mt-2">Follow the order status and confirm handoff securely.</p></div><span className="rounded-full bg-[#FFF6BE] px-3 py-2 text-[10px] font-black">{currentStatus.replaceAll("_", " ")}</span></header>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 flex gap-2 text-xs font-semibold text-red-700"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        <section className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4"><h2 className="font-black">Customer and destination</h2><div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#A48B00] mt-0.5 shrink-0" /><div><p className="font-extrabold text-sm">{order.address.fullName || order.user.name}</p><p className="text-xs text-neutral-600 mt-1 leading-relaxed">{addressText}</p></div></div><div className="flex flex-wrap gap-2">{contactPhone && <a href={"tel:" + contactPhone} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold"><Phone className="w-4 h-4" /> Call customer</a>}<a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapQuery)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold"><MapPin className="w-4 h-4" /> Open directions</a></div></section>
        <section className="bg-white border border-neutral-200 rounded-2xl p-5"><div className="flex items-center gap-2"><Package className="w-5 h-5" /><h2 className="font-black">Order contents</h2></div><div className="divide-y divide-neutral-100 mt-3">{order.items.map((item, index) => <div key={index} className="flex justify-between gap-3 py-3 text-xs"><span>{item.productName} <b className="text-neutral-500">× {item.quantity}</b></span><b>{formatPrice(item.totalAmount)}</b></div>)}</div><div className="border-t border-neutral-200 pt-3 flex justify-between text-sm"><span className="text-neutral-500">Order total</span><b>{formatPrice(order.totalAmount)}</b></div><div className="mt-3 rounded-xl bg-[#F7F7F5] p-3 flex justify-between text-xs"><span className="text-neutral-500">Payment method</span><b>{order.paymentMethod === "COD" ? "Cash on delivery" : order.paymentMethod}</b></div></section>
        {nextAction && <button disabled={busy} onClick={() => updateStatus(nextAction.status)} className="w-full rounded-xl bg-[#111111] text-white px-5 py-4 text-sm font-black disabled:opacity-50"><Truck className="w-4 h-4 inline mr-2" />{busy ? "Updating…" : nextAction.label}</button>}
        {currentStatus === "OUT_FOR_DELIVERY" && <section className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4"><div className="flex gap-3"><ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" /><div><h2 className="font-black">Verify delivery with customer OTP</h2><p className="text-xs text-neutral-500 mt-1">For COD, collect {formatPrice(order.totalAmount)} from the customer. Enter the OTP they provide to confirm handoff and record payment.</p></div></div><label className="block text-xs font-bold">6-digit delivery OTP<input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter customer OTP" className="w-full border border-neutral-200 rounded-xl p-4 text-center text-2xl font-mono tracking-[0.5em] mt-2 outline-none focus:border-[#F7D928]" /></label><button disabled={busy || otp.length !== 6} onClick={() => updateStatus("DELIVERED")} className="w-full rounded-xl bg-[#16803C] text-white px-5 py-4 text-sm font-black disabled:opacity-40">{busy ? "Verifying…" : "Verify OTP & complete delivery"}</button></section>}
        {currentStatus === "DELIVERED" && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-bold text-emerald-800"><CheckCircle2 className="w-4 h-4 inline mr-2" />Order delivered successfully.</div>}
      </>}
    </div>
  </main>;
}
