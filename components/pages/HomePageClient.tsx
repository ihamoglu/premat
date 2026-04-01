"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import {
  documentTypeCatalog,
  getAllTopics,
  getTopicsByGrade,
} from "@/data/catalog";

export default function HomePageClient() {
  const router = useRouter();
  const { documents } = useDocuments();

  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");

  const publishedDocs = useMemo(
    () => documents.filter((doc) => doc.published),
    [documents]
  );

  const featuredDocs = useMemo(
    () => publishedDocs.filter((doc) => doc.featured).slice(0, 6),
    [publishedDocs]
  );

  const latestDocs = useMemo(
    () =>
      [...publishedDocs]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 8),
    [publishedDocs]
  );

  const stats = useMemo(
    () => [
      { label: "Yayındaki Döküman", value: publishedDocs.length },
      {
        label: "Çözüm Bağlantısı Olan",
        value: publishedDocs.filter((doc) => doc.solutionUrl).length,
      },
      { label: "Öne Çıkan İçerik", value: featuredDocs.length },
    ],
    [publishedDocs, featuredDocs]
  );

  const gradeBlocks = useMemo(
    () =>
      (["5", "6", "7", "8"] as const).map((level) => {
        const docs = publishedDocs.filter((doc) => doc.grade === level);
        const topics = new Set(docs.map((doc) => doc.topic)).size;
        return {
          level,
          count: docs.length,
          topics,
          featured: docs.filter((doc) => doc.featured).length,
        };
      }),
    [publishedDocs]
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
        <div className="overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/95 shadow-2xl shadow-blue-950/10 sm:rounded-[2rem]">
          <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-14">
            <div className="absolute inset-0 opacity-35">
              <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-sky-100 blur-3xl sm:h-40 sm:w-40" />
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100 blur-3xl sm:h-56 sm:w-56" />
              <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-orange-100 blur-3xl sm:h-32 sm:w-32" />
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-10">
              <div>
                <div className="mb-5">
                  <Image
                    src="/brand/logo-square.png"
                    alt="premat kare logo"
                    width={220}
                    height={220}
                    className="h-auto w-[120px] sm:w-[145px] md:w-[175px]"
                    priority
                  />
                </div>

                <h1 className="max-w-3xl text-2xl font-black leading-tight text-slate-950 sm:text-3xl md:text-5xl">
                  Matematik İçin
                  <span className="block text-blue-900">
                    Düzenli ve Güvenilir Dökümanlar
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
                  Dağınık içerik yığınları yerine; sınıf, konu ve tür bazında
                  düzenlenmiş, seçilmiş ve hızlı ulaşılan bir döküman yapısı.
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                  {[
                    "Seçili içerik yapısı",
                    "Temiz arşiv deneyimi",
                    "Sınıf ve konu filtresi",
                    "Hızlı erişim akışı",
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

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/documents"
                    className="w-full rounded-2xl bg-blue-800 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-900 sm:w-auto"
                  >
                    Arşivi İncele
                  </Link>

                  <Link
                    href="/sinif/8"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 sm:w-auto"
                  >
                    8. Sınıfa Git
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
                {stats.map((item, index) => (
                  <div
                    key={item.label}
                    className={`rounded-[1.35rem] border p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5 ${
                      index === 2
                        ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                      {item.label}
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                      {item.value}
                    </div>
                  </div>
                ))}
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

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <select
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value);
                  setTopic("");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none sm:text-base"
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
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none sm:text-base"
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
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none sm:text-base"
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
                className="rounded-2xl bg-blue-700 px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 sm:text-lg"
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

                <div className="mt-4 text-3xl font-black text-slate-950">
                  {item.count}
                </div>

                <div className="mt-1 text-sm font-semibold text-slate-500">
                  Yayındaki döküman
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">
                      Konu sayısı:
                    </span>{" "}
                    {item.topics}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">
                      Öne çıkan:
                    </span>{" "}
                    {item.featured}
                  </div>
                </div>

                <div className="mt-5 text-sm font-black text-blue-800">
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
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Tüm Arşivi Gör
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

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
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
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Tümünü Aç
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

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="grid gap-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
            <h3 className="text-xl font-black text-slate-900 sm:text-2xl">
              Yapı Nasıl İşliyor?
            </h3>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "1. İçerik sisteme eklenir.",
                "2. Sınıf, konu ve türe göre düzenlenir.",
                "3. Arşivden filtrelenip doğrudan açılır.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-gradient-to-r from-blue-900 to-blue-700 p-4 text-white shadow-2xl shadow-blue-900/20 sm:p-6 md:rounded-[2rem] md:p-8">
            <h3 className="text-xl font-black sm:text-2xl">Neden premat?</h3>
            <p className="mt-3 text-sm leading-7 text-blue-100 md:text-base">
              Çünkü amaç sadece dosya yığmak değil. Aradığını hızlı bulmak,
              doğru içeriklere temiz bir yapıyla ulaşmak ve genel deneyimi güçlü
              tutmak.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}