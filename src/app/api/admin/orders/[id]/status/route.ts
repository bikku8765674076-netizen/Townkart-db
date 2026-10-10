import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR","ORDER_MANAGER","DELIVERY_MANAGER"];
const VALID_STATUSES = ["CONFIRMED","PROCESSING","PACKING","READY_FOR_PICKUP","ASSIGNED","PICKED_UP","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status, reason, riderId } = await req.json();

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({ where: { id }, data: { status } });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          previousStatus: order.status,
          newStatus: status,
          changedByUserId: user.sub,
          reason: reason ?? null,
        },
      });

      if (status === "ASSIGNED" && riderId) {
        const partner = await tx.deliveryPartner.findFirst({ where: { userId: riderId } });
        if (partner) {
          await tx.deliveryAssignment.create({
            data: { orderId: id, partnerId: partner.id, assignedAt: new Date() },
          });
        }
      }

      if (status === "CANCELLED" && order.status !== "CANCELLED") {
        const items = await tx.orderItem.findMany({ where: { orderId: id } });
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({ where: { id }, data: { paymentStatus: "FAILED" } });
      }

      if (status === "DELIVERED") {
        await tx.order.update({ where: { id }, data: { paymentStatus: "PAID" } });
        const assignment = await tx.deliveryAssignment.findFirst({
          where: { orderId: id }, orderBy: { assignedAt: "desc" },
        });
        if (assignment) {
          await tx.deliveryAssignment.update({
            where: { id: assignment.id },
            data: { deliveredAt: new Date(), codCollected: true },
          });
        }
      }

      return updatedOrder;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/admin/orders/[id]/status error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
