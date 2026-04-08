import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getPublishedDocumentsForSitemap } from "@/lib/server-documents";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getPublishedDocumentsForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/documents"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/sinif/5"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/sinif/6"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/sinif/7"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/sinif/8"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/kocluk"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/ogretmen"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const documentRoutes: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: absoluteUrl(`/documents/${doc.slug}`),
    lastModified: new Date(doc.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...documentRoutes];
}
