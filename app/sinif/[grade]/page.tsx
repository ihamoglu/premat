import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GradePageClient from "@/components/pages/GradePageClient";
import StructuredData from "@/components/seo/StructuredData";
import { getPublishedDocumentsByGrade } from "@/lib/server-documents";
import { absoluteUrl, siteConfig } from "@/lib/site";

const validGrades = ["5", "6", "7", "8"] as const;

type PageProps = {
  params: Promise<{
    grade: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { grade } = await params;

  if (!validGrades.includes(grade as (typeof validGrades)[number])) {
    return {
      title: "Sınıf Bulunamadı",
      description: "İstenen sınıf sayfası bulunamadı.",
    };
  }

  return {
    title: `${grade}. Sınıf Matematik Dökümanları`,
    description: `${grade}. sınıf matematik dökümanları, konu bazlı içerikler, çalışma kağıtları, kazanım testleri ve seçili kaynaklar ${siteConfig.name} arşivinde.`,
    alternates: {
      canonical: `/sinif/${grade}`,
    },
    openGraph: {
      title: `${grade}. Sınıf Matematik Dökümanları | ${siteConfig.name}`,
      description: `${grade}. sınıf düzeyine ait seçili matematik dökümanları ve konu bazlı içerikler.`,
      url: absoluteUrl(`/sinif/${grade}`),
      images: [absoluteUrl(siteConfig.ogImage)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${grade}. Sınıf Matematik Dökümanları | ${siteConfig.name}`,
      description: `${grade}. sınıf düzeyine ait seçili matematik dökümanları ve konu bazlı içerikler.`,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export default async function GradePage({ params }: PageProps) {
  const { grade } = await params;

  if (!validGrades.includes(grade as (typeof validGrades)[number])) {
    notFound();
  }

  const documents = await getPublishedDocumentsByGrade(grade as "5" | "6" | "7" | "8");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${grade}. Sınıf Matematik Dökümanları | ${siteConfig.name}`,
    url: absoluteUrl(`/sinif/${grade}`),
    description: `${grade}. sınıf düzeyine ait seçili matematik dökümanları ve konu bazlı içerikler.`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <GradePageClient grade={grade} documents={documents} />
    </>
  );
}
