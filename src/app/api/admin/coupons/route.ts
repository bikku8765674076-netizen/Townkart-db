import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN","ADMIN","SUPERVISOR"];

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = token ? await verifyJwt(token) : null;
  if (!user || !ADMIN_ROLES.includes(user.role)) return null;
  return user;
}

export async function GET() {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { usages: true } } },
    });
    return NextResponse.json({ success: true, data: coupons });
  } catch (err) {
    console.error("GET /api/admin/coupons error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { code, description, discountType, discountValue, minOrderAmount,
      maxDiscountAmount, endDate, usageLimit, perUserLimit, isFirstOrder } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "code, discountType, discountValue required" }, { status: 400 });
    }

    // Check for duplicate code
    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });
    if (existing) return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount ?? 0),
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        endDate: endDate ? new Date(endDate) : null,
        usageLimit: parseInt(usageLimit ?? 1000),
        perUserLimit: parseInt(perUserLimit ?? 1),
        isFirstOrder: isFirstOrder ?? false,
        active: true,
      },
    });
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/coupons error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id, active } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const coupon = await prisma.coupon.update({ where: { id }, data: { active } });
    return NextResponse.json({ success: true, data: coupon });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
