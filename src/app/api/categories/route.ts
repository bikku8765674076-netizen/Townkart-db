import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
          select: { id: true, name: true, slug: true, image: true, displayOrder: true },
        },
        _count: { select: { products: { where: { status: "ACTIVE" } } } },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
