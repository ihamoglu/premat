import type { Metadata } from "next";
import TestsPageClient from "@/components/pages/TestsPageClient";
import { getPublishedTestSets } from "@/lib/server-tests";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Online Matematik Testleri",
  description:
    "Sınıf, konu ve zorluk seviyesine göre çözülebilen online matematik testleri.",
  alternates: {
    canonical: "/testler",
  },
  openGraph: {
    title: `Online Matematik Testleri | ${siteConfig.name}`,
    description:
      "Sınıf, konu ve zorluk seviyesine göre çözülebilen online matematik testleri.",
    url: absoluteUrl("/testler"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default async function TestsPage() {
  const tests = await getPublishedTestSets();

  return <TestsPageClient tests={tests} />;
}
