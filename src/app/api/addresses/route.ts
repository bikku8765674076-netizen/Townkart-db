import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const addresses = await prisma.address.findMany({
      where: { userId: user.sub },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: addresses });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { type, fullName, phone, houseBuilding, street, landmark, town, state, pincode, isDefault } = body;
    if (!fullName || !phone || !houseBuilding || !street || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: user.sub }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.sub, type: type ?? "HOME", fullName, phone,
        houseBuilding, street, landmark: landmark ?? null,
        town: town ?? "Civil Lines", state: state ?? "Uttar Pradesh",
        pincode, isDefault: isDefault ?? false,
      },
    });
    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const addr = await prisma.address.findUnique({ where: { id } });
    if (!addr || addr.userId !== user.sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
