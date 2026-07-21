import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function guardAdmin(request: Request) {
  const referer = request.headers.get("referer") ?? "";
  if (!referer.includes("/admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// GET /api/admin/projects — all projects (admin view, published + unpublished)
export async function GET(request: Request) {
  const guard = guardAdmin(request);
  if (guard) return guard;

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, slug, title, category, description, tags, image_url, video_url, gallery_images, features, is_published, sort_order, created_at")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ projects: data ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json({ projects: [], warning: "Service role key not configured yet." });
    }
    console.error("[admin/projects GET]", msg);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

// POST /api/admin/projects — create a new project
export async function POST(request: Request) {
  const guard = guardAdmin(request);
  if (guard) return guard;

  let body: {
    slug?: string;
    title?: string;
    category?: string;
    description?: string;
    tags?: string[];
    image_url?: string;
    video_url?: string;
    gallery_images?: string[];
    features?: string[];
    is_published?: boolean;
    sort_order?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, category, description } = body;
  if (!title || !category || !description) {
    return NextResponse.json(
      { error: "title, category and description are required" },
      { status: 400 },
    );
  }

  // Auto-generate slug from title if not provided
  const slug =
    body.slug?.trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        slug,
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        tags: body.tags ?? [],
        image_url: body.image_url?.trim() || null,
        video_url: body.video_url?.trim() || null,
        gallery_images: body.gallery_images ?? [],
        features: body.features ?? [],
        is_published: body.is_published ?? false,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/projects POST]", msg);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

// PATCH /api/admin/projects — update project fields (full edit or toggle)
export async function PATCH(request: Request) {
  const guard = guardAdmin(request);
  if (guard) return guard;

  let body: {
    id?: string;
    is_published?: boolean;
    title?: string;
    slug?: string;
    category?: string;
    description?: string;
    tags?: string[];
    image_url?: string | null;
    video_url?: string | null;
    gallery_images?: string[];
    features?: string[];
    sort_order?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { id, ...rest } = body;
  const updateData: Record<string, unknown> = {};

  if (rest.title !== undefined) updateData.title = rest.title;
  if (rest.slug !== undefined) updateData.slug = rest.slug;
  if (rest.category !== undefined) updateData.category = rest.category;
  if (rest.description !== undefined) updateData.description = rest.description;
  if (rest.tags !== undefined) updateData.tags = rest.tags;
  if (rest.image_url !== undefined) updateData.image_url = rest.image_url;
  if (rest.video_url !== undefined) updateData.video_url = rest.video_url;
  if (rest.gallery_images !== undefined) updateData.gallery_images = rest.gallery_images;
  if (rest.features !== undefined) updateData.features = rest.features;
  if (rest.sort_order !== undefined) updateData.sort_order = rest.sort_order;
  if (rest.is_published !== undefined) updateData.is_published = rest.is_published;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/projects PATCH]", msg);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

// DELETE /api/admin/projects — delete project by id
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
      .from("projects")
      .delete()
      .eq("id", body.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/projects DELETE]", msg);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
