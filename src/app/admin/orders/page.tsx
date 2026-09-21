"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Clock,
  Printer,
  Bike,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  ArrowRight,
  Filter,
  User,
  MapPin,
} from "lucide-react";

interface PipelineOrder {
  id: string;
  orderNumber: string;
  timeAgo: string;
  customer: string;
  area: string;
  amount: number;
  itemsSummary: string;
  stage: "PENDING" | "CONFIRMED" | "PACKING" | "READY" | "OUT" | "DELIVERED";
  paymentType: "UPI" | "COD" | "CARD";
  note?: string;
  picker?: string;
  bay?: string;
  rider?: string;
}

const INITIAL_PIPELINE: PipelineOrder[] = [
  {
    id: "ord-9835",
    orderNumber: "TK-9835",
    timeAgo: "2m ago",
    customer: "Pooja Verma",
    area: "Sector 4-B",
    amount: 348,
    itemsSummary: "Mother Dairy Curd, Aashirvaad Atta",
    stage: "PENDING",
    paymentType: "UPI",
    note: "UPI Intent awaiting",
  },
  {
    id: "ord-9834",
    orderNumber: "TK-9834",
    timeAgo: "4m ago",
    customer: "Dr. Amit Saxena",
    area: "Kalyani Ngr",
    amount: 890,
    itemsSummary: "Fortune Sunflower Oil, Tata Salt",
    stage: "PENDING",
    paymentType: "CARD",
    note: "Card Gateway Hook",
  },
  {
    id: "ord-9833",
    orderNumber: "TK-9833",
    timeAgo: "1m ago",
    customer: "Ankit Trivedi",
    area: "1.2 km away",
    amount: 195,
    itemsSummary: "Fresh Coriander, Tomatoes Hybrid",
    stage: "CONFIRMED",
    paymentType: "COD",
    note: "Auto-Accepted",
  },
  {
    id: "ord-9832",
    orderNumber: "TK-9832",
    timeAgo: "3m ago",
    customer: "Rakesh Malhotra",
    area: "0.8 km away",
    amount: 540,
    itemsSummary: "Wagh Bakri Tea, Parle-G 1kg",
    stage: "CONFIRMED",
    paymentType: "UPI",
  },
  {
    id: "ord-9831",
    orderNumber: "TK-9831",
    timeAgo: "04:18 elapsed",
    customer: "Amit Sharma",
    area: "Civil Lines",
    amount: 425,
    itemsSummary: "Fresh Paneer 200g, Shimla Mirch",
    stage: "PACKING",
    paymentType: "UPI",
    picker: "Dinesh (Station #2)",
  },
  {
    id: "ord-9830",
    orderNumber: "TK-9830",
    timeAgo: "02:40 elapsed",
    customer: "Sunita Rao",
    area: "Ward 12",
    amount: 1140,
    itemsSummary: "India Gate Basmati, Tata Sampann",
    stage: "PACKING",
    paymentType: "CARD",
    picker: "Meena (Station #1)",
  },
  {
    id: "ord-9829",
    orderNumber: "TK-9829",
    timeAgo: "8m ago",
    customer: "Rahul G.",
    area: "Prem Nagar",
    amount: 220,
    itemsSummary: "Maggi 4-pack, Coca-Cola 750ml",
    stage: "READY",
    paymentType: "UPI",
    bay: "Bay B-04 Bagged",
  },
  {
    id: "ord-7492",
    orderNumber: "TK-7492",
    timeAgo: "14m ago",
    customer: "Amit Sharma",
    area: "Greenfield Heights",
    amount: 199.3,
    itemsSummary: "Premium Milk 1L x 2, Tomatoes 1kg",
    stage: "OUT",
    paymentType: "COD",
    rider: "Dinesh Kumar (Hero Splendor)",
  },
  {
    id: "ord-7491",
    orderNumber: "TK-7491",
    timeAgo: "28m ago",
    customer: "Sameer Khan",
    area: "Civil Lines",
    amount: 1399,
    itemsSummary: "TownKart Studio Headphones",
    stage: "DELIVERED",
    paymentType: "UPI",
  },
];

export default function AdminOrdersDispatchPage() {
  const [pipeline, setPipeline] = useState<PipelineOrder[]>(INITIAL_PIPELINE);
  const [searchQuery, setSearchQuery] = useState("");

  const advanceOrderStage = (id: string) => {
    setPipeline((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;
        if (order.stage === "PENDING") {
          return { ...order, stage: "CONFIRMED" };
        }
        if (order.stage === "CONFIRMED") {
          return {
            ...order,
            stage: "PACKING",
            picker: "Picker: Station #1",
            timeAgo: "00:30 elapsed",
          };
        }
        if (order.stage === "PACKING") {
          return { ...order, stage: "READY", bay: "Bay B-06 Bagged" };
        }
        if (order.stage === "READY") {
          return {
            ...order,
            stage: "OUT",
            rider: "Dinesh Kumar (Rider #01)",
          };
        }
        if (order.stage === "OUT") {
          return { ...order, stage: "DELIVERED" };
        }
        return order;
      })
    );
  };

  const columns = [
    { id: "PENDING", title: "Pending Payment", color: "bg-neutral-500" },
    { id: "CONFIRMED", title: "Confirmed", color: "bg-blue-600" },
    { id: "PACKING", title: "Packing & Weighing", color: "bg-purple-600" },
    { id: "READY", title: "Ready at Hub Bay", color: "bg-amber-500" },
    { id: "OUT", title: "Out for Delivery", color: "bg-[#FF5A36]" },
    { id: "DELIVERED", title: "Delivered", color: "bg-[#16803C]" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Title & Top Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Sector 4 Fulfillment Hub Operations
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-0.5">
            Hyper-local Dispatch Workflow
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Live state transitions for Ward 12 &amp; Civil Lines sector. Click action buttons to advance stage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, Rider, Item..."
              className="text-xs pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl font-medium w-64 focus:outline-[#FF5A36]"
            />
          </div>
        </div>
      </div>

      {/* 6-Stage Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {columns.map((col) => {
          const colOrders = pipeline.filter((o) => o.stage === col.id);

          return (
            <div
              key={col.id}
              className="w-72 flex-shrink-0 bg-[#EFEFEF]/70 rounded-3xl p-3 flex flex-col border border-neutral-200/60"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-extrabold text-xs text-[#111111]">
                    {col.title}
                  </h3>
                </div>
                <span className="bg-white text-neutral-600 text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-4 shadow-soft border border-neutral-200/80 space-y-3 hover:shadow-hover transition-all"
                  >
                    {/* Top Row: #ID & Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-[#111111]">
                          #{ord.orderNumber}
                        </span>
                        {ord.paymentType && (
                          <span className="text-[9px] font-bold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                            {ord.paymentType}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ord.timeAgo}
                      </span>
                    </div>

                    {/* Items & Customer Area */}
                    <div>
                      <p className="font-bold text-xs text-[#111111] line-clamp-1">
                        {ord.itemsSummary}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                        <span>{ord.customer}</span>
                        <span className="font-semibold text-black">
                          {formatPrice(ord.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Metadata tags: Picker / Bay / Rider */}
                    {ord.picker && (
                      <div className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                        {ord.picker}
                      </div>
                    )}
                    {ord.bay && (
                      <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                        {ord.bay}
                      </div>
                    )}
                    {ord.rider && (
                      <div className="bg-red-50 text-[#FF5A36] text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <Bike className="w-3 h-3" />
                        <span>{ord.rider}</span>
                      </div>
                    )}

                    {/* Stage Advancer Button */}
                    {col.id !== "DELIVERED" && (
                      <button
                        onClick={() => advanceOrderStage(ord.id)}
                        className="w-full bg-[#111111] hover:bg-[#FF5A36] text-white py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        {col.id === "PENDING" && "Verify Paid / COD"}
                        {col.id === "CONFIRMED" && "Send to Packing Picker"}
                        {col.id === "PACKING" && "Mark Packed & Sealed"}
                        {col.id === "READY" && "Assign Rider Fleet"}
                        {col.id === "OUT" && "Confirm Delivery (OTP)"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
