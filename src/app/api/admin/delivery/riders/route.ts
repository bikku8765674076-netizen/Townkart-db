import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","DELIVERY_MANAGER"];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const riders = await prisma.deliveryPartner.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, phone: true, avatar: true } },
        _count: { select: { assignments: true } },
        assignments: {
          where: { deliveredAt: null, failedAt: null },
          select: { id: true, orderId: true },
        },
      },
    });
    return NextResponse.json({ success: true, data: riders });
  } catch (err) {
    console.error("GET /api/admin/delivery/riders error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
