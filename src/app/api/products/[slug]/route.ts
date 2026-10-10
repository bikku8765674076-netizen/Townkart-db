import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true, slug: true, parent: { select: { name: true, slug: true } } } },
        brand: { select: { name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: { orderBy: { price: "asc" } },
        reviews: {
          where: { isApproved: true },
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (product.status === "ARCHIVED") return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Related products — same category, different product
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, status: "ACTIVE", id: { not: product.id } },
      take: 6,
      select: {
        id: true, name: true, slug: true, sellingPrice: true, mrp: true,
        stock: true, rating: true, reviewCount: true,
        images: { select: { url: true }, take: 1, orderBy: { displayOrder: "asc" } },
      },
    });

    return NextResponse.json({ success: true, data: { ...product, related } });
  } catch (err) {
    console.error("GET /api/products/[slug] error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
