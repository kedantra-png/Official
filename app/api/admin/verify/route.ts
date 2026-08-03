import { verifyAdminRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true, user: admin });
}
