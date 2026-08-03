import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cwd = process.cwd();

    // Restore original clean oordhwa-icon.png from git
    try {
      execSync("git checkout -- public/oordhwa-icon.png", { cwd });
    } catch {
      // fallback if git command fails
    }

    const sourcePath = path.join(cwd, "public", "oordhwa-icon.png");

    if (!fs.existsSync(sourcePath)) {
      return NextResponse.json(
        { error: "Original oordhwa-icon.png not found" },
        { status: 404 },
      );
    }

    const iconBuffer = fs.readFileSync(sourcePath);

    const targets = [
      path.join(cwd, "app", "favicon.ico"),
      path.join(cwd, "app", "icon.png"),
      path.join(cwd, "app", "apple-icon.png"),
      path.join(cwd, "public", "favicon.ico"),
      path.join(cwd, "public", "icon.png"),
      path.join(cwd, "public", "apple-touch-icon.png"),
    ];

    for (const target of targets) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, iconBuffer);
    }

    // Clean up fake checkerboard image copy.png
    const fakeCopy = path.join(cwd, "public", "image copy.png");
    if (fs.existsSync(fakeCopy)) {
      fs.unlinkSync(fakeCopy);
    }

    return NextResponse.json({
      ok: true,
      count: targets.length,
      message: "Restored original clean transparent logo across all favicons and icons!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
