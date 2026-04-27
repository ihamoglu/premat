import type { Metadata } from "next";
import LgsScoreCalculatorClient from "@/components/pages/LgsScoreCalculatorClient";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "LGS Puan Hesaplama",
  description:
    "2018-2025 LGS verileriyle net, MSP, yaklaşık yüzdelik dilim ve sıralama hesaplama aracı.",
  alternates: {
    canonical: "/araclar/lgs-puan-hesaplama",
  },
  openGraph: {
    title: `LGS Puan Hesaplama | ${siteConfig.name}`,
    description:
      "Doğru ve yanlış sayılarına göre çok yıllı LGS puan tahmini.",
    url: absoluteUrl("/araclar/lgs-puan-hesaplama"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default function LgsScoreCalculatorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `LGS Puan Hesaplama | ${siteConfig.name}`,
    url: absoluteUrl("/araclar/lgs-puan-hesaplama"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "2018-2025 LGS verileriyle net, MSP, yaklaşık yüzdelik dilim ve sıralama hesaplama aracı.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <LgsScoreCalculatorClient />
    </>
  );
}
