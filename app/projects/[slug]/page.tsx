import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./ProjectDetailClient";

export async function generateStaticParams() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, category, description, tags, image_url, video_url, gallery_images, features, sort_order"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !project) notFound();

  return <ProjectDetailClient project={project} />;
}
