import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Pass-through /admin request so app/admin/page.tsx can render the 404 screen with the login modal
  // All backend API routes under /api/admin/* remain strictly protected with 401 guards.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
