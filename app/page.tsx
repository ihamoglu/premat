import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";
import StructuredData from "@/components/seo/StructuredData";
import { getPublishedDocuments } from "@/lib/server-documents";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "premat | Matematik İçin Düzenli ve Güvenilir Döküman Arşivi",
  description: siteConfig.longDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "premat | Matematik İçin Düzenli ve Güvenilir Döküman Arşivi",
    description: siteConfig.longDescription,
    url: siteConfig.url,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "premat | Matematik İçin Düzenli ve Güvenilir Döküman Arşivi",
    description: siteConfig.longDescription,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default async function HomePage() {
  const documents = await getPublishedDocuments();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.shortName,
      url: siteConfig.url,
      logo: absoluteUrl("/icon.png"),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.shortName,
      url: siteConfig.url,
      description: siteConfig.longDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/documents?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <HomePageClient documents={documents} />
    </>
  );
}
