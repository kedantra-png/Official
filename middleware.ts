import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin portal page routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    const payload = token ? verifyJwtToken(token) : null;

    // If not authenticated as admin, rewrite to 404 so admin portal files/code are NOT served
    if (!payload || payload.role !== "admin") {
      return NextResponse.rewrite(new URL("/404", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
