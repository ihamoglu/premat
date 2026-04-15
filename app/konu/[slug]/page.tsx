import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentCard from "@/components/documents/DocumentCard";
import SectionHeader from "@/components/ui/SectionHeader";
import StructuredData from "@/components/seo/StructuredData";
import { getPublishedDocuments } from "@/lib/server-documents";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { findTopicBySlug, topicToSlug } from "@/lib/topic-slugs";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const difficultyConfig: Record<
  string,
  { border: string; bg: string; textColor: string; gradient: string }
> = {
  Başlangıç: {
    border: "border-emerald-200",
    bg: "bg-emerald-50/60",
    textColor: "text-emerald-700",
    gradient: "linear-gradient(135deg,#059669,#10b981)",
  },
  Orta: {
    border: "border-blue-200",
    bg: "bg-blue-50/60",
    textColor: "text-blue-700",
    gradient: "linear-gradient(135deg,#1d4f91,#2f6eb7)",
  },
  İleri: {
    border: "border-orange-200",
    bg: "bg-orange-50/60",
    textColor: "text-orange-700",
    gradient: "linear-gradient(135deg,#ea580c,#f97316)",
  },
  Karma: {
    border: "border-purple-200",
    bg: "bg-purple-50/60",
    textColor: "text-purple-700",
    gradient: "linear-gradient(135deg,#7c3aed,#9333ea)",
  },
};

async function getTopicPageData(slug: string) {
  const documents = await getPublishedDocuments();
  const topics = Array.from(new Set(documents.map((doc) => doc.topic)));
  const topic = findTopicBySlug(topics, slug);

  if (!topic) {
    return null;
  }

  return {
    topic,
    documents: documents.filter((doc) => doc.topic === topic),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTopicPageData(slug);

  if (!data) {
    return {
      title: "Konu Bulunamadı",
      description: "İstenen konu sayfası bulunamadı.",
    };
  }

  const description = `${data.topic} konusuna ait yayınlanmış matematik dokümanları, çalışma kağıtları, testler ve seçili kaynaklar ${siteConfig.name} arşivinde.`;

  return {
    title: `${data.topic} Dokümanları`,
    description,
    alternates: {
      canonical: `/konu/${topicToSlug(data.topic)}`,
    },
    openGraph: {
      title: `${data.topic} Dokümanları | ${siteConfig.name}`,
      description,
      url: absoluteUrl(`/konu/${topicToSlug(data.topic)}`),
      images: [absoluteUrl(siteConfig.ogImage)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.topic} Dokümanları | ${siteConfig.name}`,
      description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getTopicPageData(slug);

  if (!data) {
    notFound();
  }

  const gradeCounts = (["5", "6", "7", "8"] as const).map((grade) => ({
    grade,
    count: data.documents.filter((doc) => doc.grade === grade).length,
  }));

  const typeCount = new Set(data.documents.map((doc) => doc.type)).size;
  const difficultyCounts = ["Başlangıç", "Orta", "İleri", "Karma"].map(
    (difficulty) => ({
      difficulty,
      count: data.documents.filter((doc) => doc.difficulty === difficulty)
        .length,
    })
  );
  const popularDocs = [...data.documents]
    .filter((doc) => (doc.popularityScore ?? 0) > 0)
    .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
    .slice(0, 4);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.topic} Dokümanları | ${siteConfig.name}`,
    url: absoluteUrl(`/konu/${topicToSlug(data.topic)}`),
    description: `${data.topic} konusuna ait yayınlanmış matematik dokümanları.`,
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
        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden border-b border-slate-200/60"
          style={{
            background:
              "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 35%, #2f6eb7 65%, #ea580c 100%)",
          }}
        >
          {/* Dekoratif glow'lar */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -right-12 -top-12 h-56 w-56 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
            />
            <div
              className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
            />
          </div>

          {/* Dekoratif konu sembolü */}
          <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
            <span className="absolute right-[6%] top-[8%] text-[7rem] font-black text-white/5">
              ƒ
            </span>
            <span className="absolute bottom-[6%] left-[4%] text-6xl font-black text-white/5">
              ∑
            </span>
          </div>

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
                  Konu Arşivi
                </div>
                <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  {data.topic}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100 md:text-lg">
                  Bu konuya ait yayınlanmış matematik içeriklerini sınıf ve tür
                  kırılımıyla tek sayfada incele.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Toplam Kayıt", value: data.documents.length },
                  { label: "Sınıf Kırılımı", value: gradeCounts.filter((item) => item.count > 0).length },
                  { label: "İçerik Türü", value: typeCount },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="premat-fade-in-up rounded-[1.45rem] border border-white/30 bg-white/95 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition hover:-translate-y-0.5"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </div>
                    <div
                      className="mt-2 text-3xl font-black tracking-[-0.03em] bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── İÇERİK ── */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          {/* Grade filter pills */}
          <div className="mb-6 flex flex-wrap gap-2.5">
            {gradeCounts
              .filter((item) => item.count > 0)
              .map((item) => (
                <Link
                  key={item.grade}
                  href={`/documents?grade=${item.grade}&topic=${encodeURIComponent(
                    data.topic
                  )}`}
                  className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                  }}
                >
                  {item.grade}. Sınıf — {item.count} kayıt
                </Link>
              ))}
          </div>

          {/* Difficulty color-coded cards */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {difficultyCounts.map((item) => {
              const cfg = difficultyConfig[item.difficulty] ?? {
                border: "border-slate-200",
                bg: "bg-slate-50",
                textColor: "text-slate-700",
                gradient: "linear-gradient(135deg,#475569,#64748b)",
              };

              return (
                <Link
                  key={item.difficulty}
                  href={`/documents?topic=${encodeURIComponent(
                    data.topic
                  )}&difficulty=${encodeURIComponent(item.difficulty)}`}
                  className={`premat-card-3d rounded-[1.4rem] border ${cfg.border} ${cfg.bg} p-5 shadow-sm transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-black text-white"
                      style={{ background: cfg.gradient }}
                    >
                      {item.difficulty}
                    </span>
                    <span className={`text-sm font-bold ${cfg.textColor}`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-3 text-lg font-black text-slate-950">
                    {item.difficulty}
                  </div>
                  <div className={`mt-1 text-sm font-semibold ${cfg.textColor}`}>
                    {item.count} kayıt
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Popular docs */}
          {popularDocs.length > 0 ? (
            <div className="mb-10">
              <SectionHeader
                title="Bu konuda popüler"
                description="Son kullanım sinyallerine göre öne çıkan kayıtlar."
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {popularDocs.map((doc, i) => (
                  <div
                    key={doc.id}
                    className="premat-fade-in-up"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <DocumentCard doc={doc} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* All docs */}
          <SectionHeader
            title="Tüm içerikler"
            description={`${data.topic} konusuna ait yayınlanmış tüm dökümanlar.`}
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {data.documents.map((doc, i) => (
              <div
                key={doc.id}
                className="premat-fade-in-up"
                style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
              >
                <DocumentCard doc={doc} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
