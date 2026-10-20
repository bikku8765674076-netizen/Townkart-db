import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "SUPERVISOR", "ORDER_MANAGER", "DELIVERY_MANAGER"];
const ADMIN_STATUSES = ["CONFIRMED", "PROCESSING", "PACKING", "READY_FOR_PICKUP", "ASSIGNED", "CANCELLED"];
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKING", "CANCELLED"],
  PACKING: ["READY_FOR_PICKUP", "CANCELLED"],
  READY_FOR_PICKUP: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["CANCELLED"],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json() as { status?: string; reason?: string; riderId?: string };
    const status = body.status;
    const reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : null;
    const riderId = typeof body.riderId === "string" ? body.riderId : undefined;

    if (!status || !ADMIN_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id } });
      if (!order) throw new Error("ORDER_NOT_FOUND");
      if (order.status === status) return order;
      if (order.status === "CANCELLED" || order.status === "DELIVERED") {
        throw new Error("ORDER_TERMINAL");
      }
      if (!(ALLOWED_TRANSITIONS[order.status] ?? []).includes(status)) {
        throw new Error("INVALID_TRANSITION");
      }
      // Pickup, in-transit and delivery completion are controlled by the
      // assigned rider endpoint; COD requires customer OTP verification.
      if (status === "ASSIGNED" && !riderId) throw new Error("RIDER_REQUIRED");

      const changed = await tx.order.updateMany({
        where: { id, status: order.status },
        data: { status },
      });
      if (changed.count !== 1) throw new Error("ORDER_CONCURRENT_UPDATE");

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          previousStatus: order.status,
          newStatus: status,
          changedByUserId: user.sub,
          reason,
        },
      });

      if (status === "ASSIGNED" && riderId) {
        const partner = await tx.deliveryPartner.findFirst({ where: { userId: riderId } });
        if (!partner || !partner.isApproved || partner.status !== "ONLINE") throw new Error("RIDER_NOT_AVAILABLE");
        const existingAssignment = await tx.deliveryAssignment.findFirst({
          where: { orderId: id, deliveredAt: null, failedAt: null },
        });
        if (existingAssignment) throw new Error("ORDER_ALREADY_ASSIGNED");
        await tx.deliveryAssignment.create({
          data: { orderId: id, partnerId: partner.id, assignedAt: new Date() },
        });
        await tx.deliveryPartner.update({ where: { id: partner.id }, data: { status: "BUSY" } });
      }

      if (status === "CANCELLED") {
        const activeAssignments = await tx.deliveryAssignment.findMany({
          where: { orderId: id, deliveredAt: null, failedAt: null },
          select: { id: true, partnerId: true },
        });
        for (const assignment of activeAssignments) {
          await tx.deliveryAssignment.update({
            where: { id: assignment.id },
            data: { failedAt: new Date(), failureReason: "Order cancelled by store operations" },
          });
          const remaining = await tx.deliveryAssignment.count({
            where: { partnerId: assignment.partnerId, deliveredAt: null, failedAt: null },
          });
          if (remaining === 0) {
            await tx.deliveryPartner.update({ where: { id: assignment.partnerId }, data: { status: "ONLINE" } });
          }
        }
        const items = await tx.orderItem.findMany({
          where: { orderId: id },
          select: { productId: true, variantId: true, quantity: true },
        });
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true },
          });
          await tx.inventoryTransaction.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              type: "RETURN",
              quantity: item.quantity,
              balanceAfter: product?.stock ?? 0,
              referenceType: "ORDER",
              referenceId: id,
              notes: "Stock restored after order cancellation",
              createdByUserId: user.sub,
            },
          });
        }
      }

      return tx.order.findUnique({ where: { id } });
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const errors: Record<string, { status: number; message: string }> = {
      ORDER_NOT_FOUND: { status: 404, message: "Order not found." },
      ORDER_TERMINAL: { status: 409, message: "This order is already completed or cancelled." },
      CANCELLATION_TOO_LATE: { status: 409, message: "This order can no longer be cancelled after pickup." },
      COD_CONFIRMATION_REQUIRED: { status: 409, message: "Confirm COD collection with the delivery OTP before marking this order delivered." },
      ORDER_CONCURRENT_UPDATE: { status: 409, message: "The order changed in another session. Refresh and try again." },
      INVALID_TRANSITION: { status: 409, message: "That status change is not allowed. Follow the order workflow in sequence." },
      RIDER_NOT_AVAILABLE: { status: 400, message: "The selected delivery partner is offline, unavailable or not approved." },
      RIDER_REQUIRED: { status: 400, message: "Choose an approved online delivery partner before assigning this order." },
      ORDER_ALREADY_ASSIGNED: { status: 409, message: "This order already has an active delivery assignment." },
    };
    if (errors[message]) {
      return NextResponse.json({ error: errors[message].message }, { status: errors[message].status });
    }
    console.error("PATCH /api/admin/orders/[id]/status error:", err);
    return NextResponse.json({ error: "Unable to update this order right now." }, { status: 500 });
  }
}
