"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { ProductCard } from "@/components/storefront/ProductCard";
import { formatPrice } from "@/lib/utils";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";

// Full local town catalog
const ALL_PRODUCTS = [
  {
    id: "wh-01",
    name: "TownKart Studio Wireless Headphones",
    slug: "townkart-studio-wireless-headphones",
    category: "Electronics",
    brand: "TownKart Originals",
    shortDescription: "Active Noise Isolation • 40Hr Battery",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    price: 1499,
    mrp: 1899,
    rating: 4.7,
    reviewCount: 126,
    stock: 42,
    isBestSeller: true,
    isNewArrival: true,
  },
  {
    id: "sw-02",
    name: "Noise ColorFit Ultra Smart Watch",
    slug: "noise-colorfit-ultra-smart-watch",
    category: "Electronics",
    brand: "Noise",
    shortDescription: "1.75\" HD Display • BT Calling • IP68",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    price: 2999,
    mrp: 4999,
    rating: 4.6,
    reviewCount: 215,
    stock: 15,
    isBestSeller: false,
    isNewArrival: true,
  },
  {
    id: "rs-02",
    name: "Men's AeroStrider Running Shoes",
    slug: "mens-aerostrider-running-shoes",
    category: "Fashion",
    brand: "TownKart Originals",
    shortDescription: "Ultra-Lightweight • Cloud Cushion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    price: 1999,
    mrp: 2999,
    rating: 4.8,
    reviewCount: 89,
    stock: 15,
    isBestSeller: false,
    isNewArrival: true,
  },
  {
    id: "wb-03",
    name: "Insulated Stainless Steel Water Bottle 1L",
    slug: "insulated-stainless-steel-water-bottle-1l",
    category: "Sports & Fitness",
    brand: "TownKart Originals",
    shortDescription: "24Hr Cold / 12Hr Hot • Grade 304 Steel",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    price: 499,
    mrp: 799,
    rating: 4.9,
    reviewCount: 310,
    stock: 120,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "bp-04",
    name: "TownCommute Anti-Theft Laptop Backpack",
    slug: "towncommute-anti-theft-laptop-backpack",
    category: "Accessories",
    brand: "TownKart Originals",
    shortDescription: "15.6\" Laptop Sleeve • Water-Resistant",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    price: 1299,
    mrp: 1999,
    rating: 4.5,
    reviewCount: 74,
    stock: 8,
    isBestSeller: false,
    isNewArrival: true,
  },
  {
    id: "sg-05",
    name: "Classic Polarized Wayfarer Sunglasses",
    slug: "classic-polarized-wayfarer-sunglasses",
    category: "Accessories",
    brand: "TownKart Originals",
    shortDescription: "UV400 Polarized • Anti-Glare",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    price: 899,
    mrp: 1499,
    rating: 4.4,
    reviewCount: 52,
    stock: 0,
    isBestSeller: false,
    isNewArrival: false,
  },
  {
    id: "wh-sony-01",
    name: "Sony WH-1000XM5 Premium ANC Headphones",
    slug: "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
    category: "Electronics",
    brand: "Sony",
    shortDescription: "Flagship ANC • 8 Mics • LDAC Hi-Res",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    price: 28999,
    mrp: 34999,
    rating: 4.8,
    reviewCount: 412,
    stock: 42,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "gr-01",
    name: "Aashirvaad Shudh Chakki Whole Wheat Atta 5kg",
    slug: "aashirvaad-shudh-chakki-whole-wheat-atta-5kg",
    category: "Grocery",
    brand: "Aashirvaad",
    shortDescription: "100% Whole Wheat • Stone Ground",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
    price: 245,
    mrp: 285,
    rating: 4.9,
    reviewCount: 1420,
    stock: 85,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "gr-02",
    name: "Amul Taaza Fresh Toned Milk 1L",
    slug: "amul-taaza-fresh-toned-milk-1l",
    category: "Grocery",
    brand: "Amul",
    shortDescription: "Fresh Toned Milk • 1L Pouch",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
    price: 52,
    mrp: 54,
    rating: 4.9,
    reviewCount: 890,
    stock: 3,
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: "gr-03",
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    slug: "fortune-sunlite-refined-sunflower-oil-1l",
    category: "Grocery",
    brand: "Fortune",
    shortDescription: "Refined Sunflower Oil • Vitamins A & D",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
    price: 142,
    mrp: 165,
    rating: 4.8,
    reviewCount: 340,
    stock: 48,
    isBestSeller: false,
    isNewArrival: false,
  },
  {
    id: "fv-01",
    name: "Farm Fresh Hybrid Tomatoes 1kg",
    slug: "farm-fresh-hybrid-tomatoes-1kg",
    category: "Fruits & Vegetables",
    brand: "Farm Fresh",
    shortDescription: "Farm Picked • Firm & Juicy",
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb7?w=800&auto=format&fit=crop&q=80",
    price: 35,
    mrp: 45,
    rating: 4.7,
    reviewCount: 220,
    stock: 40,
    isBestSeller: false,
    isNewArrival: false,
  },
  {
    id: "gr-04",
    name: "Fresh Malai Paneer 200g Block",
    slug: "fresh-malai-paneer-200g-block",
    category: "Grocery",
    brand: "Dairy Fresh",
    shortDescription: "Creamy Malai Paneer • 200g",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    price: 85,
    mrp: 95,
    rating: 4.9,
    reviewCount: 185,
    stock: 18,
    isBestSeller: false,
    isNewArrival: false,
  },
];

const CATEGORIES = [
  "All",
  "Grocery",
  "Fruits & Vegetables",
  "Electronics",
  "Fashion",
  "Sports & Fitness",
  "Accessories",
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialFilter = searchParams.get("filter") || "";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory === "grocery"
      ? "Grocery"
      : initialCategory === "electronics"
      ? "Electronics"
      : initialCategory === "fashion"
      ? "Fashion"
      : initialCategory === "fruits-vegetables"
      ? "Fruits & Vegetables"
      : "All"
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }
      // Query filter
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Filter params
      if (initialFilter === "new" && !p.isNewArrival) return false;
      if (initialFilter === "bestseller" && !p.isBestSeller) return false;
      // Price filter
      if (p.price > maxPrice) return false;
      // Stock filter
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // recommended default
    });
  }, [selectedCategory, searchQuery, sortBy, maxPrice, inStockOnly, initialFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="text-xs text-neutral-400 font-medium mb-1">
            Home / Shop / <span className="text-[#111111]">{selectedCategory}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Town Catalog ({filteredProducts.length} Products)
          </h1>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#F7F7F5] border border-neutral-200 text-xs font-bold px-3.5 py-2.5 rounded-xl"
          >
            <Filter className="w-4 h-4 text-[#FF5A36]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-[#F7F7F5] border border-neutral-200 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="bg-transparent font-bold text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          {/* Categories Filter */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-soft">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Categories
            </h3>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#FF5A36] text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-soft space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="uppercase tracking-wider text-neutral-400">Max Price</span>
              <span className="text-[#FF5A36] font-extrabold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="100"
              max="35000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#FF5A36] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-bold">
              <span>₹100</span>
              <span>₹35,000</span>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-soft">
            <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF5A36] accent-[#FF5A36]"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#F7F7F5] rounded-3xl p-8 border border-neutral-200">
              <h3 className="text-lg font-bold text-[#111111]">
                No products match your selected filters
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try widening your price range or resetting category filters to see more town essentials.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setMaxPrice(30000);
                  setInStockOnly(false);
                  setSearchQuery("");
                }}
                className="mt-4 bg-[#FF5A36] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50"
          />
          <div className="relative z-10 w-80 bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="font-extrabold text-base">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-neutral-400 mb-2">Category</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg font-semibold ${
                      selectedCategory === cat ? "bg-[#FF5A36] text-white" : "text-neutral-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Max Price</span>
                <span className="text-[#FF5A36]">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="35000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#FF5A36]"
              />
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#111111] text-white py-3 rounded-xl font-bold text-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-sm font-bold">Loading town catalog...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
