import type { Metadata } from "next";
import KronometreToolClient from "@/components/pages/KronometreToolClient";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kronometre",
  description:
    "Pomodoro, etüt, geri sayım ve sınav sayacı araçlarını tam ekran destekli kullanabileceğin Premat kronometre aracı.",
  alternates: {
    canonical: "/araclar/kronometre",
  },
  openGraph: {
    title: `Kronometre | ${siteConfig.name}`,
    description:
      "Pomodoro, etüt, geri sayım ve sınav sayacı araçlarını tek ekranda kullan.",
    url: absoluteUrl("/araclar/kronometre"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default function KronometrePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Kronometre | ${siteConfig.name}`,
    url: absoluteUrl("/araclar/kronometre"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "Pomodoro, etüt, geri sayım ve sınav sayacı araçlarını tam ekran destekli kullanabileceğin Premat kronometre aracı.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <KronometreToolClient />
    </>
  );
}
