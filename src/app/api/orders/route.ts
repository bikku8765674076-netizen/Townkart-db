import { randomBytes, randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

type CheckoutItem = { productId: string; variantId?: string; quantity: number };
type CheckoutAddress = {
  id?: string;
  type?: string;
  fullName?: string;
  phone?: string;
  houseBuilding?: string;
  street?: string;
  landmark?: string | null;
  town?: string;
  state?: string;
  pincode?: string;
};

function checkoutError(message: string): Error {
  return new Error("CHECKOUT_CONFLICT:" + message);
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const jwtUser = token ? await verifyJwt(token) : null;
    if (!jwtUser) {
      return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
    }

    const body = await req.json() as {
      items?: unknown;
      address?: CheckoutAddress;
      couponCode?: string;
      deliveryZoneId?: string;
    };
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 100) {
      return NextResponse.json({ error: "Add valid items before placing your order." }, { status: 400 });
    }
    const address = body.address;
    if (!address || typeof address !== "object") {
      return NextResponse.json({ error: "Delivery address required." }, { status: 400 });
    }

    // Normalize duplicate lines before validating quantities. This prevents a
    // client from bypassing per-product limits by submitting the same SKU twice.
    const normalized = new Map<string, CheckoutItem>();
    for (const raw of body.items) {
      if (!raw || typeof raw !== "object") {
        return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
      }
      const item = raw as Partial<CheckoutItem>;
      if (
        typeof item.productId !== "string" ||
        !item.productId ||
        !Number.isSafeInteger(item.quantity) ||
        (item.quantity as number) < 1 ||
        (item.quantity as number) > 1000 ||
        (item.variantId !== undefined && typeof item.variantId !== "string")
      ) {
        return NextResponse.json({ error: "Invalid product or quantity." }, { status: 400 });
      }
      const variantId = item.variantId || undefined;
      const key = item.productId + ":" + (variantId || "");
      const previous = normalized.get(key);
      normalized.set(key, {
        productId: item.productId,
        variantId,
        quantity: (previous?.quantity ?? 0) + (item.quantity as number),
      });
    }
    const items = [...normalized.values()];
    const quantityByProduct = new Map<string, number>();
    for (const item of items) {
      quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) ?? 0) + item.quantity);
    }

    const productIds = [...new Set(items.map((item) => item.productId))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        variants: true,
        images: { take: 1, orderBy: { displayOrder: "asc" } },
      },
    });
    const productMap = new Map(dbProducts.map((product) => [product.id, product]));

    for (const [productId, quantity] of quantityByProduct) {
      const product = productMap.get(productId);
      if (!product || product.status !== "ACTIVE") {
        return NextResponse.json({ error: "One or more products are no longer available." }, { status: 409 });
      }
      if (quantity > product.maxOrderQty) {
        return NextResponse.json({ error: "Maximum quantity for " + product.name + " is " + product.maxOrderQty + "." }, { status: 400 });
      }
      if (quantity > product.stock) {
        return NextResponse.json({ error: "Insufficient stock for " + product.name + "." }, { status: 409 });
      }
    }

    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const variant = item.variantId ? product.variants.find((candidate) => candidate.id === item.variantId) : undefined;
      if (item.variantId && !variant) {
        throw checkoutError("A selected product option is no longer available. Refresh your cart.");
      }
      if (variant && item.quantity > variant.stock) {
        throw checkoutError("Insufficient stock for " + product.name + " (" + variant.name + ").");
      }
      const unitPrice = variant ? variant.price : product.sellingPrice;
      return {
        ...item,
        unitPrice,
        totalAmount: unitPrice * item.quantity,
        product,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalAmount, 0);
    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json({ error: "The order total is invalid." }, { status: 400 });
    }

    let discount = 0;
    let couponId: string | undefined;
    if (body.couponCode) {
      const code = body.couponCode.trim().toUpperCase();
      if (code.length > 80) {
        return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
      }
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      if (coupon && coupon.active && coupon.usageCount < coupon.usageLimit && subtotal >= coupon.minOrderAmount) {
        discount = coupon.discountType === "PERCENTAGE"
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
        if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
        discount = Math.max(0, Math.min(subtotal, discount));
        couponId = coupon.id;
      }
    }

    let deliveryFee = 30;
    if (body.deliveryZoneId) {
      const zone = await prisma.deliveryZone.findUnique({ where: { id: body.deliveryZoneId } });
      if (!zone) {
        return NextResponse.json({ error: "Selected delivery area is unavailable. Choose another area." }, { status: 400 });
      }
      deliveryFee = subtotal >= zone.freeDeliveryThreshold ? 0 : zone.deliveryFee;
    } else {
      deliveryFee = subtotal >= 499 ? 0 : 30;
    }
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

    let targetAddressId: string | undefined;
    if (address.id) {
      const existingAddress = await prisma.address.findUnique({ where: { id: address.id } });
      if (!existingAddress || existingAddress.userId !== jwtUser.sub) {
        return NextResponse.json({ error: "Invalid delivery address." }, { status: 400 });
      }
      targetAddressId = address.id;
    } else {
      const digits = typeof address.phone === "string" ? address.phone.replace(/\\D/g, "") : "";
      const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
      if (
        typeof address.fullName !== "string" || address.fullName.trim().length < 2 ||
        !/^[6-9]\\d{9}$/.test(phone) ||
        typeof address.houseBuilding !== "string" || !address.houseBuilding.trim() ||
        typeof address.street !== "string" || !address.street.trim() ||
        typeof address.pincode !== "string" || !/^\\d{6}$/.test(address.pincode)
      ) {
        return NextResponse.json({ error: "Enter a valid name, Indian mobile number, complete address and six-digit PIN code." }, { status: 400 });
      }
    }

    const orderNumber = "TK-" + Date.now().toString(36).toUpperCase() + "-" + randomBytes(3).toString("hex").toUpperCase();
    const deliveryOtp = String(randomInt(100000, 1000000));

    const order = await prisma.$transaction(async (tx) => {
      // Conditional stock decrements are the concurrency guard: only one
      // checkout can claim the remaining units, even when requests race.
      for (const [productId, quantity] of quantityByProduct) {
        const result = await tx.product.updateMany({
          where: { id: productId, status: "ACTIVE", stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (result.count !== 1) {
          const product = productMap.get(productId);
          throw checkoutError("Insufficient stock for " + (product?.name ?? "a product") + ". Refresh your cart.");
        }
        const updatedProduct = await tx.product.findUnique({
          where: { id: productId },
          select: { stock: true },
        });
        await tx.inventoryTransaction.create({
          data: {
            productId,
            type: "SALE_RESERVED",
            quantity: -quantity,
            balanceAfter: updatedProduct?.stock ?? 0,
            referenceType: "ORDER",
            notes: "Order " + orderNumber,
            createdByUserId: jwtUser.sub,
          },
        });
      }

      // Variant stock is also checked and reserved atomically where variants are used.
      for (const item of orderItems) {
        if (!item.variantId) continue;
        const variantResult = await tx.productVariant.updateMany({
          where: { id: item.variantId, productId: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (variantResult.count !== 1) {
          throw checkoutError("The selected option for " + item.product.name + " just sold out. Refresh your cart.");
        }
      }

      if (couponId) {
        const couponResult = await tx.coupon.updateMany({
          where: { id: couponId, active: true, usageCount: { lt: (await tx.coupon.findUnique({ where: { id: couponId } }))?.usageLimit ?? 0 } },
          data: { usageCount: { increment: 1 } },
        });
        if (couponResult.count !== 1) {
          throw checkoutError("That coupon has just reached its usage limit. Remove it and try again.");
        }
      }

      if (!targetAddressId) {
        const digits = (address.phone as string).replace(/\\D/g, "");
        const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
        const newAddress = await tx.address.create({
          data: {
            userId: jwtUser.sub,
            type: ["HOME", "WORK", "OTHER"].includes(address.type ?? "") ? address.type! : "HOME",
            fullName: (address.fullName as string).trim(),
            phone,
            houseBuilding: (address.houseBuilding as string).trim(),
            street: (address.street as string).trim(),
            landmark: typeof address.landmark === "string" ? address.landmark.trim() || null : null,
            town: typeof address.town === "string" && address.town.trim() ? address.town.trim() : "Siddharth Nagar",
            state: typeof address.state === "string" && address.state.trim() ? address.state.trim() : "Uttar Pradesh",
            pincode: address.pincode as string,
          },
        });
        targetAddressId = newAddress.id;
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: jwtUser.sub,
          addressId: targetAddressId,
          deliveryZoneId: body.deliveryZoneId ?? null,
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
            create: orderItems.map((item) => ({
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

      if (couponId) {
        await tx.couponUsage.create({
          data: {
            couponId,
            userId: jwtUser.sub,
            orderId: newOrder.id,
            discountApplied: discount,
          },
        });
      }

      const cart = await tx.cart.findFirst({ where: { userId: jwtUser.sub } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // Return the OTP only in the authenticated order response. Do not place it
    // in the URL, where it could leak through browser history or referrer logs.
    return NextResponse.json({
      success: true,
      data: { order: { ...order, deliveryOtp: undefined }, orderNumber },
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.startsWith("CHECKOUT_CONFLICT:")) {
      return NextResponse.json({ error: message.slice("CHECKOUT_CONFLICT:".length) }, { status: 409 });
    }
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Unable to place your order right now. Please try again." }, { status: 500 });
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
            product: {
              select: {
                name: true,
                slug: true,
                images: { take: 1, select: { url: true }, orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
        address: true,
      },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ error: "Unable to load orders right now." }, { status: 500 });
  }
}
