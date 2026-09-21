"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCart } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { formatPrice } from "@/lib/utils";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Share2,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Catalog dictionary
const PRODUCTS_DATA: Record<string, any> = {
  "townkart-studio-wireless-headphones": {
    id: "wh-01",
    name: "TownKart Studio Wireless Headphones",
    slug: "townkart-studio-wireless-headphones",
    category: "Electronics",
    brand: "TownKart Originals",
    sku: "WH-001",
    price: 1499,
    mrp: 1899,
    rating: 4.7,
    reviewCount: 126,
    stock: 42,
    description:
      "Engineered for deep acoustic immersion. Features 40mm high-res neodymium drivers, 40 hours of continuous music playback on a single charge, fast USB-C charging (10 mins gives 5 hours), and featherlight memory foam cushions for all-day comfort.",
    highlights: [
      "Active Noise Isolation with dual acoustic microphones",
      "40-Hour continuous playback on standard charge",
      "Fast Type-C charge: 10 mins gives 5 hours runtime",
      "Bluetooth 5.3 with dual-device instant pairing",
      "Integrated microphone for clear calling in noisy town traffic",
    ],
    variants: ["Midnight Black", "Pearl White", "Slate Blue"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80",
    ],
  },
  "sony-wh-1000xm5-wireless-noise-cancelling-headphones": {
    id: "wh-sony-01",
    name: "Sony WH-1000XM5 Premium Noise Cancelling Headphones",
    slug: "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
    category: "Electronics",
    brand: "Sony",
    sku: "WH-SONY-001",
    price: 28999,
    mrp: 34999,
    rating: 4.8,
    reviewCount: 412,
    stock: 42,
    description:
      "Industry-leading noise cancellation with two processors and eight microphones for unprecedented noise isolation. Specially designed 30mm driver unit with carbon fibre composite material.",
    highlights: [
      "Auto NC Optimizer automatically adjusts noise cancellation to environment",
      "Up to 30-hour battery life with quick charging (3 min charge for 3 hours)",
      "Ultra-comfortable, lightweight design with soft fit leather",
      "Multipoint connection allows pairing with two devices simultaneously",
    ],
    variants: ["Black", "Silver", "Midnight Blue"],
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
    ],
  },
  "noise-colorfit-ultra-smart-watch": {
    id: "sw-02",
    name: "Noise ColorFit Ultra Smart Watch",
    slug: "noise-colorfit-ultra-smart-watch",
    category: "Electronics",
    brand: "Noise",
    sku: "SW-002",
    price: 2999,
    mrp: 4999,
    rating: 4.6,
    reviewCount: 215,
    stock: 15,
    description:
      "1.75\" HD TruView display with 320x385 px resolution. Aluminum alloy body, 60 sports modes, continuous heart rate and SpO2 tracking, and IP68 waterproof rating.",
    highlights: [
      "1.75-inch HD TruView color display",
      "SpO2 and 24/7 Heart rate monitor",
      "60 Sports modes with fitness tracking app",
      "IP68 Water resistance suitable for swimming & workouts",
    ],
    variants: ["Space Blue", "Charcoal Black", "Rose Pink"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80",
    ],
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product =
    PRODUCTS_DATA[resolvedParams.slug] ||
    PRODUCTS_DATA["townkart-studio-wireless-headphones"];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("272206");
  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "available" | "unavailable"
  >("available");
  const [activeTab, setActiveTab] = useState<"highlights" | "reviews">("highlights");

  const discountPercent = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );
  const isWishlisted = isInWishlist(product.id);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.startsWith("272") || pincode.startsWith("226") || pincode === "110001") {
      setPincodeStatus("available");
    } else {
      setPincodeStatus("unavailable");
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        price: product.price,
        mrp: product.mrp,
        variantName: selectedVariant,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-600 font-medium mb-6">
          <Link href="/" className="hover:text-black">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="hover:text-black">
            {product.category}
          </Link>{" "}
          / <span className="text-[#111111] font-semibold">{product.name}</span>
        </div>

        {/* Product Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-square bg-[#F7F7F5] rounded-3xl overflow-hidden border border-neutral-200 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute top-4 left-4 bg-[#FF5A36] text-white text-xs font-black px-3 py-1 rounded-lg">
                -{discountPercent}% OFF
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-red-500 shadow-xs transition-colors"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-neutral-100 transition-all ${
                      selectedImage === img
                        ? "border-[#FF5A36] shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#FF5A36] uppercase tracking-wider">
                {product.brand} • {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#111111]">
                  {product.rating}
                </span>
                <span className="text-xs text-neutral-600">
                  ({product.reviewCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#F7F7F5] rounded-2xl p-4 border border-neutral-200/80">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#111111]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-base text-neutral-600 line-through">
                  {formatPrice(product.mrp)}
                </span>
                <span className="bg-[#16803C] text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Save {formatPrice(product.mrp - product.price)}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Inclusive of all town GST &amp; central taxes.
              </p>
            </div>

            {/* Variant Picker */}
            {product.variants && (
              <div>
                <span className="text-xs font-bold text-neutral-700 block mb-2">
                  Select Color / Option: <strong className="text-black">{selectedVariant}</strong>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant: string) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                        selectedVariant === variant
                          ? "border-[#FF5A36] bg-[#FF5A36]/10 text-[#FF5A36]"
                          : "border-neutral-200 hover:border-neutral-400 text-neutral-800"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buy Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-soft"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#FF5A36] hover:bg-[#e04f2e] text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-soft"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Delivery Availability Checker */}
            <div className="border border-neutral-200 rounded-2xl p-4 bg-white shadow-soft">
              <form onSubmit={handleCheckPincode} className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter your town pincode (e.g. 272206)"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl font-semibold text-[#111111] focus:outline-[#FF5A36]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#111111] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeStatus === "available" ? (
                <div className="flex items-center gap-2 text-xs text-[#16803C] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
                  <span>
                    ✓ Express local delivery available! Expected delivery:{" "}
                    <strong>Today between 5:00 PM – 8:00 PM</strong>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-red-600 font-semibold">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>
                    Sorry, delivery is currently not active in pincode {pincode}.
                  </span>
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 bg-[#F7F7F5] rounded-xl text-xs font-medium text-neutral-700">
                <Truck className="w-4 h-4 text-[#FF5A36] mx-auto mb-1" />
                <span>Town Express</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] rounded-xl text-xs font-medium text-neutral-700">
                <RotateCcw className="w-4 h-4 text-[#FF5A36] mx-auto mb-1" />
                <span>Doorstep Returns</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] rounded-xl text-xs font-medium text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-[#FF5A36] mx-auto mb-1" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Highlights / Reviews) */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <div className="flex gap-6 border-b border-neutral-200 pb-3">
            <button
              onClick={() => setActiveTab("highlights")}
              className={`text-sm font-extrabold pb-2 border-b-2 transition-colors ${
                activeTab === "highlights"
                  ? "border-[#FF5A36] text-[#FF5A36]"
                  : "border-transparent text-neutral-500 hover:text-black"
              }`}
            >
              Key Highlights &amp; Specs
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-extrabold pb-2 border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-[#FF5A36] text-[#FF5A36]"
                  : "border-transparent text-neutral-500 hover:text-black"
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === "highlights" ? (
              <div className="space-y-4 max-w-2xl text-sm text-neutral-700">
                <p className="leading-relaxed">{product.description}</p>
                <ul className="space-y-2 pt-2">
                  {product.highlights.map((h: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16803C]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                <div className="border border-neutral-200 rounded-2xl p-4 bg-[#F7F7F5]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#111111]">
                      Amit Sharma (Civil Lines)
                    </span>
                    <span className="text-xs text-neutral-600">2 days ago</span>
                  </div>
                  <div className="flex items-center text-amber-500 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600">
                    Received within 35 minutes directly from the Sector 4 hub! Sound quality is punchy and the battery easily lasts multiple days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
