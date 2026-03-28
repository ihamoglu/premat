import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentDetailPageClient from "@/components/pages/DocumentDetailPageClient";
import StructuredData from "@/components/seo/StructuredData";
import { getPublishedDocumentBySlug } from "@/lib/server-documents";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getPublishedDocumentBySlug(slug);

  if (!doc) {
    return {
      title: "İçerik Bulunamadı",
      description: "İstenen içerik bulunamadı ya da yayında değil.",
    };
  }

  const shortDescription =
    doc.description.length > 160
      ? `${doc.description.slice(0, 157)}...`
      : doc.description;

  return {
    title: doc.title,
    description: shortDescription,
    alternates: {
      canonical: `/documents/${doc.slug}`,
    },
    openGraph: {
      title: `${doc.title} | premat`,
      description: shortDescription,
      url: `https://www.premat.com.tr/documents/${doc.slug}`,
    },
  };
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getPublishedDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: doc.title,
    headline: doc.title,
    description: doc.description,
    url: `https://www.premat.com.tr/documents/${doc.slug}`,
    datePublished: doc.created_at,
    educationalLevel: `${doc.grade}. Sınıf`,
    learningResourceType: doc.type,
    about: [doc.topic, doc.subtopic].filter(Boolean),
    publisher: {
      "@type": "Organization",
      name: "premat",
      url: "https://www.premat.com.tr",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <DocumentDetailPageClient slug={slug} />
    </>
  );
}