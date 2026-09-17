import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signJwtToken } from "@/lib/jwt";
import {
  getClientIp,
  checkAdminLoginLockout,
  recordFailedAdminLogin,
  resetAdminLoginAttempts,
} from "@/lib/rate-limit";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Check if the IP is currently locked out due to previous failed attempts
  const rateLimit = checkAdminLoginLockout(ip);
  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return NextResponse.json(
      {
        error: `Too many failed login attempts. For security, your IP is temporarily blocked. Please try again after ${minutes} minute(s).`,
        retryAfter: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  let body: { email?: string; password?: string; route?: string };
  try {
    body = await request.json();
  } catch {
    recordFailedAdminLogin(ip);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password, route } = body;

  if (!email || !password) {
    recordFailedAdminLogin(ip);
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  if (route !== "/admin") {
    recordFailedAdminLogin(ip);
    return NextResponse.json({ error: "Invalid route" }, { status: 403 });
  }

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.rpc("verify_admin_password", {
      email,
      password,
    });

    if (error) {
      console.error(
        "[admin-login] RPC error:",
        JSON.stringify({
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }),
      );
      const isMissingFn =
        error.code === "PGRST202" || error.message?.includes("does not exist");
      const isCryptMissing =
        error.message?.includes("does not exist") &&
        error.message?.includes("crypt");
      const isCryptBadHash =
        error.message?.includes("crypt") &&
        (error.message?.includes("Illegal salt") ||
          error.message?.includes("error"));
      const isNetworkError =
        error.message?.includes("fetch failed") ||
        error.message?.includes("EAI_AGAIN") ||
        (typeof error.details === "string" && error.details.includes("EAI_AGAIN"));

      if (isNetworkError) {
        return NextResponse.json(
          {
            error:
              "Unable to reach Supabase database (DNS / Network Timeout). Please check your internet connection.",
          },
          { status: 503 },
        );
      }
      if (isMissingFn) {
        return NextResponse.json(
          {
            error:
              "Admin auth not set up. Run supabase/run_all_migrations.sql in the Supabase SQL Editor.",
          },
          { status: 503 },
        );
      }
      if (isCryptMissing) {
        return NextResponse.json(
          {
            error:
              "Auth setup incomplete: run 'CREATE EXTENSION IF NOT EXISTS pgcrypto;' in Supabase SQL Editor first.",
          },
          { status: 503 },
        );
      }
      if (isCryptBadHash) {
        return NextResponse.json(
          {
            error:
              "Admin password hash is corrupted. Re-run supabase/run_all_migrations.sql to fix it.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 },
      );
    }

    if (data === true) {
      // Successful authentication clears failed attempt history for this IP
      resetAdminLoginAttempts(ip);

      const token = await signJwtToken({ email, role: "admin" }, 86400);

      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 86400, // 24 hours
      });

      return NextResponse.json({
        ok: true,
        token,
        user: { email, role: "admin" },
      });
    }

    recordFailedAdminLogin(ip);
    const postCheck = checkAdminLoginLockout(ip);
    const attemptsLeft = postCheck.remaining;
    const warningMsg =
      attemptsLeft > 0
        ? ` (${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining)`
        : " (Too many failed attempts. Your IP has been temporarily locked for 15 minutes)";

    return NextResponse.json(
      { error: `Invalid credentials${warningMsg}` },
      {
        status: 401,
        headers: {
          "X-RateLimit-Limit": String(postCheck.limit),
          "X-RateLimit-Remaining": String(attemptsLeft),
        },
      },
    );
  } catch (err: unknown) {
    console.error("[admin-login] Server error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("fetch failed") || msg.includes("EAI_AGAIN")) {
      return NextResponse.json(
        {
          error:
            "Network error connecting to Supabase. Please check your internet connection.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }
}
