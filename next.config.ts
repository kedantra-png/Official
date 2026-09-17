import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

try {
  const src = path.join(process.cwd(), "assets", "default.jfif");
  const dest = path.join(process.cwd(), "public", "default.jfif");
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
} catch (e) {
  console.error("Failed to copy default.jfif to public:", e);
}

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['*.ngrok-free.app', "192.168.1.2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "njnjduztkvqnybntyalv.supabase.co",
      },
    ],
  },
};

export default nextConfig;
