"use client";

import Link from "next/link";
import { useMemo } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import { useDocuments } from "@/components/providers/DocumentsProvider";

type GradePageClientProps = {
  grade: string;
};

export default function GradePageClient({ grade }: GradePageClientProps) {
  const { documents } = useDocuments();

  const publishedDocs = useMemo(
    () => documents.filter((doc) => doc.published && doc.grade === grade),
    [documents, grade]
  );

  const featuredDocs = useMemo(
    () => publishedDocs.filter((doc) => doc.featured).slice(0, 4),
    [publishedDocs]
  );

  const remainingDocs = useMemo(() => {
    if (featuredDocs.length === 0) return publishedDocs;
    const featuredIds = new Set(featuredDocs.map((doc) => doc.id));
    return publishedDocs.filter((doc) => !featuredIds.has(doc.id));
  }, [publishedDocs, featuredDocs]);

  const topicCount = useMemo(
    () => new Set(publishedDocs.map((doc) => doc.topic)).size,
    [publishedDocs]
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#f8fbff_55%,#f8fbff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/40 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-800"
            >
              ← Ana Sayfa
            </Link>

            <Link
              href="/documents"
              className="rounded-full border border-white/40 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-800"
            >
              Tüm Dökümanlar
            </Link>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800 shadow-sm">
                {grade}. SINIF ARŞİVİ
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                {grade}. sınıf matematik dökümanları
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-lg md:leading-8">
                {grade}. sınıf düzeyine ait yayınlanan içerikler burada tek
                yapıda listelenir. Bu sayfa doğrudan filtrelenmiş sınıf arşivi
                gibi çalışır.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/documents?grade=${grade}`}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5"
                >
                  Tüm Arşivde Gör
                </Link>

                <Link
                  href="/documents"
                  className="rounded-2xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Genel Arşive Dön
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.55rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Toplam Döküman
                </div>
                <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {publishedDocs.length}
                </div>
              </div>

              <div className="rounded-[1.55rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Konu Sayısı
                </div>
                <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {topicCount}
                </div>
              </div>

              <div className="rounded-[1.55rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Öne Çıkan
                </div>
                <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {featuredDocs.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {publishedDocs.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto max-w-xl">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                Bu sınıf için henüz içerik yok
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                {grade}. sınıfa ait yayınlanmış döküman görünmüyor. Yeni içerik
                eklendikçe burada listelenecek.
              </p>
            </div>
          </div>
        ) : (
          <>
            {featuredDocs.length > 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                      Öne çıkan seçkiler
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {grade}. sınıf için öne alınmış içerikler önce burada
                      görünür.
                    </p>
                  </div>

                  <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800">
                    {featuredDocs.length} içerik
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredDocs.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className={featuredDocs.length > 0 ? "mt-8" : ""}>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                    {featuredDocs.length > 0
                      ? "Diğer dökümanlar"
                      : "Tüm dökümanlar"}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {grade}. sınıfa ait yayınlanan içeriklerin kalan listesi.
                  </p>
                </div>

                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                  {(featuredDocs.length > 0 ? remainingDocs : publishedDocs).length} kayıt
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {(featuredDocs.length > 0 ? remainingDocs : publishedDocs).map(
                  (doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  )
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}