"use client";

import Link from "next/link";
import { useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import { DocumentItem } from "@/types/document";

type DocumentDetailPageClientProps = {
  doc: DocumentItem;
  sameTopicDocs: DocumentItem[];
  sameGradeDocs: DocumentItem[];
};

export default function DocumentDetailPageClient({
  doc,
  sameTopicDocs,
  sameGradeDocs,
}: DocumentDetailPageClientProps) {
  const [copied, setCopied] = useState(false);

  const topicArchiveHref = `/documents?grade=${doc.grade}&topic=${encodeURIComponent(
    doc.topic
  )}`;
  const gradeArchiveHref = `/sinif/${doc.grade}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <Link href="/" className="transition hover:text-blue-800">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/documents" className="transition hover:text-blue-800">
              Dökümanlar
            </Link>
            <span>/</span>
            <Link
              href={gradeArchiveHref}
              className="transition hover:text-blue-800"
            >
              {doc.grade}. Sınıf
            </Link>
            <span>/</span>
            <span className="text-slate-700">{doc.title}</span>
          </div>

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
              Arşive Dön
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {copied ? "Link Kopyalandı" : "Linki Kopyala"}
            </button>
          </div>

          {doc.coverImageUrl ? (
            <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <img
                src={doc.coverImageUrl}
                alt={doc.title}
                className="h-[240px] w-full object-cover md:h-[360px]"
              />
            </div>
          ) : (
            <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] shadow-sm">
              <div className="flex min-h-[240px] items-center justify-center px-8 text-center md:min-h-[320px]">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-800">
                    premat
                  </div>
                  <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                    {doc.title}
                  </h1>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-8">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-800 sm:text-sm">
                  {doc.grade}. Sınıf
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 sm:text-sm">
                  {doc.type}
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 sm:text-sm">
                  {doc.sourceType}
                </span>
                {doc.featured ? (
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-700 sm:text-sm">
                    Öne Çıkan
                  </span>
                ) : null}
              </div>

              <h1 className="max-w-4xl text-2xl font-black leading-tight text-slate-950 sm:text-3xl md:text-5xl">
                {doc.title}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg md:leading-8">
                {doc.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8">
                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
                  <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                    Konu
                  </div>
                  <div className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    {doc.topic}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
                  <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                    Alt Konu
                  </div>
                  <div className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    {doc.subtopic || "Belirtilmedi"}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
                  <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                    Yayın Tarihi
                  </div>
                  <div className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    {doc.createdAt}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
                  <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                    Cevap Anahtarı
                  </div>
                  <div className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    {doc.answerKeyUrl ? "Bağlantı mevcut" : "Bağlantı yok"}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Link
                  href={topicArchiveHref}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="text-sm font-bold text-slate-500">
                    Aynı Konu
                  </div>
                  <div className="mt-2 text-lg font-black text-slate-950">
                    Bu konuya ait diğer içerikleri aç
                  </div>
                </Link>

                <Link
                  href={gradeArchiveHref}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="text-sm font-bold text-slate-500">
                    Aynı Sınıf
                  </div>
                  <div className="mt-2 text-lg font-black text-slate-950">
                    {doc.grade}. sınıf arşivine git
                  </div>
                </Link>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:rounded-[2rem] sm:p-6 md:p-8">
              <div className="mb-5">
                <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                  İçerik Erişimi
                </div>

                <h2 className="mt-4 text-xl font-black text-slate-900 sm:text-2xl">
                  Hızlı İşlemler
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Dosya bağlantısını, çözümü ve cevap anahtarını tek yerden
                  açabilirsin.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-blue-800 px-5 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-800/20 transition hover:bg-blue-900"
                >
                  Dokümanı Aç
                </a>

                {doc.solutionUrl ? (
                  <a
                    href={doc.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    Çözümü Aç
                  </a>
                ) : null}

                {doc.answerKeyUrl ? (
                  <a
                    href={doc.answerKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-bold text-amber-700 transition hover:bg-amber-100"
                  >
                    Cevap Anahtarını Aç
                  </a>
                ) : null}

                {!doc.solutionUrl && !doc.answerKeyUrl ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-500">
                    Bu içerik için ek bağlantı bulunmuyor
                  </div>
                ) : null}
              </div>

              <div className="mt-6 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4 sm:rounded-[1.5rem] sm:p-5">
                <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                  Kayıt Özeti
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">Tür</span>
                    <span className="font-bold text-slate-900">{doc.type}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">Kaynak</span>
                    <span className="font-bold text-slate-900">
                      {doc.sourceType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">Seviye</span>
                    <span className="font-bold text-slate-900">
                      {doc.grade}. Sınıf
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-500">Konu</span>
                    <span className="font-bold text-right text-slate-900">
                      {doc.topic}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
            Aynı Konudan Diğer İçerikler
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Doğrudan bu konuya yakın içerikler
          </p>
        </div>

        {sameTopicDocs.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:rounded-[2rem] sm:p-12">
            <div className="mx-auto max-w-xl">
              <h3 className="text-2xl font-black text-slate-900">
                Aynı konuda başka içerik yok
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                Bu konu için şu an başka yayınlanmış kayıt görünmüyor.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sameTopicDocs.map((item) => (
              <DocumentCard key={item.id} doc={item} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 md:pb-14">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
            Aynı Sınıftan Diğer İçerikler
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {doc.grade}. sınıf düzeyindeki diğer kayıtlar
          </p>
        </div>

        {sameGradeDocs.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:rounded-[2rem] sm:p-12">
            <div className="mx-auto max-w-xl">
              <h3 className="text-2xl font-black text-slate-900">
                Aynı sınıfta ek içerik yok
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                Bu sınıf için şu an ek yayın görünmüyor.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sameGradeDocs.map((item) => (
              <DocumentCard key={item.id} doc={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
