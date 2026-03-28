import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GradePageClient from "@/components/pages/GradePageClient";
import StructuredData from "@/components/seo/StructuredData";

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
    description: `${grade}. sınıf matematik dökümanları, konu bazlı içerikler, çalışma kağıtları, kazanım testleri ve seçili kaynaklar premat arşivinde.`,
    alternates: {
      canonical: `/sinif/${grade}`,
    },
    openGraph: {
      title: `${grade}. Sınıf Matematik Dökümanları | premat`,
      description: `${grade}. sınıf düzeyine ait seçili matematik dökümanları ve konu bazlı içerikler.`,
      url: `https://www.premat.com.tr/sinif/${grade}`,
    },
  };
}

export default async function GradePage({ params }: PageProps) {
  const { grade } = await params;

  if (!validGrades.includes(grade as (typeof validGrades)[number])) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${grade}. Sınıf Matematik Dökümanları | premat`,
    url: `https://www.premat.com.tr/sinif/${grade}`,
    description: `${grade}. sınıf düzeyine ait seçili matematik dökümanları ve konu bazlı içerikler.`,
    isPartOf: {
      "@type": "WebSite",
      name: "premat",
      url: "https://www.premat.com.tr",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <GradePageClient grade={grade} />
    </>
  );
}