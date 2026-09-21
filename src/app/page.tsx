import React from "react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { HeroSection } from "@/components/storefront/HeroSection";
import { TrustBar } from "@/components/storefront/TrustBar";
import { CategorySection } from "@/components/storefront/CategorySection";
import { NewArrivalsSection } from "@/components/storefront/NewArrivalsSection";
import { BestSellersSection } from "@/components/storefront/BestSellersSection";
import { FlashSaleBanner } from "@/components/storefront/FlashSaleBanner";
import { FeaturedCollectionBanner } from "@/components/storefront/FeaturedCollectionBanner";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { BottomNav } from "@/components/storefront/BottomNav";
import { Footer } from "@/components/storefront/Footer";
import { prisma } from "@/lib/prisma";

import { ProductCardProps } from "@/components/storefront/ProductCard";

export const revalidate = 60;

export default async function HomePage() {
  let products: ProductCardProps[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        slug: true,
        sellingPrice: true,
        mrp: true,
        rating: true,
        reviewCount: true,
        stock: true,
        isBestSeller: true,
        isNewArrival: true,
        shortDescription: true,
        category: {
          select: { name: true },
        },
        brand: {
          select: { name: true },
        },
        images: {
          select: { url: true },
          orderBy: { displayOrder: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    products = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      brand: p.brand?.name,
      shortDescription: p.shortDescription || undefined,
      image:
        p.images[0]?.url ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
      price: p.sellingPrice,
      mrp: p.mrp,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
    }));
  } catch (error) {
    console.error("Error fetching products in HomePage:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <CategorySection />
        <NewArrivalsSection products={products} />
        <BestSellersSection products={products} />
        <FlashSaleBanner />
        <FeaturedCollectionBanner />
      </main>
      <Footer />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
