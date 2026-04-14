"use client";

import Link from "next/link";
import { useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import ContentImage from "@/components/common/ContentImage";
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
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #f0f5ff 0%, #f8fafc 100%)",
      }}
    >
      {/* ── ÜST BAŞLIK ── */}
      <section className="border-b border-slate-200/60 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          {/* Breadcrumb */}
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <Link href="/" className="transition hover:text-blue-800">
              Ana Sayfa
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/documents" className="transition hover:text-blue-800">
              Dökümanlar
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href={gradeArchiveHref}
              className="transition hover:text-blue-800"
            >
              {doc.grade}. Sınıf
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">{doc.title}</span>
          </div>

          {/* Back butonları — glassmorphism pill */}
          <div className="mb-5 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:border-blue-200 hover:text-blue-800"
            >
              ← Ana Sayfa
            </Link>

            <Link
              href="/documents"
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:border-blue-200 hover:text-blue-800"
            >
              Arşive Dön
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:border-blue-200 hover:text-blue-800"
            >
              {copied ? "✓ Link Kopyalandı" : "Linki Kopyala"}
            </button>
          </div>

          {/* Cover image veya premium placeholder */}
          {doc.coverImageUrl ? (
            <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <ContentImage
                src={doc.coverImageUrl}
                alt={doc.title}
                width={1600}
                height={900}
                priority
                className="h-[240px] w-full object-cover md:h-[360px]"
              />
            </div>
          ) : (
            <div
              className="relative mb-8 overflow-hidden rounded-[2rem] shadow-xl shadow-blue-900/10"
            >
              {/* Gradient placeholder */}
              <div
                className="flex min-h-[240px] items-center justify-center px-8 text-center md:min-h-[320px]"
                style={{
                  background:
                    "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 40%, #2f6eb7 70%, #ea580c 100%)",
                }}
              >
                {/* Dekoratif semboller */}
                <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
                  <span className="absolute left-6 top-6 text-6xl font-black text-white/8">π</span>
                  <span className="absolute bottom-6 right-6 text-5xl font-black text-white/8">∑</span>
                  <span className="absolute right-12 top-8 text-4xl font-black text-white/8">√</span>
                  <span className="absolute bottom-8 left-12 text-3xl font-black text-white/8">∞</span>
                </div>

                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.20em] text-white/60">
                    premat
                  </div>
                  <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                    {doc.title}
                  </h1>
                </div>
              </div>
            </div>
          )}

          {/* İçerik + sidebar grid */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-8">
            <div>
              {/* Badge'ler */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className="rounded-full px-4 py-2 text-xs font-bold text-white sm:text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                  }}
                >
                  {doc.grade}. Sınıf
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 sm:text-sm">
                  {doc.type}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 sm:text-sm">
                  {doc.sourceType}
                </span>
                {doc.featured ? (
                  <span
                    className="rounded-full px-4 py-2 text-xs font-bold text-white sm:text-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                    }}
                  >
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

              {/* Detay kartları */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8">
                {[
                  { label: "Konu", value: doc.topic },
                  { label: "Alt Konu", value: doc.subtopic || "Belirtilmedi" },
                  { label: "Yayın Tarihi", value: doc.createdAt },
                  {
                    label: "Cevap Anahtarı",
                    value: doc.answerKeyUrl ? "Bağlantı mevcut" : "Bağlantı yok",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 sm:rounded-[1.5rem] sm:p-5"
                  >
                    <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                      {item.label}
                    </div>
                    <div className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aksiyon sidebar — glassmorphism */}
            <aside className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:rounded-[2rem] sm:p-6 md:p-8">
              <div className="mb-5">
                <div
                  className="inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                  }}
                >
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
                {/* Ana dosya butonu */}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl px-5 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-800/20 transition hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-blue-800/30 visited:text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 55%, #ea580c 100%)",
                    color: "#ffffff",
                  }}
                >
                  <span style={{ color: "#ffffff" }}>Dokümanı Aç</span>
                </a>

                {doc.solutionUrl ? (
                  <a
                    href={doc.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-sm font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-sm"
                  >
                    Çözümü Aç
                  </a>
                ) : null}

                {doc.answerKeyUrl ? (
                  <a
                    href={doc.answerKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-bold text-amber-700 transition hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-sm"
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

              {/* Kayıt özeti */}
              <div className="mt-6 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4 sm:rounded-[1.5rem] sm:p-5">
                <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                  Kayıt Özeti
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  {[
                    { label: "Tür", value: doc.type },
                    { label: "Kaynak", value: doc.sourceType },
                    { label: "Seviye", value: `${doc.grade}. Sınıf` },
                    { label: "Konu", value: doc.topic },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="font-semibold text-slate-500">
                        {item.label}
                      </span>
                      <span className="font-bold text-right text-slate-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── AYNI KONUDAN DİĞER İÇERİKLER ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        <div className="mb-6 flex items-start gap-3">
          <div
            className="mt-1 h-6 w-1.5 shrink-0 rounded-full"
            style={{ background: "linear-gradient(180deg, #1d4f91, #2f6eb7)" }}
          />
          <div>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
              Aynı Konudan Diğer İçerikler
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Doğrudan bu konuya yakın içerikler
            </p>
          </div>
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

      {/* ── AYNI SINIFTAN DİĞER İÇERİKLER ── */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 md:pb-14">
        <div className="mb-6 flex items-start gap-3">
          <div
            className="mt-1 h-6 w-1.5 shrink-0 rounded-full"
            style={{ background: "linear-gradient(180deg, #ea580c, #f97316)" }}
          />
          <div>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
              Aynı Sınıftan Diğer İçerikler
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {doc.grade}. sınıf düzeyindeki diğer kayıtlar
            </p>
          </div>
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

      {/* ── ALT NAVİGASYON KARTLARI ── */}
      <section
        className="border-t border-slate-200/60"
        style={{
          background:
            "linear-gradient(180deg, #eef5ff 0%, #ffffff 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm">
            <div
              className="border-b border-slate-200/60 px-5 py-4 sm:px-6"
              style={{
                background:
                  "linear-gradient(135deg, #f0f6ff 0%, #fff8f2 100%)",
              }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{
                      background:
                        "linear-gradient(90deg, #1d4f91, #ea580c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Diğer Sayfalara Geçiş
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                    Buradan ilgili arşiv sayfalarına geç
                  </h2>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                  <span className="text-blue-800">Bu içerik</span>
                  <span className="text-slate-400">→</span>
                  <span>Arşiv sayfaları</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:px-6 sm:py-6 md:grid-cols-2">
              {/* Aynı Konu */}
              <Link
                href={topicArchiveHref}
                className="group rounded-[1.6rem] border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f0f6ff_100%)] p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-500">Aynı Konu</div>
                    <div className="mt-2 text-2xl font-black leading-tight text-slate-950">
                      Bu konuya ait diğer içerikleri aç
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {doc.topic} başlığındaki ilgili içeriklerin olduğu listeye geç.
                    </p>
                  </div>

                  <div
                    className="shrink-0 rounded-full px-3 py-2 text-white transition group-hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #1d4f91, #2f6eb7)",
                    }}
                  >
                    →
                  </div>
                </div>
              </Link>

              {/* Aynı Sınıf */}
              <Link
                href={gradeArchiveHref}
                className="group rounded-[1.6rem] border border-orange-100 bg-[linear-gradient(135deg,#ffffff_0%,#fff8f2_100%)] p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-900/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-500">Aynı Sınıf</div>
                    <div className="mt-2 text-2xl font-black leading-tight text-slate-950">
                      {doc.grade}. sınıf arşivine git
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Aynı sınıf düzeyindeki tüm yayınlara doğrudan geçiş yap.
                    </p>
                  </div>

                  <div
                    className="shrink-0 rounded-full px-3 py-2 text-white transition group-hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #ea580c, #f97316)",
                    }}
                  >
                    →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
