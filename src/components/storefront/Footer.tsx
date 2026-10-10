"use client";

import React from "react";
import Link from "next/link";
import { Share2, Globe, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  const usefulLinksCol1 = [
    { label: "About TownKart", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQs & Help Center", href: "/faqs" },
    { label: "Security & Trust", href: "/security" },
    { label: "Contact Helpline", href: "/contact" },
  ];

  const usefulLinksCol2 = [
    { label: "Partner with Us", href: "/partner" },
    { label: "Town Franchise", href: "/franchise" },
    { label: "Local Farmer Seller", href: "/seller" },
    { label: "Dark Store Hubs", href: "/warehouse" },
    { label: "Deliver as Rider", href: "/deliver" },
    { label: "Town Resources", href: "/resources" },
  ];

  const usefulLinksCol3 = [
    { label: "Express Recipes", href: "/recipes" },
    { label: "Town Bistro", href: "/bistro" },
    { label: "Town Ward Map", href: "/district" },
    { label: "Feeding Towns", href: "/community" },
  ];

  const categoryCol1 = [
    "Bath & Body",
    "Beauty & Cosmetics",
    "Health & Pharma",
    "Atta, Rice & Dal",
    "Bakery & Biscuits",
    "Kitchenware & Tools",
    "Cold Drinks & Juices",
    "Sauces & Spreads",
    "Home & Lifestyle",
    "Stationery & Books",
  ];

  const categoryCol2 = [
    "Hair Care",
    "Feminine Hygiene",
    "Personal Wellness",
    "Oil, Ghee & Masala",
    "Dry Fruits & Cereals",
    "Chips & Munchies",
    "Tea, Coffee & Drinks",
    "Paan Corner",
    "Cleaners & Sprays",
    "Office Essentials",
  ];

  const categoryCol3 = [
    "Skin & Face",
    "Baby Care Essentials",
    "Vegetables & Fruits",
    "Dairy, Bread & Eggs",
    "Fresh Protein & Fish",
    "Sweets & Chocolates",
    "Instant Food & Noodles",
    "Ice Creams & Frozen",
    "Electronics & Cords",
    "Town Gift Hampers",
  ];

  return (
    <footer className="bg-white border-t border-neutral-200 pt-12 pb-16 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-200">
          {/* Useful Links Column */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-sm font-black text-[#171717]">Useful Links</h4>
            <div className="grid grid-cols-3 gap-3 text-xs font-medium">
              <ul className="space-y-2">
                {usefulLinksCol1.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-[#0C831F] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {usefulLinksCol2.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-[#0C831F] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {usefulLinksCol3.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-[#0C831F] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Categories Columns */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-[#171717]">Categories</h4>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#0C831F] hover:underline"
              >
                see all
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs font-medium">
              <ul className="space-y-2">
                {categoryCol1.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/search?q=${encodeURIComponent(c)}`}
                      className="hover:text-[#0C831F] transition-colors"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {categoryCol2.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/search?q=${encodeURIComponent(c)}`}
                      className="hover:text-[#0C831F] transition-colors"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {categoryCol3.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/search?q=${encodeURIComponent(c)}`}
                      className="hover:text-[#0C831F] transition-colors"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Download app & Trust Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-neutral-500 font-medium text-center md:text-left">
            © TownKart Technologies Private Limited, 2026. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-xs font-bold text-neutral-700">
              Download App
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-[#111111] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                App Store
              </span>
              <span className="bg-[#111111] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                Google Play
              </span>
            </div>

            <div className="flex items-center gap-2 ml-2 text-neutral-700">
              <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer" title="Town Express">
                <Globe className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer" title="Verified Safe">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer" title="Made for Town">
                <Heart className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-neutral-400 mt-6 text-center md:text-left leading-relaxed">
          &quot;TownKart&quot; is owned and managed by TownKart Technologies Private Limited. Delivering everyday essentials to your doorstep with 10-15 minute dispatch. Cash on Delivery (COD) only.
        </p>
      </div>
    </footer>
  );
}
