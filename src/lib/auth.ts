import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "tk_session";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || "townkart_secret_key_production_grade_jwt_2026";
  return new TextEncoder().encode(secret);
};

export interface JwtPayload {
  sub: string; // user id
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  iat?: number;
  exp?: number;
}

/** Sign a JWT — valid for 7 days */
export async function signJwt(payload: Omit<JwtPayload, "iat" | "exp">) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

/** Verify a JWT — returns payload or null on failure */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

/** Hash a plain-text password */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/** Compare plain-text password against stored hash */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Cookie options — shared across login/logout routes */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
