import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const referer = request.headers.get("referer") ?? "";
  if (!referer.includes("/admin")) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  let body: { email?: string; password?: string; route?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password, route } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  if (route !== "/admin") {
    return NextResponse.json({ error: "Invalid route" }, { status: 403 });
  }

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.rpc("verify_admin_password", {
      email,
      password,
    });

    if (error) {
      console.error("[admin-login] RPC error:", JSON.stringify({ message: error.message, code: error.code, details: error.details, hint: error.hint }));
      const isMissingFn = error.code === "PGRST202" || error.message?.includes("does not exist");
      const isCryptMissing = error.message?.includes("does not exist") && error.message?.includes("crypt");
      const isCryptBadHash = error.message?.includes("crypt") && (error.message?.includes("Illegal salt") || error.message?.includes("error"));

      if (isMissingFn) {
        return NextResponse.json(
          { error: "Admin auth not set up. Run supabase/run_all_migrations.sql in the Supabase SQL Editor." },
          { status: 503 },
        );
      }
      if (isCryptMissing) {
        return NextResponse.json(
          { error: "Auth setup incomplete: run 'CREATE EXTENSION IF NOT EXISTS pgcrypto;' in Supabase SQL Editor first." },
          { status: 503 },
        );
      }
      if (isCryptBadHash) {
        return NextResponse.json(
          { error: "Admin password hash is corrupted. Re-run supabase/run_all_migrations.sql to fix it." },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 },
      );
    }

    if (data === true) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("[admin-login] Server error:", err);
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }
}
