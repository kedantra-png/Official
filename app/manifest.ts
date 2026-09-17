import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oordhwa Tech Solutions",
    short_name: "Oordhwa",
    description:
      "Next-gen software, web, AI and hardware IoT engineering solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#06b6d4",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
