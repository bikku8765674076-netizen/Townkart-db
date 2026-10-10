import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { shortDescription: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: limit,
      select: {
        id: true, name: true, slug: true, sellingPrice: true, mrp: true,
        stock: true, rating: true, reviewCount: true, shortDescription: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
        images: { select: { url: true, alt: true }, take: 1, orderBy: { displayOrder: "asc" } },
      },
      orderBy: { isBestSeller: "desc" },
    });

    return NextResponse.json({ success: true, data: products, total: products.length });
  } catch (err) {
    console.error("GET /api/search error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
