"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

export function TrustBar() {
  const highlights = [
    {
      icon: Truck,
      title: "Fast Local Delivery",
      description: "Direct from town dark-store in 30–45 mins",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "UPI, Cards, Net Banking & Cash on Delivery",
    },
    {
      icon: RotateCcw,
      title: "Easy Local Returns",
      description: "Hassle-free doorstep returns and exchanges",
    },
    {
      icon: Headphones,
      title: "Local Town Support",
      description: "Direct WhatsApp & phone help in your town",
    },
  ];

  return (
    <section className="bg-white border-b border-[#E8E8E8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-2xl transition-colors hover:bg-[#F7F7F5]"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111]">{item.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
