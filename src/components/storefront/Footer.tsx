"use client";

import React from "react";
import Link from "next/link";
import { TownKartLogo } from "@/components/common/TownKartLogo";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <>
      <footer className="bg-[#111111] text-white pt-16 pb-24 md:pb-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
            {/* Column 1 & 2: Brand Story */}
            <div className="lg:col-span-2 space-y-4">
              <TownKartLogo size="lg" inverted={true} />
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
                TownKart is your hyper-local community marketplace. Bringing modern D2C quality and express convenience to your town with 30-minute doorstep delivery.
              </p>

              <div className="pt-2 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF5A36] flex-shrink-0" />
                  <span>Sector 4 Fulfillment Hub, Civil Lines, Anand Vihar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#FF5A36] flex-shrink-0" />
                  <span>Helpline: +91 80099 22444 (8:00 AM – 10:00 PM)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF5A36] flex-shrink-0" />
                  <span>support@townkart.in</span>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Shop Departments
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link href="/shop?category=grocery" className="hover:text-white transition-colors">
                    Daily Groceries & Atta
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=fruits-vegetables" className="hover:text-white transition-colors">
                    Farm Fresh Produce
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=electronics" className="hover:text-white transition-colors">
                    Audio & Smart Devices
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=fashion" className="hover:text-white transition-colors">
                    Footwear & Lifestyle
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=beauty-personal-care" className="hover:text-white transition-colors">
                    Personal Care & Hygiene
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Customer Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Customer Services
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <Link href="/account/orders" className="hover:text-white transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/account/addresses" className="hover:text-white transition-colors">
                    Delivery Addresses
                  </Link>
                </li>
                <li>
                  <Link href="/shop?filter=flash-sale" className="hover:text-white transition-colors">
                    Active Coupons & Offers
                  </Link>
                </li>
                <li>
                  <Link href="/delivery/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Delivery Partner Portal</span>
                    <ArrowUpRight className="w-3 h-3 text-[#FF5A36]" />
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Hub Admin Control</span>
                    <ArrowUpRight className="w-3 h-3 text-[#FF5A36]" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Town Guarantee & App */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Town Trust Promise
              </h4>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#16803C]" />
                  <span>100% Genuine Products</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every item is packed in sanitary hygiene-inspected town hubs. Hassle-free doorstep returns guaranteed.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Payment Badges */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} TownKart Technologies Pvt. Ltd. All rights reserved.</p>

            {/* Payment Badges */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[11px] font-medium text-neutral-400">
                Supported Payments:
              </span>
              {["UPI (GPay, PhonePe, Paytm)", "RuPay", "Visa", "MasterCard", "Net Banking", "Cash on Delivery"].map(
                (m) => (
                  <span
                    key={m}
                    className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px] font-semibold px-2.5 py-1 rounded-md"
                  >
                    {m}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20TownKart,%20I%20need%20assistance%20with%20an%20order"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group select-none"
        aria-label="Chat on WhatsApp with TownKart support"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="text-xs font-bold hidden sm:inline group-hover:inline">
          Chat with us
        </span>
      </a>
    </>
  );
}
