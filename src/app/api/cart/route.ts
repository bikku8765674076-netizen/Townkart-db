import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

async function getAuthUser(req: NextRequest) {
  void req; // unused but kept for signature consistency
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: true, data: [] });

    const cart = await prisma.cart.findFirst({
      where: { userId: user.sub },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true, name: true, slug: true, sellingPrice: true, mrp: true,
                stock: true, status: true, maxOrderQty: true,
                images: { select: { url: true }, take: 1, orderBy: { displayOrder: "asc" } },
              },
            },
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: cart?.items ?? [] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, variantId, quantity } = await req.json();
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Product not available" }, { status: 400 });
    }
    if (quantity > product.stock) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }
    if (quantity > product.maxOrderQty) {
      return NextResponse.json({ error: `Max ${product.maxOrderQty} per order` }, { status: 400 });
    }

    let cart = await prisma.cart.findFirst({ where: { userId: user.sub } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.sub } });
    }

    // Upsert cart item
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: Math.min(existing.quantity + quantity, product.maxOrderQty) },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, variantId: variantId ?? undefined, quantity },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
