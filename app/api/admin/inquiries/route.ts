import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function guardAdmin(request: Request) {
  const referer = request.headers.get("referer") ?? "";
  if (!referer.includes("/admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET /api/admin/inquiries — fetch all contact form submissions (Admin only)
export async function GET(request: Request) {
  const guard = guardAdmin(request);
  if (guard) return guard;

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("id, name, email, inquiry_type, message, status, source, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ inquiries: data ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/inquiries GET]", msg);
    return NextResponse.json({ error: "Failed to fetch contact inquiries.", inquiries: [] }, { status: 500 });
  }
}

// PATCH /api/admin/inquiries — update inquiry status (e.g. mark read or resolved)
export async function PATCH(request: Request) {
  const guard = guardAdmin(request);
  if (guard) return guard;

  let body: { id?: string; status?: "new" | "read" | "resolved" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.id || !body.status) {
    return NextResponse.json(
      { error: "id and status are required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("contact_inquiries")
      .update({ status: body.status })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ inquiry: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/inquiries PATCH]", msg);
    return NextResponse.json({ error: "Failed to update inquiry status." }, { status: 500 });
  }
}

// DELETE /api/admin/inquiries — delete an inquiry by id
export async function DELETE(request: Request) {
  const guard = guardAdmin(request);
  if (guard) return guard;

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("contact_inquiries")
      .delete()
      .eq("id", body.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/inquiries DELETE]", msg);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}
