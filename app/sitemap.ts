import type { MetadataRoute } from "next";
import { getPublishedDocumentsForSitemap } from "@/lib/server-documents";
import { siteUrl } from "@/lib/site";
import { topicToSlug } from "@/lib/topic-slugs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const documents = await getPublishedDocumentsForSitemap();
  const now = new Date();

  const staticRoutes = [
    "",
    "/documents",
    "/sinif/5",
    "/sinif/6",
    "/sinif/7",
    "/sinif/8",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  const documentEntries: MetadataRoute.Sitemap = documents.map((doc) => ({
    url: `${siteUrl}/documents/${doc.slug}`,
    lastModified: new Date(doc.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const topicEntries: MetadataRoute.Sitemap = Array.from(
    new Set(documents.map((doc) => doc.topic))
  ).map((topic) => ({
    url: `${siteUrl}/konu/${topicToSlug(topic)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  return [...staticEntries, ...documentEntries, ...topicEntries];
}
