import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "premat",
    short_name: "premat",
    description:
      "Matematik için düzenli, seçili ve güvenilir döküman arşivi.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fbff",
    theme_color: "#295c9c",
    icons: [
      {
        src: "/brand/logo-square.png",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}