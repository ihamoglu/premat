import type { Metadata } from "next";
import YksScoreCalculatorClient from "@/components/pages/YksScoreCalculatorClient";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "YKS Puan Hesaplama",
  description:
    "2018-2025 YKS verileriyle TYT, SAY, SÖZ, EA ve DİL puan türlerinde ham puan, yerleştirme puanı, yaklaşık yüzdelik dilim ve sıralama hesaplama aracı.",
  alternates: {
    canonical: "/araclar/yks-puan-hesaplama",
  },
  openGraph: {
    title: `YKS Puan Hesaplama | ${siteConfig.name}`,
    description:
      "TYT, AYT ve YDT netlerine göre çok yıllı YKS puan tahmini.",
    url: absoluteUrl("/araclar/yks-puan-hesaplama"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default function YksScoreCalculatorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `YKS Puan Hesaplama | ${siteConfig.name}`,
    url: absoluteUrl("/araclar/yks-puan-hesaplama"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "2018-2025 YKS verileriyle TYT, SAY, SÖZ, EA ve DİL puan türlerinde ham puan, yerleştirme puanı, yaklaşık yüzdelik dilim ve sıralama hesaplama aracı.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <YksScoreCalculatorClient />
    </>
  );
}
