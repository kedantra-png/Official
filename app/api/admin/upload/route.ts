import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const referer = request.headers.get("referer") ?? "";
    const isAdmin = referer.includes("/admin");

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer or array buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}-${uuidv4()}.${ext}`;

    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.storage
      .from("project-media")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: "Upload failed. Please check file size and format." }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("project-media")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: "Internal server error during media upload." }, { status: 500 });
  }
}
