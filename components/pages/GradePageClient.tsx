"use client";

import Link from "next/link";
import { useMemo } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { DocumentItem } from "@/types/document";
import { topicToSlug } from "@/lib/topic-slugs";

type GradePageClientProps = {
  grade: string;
  documents: DocumentItem[];
};

export default function GradePageClient({
  grade,
  documents,
}: GradePageClientProps) {
  const featuredDocs = useMemo(
    () => documents.filter((doc) => doc.featured),
    [documents]
  );

  const topicCount = useMemo(
    () => new Set(documents.map((doc) => doc.topic)).size,
    [documents]
  );

  const topicBlocks = useMemo(() => {
    return Array.from(new Set(documents.map((doc) => doc.topic)))
      .map((topic) => {
        const topicDocs = documents.filter((doc) => doc.topic === topic);

        return {
          topic,
          count: topicDocs.length,
          video: topicDocs.filter((doc) => doc.hasVideoSolution).length,
          answerKey: topicDocs.filter((doc) => doc.answerKeyUrl).length,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [documents]);

  const popularDocs = useMemo(
    () =>
      [...documents]
        .filter((doc) => (doc.popularityScore ?? 0) > 0)
        .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
        .slice(0, 4),
    [documents]
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #eef5ff 0%, #f8fbff 18%, #f8fafc 100%)",
      }}
    >
      {/* ── HEADER ── */}
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

        {/* Arka plan matematik sembolleri */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <span className="absolute right-[8%] top-[10%] text-8xl font-black text-white/5">
            {grade}
          </span>
          <span className="absolute bottom-[8%] left-[4%] text-6xl font-black text-white/5">
            ∑
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
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

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                {grade}. Sınıf Arşivi
              </div>

              <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                {grade}. Sınıf
                <span className="block text-blue-200">
                  Matematik Dökümanları
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100 md:text-lg">
                {grade}. sınıf düzeyine ait yayınlanan dökümanlar burada
                listelenir. Konu bazlı içeriklere daha hızlı ulaşmak için bu
                sayfa doğrudan filtrelenmiş arşiv görevi görür.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Toplam Döküman", value: documents.length },
                { label: "Konu Sayısı", value: topicCount },
                { label: "Öne Çıkan", value: featuredDocs.length },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="premat-fade-in-up rounded-[1.45rem] border border-white/30 bg-white/95 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 0.1}s` }}
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
        {documents.length === 0 ? (
          <EmptyState
            title="Bu sınıf için henüz içerik yok"
            description={`${grade}. sınıfa ait yayınlanmış döküman görünmüyor. İçerikler eklendikçe burada listelenecek.`}
          />
        ) : (
          <div>
            <SectionHeader
              title="Konu kırılımı"
              description={`${grade}. sınıf içindeki konuları yoğunluk ve kaynak sinyalleriyle incele.`}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {topicBlocks.map((item) => (
                <Link
                  key={item.topic}
                  href={`/konu/${topicToSlug(item.topic)}`}
                  className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="text-sm font-bold text-blue-800">
                    {item.count} döküman
                  </div>
                  <h2 className="mt-2 text-xl font-black tracking-[-0.02em] text-slate-950">
                    {item.topic}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Video {item.video}
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Cevap {item.answerKey}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {popularDocs.length > 0 ? (
              <div className="mt-10">
                <SectionHeader
                  title="Bu sınıfta popüler"
                  description="Son kullanım sinyallerine göre öne çıkan kayıtlar."
                />

                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {popularDocs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10">
            <SectionHeader
              title="Yayınlanan içerikler"
              description={`${grade}. sınıf düzeyine ait aktif döküman listesi.`}
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
