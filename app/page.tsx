import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Matematik İçin Düzenli ve Güvenilir Dökümanlar",
  description:
    "premat; matematik için düzenli, seçili ve güvenilir döküman arşivi sunar. Sınıf, konu ve içerik türüne göre filtrelenmiş içeriklere hızlı erişim sağlar.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "premat | Matematik İçin Düzenli ve Güvenilir Dökümanlar",
    description:
      "Sınıf, konu ve içerik türüne göre düzenlenmiş matematik döküman arşivi.",
    url: "https://www.premat.com.tr",
  },
};

export default function HomePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "premat",
      url: "https://www.premat.com.tr",
      logo: "https://www.premat.com.tr/brand/logo-square.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "premat",
      url: "https://www.premat.com.tr",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.premat.com.tr/documents?topic={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <HomePageClient />
    </>
  );
}