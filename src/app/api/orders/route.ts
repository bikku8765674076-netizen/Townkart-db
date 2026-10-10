import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const jwtUser = token ? await verifyJwt(token) : null;
    if (!jwtUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { items, address, couponCode, deliveryZoneId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ error: "Delivery address required" }, { status: 400 });
    }

    // Fetch all products from DB to validate prices & stock
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true, images: { take: 1, orderBy: { displayOrder: "asc" } } },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate stock and compute server-side prices
    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p || p.status !== "ACTIVE") {
        return NextResponse.json({ error: `Product ${item.productId} is not available` }, { status: 400 });
      }
      if (item.quantity > p.stock) {
        return NextResponse.json({ error: `Insufficient stock for ${p.name}` }, { status: 400 });
      }
      if (item.quantity > p.maxOrderQty) {
        return NextResponse.json({ error: `Max ${p.maxOrderQty} units for ${p.name}` }, { status: 400 });
      }
    }

    // Server-side price computation (never trust client)
    const orderItems = items.map((item: { productId: string; variantId?: string; quantity: number }) => {
      const p = productMap.get(item.productId)!;
      let unitPrice = p.sellingPrice;
      if (item.variantId) {
        const variant = p.variants.find((v) => v.id === item.variantId);
        if (variant) unitPrice = variant.price;
      }
      return { ...item, unitPrice, totalAmount: unitPrice * item.quantity, product: p };
    });

    const subtotal = orderItems.reduce((sum: number, i: { totalAmount: number }) => sum + i.totalAmount, 0);

    // Coupon validation (server-side)
    let discount = 0;
    let couponId: string | undefined;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.active && coupon.usageCount < coupon.usageLimit && subtotal >= coupon.minOrderAmount) {
        discount = coupon.discountType === "PERCENTAGE"
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
        if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
        couponId = coupon.id;
      }
    }

    // Delivery fee from zone
    let deliveryFee = 30;
    if (deliveryZoneId) {
      const zone = await prisma.deliveryZone.findUnique({ where: { id: deliveryZoneId } });
      if (zone) {
        deliveryFee = subtotal >= zone.freeDeliveryThreshold ? 0 : zone.deliveryFee;
      }
    } else {
      deliveryFee = subtotal >= 499 ? 0 : 30;
    }

    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

    // Create or find address
    let targetAddressId: string;
    if (address.id) {
      // Use existing address — verify ownership
      const existAddr = await prisma.address.findUnique({ where: { id: address.id } });
      if (!existAddr || existAddr.userId !== jwtUser.sub) {
        return NextResponse.json({ error: "Invalid address" }, { status: 400 });
      }
      targetAddressId = address.id;
    } else {
      const newAddr = await prisma.address.create({
        data: {
          userId: jwtUser.sub,
          type: address.type ?? "HOME",
          fullName: address.fullName,
          phone: address.phone,
          houseBuilding: address.houseBuilding,
          street: address.street,
          landmark: address.landmark ?? null,
          town: address.town ?? "Civil Lines",
          state: address.state ?? "Uttar Pradesh",
          pincode: address.pincode ?? "272001",
        },
      });
      targetAddressId = newAddr.id;
    }

    const orderNumber = `TK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const deliveryOtp = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Atomic transaction: create order + deduct stock + record inventory
    const order = await prisma.$transaction(async (tx) => {
      // Deduct stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            variantId: item.variantId ?? null,
            type: "SALE_FULFILLED",
            quantity: -item.quantity,
            balanceAfter: item.product.stock - item.quantity,
            referenceType: "ORDER",
            notes: `Order ${orderNumber}`,
            createdByUserId: jwtUser.sub,
          },
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: jwtUser.sub,
          addressId: targetAddressId,
          deliveryZoneId: deliveryZoneId ?? null,
          couponId: couponId ?? null,
          status: "CONFIRMED",
          subtotal,
          discount,
          deliveryFee,
          totalAmount,
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          deliverySlot: "Today, 30–45 mins",
          deliveryOtp,
          statusHistory: {
            create: { newStatus: "CONFIRMED", reason: "Order placed by customer" },
          },
          items: {
            create: orderItems.map((item: {
              productId: string;
              variantId?: string;
              quantity: number;
              unitPrice: number;
              totalAmount: number;
              product: { name: string; images: { url: string }[] };
            }) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              productName: item.product.name,
              productImage: item.product.images[0]?.url ?? null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.totalAmount,
            })),
          },
        },
        include: { items: true, address: true },
      });

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: {
            couponId,
            userId: jwtUser.sub,
            orderId: newOrder.id,
            discountApplied: discount,
          },
        });
      }

      // Clear user cart
      const cart = await tx.cart.findFirst({ where: { userId: jwtUser.sub } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json({ success: true, data: { order, orderNumber } }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { name: true, slug: true, images: { take: 1, select: { url: true }, orderBy: { displayOrder: "asc" } } } },
          },
        },
        address: true,
      },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
