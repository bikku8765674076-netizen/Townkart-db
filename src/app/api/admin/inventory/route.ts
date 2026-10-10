import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","INVENTORY_MANAGER"];

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = token ? await verifyJwt(token) : null;
  if (!user || !ADMIN_ROLES.includes(user.role)) return null;
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const filter = req.nextUrl.searchParams.get("filter"); // "low" | "out" | all
    const where: Record<string, unknown> = { status: { not: "ARCHIVED" } };
    if (filter === "low") where.stock = { lte: 5, gt: 0 };
    else if (filter === "out") where.stock = { lte: 0 };

    const products = await prisma.product.findMany({
      where,
      orderBy: { stock: "asc" },
      select: {
        id: true, name: true, sku: true, stock: true, lowStockThreshold: true, status: true,
        category: { select: { name: true } },
        images: { take: 1, select: { url: true }, orderBy: { displayOrder: "asc" } },
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("GET /api/admin/inventory error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { productId, adjustment, reason } = await req.json();
    if (!productId || adjustment === undefined || !reason) {
      return NextResponse.json({ error: "productId, adjustment, and reason required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const newStock = Math.max(0, product.stock + parseInt(adjustment));
    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.product.update({
        where: { id: productId },
        data: {
          stock: newStock,
          status: newStock === 0 ? "OUT_OF_STOCK" : (product.status === "OUT_OF_STOCK" ? "ACTIVE" : product.status),
        },
      });
      await tx.inventoryTransaction.create({
        data: {
          productId, type: "ADJUSTMENT",
          quantity: parseInt(adjustment),
          balanceAfter: newStock,
          referenceType: "MANUAL_AUDIT",
          notes: reason, createdByUserId: user.sub,
        },
      });
      return p;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("POST /api/admin/inventory error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
