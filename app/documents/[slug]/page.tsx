import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocumentDetailPageClient from "@/components/pages/DocumentDetailPageClient";
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

  return <DocumentDetailPageClient slug={slug} />;
}