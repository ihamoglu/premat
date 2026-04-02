"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AdSlot from "@/components/common/AdSlot";
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#255794_0%,#3f78bc_18%,#edf5ff_18%,#f8fbff_100%)]">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:pb-10 sm:pt-8 md:px-6 md:pb-12 md:pt-12">
        <div className="overflow-hidden rounded-[1.9rem] border border-white/30 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.10)] sm:rounded-[2.2rem]">
          <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-sky-100 blur-3xl sm:h-44 sm:w-44" />
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-blue-100 blur-3xl sm:h-56 sm:w-56" />
              <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-orange-100 blur-3xl sm:h-32 sm:w-32" />
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800 shadow-sm">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-400" />
                  PREMAT ARŞİVİ
                </div>

                <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-5xl lg:text-[3.65rem]">
                  Matematik için
                  <span className="block bg-[linear-gradient(90deg,#1d4f91_0%,#2f6eb7_40%,#ea580c_100%)] bg-clip-text text-transparent">
                    düzenli ve güvenilir döküman arşivi
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg md:leading-8">
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
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 sm:px-4 sm:text-sm"
                    >
                      ✓ {item}
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/documents"
                    className="w-full rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                  >
                    Arşivi İncele
                  </Link>

                  <Link
                    href="/sinif/8"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 sm:w-auto"
                  >
                    8. Sınıfa Git
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.85rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-xl shadow-slate-900/5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.08em] text-blue-800">
                        ARŞİV ÖNİZLEME
                      </div>
                      <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
                        Hızlı filtre, temiz erişim
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                      <div className="text-xs font-medium text-slate-500">
                        Aktif içerik
                      </div>
                      <div className="mt-1 text-2xl font-black text-blue-900">
                        {publishedDocs.length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      {
                        title: "Sınıfa göre geçiş",
                        text: "5, 6, 7 ve 8. sınıf içeriklerine tek yapıda erişim.",
                        tone: "from-blue-50 to-white text-blue-900 border-blue-100",
                      },
                      {
                        title: "Konu filtresi",
                        text: "Aranan içeriği uzun listelerde kaybolmadan bulma.",
                        tone: "from-slate-50 to-white text-slate-900 border-slate-200",
                      },
                      {
                        title: "Çözüm bağlantıları",
                        text: `Çözüm bağlantısı olan içerik sayısı: ${
                          publishedDocs.filter((doc) => doc.solutionUrl).length
                        }`,
                        tone:
                          "from-orange-50 to-white text-orange-900 border-orange-100",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className={`rounded-2xl border bg-gradient-to-r p-4 ${item.tone}`}
                      >
                        <div className="text-sm font-semibold">{item.title}</div>
                        <p className="mt-1 text-sm leading-6 opacity-80">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
                  {stats.map((item, index) => (
                    <div
                      key={item.label}
                      className={`rounded-[1.35rem] border p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5 ${
                        index === 2
                          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-500 sm:text-sm">
                        {item.label}
                      </div>
                      <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-3xl">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-5 sm:px-6 md:px-10 md:py-6">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-black tracking-[-0.02em] text-slate-900 sm:text-xl">
                  Hızlı Arama
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sınıf, konu ve tür seçerek doğrudan arşive geç.
                </p>
              </div>

              <div className="text-xs font-medium tracking-[0.08em] text-slate-400">
                DOĞRUDAN FİLTRELİ GEÇİŞ
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <select
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value);
                  setTopic("");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 sm:text-base"
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
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 sm:text-base"
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
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 sm:text-base"
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
                className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:-translate-y-0.5 hover:shadow-xl sm:text-lg"
              >
                Ara
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <AdSlot label="Öne Çıkan İçerik Öncesi Reklam Alanı" compact />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900 sm:text-2xl md:text-3xl">
                Sınıfa Göre Hızlı Geçiş
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Her sınıf için mevcut içerik yoğunluğunu gör ve doğrudan ilgili
                arşive geç.
              </p>
            </div>

            <div className="text-xs font-medium tracking-[0.08em] text-slate-400">
              5, 6, 7 VE 8. SINIF
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {gradeBlocks.map((item) => (
              <Link
                key={item.level}
                href={`/sinif/${item.level}`}
                className="group rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                  {item.level}. Sınıf
                </div>

                <div className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {item.count}
                </div>

                <div className="mt-1 text-sm font-medium text-slate-500">
                  Yayındaki döküman
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">
                      Konu sayısı:
                    </span>{" "}
                    {item.topics}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">
                      Öne çıkan:
                    </span>{" "}
                    {item.featured}
                  </div>
                </div>

                <div className="mt-5 text-sm font-semibold text-blue-800">
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
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900 sm:text-2xl md:text-3xl">
                Öne Çıkan Dökümanlar
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Seçili içerikler burada görünür.
              </p>
            </div>

            <Link
              href="/documents"
              className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-center text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
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

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900 sm:text-2xl md:text-3xl">
                Son Eklenen Dökümanlar
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Arşive en son eklenen yayınları hızlıca incele.
              </p>
            </div>

            <Link
              href="/documents"
              className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-center text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
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

      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:rounded-[2rem] md:p-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-black tracking-[-0.03em] text-slate-900 sm:text-2xl">
                  Premat nasıl çalışır?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  İçerik akışı sade ama kontrollü bir yapıda ilerler.
                </p>
              </div>

              <div className="hidden text-xs font-medium tracking-[0.08em] text-slate-400 md:block">
                3 ADIMLI AKIŞ
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "İçerik eklenir",
                  text: "Döküman sisteme yüklenir ve temel bilgileri tamamlanır.",
                },
                {
                  step: "02",
                  title: "Düzenlenir",
                  text: "Sınıf, konu ve tür bazında net bir yapıya oturtulur.",
                },
                {
                  step: "03",
                  title: "Filtrelenip açılır",
                  text: "Kullanıcı aradığını doğrudan arşivden bulur ve açar.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-blue-800">
                    {item.step}
                  </div>
                  <div className="mt-3 text-lg font-black tracking-[-0.02em] text-slate-900">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] p-4 text-white shadow-2xl shadow-blue-900/20 sm:p-6 md:rounded-[2rem] md:p-8">
            <div className="text-xs font-semibold tracking-[0.08em] text-blue-100">
              NEDEN PREMAT?
            </div>
            <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-[2rem]">
              Çünkü amaç sadece dosya yığmak değil.
            </h3>
            <p className="mt-4 text-sm leading-7 text-blue-50 md:text-base">
              Aradığını hızlı bulmak, doğru içeriklere temiz bir yapıyla
              ulaşmak ve genel deneyimi güçlü tutmak. Tasarım dili de bu
              sadeliği destekler.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                "Sade hiyerarşi",
                "Hızlı filtre akışı",
                "Güçlü arşiv görünümü",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white/95"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}