"use client";

import Link from "next/link";
import { useMemo } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import { DocumentItem } from "@/types/document";

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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="mb-5 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              ← Ana Sayfa
            </Link>

            <Link
              href="/documents"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Dökümanlar
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                {grade}. Sınıf Arşivi
              </div>

              <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                {grade}. Sınıf Matematik Dökümanları
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                {grade}. sınıf düzeyine ait yayınlanan dökümanlar burada
                listelenir. Konu bazlı içeriklere daha hızlı ulaşmak için bu
                sayfa doğrudan filtrelenmiş arşiv görevi görür.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-500">
                  Toplam Döküman
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {documents.length}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-500">
                  Konu Sayısı
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {topicCount}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-500">
                  Öne Çıkan
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {featuredDocs.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {documents.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto max-w-xl">
              <h2 className="text-2xl font-black text-slate-950">
                Bu sınıf için henüz içerik yok
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                {grade}. sınıfa ait yayınlanmış döküman görünmüyor. İçerikler
                eklendikçe burada listelenecek.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}