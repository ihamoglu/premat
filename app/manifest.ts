import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Premat",
    short_name: "Premat",
    description:
      "Matematik için düzenli, seçili ve güvenilir döküman arşivi.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fbff",
    theme_color: "#295c9c",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
