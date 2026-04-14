import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";
import StructuredData from "@/components/seo/StructuredData";
import { getPublishedDocuments } from "@/lib/server-documents";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Matematik İçin Düzenli ve Güvenilir Dökümanlar",
  description: siteConfig.longDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Matematik İçin Düzenli ve Güvenilir Dökümanlar`,
    description: siteConfig.longDescription,
    url: siteConfig.url,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Matematik İçin Düzenli ve Güvenilir Dökümanlar`,
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
      name: siteConfig.name,
      url: siteConfig.url,
      logo: absoluteUrl(siteConfig.ogImage),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
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
