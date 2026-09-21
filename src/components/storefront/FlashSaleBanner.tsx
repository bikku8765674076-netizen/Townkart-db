"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Clock } from "lucide-react";

interface FlashSaleBannerProps {
  endDate?: string;
}

export function FlashSaleBanner({
  endDate = "2026-10-15T23:59:59Z",
}: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "14",
    minutes: "36",
    seconds: "21",
  });

  useEffect(() => {
    const target = new Date(endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FF5A36] via-[#FF6D4D] to-[#FF7F60] text-white p-8 sm:p-12 lg:p-16 shadow-xl">
          {/* Subtle background graphic circles */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text & countdown */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
                <span>Limited Town Stock Event</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Flash Sale — <br className="hidden sm:inline" />
                Up to 50% Off Everything
              </h2>

              <p className="text-sm sm:text-base text-white/90 max-w-lg mx-auto lg:mx-0">
                Massive discounts on top electronic audio, fresh dairy, household oils, and fashion sneakers. Grab before the town warehouse sells out!
              </p>

              {/* Working Countdown Clock */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hours", val: timeLeft.hours },
                  { label: "Mins", val: timeLeft.minutes },
                  { label: "Secs", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-black/25 backdrop-blur-md rounded-2xl px-3 sm:px-4 py-2 min-w-[62px] sm:min-w-[72px] border border-white/15"
                  >
                    <span className="text-xl sm:text-2xl font-black font-mono tracking-wider">
                      {item.val}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-white/80 mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-2">
                <Link
                  href="/shop?filter=flash-sale"
                  className="inline-flex items-center gap-2.5 bg-white text-[#111111] hover:bg-neutral-100 px-7 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all hover:gap-3.5"
                >
                  <span>Shop Offers Now</span>
                  <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
                </Link>
              </div>
            </div>

            {/* Right Product Composition */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-xs aspect-square rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl bg-white/10 backdrop-blur-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
                  alt="Flash sale footwear"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#111111] text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg">
                  50% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
