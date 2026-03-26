"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DocumentCard from "@/components/documents/DocumentCard";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import { GradeLevel } from "@/types/document";
import { documentTypeCatalog, getAllTopics, getTopicsByGrade } from "@/data/catalog";

export default function DocumentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { documents } = useDocuments();

  const initialGrade = searchParams.get("grade");
  const initialTopic = searchParams.get("topic") || "";
  const initialType = searchParams.get("type") || "";

  const [selectedGrade, setSelectedGrade] = useState<"Tümü" | GradeLevel>(
    initialGrade === "5" ||
      initialGrade === "6" ||
      initialGrade === "7" ||
      initialGrade === "8"
      ? initialGrade
      : "Tümü"
  );

  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedType, setSelectedType] = useState(initialType);

  const publishedDocs = useMemo(
    () => documents.filter((doc) => doc.published),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    return publishedDocs.filter((doc) => {
      const matchesGrade =
        selectedGrade === "Tümü" ? true : doc.grade === selectedGrade;

      const matchesTopic = selectedTopic ? doc.topic === selectedTopic : true;
      const matchesType = selectedType ? doc.type === selectedType : true;

      return matchesGrade && matchesTopic && matchesType;
    });
  }, [publishedDocs, selectedGrade, selectedTopic, selectedType]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedGrade !== "Tümü") params.set("grade", selectedGrade);
    if (selectedTopic) params.set("topic", selectedTopic);
    if (selectedType) params.set("type", selectedType);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [selectedGrade, selectedTopic, selectedType, pathname, router]);

  const topicOptions = useMemo(() => {
    return selectedGrade === "Tümü"
      ? getAllTopics()
      : getTopicsByGrade(selectedGrade);
  }, [selectedGrade]);

  const activeFilters = [
    selectedGrade !== "Tümü" ? `${selectedGrade}. Sınıf` : null,
    selectedTopic || null,
    selectedType || null,
  ].filter(Boolean);

  function resetFilters() {
    setSelectedGrade("Tümü");
    setSelectedTopic("");
    setSelectedType("");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <Link
            href="/"
            className="mb-5 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            ← Ana Sayfaya Dön
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                Premat Arşivi
              </div>

              <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                Tüm Dökümanlar
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Yayındaki tüm içerikler burada listelenir. Filtreleri kullanarak
                ihtiyacın olan kayıtlara daha hızlı ve daha temiz şekilde
                ulaşabilirsin.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-500">
                  Toplam Kayıt
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {publishedDocs.length}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-500">
                  Gösterilen
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {filteredDocs.length}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-500">
                  Aktif Filtre
                </div>
                <div className="mt-2 text-3xl font-black text-slate-950">
                  {activeFilters.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-950">Filtrele</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sınıf, konu ve tür seçerek arşivi daralt.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <select
              value={selectedGrade}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedGrade(
                  value === "Tümü" ? "Tümü" : (value as GradeLevel)
                );
                setSelectedTopic("");
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="Tümü">Tüm sınıflar</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8">8. Sınıf</option>
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none"
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
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="">Tüm türler</option>
              {documentTypeCatalog.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Temizle
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800"
                >
                  {filter}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500">
                Şu an filtre uygulanmıyor
              </span>
            )}
          </div>
        </div>

        <div className="mt-8">
          {filteredDocs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto max-w-xl">
                <h3 className="text-2xl font-black text-slate-950">
                  Eşleşen kayıt bulunamadı
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                  Seçtiğin kombinasyona uygun içerik görünmüyor. Filtreleri
                  temizleyip tekrar deneyebilirsin.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
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