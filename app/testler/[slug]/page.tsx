import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TestPlayerPageClient from "@/components/pages/TestPlayerPageClient";
import { getPublishedTestSetBySlug } from "@/lib/server-tests";
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
  const test = await getPublishedTestSetBySlug(slug);

  if (!test) {
    return {
      title: "Test Bulunamadı",
      description: "İstenen online test bulunamadı ya da yayında değil.",
    };
  }

  return {
    title: test.title,
    description:
      test.description || `${test.grade}. sınıf ${test.topic} online testi.`,
    alternates: {
      canonical: `/testler/${test.slug}`,
    },
    openGraph: {
      title: `${test.title} | ${siteConfig.name}`,
      description:
        test.description || `${test.grade}. sınıf ${test.topic} online testi.`,
      url: absoluteUrl(`/testler/${test.slug}`),
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export default async function TestPlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const test = await getPublishedTestSetBySlug(slug);

  if (!test) {
    notFound();
  }

  return <TestPlayerPageClient test={test} />;
}
