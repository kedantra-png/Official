import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function ensureTransparentIcons() {
  try {
    const cwd = process.cwd();
    const sourcePath = path.join(cwd, "public", "oordhwa-icon.png");
    const flagFile = path.join(cwd, ".icon-processed-v3");

    if (fs.existsSync(flagFile)) return;

    if (!fs.existsSync(sourcePath)) return;

    const image = sharp(sourcePath);
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Remove any grey/white square background pixels (R > 200, G > 200, B > 200)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (
        r > 200 &&
        g > 200 &&
        b > 200 &&
        Math.abs(r - g) < 25 &&
        Math.abs(g - b) < 25
      ) {
        data[i + 3] = 0; // 100% transparent
      }
    }

    const transparentBuffer = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .trim()
      .resize(512, 512, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    const targets = [
      path.join(cwd, "public", "oordhwa-icon.png"),
      path.join(cwd, "app", "icon.png"),
      path.join(cwd, "app", "apple-icon.png"),
      path.join(cwd, "public", "icon.png"),
      path.join(cwd, "public", "apple-touch-icon.png"),
      path.join(cwd, "public", "favicon.ico"),
      path.join(cwd, "app", "favicon.ico"),
    ];

    for (const target of targets) {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, transparentBuffer);
    }

    fs.writeFileSync(flagFile, "done");
  } catch (err) {
    console.error("Icon transparent sync error:", err);
  }
}

// Auto execute on import
ensureTransparentIcons();
