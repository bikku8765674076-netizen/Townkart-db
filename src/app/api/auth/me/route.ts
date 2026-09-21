import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyJwt } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  return NextResponse.json({
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    avatar: payload.avatar,
  });
}
