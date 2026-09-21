import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, SESSION_COOKIE } from "@/lib/auth";

// ─── Route groups and their required roles ────────────────────────────────────
const PROTECTED_ROUTES: Array<{ prefix: string; roles: string[] | "any" }> = [
  {
    prefix: "/admin",
    roles: [
      "SUPER_ADMIN",
      "SUPERVISOR",
      "ADMIN",
      "INVENTORY_MANAGER",
      "ORDER_MANAGER",
      "DELIVERY_MANAGER",
      "CONTENT_MANAGER",
    ],
  },
  { prefix: "/delivery", roles: ["DELIVERY_PARTNER"] },
  { prefix: "/account", roles: "any" },
  { prefix: "/checkout", roles: "any" },
  { prefix: "/orders", roles: "any" },
  { prefix: "/wishlist", roles: "any" },
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find the matching protected route
  const match = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));

  // Not a protected route — allow freely
  if (!match) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // No token — redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyJwt(token);

  // Invalid / expired token — redirect to login
  if (!payload) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  // Role check
  if (match.roles !== "any" && !match.roles.includes(payload.role)) {
    // Delivery partner trying to access admin → redirect to their app
    if (
      payload.role === "DELIVERY_PARTNER" &&
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(
        new URL("/delivery/dashboard", req.url)
      );
    }
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/delivery/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
  ],
};
