"use client";
import React, { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Clock, Bike, RefreshCw, Search } from "lucide-react";

interface OrderItemRow { productName: string; quantity: number; unitPrice: number; }
interface OrderAddress { town: string; pincode: string; }
interface OrderAssignment { partner: { name: string; phone: string; vehicleType: string } | null; }
interface RiderOption { userId: string; name: string; status: string; isApproved: boolean; }

interface PipelineOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  user: { name: string };
  address: OrderAddress;
  items: OrderItemRow[];
  assignments: OrderAssignment[];
}

const STAGE_COLUMNS = [
  { id: "CONFIRMED", title: "Confirmed", color: "bg-blue-600" },
  { id: "PROCESSING", title: "Processing", color: "bg-purple-600" },
  { id: "PACKING", title: "Packing", color: "bg-violet-600" },
  { id: "READY_FOR_PICKUP", title: "Ready at Hub", color: "bg-amber-500" },
  { id: "ASSIGNED", title: "Assigned to Rider", color: "bg-cyan-600" },
  { id: "PICKED_UP", title: "Picked Up", color: "bg-sky-600" },
  { id: "OUT_FOR_DELIVERY", title: "Out for Delivery", color: "bg-[#FF5A36]" },
  { id: "DELIVERED", title: "Delivered", color: "bg-[#16803C]" },
];

const NEXT_STATUS: Record<string, string> = {
  CONFIRMED: "PROCESSING",
  PROCESSING: "PACKING",
  PACKING: "READY_FOR_PICKUP",
};

const STAGE_ACTION: Record<string, string> = {
  CONFIRMED: "Start Processing",
  PROCESSING: "Send to Packing",
  PACKING: "Mark Packed",
  READY_FOR_PICKUP: "Assign Rider",
  OUT_FOR_DELIVERY: "Mark Delivered",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PipelineOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [riders, setRiders] = useState<RiderOption[]>([]);
  const [selectedRiders, setSelectedRiders] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders?limit=100");
      const data = await res.json();
      setOrders(
        (data.data ?? []).filter((o: PipelineOrder) =>
          STAGE_COLUMNS.map((c) => c.id).includes(o.status)
        )
      );
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    fetch("/api/admin/delivery/riders")
      .then(async (res) => (res.ok ? res.json() : null))
      .then((payload) => setRiders((payload?.data ?? []).filter((r: RiderOption) => r.isApproved && r.status === "ONLINE")))
      .catch(() => setRiders([]));
  }, []);

  const advanceStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = NEXT_STATUS[currentStatus];
    if (!nextStatus) return;
    setAdvancing(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await res.json();
      if (!res.ok) { setActionError(payload.error || "Could not update order."); return; }
      setActionError("");
      await fetchOrders();
    } catch {
      setActionError("Network error updating order. Please retry.");
    } finally { setAdvancing(null); }
  };

  const assignRider = async (orderId: string) => {
    const riderId = selectedRiders[orderId];
    if (!riderId) { setActionError("Choose an available delivery partner first."); return; }
    setAdvancing(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ASSIGNED", riderId, reason: "Assigned from dispatch board" }),
      });
      const payload = await res.json();
      if (!res.ok) { setActionError(payload.error || "Could not assign delivery partner."); return; }
      setActionError("");
      await fetchOrders();
    } catch {
      setActionError("Network error assigning delivery partner. Please retry.");
    } finally { setAdvancing(null); }
  };

  const filtered = search
    ? orders.filter((o) =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Dispatch Board</span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">Order Pipeline</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or customer…"
              className="text-xs pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl font-medium w-56 focus:outline-none focus:border-[#F7D928]" />
          </div>
          <button onClick={fetchOrders}
            className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <RefreshCw className={`w-4 h-4 text-neutral-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {actionError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-xs font-bold">{actionError}</div>}

      <div className="flex gap-4 overflow-x-auto pb-6">
        {STAGE_COLUMNS.map((col) => {
          const colOrders = filtered.filter((o) => o.status === col.id);
          return (
            <div key={col.id} className="w-72 flex-shrink-0 bg-[#F7F7F5] rounded-3xl p-3 flex flex-col border border-neutral-200/60">
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-extrabold text-xs text-[#111111]">{col.title}</h3>
                </div>
                <span className="bg-white text-neutral-600 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">{colOrders.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colOrders.map((ord) => {
                  const itemsSummary = ord.items.map((i) => i.productName).slice(0, 2).join(", ");
                  const rider = ord.assignments?.[0]?.partner;
                  return (
                    <div key={ord.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-[#111111]">#{ord.orderNumber}</span>
                          <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">{ord.paymentMethod}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ord.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#111111] line-clamp-1">{itemsSummary}</p>
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                          <span>{ord.user?.name}</span>
                          <span className="font-semibold text-black">{formatPrice(ord.totalAmount)}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{ord.address?.town} — {ord.address?.pincode}</p>
                      </div>
                      {rider && (
                        <div className="bg-red-50 text-[#FF5A36] text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Bike className="w-3 h-3" />
                          <span>{rider.name}</span>
                        </div>
                      )}
                      {col.id === "READY_FOR_PICKUP" && (
                        <div className="space-y-2">
                          <select value={selectedRiders[ord.id] ?? ""} onChange={(e) => setSelectedRiders((prev) => ({ ...prev, [ord.id]: e.target.value }))} className="w-full bg-white border border-neutral-200 rounded-lg px-2 py-2 text-[11px] font-semibold">
                            <option value="">Choose available rider…</option>
                            {riders.map((r) => <option key={r.userId} value={r.userId}>{r.name}</option>)}
                          </select>
                          <button onClick={() => assignRider(ord.id)} disabled={advancing === ord.id || !selectedRiders[ord.id]} className="w-full bg-[#111111] text-white py-2 rounded-xl text-[11px] font-extrabold disabled:opacity-40">
                            {advancing === ord.id ? "Assigning…" : "Assign Rider →"}
                          </button>
                          {riders.length === 0 && <p className="text-[10px] text-neutral-400">No approved online riders available.</p>}
                        </div>
                      )}
                      {col.id === "OUT_FOR_DELIVERY" && <p className="text-[10px] leading-relaxed text-neutral-500">The assigned delivery partner must verify the customer OTP to complete this COD order.</p>}
                      {col.id !== "DELIVERED" && NEXT_STATUS[col.id] && (
                        <button
                          onClick={() => advanceStatus(ord.id, col.id)}
                          disabled={advancing === ord.id}
                          className="w-full bg-[#111111] hover:bg-[#FF5A36] text-white py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60"
                        >
                          {advancing === ord.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : STAGE_ACTION[col.id]}
                        </button>
                      )}
                    </div>
                  );
                })}
                {colOrders.length === 0 && (
                  <div className="text-center py-8 text-xs text-neutral-400 font-semibold">No orders here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
