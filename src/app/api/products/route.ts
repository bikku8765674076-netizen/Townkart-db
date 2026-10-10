import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const categorySlug = searchParams.get("category");
    const brandSlug = searchParams.get("brand");
    const sort = searchParams.get("sort") ?? "createdAt_desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const status = searchParams.get("status") ?? "ACTIVE";
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const newArrival = searchParams.get("newArrival");

    const where: Record<string, unknown> = { status };
    if (categorySlug) where.category = { slug: categorySlug };
    if (brandSlug) where.brand = { slug: brandSlug };
    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) (where.sellingPrice as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.sellingPrice as Record<string, number>).lte = parseFloat(maxPrice);
    }
    if (featured === "true") where.isFeatured = true;
    if (bestSeller === "true") where.isBestSeller = true;
    if (newArrival === "true") where.isNewArrival = true;

    const [sortField, sortDir] = sort.split("_");
    const orderBy: Record<string, string> = { [sortField]: sortDir };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, name: true, slug: true, sku: true,
          sellingPrice: true, mrp: true, stock: true,
          status: true, isFeatured: true, isBestSeller: true, isNewArrival: true,
          shortDescription: true, rating: true, reviewCount: true,
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true, slug: true } },
          images: { select: { url: true, alt: true }, orderBy: { displayOrder: "asc" }, take: 1 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
