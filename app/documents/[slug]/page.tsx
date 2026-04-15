import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentDetailPageClient from "@/components/pages/DocumentDetailPageClient";
import StructuredData from "@/components/seo/StructuredData";
import {
  getPublishedDocumentBySlug,
  getPublishedDocumentsByGrade,
  getPublishedDocumentsByTopic,
  getRelatedPublishedDocuments,
} from "@/lib/server-documents";
import { absoluteUrl, siteConfig } from "@/lib/site";

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

  const imageUrl = absoluteUrl(doc.coverImageUrl || siteConfig.ogImage);

  return {
    title: doc.title,
    description: shortDescription,
    alternates: {
      canonical: `/documents/${doc.slug}`,
    },
    openGraph: {
      title: `${doc.title} | ${siteConfig.name}`,
      description: shortDescription,
      url: absoluteUrl(`/documents/${doc.slug}`),
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | ${siteConfig.name}`,
      description: shortDescription,
      images: [imageUrl],
    },
  };
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getPublishedDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const sameTopicDocs = await getPublishedDocumentsByTopic(doc.topic, {
    excludeSlug: doc.slug,
    limit: 4,
  });

  const sameGradeDocs = await getPublishedDocumentsByGrade(doc.grade, {
    excludeSlug: doc.slug,
    excludeTopic: doc.topic,
    limit: 4,
  });

  const relatedDocs = await getRelatedPublishedDocuments(doc, 6);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: doc.title,
    headline: doc.title,
    description: doc.description,
    url: absoluteUrl(`/documents/${doc.slug}`),
    datePublished:
      doc.createdAt && !Number.isNaN(Date.parse(doc.createdAt))
        ? doc.createdAt
        : undefined,
    educationalLevel: `${doc.grade}. Sınıf`,
    learningResourceType: doc.type,
    about: [doc.topic, doc.subtopic].filter(Boolean),
    image: absoluteUrl(doc.coverImageUrl || siteConfig.ogImage),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <DocumentDetailPageClient
        doc={doc}
        relatedDocs={relatedDocs}
        sameTopicDocs={sameTopicDocs}
        sameGradeDocs={sameGradeDocs}
      />
    </>
  );
}
