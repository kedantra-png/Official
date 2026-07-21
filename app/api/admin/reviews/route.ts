import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function isAdminRequest(request: Request): boolean {
  const referer = request.headers.get("referer") ?? "";
  const origin = request.headers.get("origin") ?? "";
  return referer.includes("/admin") || origin.includes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
}

// GET /api/admin/reviews — fetch all customer_experiences
export async function GET(request: Request) {
  // Basic origin guard
  const referer = request.headers.get("referer") ?? "";
  if (!referer.includes("/admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("customer_experiences")
      .select("id, quote, author, role, company, image_url, is_published, source, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ reviews: data ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    // Service role key not set yet — return empty so UI doesn't crash
    if (msg.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json({ reviews: [], warning: "Service role key not configured yet." });
    }
    console.error("[admin/reviews GET]", msg);
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}

// DELETE /api/admin/reviews — delete a review by id
export async function DELETE(request: Request) {
  const referer = request.headers.get("referer") ?? "";
  if (!referer.includes("/admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
      .from("customer_experiences")
      .delete()
      .eq("id", body.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/reviews DELETE]", msg);
    return NextResponse.json({ error: "Failed to delete review." }, { status: 500 });
  }
}

// PATCH /api/admin/reviews — update a review by id
export async function PATCH(request: Request) {
  const referer = request.headers.get("referer") ?? "";
  if (!referer.includes("/admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, quote, author, role, company, image_url, is_published } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updateData: any = {};
  if (quote !== undefined) updateData.quote = quote;
  if (author !== undefined) updateData.author = author;
  if (role !== undefined) updateData.role = role;
  if (company !== undefined) updateData.company = company;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (is_published !== undefined) updateData.is_published = is_published;

  if (Object.keys(updateData).length === 0) {
     return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("customer_experiences")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ review: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/reviews PATCH]", msg);
    return NextResponse.json({ error: "Failed to update review." }, { status: 500 });
  }
}
