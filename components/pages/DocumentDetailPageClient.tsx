"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import { useDocuments } from "@/components/providers/DocumentsProvider";

type DocumentDetailPageClientProps = {
  slug: string;
};

export default function DocumentDetailPageClient({
  slug,
}: DocumentDetailPageClientProps) {
  const { documents } = useDocuments();
  const [copied, setCopied] = useState(false);

  const doc = documents.find((item) => item.slug === slug && item.published);

  const sameTopicDocs = useMemo(() => {
    if (!doc) return [];
    return documents.filter(
      (item) =>
        item.published &&
        item.slug !== doc.slug &&
        item.topic === doc.topic
    );
  }, [documents, doc]);

  const sameGradeDocs = useMemo(() => {
    if (!doc) return [];
    return documents.filter(
      (item) =>
        item.published &&
        item.slug !== doc.slug &&
        item.grade === doc.grade &&
        item.topic !== doc.topic
    );
  }, [documents, doc]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      setCopied(false);
    }
  }

  if (!doc) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_24%,#f8fafc_100%)] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl">
            📄
          </div>

          <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
            İçerik bulunamadı
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Aradığın kayıt şu an yayında değil ya da bağlantı geçersiz.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Ana Sayfaya Dön
            </Link>

            <Link
              href="/documents"
              className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Arşivi Aç
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const topicArchiveHref = `/documents?grade=${doc.grade}&topic=${encodeURIComponent(
    doc.topic
  )}`;
  const gradeArchiveHref = `/sinif/${doc.grade}`;

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
              Dökümanlar
            </Link>

            <Link
              href={gradeArchiveHref}
              className="rounded-full border border-white/40 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-800"
            >
              {doc.grade}. Sınıf
            </Link>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800 shadow-sm">
                  PREMAT KAYDI
                </span>

                <span className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white">
                  {doc.grade}. SINIF
                </span>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                {doc.title}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-lg md:leading-8">
                {doc.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                  {doc.type}
                </span>

                <span className="rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                  {doc.sourceType}
                </span>

                <span className="rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                  {doc.topic}
                </span>

                {doc.featured ? (
                  <span className="rounded-full bg-orange-500/95 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                    Öne Çıkan
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.55rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Konu
                </div>
                <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                  {doc.topic}
                </div>
              </div>

              <div className="rounded-[1.55rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Alt Konu
                </div>
                <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                  {doc.subtopic || "Yok"}
                </div>
              </div>

              <div className="rounded-[1.55rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Yayın Tarihi
                </div>
                <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                  {doc.createdAt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-8">
            {doc.coverImageUrl ? (
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                <img
                  src={doc.coverImageUrl}
                  alt={doc.title}
                  className="h-[240px] w-full object-cover md:h-[380px]"
                />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#fff7ed_100%)] px-8 py-14 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:px-12 md:py-20">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-orange-100 blur-3xl" />

                <div className="relative">
                  <div className="text-xs font-black tracking-[0.16em] text-blue-800">
                    PREMAT
                  </div>
                  <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950 md:text-5xl">
                    {doc.title}
                  </h2>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                    Kayıt bilgileri
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Bu içeriğe ait temel bilgiler aşağıda düzenli şekilde yer alır.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                >
                  {copied ? "Link Kopyalandı" : "Linki Kopyala"}
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Konu
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.topic}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Alt Konu
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.subtopic || "Belirtilmedi"}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    İçerik Türü
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.type}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Kaynak
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.sourceType}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Cevap Anahtarı
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.answerKeyUrl ? "Bağlantı var" : "Bağlantı yok"}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Çözüm
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.solutionUrl ? "Bağlantı var" : "Bağlantı yok"}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Link
                  href={topicArchiveHref}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="text-sm font-semibold text-slate-500">
                    Aynı Konu
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    Bu konuya ait diğer kayıtları aç
                  </div>
                </Link>

                <Link
                  href={gradeArchiveHref}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="text-sm font-semibold text-slate-500">
                    Aynı Sınıf
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    {doc.grade}. sınıf arşivine git
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-6">
            <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800">
              HIZLI İŞLEMLER
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-slate-950">
              İçeriğe eriş
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Dosya bağlantısını, çözümü ve cevap anahtarını buradan açabilirsin.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Dökümanı Aç
              </a>

              {doc.solutionUrl ? (
                <a
                  href={doc.solutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Çözümü Aç
                </a>
              ) : null}

              {doc.answerKeyUrl ? (
                <a
                  href={doc.answerKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                >
                  Cevap Anahtarını Aç
                </a>
              ) : null}

              {!doc.solutionUrl && !doc.answerKeyUrl ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm font-semibold text-slate-500">
                  Bu kayıt için ek bağlantı bulunmuyor
                </div>
              ) : null}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] p-5 text-white">
              <div className="text-xs font-semibold tracking-[0.08em] text-blue-100">
                KAYIT ÖZETİ
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-3">
                  <span className="text-white/75">Sınıf</span>
                  <span className="font-semibold">{doc.grade}. Sınıf</span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-3">
                  <span className="text-white/75">Tür</span>
                  <span className="font-semibold">{doc.type}</span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-3">
                  <span className="text-white/75">Kaynak</span>
                  <span className="font-semibold">{doc.sourceType}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/75">Konu</span>
                  <span className="text-right font-semibold">{doc.topic}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
              Aynı konudan diğer içerikler
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Doğrudan bu konuya yakın yayınlanan kayıtlar.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {sameTopicDocs.length} kayıt
          </div>
        </div>

        {sameTopicDocs.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto max-w-xl">
              <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                Aynı konuda başka içerik yok
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                Bu konu için şu an başka yayınlanmış kayıt görünmüyor.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sameTopicDocs.slice(0, 4).map((item) => (
              <DocumentCard key={item.id} doc={item} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6 md:pb-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
              Aynı sınıftan diğer içerikler
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {doc.grade}. sınıf düzeyindeki diğer kayıtlar.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {sameGradeDocs.length} kayıt
          </div>
        </div>

        {sameGradeDocs.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto max-w-xl">
              <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                Aynı sınıfta ek içerik yok
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                Bu sınıf için şu an ek yayın görünmüyor.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sameGradeDocs.slice(0, 4).map((item) => (
              <DocumentCard key={item.id} doc={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}