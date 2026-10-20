import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

async function getDeliveryPartner() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const user = token ? await verifyJwt(token) : null;
  if (!user || user.role !== "DELIVERY_PARTNER") return null;
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId: user.sub } });
  if (!partner || !partner.isApproved) return null;
  return { user, partner };
}

export async function GET() {
  try {
    const context = await getDeliveryPartner();
    if (!context) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const assignments = await prisma.deliveryAssignment.findMany({
      where: { partnerId: context.partner.id, deliveredAt: null, failedAt: null },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            subtotal: true,
            discount: true,
            deliveryFee: true,
            totalAmount: true,
            paymentMethod: true,
            paymentStatus: true,
            deliverySlot: true,
            createdAt: true,
            items: {
              select: {
                productName: true,
                quantity: true,
                unitPrice: true,
                totalAmount: true,
                product: { select: { name: true } },
              },
            },
            address: {
              select: {
                fullName: true,
                phone: true,
                houseBuilding: true,
                street: true,
                landmark: true,
                town: true,
                state: true,
                pincode: true,
                latitude: true,
                longitude: true,
              },
            },
            user: { select: { name: true, phone: true } },
          },
        },
      },
      orderBy: { assignedAt: "desc" },
    });

    // Do not expose deliveryOtp to a rider before the customer provides it.
    return NextResponse.json({ success: true, data: assignments });
  } catch (err) {
    console.error("GET /api/delivery/orders error:", err);
    return NextResponse.json({ error: "Unable to load assigned deliveries." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const context = await getDeliveryPartner();
    if (!context) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json() as { orderId?: string; status?: string; otp?: string };
    if (typeof body.orderId !== "string" || !body.orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }
    if (!["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"].includes(body.status ?? "")) {
      return NextResponse.json({ error: "Invalid delivery status." }, { status: 400 });
    }

    const assignment = await prisma.deliveryAssignment.findFirst({
      where: {
        orderId: body.orderId,
        partnerId: context.partner.id,
        deliveredAt: null,
        failedAt: null,
      },
      include: { order: true },
    });
    if (!assignment) {
      return NextResponse.json({ error: "This order is not assigned to your account." }, { status: 404 });
    }

    const order = assignment.order;
    const status = body.status!;
    if (status === "PICKED_UP" && !["ASSIGNED", "READY_FOR_PICKUP"].includes(order.status)) {
      return NextResponse.json({ error: "This order is not ready for pickup." }, { status: 409 });
    }
    if (status === "OUT_FOR_DELIVERY" && order.status !== "PICKED_UP") {
      return NextResponse.json({ error: "Mark the order as picked up first." }, { status: 409 });
    }
    if (status === "DELIVERED") {
      if (order.status !== "OUT_FOR_DELIVERY") {
        return NextResponse.json({ error: "This order is not out for delivery." }, { status: 409 });
      }
      if (typeof body.otp !== "string" || !/^\\d{6}$/.test(body.otp) || body.otp !== order.deliveryOtp) {
        return NextResponse.json({ error: "The delivery OTP is invalid." }, { status: 400 });
      }
      if (order.paymentMethod !== "COD" && order.paymentStatus !== "PAID") {
        return NextResponse.json({ error: "Payment has not been confirmed for this order." }, { status: 409 });
      }
    }

    try {
      const updated = await prisma.$transaction(async (tx) => {
        const changed = await tx.order.updateMany({
          where: { id: order.id, status: order.status },
          data: {
            status,
            ...(status === "DELIVERED" && order.paymentMethod === "COD" ? { paymentStatus: "PAID" } : {}),
          },
        });
        if (changed.count !== 1) throw new Error("ORDER_CONCURRENT_UPDATE");

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            previousStatus: order.status,
            newStatus: status,
            changedByUserId: context.user.sub,
            reason: status === "DELIVERED" ? "Customer OTP verified at handoff" : "Updated by assigned delivery partner",
          },
        });

        await tx.deliveryAssignment.update({
          where: { id: assignment.id },
          data: {
            ...(status === "PICKED_UP" ? { acceptedAt: assignment.acceptedAt ?? new Date(), pickedUpAt: new Date() } : {}),
            ...(status === "DELIVERED" ? { deliveredAt: new Date(), codCollected: order.paymentMethod === "COD" } : {}),
          },
        });

        if (status === "DELIVERED") {
          await tx.deliveryPartner.update({
            where: { id: context.partner.id },
            data: {
              totalDeliveries: { increment: 1 },
              todayEarnings: { increment: assignment.partnerEarning },
              status: "ONLINE",
            },
          });
        } else if (status === "PICKED_UP") {
          await tx.deliveryPartner.update({
            where: { id: context.partner.id },
            data: { status: "BUSY" },
          });
        }

        return tx.order.findUnique({
          where: { id: order.id },
          select: { id: true, orderNumber: true, status: true, paymentMethod: true, paymentStatus: true },
        });
      });
      return NextResponse.json({ success: true, data: updated });
    } catch (err) {
      if (err instanceof Error && err.message === "ORDER_CONCURRENT_UPDATE") {
        return NextResponse.json({ error: "This order changed in another session. Refresh and try again." }, { status: 409 });
      }
      throw err;
    }
  } catch (err) {
    console.error("PATCH /api/delivery/orders error:", err);
    return NextResponse.json({ error: "Unable to update this delivery right now." }, { status: 500 });
  }
}
