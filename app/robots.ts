import type { MetadataRoute } from "next";

const siteUrl = "https://www.premat.com.tr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/panel-giris"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}