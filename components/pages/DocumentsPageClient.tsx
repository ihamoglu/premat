"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DocumentCard from "@/components/documents/DocumentCard";
import { DocumentItem, GradeLevel } from "@/types/document";
import {
  documentTypeCatalog,
  getAllTopics,
  getTopicsByGrade,
} from "@/data/catalog";

const gradePills: Array<{ value: "Tümü" | GradeLevel; label: string }> = [
  { value: "Tümü", label: "Tümü" },
  { value: "5", label: "5. Sınıf" },
  { value: "6", label: "6. Sınıf" },
  { value: "7", label: "7. Sınıf" },
  { value: "8", label: "8. Sınıf" },
];

export default function DocumentsPageClient({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedGradeParam = searchParams.get("grade");
  const selectedTopic = searchParams.get("topic") || "";
  const selectedType = searchParams.get("type") || "";

  const selectedGrade: "Tümü" | GradeLevel =
    selectedGradeParam === "5" ||
    selectedGradeParam === "6" ||
    selectedGradeParam === "7" ||
    selectedGradeParam === "8"
      ? selectedGradeParam
      : "Tümü";

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesGrade =
        selectedGrade === "Tümü" ? true : doc.grade === selectedGrade;

      const matchesTopic = selectedTopic ? doc.topic === selectedTopic : true;
      const matchesType = selectedType ? doc.type === selectedType : true;

      return matchesGrade && matchesTopic && matchesType;
    });
  }, [documents, selectedGrade, selectedTopic, selectedType]);

  const topicOptions = useMemo(() => {
    return selectedGrade === "Tümü"
      ? getAllTopics()
      : getTopicsByGrade(selectedGrade);
  }, [selectedGrade]);

  const featuredCount = useMemo(
    () => filteredDocs.filter((doc) => doc.featured).length,
    [filteredDocs]
  );

  const activeFilters = [
    selectedGrade !== "Tümü" ? `${selectedGrade}. Sınıf` : null,
    selectedTopic || null,
    selectedType || null,
  ].filter(Boolean);

  function updateFilters(next: {
    grade?: "Tümü" | GradeLevel;
    topic?: string;
    type?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    const nextGrade = next.grade ?? selectedGrade;
    const nextTopic = next.topic ?? selectedTopic;
    const nextType = next.type ?? selectedType;

    if (nextGrade === "Tümü") {
      params.delete("grade");
    } else {
      params.set("grade", nextGrade);
    }

    if (nextTopic) {
      params.set("topic", nextTopic);
    } else {
      params.delete("topic");
    }

    if (nextType) {
      params.set("type", nextType);
    } else {
      params.delete("type");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function resetFilters() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#f8fbff_55%,#f8fbff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/40 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-800"
          >
            ← Ana Sayfaya Dön
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-8">
            <div>
              <div className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800 shadow-sm">
                PREMAT ARŞİVİ
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                Tüm dökümanlar
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-lg md:leading-8">
                Yayındaki tüm içerikler burada listelenir. Filtreleri
                kullanarak ihtiyacın olan kayıtlara daha hızlı, daha temiz ve
                daha kontrollü şekilde ulaşabilirsin.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.45rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Toplam Kayıt
                </div>
                <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {documents.length}
                </div>
              </div>

              <div className="rounded-[1.45rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Gösterilen
                </div>
                <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {filteredDocs.length}
                </div>
              </div>

              <div className="rounded-[1.45rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
                <div className="text-sm font-medium text-slate-500">
                  Öne Çıkan
                </div>
                <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  {featuredCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 md:text-2xl">
                Filtrele ve daralt
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Sınıf, konu ve içerik türü seçerek arşivi doğrudan ihtiyacın
                olan alana indir.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 lg:w-auto"
            >
              Filtreleri Temizle
            </button>
          </div>

          <div className="-mx-1 mt-5 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2.5 px-1">
              {gradePills.map((item) => {
                const active = selectedGrade === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      updateFilters({
                        grade: item.value,
                        topic: "",
                      })
                    }
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_100%)] text-white shadow-md shadow-blue-900/20"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-800"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <select
              value={selectedGrade}
              onChange={(e) =>
                updateFilters({
                  grade:
                    e.target.value === "Tümü"
                      ? "Tümü"
                      : (e.target.value as GradeLevel),
                  topic: "",
                })
              }
              className="w-full min-w-0 max-w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300"
            >
              <option value="Tümü">Tüm sınıflar</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8">8. Sınıf</option>
            </select>

            <select
              value={selectedTopic}
              onChange={(e) =>
                updateFilters({
                  topic: e.target.value,
                })
              }
              className="w-full min-w-0 max-w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300"
            >
              <option value="">Tüm konular</option>
              {topicOptions.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) =>
                updateFilters({
                  type: e.target.value,
                })
              }
              className="w-full min-w-0 max-w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300"
            >
              <option value="">Tüm türler</option>
              {documentTypeCatalog.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800"
                >
                  {filter}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
                Şu an filtre uygulanmıyor
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
              Sonuçlar
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Filtrelere göre gösterilen yayınlanmış döküman listesi.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {filteredDocs.length} kayıt gösteriliyor
          </div>
        </div>

        <div className="mt-6">
          {filteredDocs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto max-w-xl">
                <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                  Eşleşen kayıt bulunamadı
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  Seçtiğin filtre kombinasyonuna uygun yayın görünmüyor.
                  Filtreleri temizleyip daha geniş bir aralıkla tekrar dene.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
