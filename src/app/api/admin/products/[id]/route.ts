import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","INVENTORY_MANAGER","ORDER_MANAGER","DELIVERY_MANAGER","CONTENT_MANAGER"];

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = token ? await verifyJwt(token) : null;
  if (!user || !ADMIN_ROLES.includes(user.role)) return null;
  return user;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        shortDescription: body.shortDescription,
        categoryId: body.categoryId,
        brandId: body.brandId ?? null,
        sku: body.sku,
        mrp: body.mrp ? parseFloat(body.mrp) : undefined,
        sellingPrice: body.sellingPrice ? parseFloat(body.sellingPrice) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        lowStockThreshold: body.lowStockThreshold ? parseInt(body.lowStockThreshold) : undefined,
        maxOrderQty: body.maxOrderQty ? parseInt(body.maxOrderQty) : undefined,
        status: body.status,
        isFeatured: body.isFeatured,
        isNewArrival: body.isNewArrival,
        isBestSeller: body.isBestSeller,
      },
    });
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("PUT /api/admin/products/[id] error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const orderCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } });
    } else {
      await prisma.product.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
