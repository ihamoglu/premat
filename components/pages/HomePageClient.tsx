"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import { DocumentItem } from "@/types/document";
import {
  documentTypeCatalog,
  getAllTopics,
  getTopicsByGrade,
} from "@/data/catalog";

export default function HomePageClient({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const router = useRouter();

  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [prekocLogoFailed, setPrekocLogoFailed] = useState(false);

  const featuredDocs = useMemo(
    () => documents.filter((doc) => doc.featured).slice(0, 6),
    [documents]
  );

  const latestDocs = useMemo(
    () =>
      [...documents]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 8),
    [documents]
  );

  const gradeBlocks = useMemo(
    () =>
      (["5", "6", "7", "8"] as const).map((level) => {
        const docs = documents.filter((doc) => doc.grade === level);
        const topics = new Set(docs.map((doc) => doc.topic)).size;

        return {
          level,
          count: docs.length,
          topics,
          featured: docs.filter((doc) => doc.featured).length,
        };
      }),
    [documents]
  );

  const topicOptions = useMemo(() => {
    return grade ? getTopicsByGrade(grade) : getAllTopics();
  }, [grade]);

  function handleSearch() {
    const params = new URLSearchParams();

    if (grade) params.set("grade", grade);
    if (topic) params.set("topic", topic);
    if (type) params.set("type", type);

    const query = params.toString();
    router.push(query ? `/documents?${query}` : "/documents");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#295c9c_0%,#4479be_18%,#eef5ff_18%,#f8fbff_100%)]">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:pb-12 sm:pt-8 md:px-6 md:pb-16 md:pt-12">
        <div className="overflow-hidden rounded-[1.9rem] border border-white/30 bg-white/95 shadow-2xl shadow-blue-950/10 sm:rounded-[2.2rem]">
          <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-14">
            <div className="absolute inset-0 opacity-35">
              <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-sky-100 blur-3xl sm:h-40 sm:w-40" />
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100 blur-3xl sm:h-56 sm:w-56" />
              <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-orange-100 blur-3xl sm:h-32 sm:w-32" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="max-w-4xl">
                <div className="mb-5">
                  <Image
                    src="/brand/logo-square.png"
                    alt="premat kare logo"
                    width={220}
                    height={220}
                    className="h-auto w-[110px] sm:w-[130px] md:w-[150px]"
                    priority
                  />
                </div>

                <h1 className="max-w-4xl text-3xl font-black leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-6xl">
                  Matematik için
                  <span className="block bg-[linear-gradient(90deg,#1d4f91_0%,#2f6eb7_42%,#ea580c_100%)] bg-clip-text text-transparent">
                    düzenli ve güvenilir
                  </span>
                  <span className="block bg-[linear-gradient(90deg,#2f6eb7_0%,#5b6b96_52%,#c2410c_100%)] bg-clip-text text-transparent">
                    döküman arşivi
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg md:leading-8">
                  Dağınık içerik yığınları yerine; sınıf, konu ve tür bazında
                  düzenlenmiş, seçilmiş ve hızlı ulaşılan bir döküman yapısı.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                  {[
                    "Seçili içerik yapısı",
                    "Sınıf ve konu filtresi",
                    "Maarif Modeli’ne uygun",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:px-4 sm:text-sm"
                    >
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <a href="https://prekoc.com.tr" className="group block">
                  <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(135deg,rgba(29,79,145,0.08)_0%,rgba(47,110,183,0.12)_55%,rgba(234,88,12,0.08)_100%)] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-5 md:p-6">
                    <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_72%)] opacity-80 transition duration-300 group-hover:opacity-100" />

                    <div className="relative flex items-center justify-between gap-3">
                      <div className="inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold tracking-[0.08em] text-blue-800">
                        KOÇLUK MODÜLÜ
                      </div>

                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-800 transition duration-300 group-hover:translate-x-0.5 group-hover:shadow-md">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M13 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative mt-4 rounded-[1.5rem] border border-white/70 bg-white/80 p-4 backdrop-blur sm:p-5">
                      <div className="flex min-h-[102px] items-center justify-center rounded-[1.25rem] border border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4 sm:min-h-[110px]">
                        {prekocLogoFailed ? (
                          <div className="text-center">
                            <div className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                              preKoç
                            </div>
                            <div className="mt-2 text-sm font-semibold text-slate-500">
                              Koçluk ürünü
                            </div>
                          </div>
                        ) : (
                          <Image
                            src="/brand/prekoc-logo.png"
                            alt="preKoç logo"
                            width={360}
                            height={140}
                            className="h-auto max-h-[64px] w-auto max-w-full object-contain sm:max-h-[72px]"
                            onError={() => setPrekocLogoFailed(true)}
                          />
                        )}
                      </div>

                      <p className="mt-3 text-center text-sm font-medium leading-6 text-slate-500">
                        Planlı takip için ayrı ürün deneyimi.
                      </p>

                      <p className="mt-1 text-center text-xs font-semibold tracking-[0.08em] text-slate-400">
                        PREKOC.COM.TR
                      </p>
                    </div>

                    <div className="relative mt-4 rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition duration-300 group-hover:shadow-xl group-hover:shadow-blue-900/20">
                      preKoç'a Geç →
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-5 sm:px-6 md:px-10 md:py-6">
            <div className="mb-4">
              <h2 className="text-base font-black text-slate-900 sm:text-lg">
                Hızlı Arama
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Sınıf, konu ve tür seçerek doğrudan arşive geç.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
              <select
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value);
                  setTopic("");
                }}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300 sm:text-base"
              >
                <option value="">Sınıf seç</option>
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf</option>
              </select>

              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300 sm:text-base"
              >
                <option value="">Konu seç</option>
                {topicOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-300 sm:text-base"
              >
                <option value="">İçerik türü</option>
                {documentTypeCatalog.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSearch}
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-700/25 transition hover:-translate-y-0.5 hover:shadow-xl md:w-auto sm:text-lg"
              >
                Ara
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
              Sınıfa Göre Hızlı Geçiş
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Her sınıf için mevcut içerik yoğunluğunu gör ve doğrudan ilgili
              arşive geç.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {gradeBlocks.map((item) => (
              <Link
                key={item.level}
                href={`/sinif/${item.level}`}
                className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                  {item.level}. Sınıf
                </div>

                <div className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950">
                  {item.count}
                </div>

                <div className="mt-1 text-sm font-medium text-slate-500">
                  Yayındaki döküman
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">Konu:</span>{" "}
                    {item.topics}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Öne çıkan:</span>{" "}
                    {item.featured}
                  </div>
                </div>

                <div className="mt-5 text-sm font-bold text-blue-800 transition group-hover:translate-x-1">
                  Arşive Git →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
                Öne Çıkan Dökümanlar
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Seçili içerikler burada görünür.
              </p>
            </div>

            <Link
              href="/documents"
              className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-center text-sm font-bold text-blue-900 transition hover:bg-blue-50"
            >
              Dökümanları İncele
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredDocs.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                Henüz öne çıkan döküman yok.
              </div>
            ) : (
              featuredDocs.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6 md:pb-14">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl md:text-3xl">
                Son Eklenen Dökümanlar
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Arşive en son eklenen yayınları hızlıca incele.
              </p>
            </div>

            <Link
              href="/documents"
              className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-center text-sm font-bold text-blue-900 transition hover:bg-blue-50"
            >
              Dökümanları İncele
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {latestDocs.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                Henüz yayınlanmış döküman yok.
              </div>
            ) : (
              latestDocs.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
