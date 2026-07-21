import { mapRowToCard } from "@/lib/customer-experiences";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CustomerExperienceRow } from "@/lib/types/customer-experience";
import { validateCustomerExperienceForm } from "@/lib/validation/customer-experience";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("customer_experiences")
      .select("id, quote, author, role, company, image_url, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[customer-experiences] Supabase select failed:", error.message);
      return NextResponse.json(
        { error: "Unable to load experiences at this time.", experiences: [] },
        { status: 503 },
      );
    }

    const experiences = (data ?? []).map(mapRowToCard);

    return NextResponse.json({ experiences });
  } catch (err) {
    console.error("[customer-experiences] Server error:", err);
    return NextResponse.json(
      { error: "Server configuration error. Contact support.", experiences: [] },
      { status: 500 },
    );
  }
}

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

  const { quote, author, role, company, image_url } = body as Record<
    string,
    unknown
  >;

  const validated = validateCustomerExperienceForm(
    {
      quote: String(quote ?? ""),
      author: String(author ?? ""),
      role: role != null ? String(role) : undefined,
      company: company != null ? String(company) : undefined,
      image_url: image_url != null ? String(image_url) : undefined,
    },
    {
      userAgent: request.headers.get("user-agent"),
      pagePath:
        request.headers.get("referer") ??
        request.headers.get("x-page-path") ??
        null,
    },
  );

  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("customer_experiences")
      .insert({
        quote: validated.data.quote,
        author: validated.data.author,
        role: validated.data.role,
        company: validated.data.company,
        image_url: validated.data.image_url,
        source: validated.data.source,
        user_agent: validated.data.user_agent,
        page_path: validated.data.page_path,
        is_published: true,
      })
      .select("id, quote, author, role, company, image_url")
      .single();

    if (error || !data) {
      console.error(
        "[customer-experiences] Supabase insert failed:",
        error?.message,
      );
      return NextResponse.json(
        {
          error:
            "Unable to save your experience right now. Please try again shortly.",
        },
        { status: 500 },
      );
    }

    const experience = mapRowToCard(data as CustomerExperienceRow);

    return NextResponse.json({ ok: true, experience }, { status: 201 });
  } catch (err) {
    console.error("[customer-experiences] Server error:", err);
    return NextResponse.json(
      { error: "Server configuration error. Contact support." },
      { status: 500 },
    );
  }
}
