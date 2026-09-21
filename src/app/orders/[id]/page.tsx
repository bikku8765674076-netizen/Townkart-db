"use client";

import React, { use } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  Phone,
  MessageCircle,
  KeyRound,
  MapPin,
  ArrowLeft,
  Store,
} from "lucide-react";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  // Visual tracking stages
  const stages = [
    { title: "Order Placed", time: "10:15 AM", done: true },
    { title: "Confirmed by Hub", time: "10:18 AM", done: true },
    { title: "Packed & Sealed", time: "10:25 AM", done: true, desc: "Picker: Dinesh (Station #2)" },
    { title: "Ready at Hub Bay", time: "10:32 AM", done: true, desc: "Bay B-04 Bagged" },
    { title: "Out for Delivery", time: "10:38 AM", done: true, current: true, desc: "Rider on the way (2.4 km)" },
    { title: "Delivered", time: "Estimated 10:55 AM", done: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Card Container */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-md">
                  In Transit
                </span>
                <span className="text-xs text-neutral-600">Same-Day Local Express</span>
              </div>
              <h1 className="text-2xl font-black text-[#111111] mt-1">
                Order #{orderId}
              </h1>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-neutral-600 block">Estimated Arrival</span>
              <strong className="text-base text-[#16803C] font-extrabold flex items-center sm:justify-end gap-1.5 mt-0.5">
                <Clock className="w-4 h-4" />
                Today, 5:00 PM – 8:00 PM
              </strong>
            </div>
          </div>

          {/* Delivery OTP Card */}
          <div className="bg-[#111111] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#FF5A36] flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Doorstep Verification OTP
                </span>
                <p className="text-2xl font-mono font-black tracking-widest text-white">
                  849201
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-400 max-w-xs text-center sm:text-right">
              Share this code with rider <strong className="text-white">Dinesh Kumar</strong> only after inspecting your delivery package.
            </p>
          </div>

          {/* Visual Step-by-Step Progress Timeline */}
          <div>
            <h3 className="font-extrabold text-sm text-[#111111] mb-6">
              Live Fulfillment Progress
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {stages.map((stage, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                      stage.done
                        ? "bg-[#16803C]"
                        : stage.current
                        ? "bg-[#FF5A36] ring-4 ring-[#FF5A36]/20"
                        : "bg-neutral-300"
                    }`}
                  >
                    {stage.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-extrabold ${
                          stage.current
                            ? "text-[#FF5A36]"
                            : stage.done
                            ? "text-[#111111]"
                            : "text-neutral-600"
                        }`}
                      >
                        {stage.title}
                      </h4>
                      <span className="text-[11px] text-neutral-600 font-semibold">
                        {stage.time}
                      </span>
                    </div>
                    {stage.desc && (
                      <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                        {stage.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partner Contact Card */}
          <div className="bg-[#F7F7F5] border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                alt="Dinesh Kumar - Delivery Partner"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#16803C] tracking-wider">
                  Assigned Delivery Partner
                </span>
                <h4 className="font-extrabold text-sm text-[#111111]">
                  Dinesh Kumar (⭐ 4.9)
                </h4>
                <p className="text-xs text-neutral-600">
                  Vehicle: Hero Splendor (UP-32-DK-8910)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:+919876511001"
                className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#16803C]" />
                <span>Call Rider</span>
              </a>
              <Link
                href="/delivery/orders/order-7492"
                className="inline-flex items-center gap-1.5 bg-[#FF5A36] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#e04f2e] transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Rider App View</span>
              </Link>
            </div>
          </div>

          {/* Delivery Location & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100 text-xs">
            <div>
              <span className="font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                Delivering to:
              </span>
              <p className="font-bold text-[#111111]">Amit Sharma</p>
              <p className="text-neutral-600">
                Flat 402, Greenfield Heights, Near Main Market
              </p>
              <p className="text-neutral-600">Civil Lines, Ward 12 • 272206</p>
            </div>
            <div>
              <span className="font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                Payment Info:
              </span>
              <p className="font-bold text-[#111111]">
                Cash on Delivery (COD) • ₹199.30
              </p>
              <p className="text-neutral-600">
                Please keep exact cash ready or scan rider&apos;s dynamic QR.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
