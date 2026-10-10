import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","INVENTORY_MANAGER","ORDER_MANAGER","DELIVERY_MANAGER","CONTENT_MANAGER"];

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayOrders, pendingOrders, processingOrders, outForDelivery, delivered, cancelled,
      gmvResult, lowStock, totalCustomers, totalProducts] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.count({ where: { status: { in: ["PROCESSING","PACKING"] } } }),
      prisma.order.count({ where: { status: { in: ["ASSIGNED","PICKED_UP","OUT_FOR_DELIVERY"] } } }),
      prisma.order.count({ where: { status: "DELIVERED", createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { status: "CANCELLED", createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({ where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } }, _sum: { totalAmount: true, discount: true, deliveryFee: true } }),
      prisma.product.findMany({ where: { stock: { lte: 5 }, status: "ACTIVE" }, select: { id: true, name: true, stock: true, lowStockThreshold: true }, take: 10 }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { status: "ACTIVE" } }),
    ]);

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true, orderNumber: true, status: true, totalAmount: true, createdAt: true,
        user: { select: { name: true } },
        items: { select: { productName: true }, take: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        todayOrders, pendingOrders, processingOrders, outForDelivery,
        delivered, cancelled,
        gmv: gmvResult._sum.totalAmount ?? 0,
        discountsGranted: gmvResult._sum.discount ?? 0,
        deliveryFees: gmvResult._sum.deliveryFee ?? 0,
        lowStock, totalCustomers, totalProducts, recentOrders,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
