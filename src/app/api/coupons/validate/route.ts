import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const user = token ? await verifyJwt(token) : null;

    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ error: "Coupon code required" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 400 });
    }

    const now = new Date();
    if (coupon.startDate > now) return NextResponse.json({ error: "Coupon not yet active" }, { status: 400 });
    if (coupon.endDate && coupon.endDate < now) return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    if (coupon.usageCount >= coupon.usageLimit) return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json({ error: `Minimum order ₹${coupon.minOrderAmount} required` }, { status: 400 });
    }

    if (user) {
      const userUsage = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId: user.sub } });
      if (userUsage >= coupon.perUserLimit) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
      }
      if (coupon.isFirstOrder) {
        const orderCount = await prisma.order.count({ where: { userId: user.sub } });
        if (orderCount > 0) {
          return NextResponse.json({ error: "This coupon is for first orders only" }, { status: 400 });
        }
      }
    }

    let discount = coupon.discountType === "PERCENTAGE"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      success: true,
      data: {
        couponId: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.round(discount * 100) / 100,
      },
    });
  } catch (err) {
    console.error("POST /api/coupons/validate error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
