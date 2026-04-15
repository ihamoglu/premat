import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentCard from "@/components/documents/DocumentCard";
import StructuredData from "@/components/seo/StructuredData";
import { getPublicCollectionBySlug } from "@/lib/server-collections";
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
  const collection = await getPublicCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Çalışma Listesi Bulunamadı",
      description: "İstenen çalışma listesi bulunamadı.",
    };
  }

  const description =
    collection.description ||
    `${collection.title} içindeki seçili matematik dokümanları.`;

  return {
    title: collection.title,
    description,
    alternates: {
      canonical: `/koleksiyon/${collection.slug}`,
    },
    openGraph: {
      title: `${collection.title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(`/koleksiyon/${collection.slug}`),
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getPublicCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.title} | ${siteConfig.name}`,
    url: absoluteUrl(`/koleksiyon/${collection.slug}`),
    description:
      collection.description ||
      `${collection.documents.length} seçili matematik dokümanı.`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #eef5ff 0%, #f8fbff 18%, #f8fafc 100%)",
        }}
      >
        <section
          className="relative overflow-hidden border-b border-slate-200/60"
          style={{
            background:
              "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 35%, #2f6eb7 65%, #ea580c 100%)",
          }}
        >
          <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
            <div className="mb-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                ← Ana Sayfa
              </Link>
              <Link
                href="/documents"
                className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                Dökümanlar
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  Paylaşılan Liste
                </div>
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  {collection.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100 md:text-lg">
                  {collection.description ||
                    "Seçili dokümanları tek sayfada aç, paylaş ve derste kullan."}
                </p>
              </div>

              <div className="rounded-[1.45rem] border border-white/30 bg-white/95 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition hover:-translate-y-0.5">
                <div className="text-sm font-medium text-slate-500">
                  Listedeki Doküman
                </div>
                <div
                  className="mt-2 text-4xl font-black tracking-[-0.03em] bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                  }}
                >
                  {collection.documents.length}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          {collection.documents.length === 0 ? (
            <div className="overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white shadow-sm">
              <div
                className="h-[3px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg,#1d4f91,#2f6eb7,#ea580c)",
                }}
              />
              <div className="p-12 text-center">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg,#1d4f91,#2f6eb7)",
                  }}
                >
                  <span className="text-white font-black">∅</span>
                </div>
                <h2 className="text-2xl font-black text-slate-950">
                  Bu listede yayınlanmış doküman yok
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Liste içindeki dokümanlar kaldırılmış veya yayından alınmış olabilir.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {collection.documents.map((doc, i) => (
                <div
                  key={doc.id}
                  className="premat-fade-in-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                >
                  <DocumentCard doc={doc} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
