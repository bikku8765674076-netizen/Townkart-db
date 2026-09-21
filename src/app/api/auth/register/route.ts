import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  signJwt,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;

    // Check if email already taken
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      const field = existing.email === email ? "Email" : "Phone number";
      return NextResponse.json(
        { error: `${field} is already registered. Please login instead.` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash, role: "CUSTOMER" },
    });

    // Auto-login after registration
    const token = await signJwt({
      sub: user.id,
      name: user.name,
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role,
    });

    const res = NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      { status: 201 }
    );

    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(60 * 60 * 24 * 7));

    return res;
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
