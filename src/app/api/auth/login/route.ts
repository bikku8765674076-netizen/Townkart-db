import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  comparePassword,
  signJwt,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signJwt({
      sub: user.id,
      name: user.name,
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role,
      avatar: user.avatar ?? undefined,
    });

    // Build response with httpOnly cookie
    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    });

    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(60 * 60 * 24 * 7));

    return res;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
