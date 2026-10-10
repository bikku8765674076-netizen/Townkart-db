import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || user.role !== "DELIVERY_PARTNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const partner = await prisma.deliveryPartner.findUnique({ where: { userId: user.sub } });
    if (!partner) return NextResponse.json({ error: "Rider profile not found" }, { status: 404 });

    const assignments = await prisma.deliveryAssignment.findMany({
      where: { partnerId: partner.id, deliveredAt: null, failedAt: null },
      include: {
        order: {
          include: {
            items: { include: { product: { select: { name: true } } } },
            address: true,
            user: { select: { name: true, phone: true } },
          },
        },
      },
      orderBy: { assignedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assignments });
  } catch (err) {
    console.error("GET /api/delivery/orders error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
