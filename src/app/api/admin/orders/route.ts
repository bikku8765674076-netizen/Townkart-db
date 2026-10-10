import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","INVENTORY_MANAGER","ORDER_MANAGER","DELIVERY_MANAGER","CONTENT_MANAGER"];

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "25");
    const status = req.nextUrl.searchParams.get("status");
    const search = req.nextUrl.searchParams.get("q");
    const dateFrom = req.nextUrl.searchParams.get("from");
    const dateTo = req.nextUrl.searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
      if (dateTo) (where.createdAt as Record<string, Date>).lte = new Date(dateTo);
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where, skip: (page-1)*limit, take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: { select: { town: true, pincode: true, houseBuilding: true, street: true } },
          items: { select: { productName: true, quantity: true, unitPrice: true } },
          assignments: {
            include: { partner: { select: { name: true, phone: true, vehicleType: true } } },
            orderBy: { assignedAt: "desc" },
            take: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: orders, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
