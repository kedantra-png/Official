import { verifyJwtToken, AdminTokenPayload } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Verifies if the request contains a valid admin JWT token (from Authorization header or admin_token cookie).
 * Returns the decoded token payload if valid, or null if unauthorized/expired.
 */
export async function verifyAdminRequest(
  request: Request,
): Promise<AdminTokenPayload | null> {
  let token: string | null = null;

  // 1. Check Authorization header: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // 2. Fall back to admin_token cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("admin_token")?.value ?? null;
    } catch {
      // Manual cookie parsing fallback if cookies() context is unavailable
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/admin_token=([^;]+)/);
        if (match) token = match[1];
      }
    }
  }

  if (!token) {
    return null;
  }

  const payload = await verifyJwtToken<AdminTokenPayload>(token);
  if (!payload || payload.role !== "admin") {
    return null;
  }

  return payload;
}

/**
 * Middleware guard for admin API routes.
 * Returns a 401 Unauthorized response if authentication fails, or null if authorized.
 */
export async function authenticateAdminGuard(
  request: Request,
): Promise<NextResponse | null> {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 },
    );
  }
  return null; // Authorized
}
