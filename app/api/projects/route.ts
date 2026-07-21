import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/projects — public route, returns only published projects
// Uses anon key; RLS policy `projects_select_public` allows this.
export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, slug, title, category, description, tags, image_url, video_url, gallery_images, features, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ projects: data ?? [] });
  } catch (err) {
    console.error("[/api/projects GET]", err);
    return NextResponse.json({ projects: [] });
  }
}
