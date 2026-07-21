import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, type } = body as Record<string, unknown>;

  const cleanEmail = String(email ?? "").trim();
  const cleanMessage = String(message ?? "").trim();
  const rawName = String(name ?? "").trim();
  const cleanName = rawName || (cleanEmail ? cleanEmail.split("@")[0] : "Website Visitor");
  const inquiryType = ["feedback", "query", "complaint"].includes(String(type ?? ""))
    ? String(type)
    : "query";

  if (!cleanMessage || cleanMessage.length < 5) {
    return NextResponse.json(
      { error: "Please enter a valid message (at least 5 characters)." },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase.from("contact_inquiries").insert({
      name: cleanName,
      email: cleanEmail || null,
      inquiry_type: inquiryType,
      message: cleanMessage,
      source: "website",
      user_agent: request.headers.get("user-agent"),
      page_path:
        request.headers.get("referer") ??
        request.headers.get("x-page-path") ??
        null,
      status: "new",
    });

    if (error) {
      console.error("[contact] Supabase insert failed:", error.message);
      return NextResponse.json(
        {
          error:
            "Unable to save your message right now. Please try again shortly.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[contact] Server error:", err);
    return NextResponse.json(
      { error: "Server configuration error. Contact support." },
      { status: 500 },
    );
  }
}
