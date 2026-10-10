import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { BottomNav } from "@/components/storefront/BottomNav";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} | TownKart`,
    description: category.description ?? `Shop ${category.name} online on TownKart`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sub: activeSubSlug, sort = "createdAt_desc" } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
      parent: {
        include: {
          children: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
        },
      },
    },
  });

  if (!category || !category.isActive) notFound();

  // If this category is a child, its siblings and parent form the subcategories
  const mainCategory = category.parent ?? category;
  const subcategories = mainCategory.children;

  // Determine which category ID to filter by
  let targetCategoryIds: string[] = [];
  if (activeSubSlug) {
    const subCat = subcategories.find((c) => c.slug === activeSubSlug);
    if (subCat) {
      targetCategoryIds = [subCat.id];
    } else {
      targetCategoryIds = [category.id];
    }
  } else if (category.children.length > 0) {
    targetCategoryIds = [category.id, ...category.children.map((c) => c.id)];
  } else {
    targetCategoryIds = [category.id];
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: targetCategoryIds },
      status: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
    take: 40,
    select: {
      id: true,
      name: true,
      slug: true,
      sellingPrice: true,
      mrp: true,
      stock: true,
      shortDescription: true,
      category: { select: { name: true } },
      brand: { select: { name: true } },
      images: {
        take: 1,
        orderBy: { displayOrder: "asc" },
        select: { url: true },
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Left Vertical Subcategory Sidebar (Blinkit Style) */}
          {subcategories.length > 0 && (
            <aside className="w-full md:w-56 lg:w-64 border-b md:border-b-0 md:border-r border-neutral-100 bg-[#FAFAFA] flex-shrink-0">
              <div className="p-3 border-b border-neutral-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Subcategories
                </span>
                <h2 className="text-xs font-black text-[#171717] mt-0.5 truncate">
                  {mainCategory.name}
                </h2>
              </div>

              {/* Subcategories list */}
              <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible p-1.5 md:p-2 gap-1">
                <Link
                  href={`/category/${mainCategory.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                    !activeSubSlug && category.id === mainCategory.id
                      ? "bg-white text-[#0C831F] shadow-2xs font-black"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-xs flex-shrink-0">
                    🛒
                  </span>
                  <span className="truncate">All {mainCategory.name}</span>
                  {!activeSubSlug && category.id === mainCategory.id && (
                    <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0C831F] rounded-l-full" />
                  )}
                </Link>

                {subcategories.map((sub) => {
                  const isActive =
                    activeSubSlug === sub.slug || category.slug === sub.slug;
                  return (
                    <Link
                      key={sub.id}
                      href={`/category/${mainCategory.slug}?sub=${sub.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative flex-shrink-0 md:flex-shrink ${
                        isActive
                          ? "bg-white text-[#0C831F] shadow-2xs font-black"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white overflow-hidden flex items-center justify-center border border-neutral-100 flex-shrink-0">
                        {sub.image ? (
                          <Image
                            src={sub.image}
                            alt={sub.name}
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xs">📦</span>
                        )}
                      </div>
                      <span className="truncate">{sub.name}</span>
                      {isActive && (
                        <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0C831F] rounded-l-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </aside>
          )}

          {/* Right Product Grid */}
          <div className="flex-1 p-4 sm:p-6 bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div>
                <h1 className="text-base sm:text-lg font-black text-[#171717]">
                  {activeSubSlug
                    ? subcategories.find((c) => c.slug === activeSubSlug)?.name ??
                      category.name
                    : category.name}
                </h1>
                <p className="text-[11px] text-neutral-400 font-medium">
                  {products.length} products available for 10-15 min dispatch
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="text-sm font-bold text-[#171717] mb-1">
                  No products in this department yet
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Check out other fresh categories or search
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#0C831F] text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    category={product.category.name}
                    brand={product.brand?.name}
                    shortDescription={product.shortDescription ?? undefined}
                    image={
                      product.images[0]?.url ??
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80"
                    }
                    price={product.sellingPrice}
                    mrp={product.mrp}
                    stock={product.stock}
                  />
                ))}
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
