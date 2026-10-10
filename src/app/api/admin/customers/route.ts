import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","ORDER_MANAGER"];

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
    const search = req.nextUrl.searchParams.get("q");

    const where: Record<string, unknown> = { role: "CUSTOMER" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, customers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where, skip: (page-1)*limit, take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, phone: true, avatar: true, createdAt: true,
          _count: { select: { orders: true } },
          orders: { select: { totalAmount: true }, where: { status: "DELIVERED" } },
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: customers, pagination: { page, limit, total, pages: Math.ceil(total/limit) } });
  } catch (err) {
    console.error("GET /api/admin/customers error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
