import type { Metadata } from "next";
import { Suspense } from "react";
import DocumentsPageClient from "@/components/pages/DocumentsPageClient";
import StructuredData from "@/components/seo/StructuredData";
import { getPublishedDocuments } from "@/lib/server-documents";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tüm Dökümanlar",
  description:
    "Yayındaki tüm matematik dökümanları burada listelenir. Sınıf, konu ve içerik türüne göre filtreleyerek arşivi hızlıca tarayabilirsin.",
  alternates: {
    canonical: "/documents",
  },
  openGraph: {
    title: `Tüm Dökümanlar | ${siteConfig.name}`,
    description:
      "Sınıf, konu ve içerik türüne göre filtrelenebilen matematik döküman arşivi.",
    url: absoluteUrl("/documents"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: `Tüm Dökümanlar | ${siteConfig.name}`,
    description:
      "Sınıf, konu ve içerik türüne göre filtrelenebilen matematik döküman arşivi.",
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

function DocumentsPageFallback() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Dökümanlar yükleniyor...
          </h1>
        </div>
      </section>
    </main>
  );
}

export default async function DocumentsPage() {
  const documents = await getPublishedDocuments();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Tüm Dökümanlar | ${siteConfig.name}`,
    url: absoluteUrl("/documents"),
    description:
      "Sınıf, konu ve içerik türüne göre filtrelenebilen matematik döküman arşivi.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <Suspense fallback={<DocumentsPageFallback />}>
        <DocumentsPageClient documents={documents} />
      </Suspense>
    </>
  );
}
