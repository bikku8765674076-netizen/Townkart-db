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

export async function GET(req: NextRequest) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
    const search = req.nextUrl.searchParams.get("q") ?? "";
    const status = req.nextUrl.searchParams.get("status");
    const categoryId = req.nextUrl.searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    const andConditions: Record<string, unknown>[] = [{ status: { not: "ARCHIVED" } }];
    if (status) andConditions[0] = { status };
    if (categoryId) andConditions.push({ categoryId });
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      });
    }
    where.AND = andConditions;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where, skip: (page-1)*limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          brand: { select: { name: true } },
          images: { take: 1, orderBy: { displayOrder: "asc" } },
          _count: { select: { variants: true, orderItems: true } },
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!["SUPER_ADMIN","ADMIN","CONTENT_MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description, shortDescription, categoryId, brandId, sku, mrp, sellingPrice,
      stock, lowStockThreshold, maxOrderQty, status, isFeatured, isNewArrival, isBestSeller, images } = body;

    if (!name || !slug || !categoryId || !sku || mrp === undefined || sellingPrice === undefined) {
      return NextResponse.json({ error: "Missing required fields: name, slug, categoryId, sku, mrp, sellingPrice" }, { status: 400 });
    }
    if (parseFloat(sellingPrice) > parseFloat(mrp)) {
      return NextResponse.json({ error: "Selling price cannot exceed MRP" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description: description ?? "", shortDescription: shortDescription ?? null,
        categoryId, brandId: brandId ?? null, sku, mrp: parseFloat(mrp), sellingPrice: parseFloat(sellingPrice),
        stock: parseInt(stock ?? 0), lowStockThreshold: parseInt(lowStockThreshold ?? 5),
        maxOrderQty: parseInt(maxOrderQty ?? 10),
        status: status ?? "ACTIVE", isFeatured: isFeatured ?? false,
        isNewArrival: isNewArrival ?? false, isBestSeller: isBestSeller ?? false,
        images: images?.length ? { create: images.map((url: string, i: number) => ({ url, displayOrder: i+1, isPrimary: i===0 })) } : undefined,
      },
      include: { category: true, brand: true, images: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
