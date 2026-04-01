"use client";

import { useMemo, useState } from "react";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import { DocumentItem, GradeLevel } from "@/types/document";
import {
  documentTypeCatalog,
  getAllTopics,
  getTopicsByGrade,
} from "@/data/catalog";

type AdminDocumentsListProps = {
  onEdit: (doc: DocumentItem) => void;
};

function slugifyTr(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildUniqueCopyTitle(baseTitle: string, existingTitles: string[]) {
  let candidate = `${baseTitle} Kopya`;

  if (!existingTitles.includes(candidate)) {
    return candidate;
  }

  let counter = 2;
  while (existingTitles.includes(`${baseTitle} Kopya ${counter}`)) {
    counter += 1;
  }

  return `${baseTitle} Kopya ${counter}`;
}

function buildUniqueSlug(baseSlug: string, existingSlugs: string[]) {
  let candidate = `${baseSlug}-kopya`;

  if (!existingSlugs.includes(candidate)) {
    return candidate;
  }

  let counter = 2;
  while (existingSlugs.includes(`${baseSlug}-kopya-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-kopya-${counter}`;
}

export default function AdminDocumentsList({
  onEdit,
}: AdminDocumentsListProps) {
  const { documents, deleteDocument, updateDocument, addDocument } =
    useDocuments();

  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<"Tümü" | GradeLevel>(
    "Tümü"
  );
  const [selectedType, setSelectedType] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const topicOptions = useMemo(() => {
    return selectedGrade === "Tümü"
      ? getAllTopics()
      : getTopicsByGrade(selectedGrade);
  }, [selectedGrade]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...documents]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((doc) => {
        const matchesSearch = normalizedSearch
          ? [
              doc.title,
              doc.description,
              doc.topic,
              doc.subtopic || "",
              doc.type,
              doc.grade,
              doc.slug,
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedSearch)
          : true;

        const matchesGrade =
          selectedGrade === "Tümü" ? true : doc.grade === selectedGrade;

        const matchesType = selectedType ? doc.type === selectedType : true;
        const matchesTopic = selectedTopic ? doc.topic === selectedTopic : true;

        return matchesSearch && matchesGrade && matchesType && matchesTopic;
      });
  }, [documents, search, selectedGrade, selectedType, selectedTopic]);

  async function handleDelete(doc: DocumentItem) {
    const confirmed = window.confirm(
      `"${doc.title}" kaydını silmek istediğine emin misin?`
    );

    if (!confirmed) {
      return;
    }

    setWorkingId(doc.id);
    setStatusMessage("");
    setStatusType("");

    try {
      await deleteDocument(doc.id);
      setStatusType("success");
      setStatusMessage("Kayıt silindi.");
    } catch {
      setStatusType("error");
      setStatusMessage("Kayıt silinirken hata oluştu.");
    } finally {
      setWorkingId(null);
    }
  }

  async function handleTogglePublished(doc: DocumentItem) {
    setWorkingId(doc.id);
    setStatusMessage("");
    setStatusType("");

    try {
      await updateDocument({
        ...doc,
        published: !doc.published,
      });

      setStatusType("success");
      setStatusMessage(
        doc.published
          ? "Kayıt yayından kaldırıldı."
          : "Kayıt yayına alındı."
      );
    } catch {
      setStatusType("error");
      setStatusMessage("Yayın durumu güncellenemedi.");
    } finally {
      setWorkingId(null);
    }
  }

  async function handleToggleFeatured(doc: DocumentItem) {
    setWorkingId(doc.id);
    setStatusMessage("");
    setStatusType("");

    try {
      await updateDocument({
        ...doc,
        featured: !doc.featured,
      });

      setStatusType("success");
      setStatusMessage(
        doc.featured
          ? "Öne çıkarma kaldırıldı."
          : "Kayıt öne çıkanlara alındı."
      );
    } catch {
      setStatusType("error");
      setStatusMessage("Öne çıkan durumu güncellenemedi.");
    } finally {
      setWorkingId(null);
    }
  }

  async function handleDuplicate(doc: DocumentItem) {
    setWorkingId(doc.id);
    setStatusMessage("");
    setStatusType("");

    try {
      const existingTitles = documents.map((item) => item.title);
      const existingSlugs = documents.map((item) => item.slug);

      const newTitle = buildUniqueCopyTitle(doc.title, existingTitles);
      const newSlug = buildUniqueSlug(slugifyTr(newTitle), existingSlugs);

      await addDocument({
        ...doc,
        id: crypto.randomUUID(),
        title: newTitle,
        slug: newSlug,
        featured: false,
        published: false,
        createdAt: new Date().toISOString().slice(0, 10),
      });

      setStatusType("success");
      setStatusMessage("Kayıt kopyalandı. Yeni kayıt taslak olarak oluşturuldu.");
    } catch {
      setStatusType("error");
      setStatusMessage("Kayıt kopyalanırken hata oluştu.");
    } finally {
      setWorkingId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setSelectedGrade("Tümü");
    setSelectedType("");
    setSelectedTopic("");
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            Kayıt Yönetimi
          </div>

          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
            Mevcut İçerikler
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Kayıtları ara, filtrele, hızlıca düzenle, kopyala veya yayın
            durumlarını buradan yönet.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-xs font-semibold text-slate-500">Toplam Kayıt</div>
          <div className="mt-1 text-3xl font-black text-slate-950">
            {documents.length}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 md:p-5">
        <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr_auto]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık, konu, açıklama veya slug ile ara"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400"
          />

          <select
            value={selectedGrade}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedGrade(
                value === "Tümü" ? "Tümü" : (value as GradeLevel)
              );
              setSelectedTopic("");
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Temizle
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
            Gösterilen kayıt: {filteredDocuments.length}
          </span>

          {selectedGrade !== "Tümü" ? (
            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800 ring-1 ring-blue-100">
              {selectedGrade}. Sınıf
            </span>
          ) : null}

          {selectedTopic ? (
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
              {selectedTopic}
            </span>
          ) : null}

          {selectedType ? (
            <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
              {selectedType}
            </span>
          ) : null}
        </div>
      </div>

      {statusMessage ? (
        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
            statusType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            Filtreye uygun kayıt bulunamadı.
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const isWorking = workingId === doc.id;

            return (
              <article
                key={doc.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                        {doc.grade}. Sınıf
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {doc.type}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {doc.topic}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          doc.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {doc.published ? "Yayında" : "Taslak"}
                      </span>
                      {doc.featured ? (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                          Öne Çıkan
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-xl font-black text-slate-950">
                      {doc.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {doc.description}
                    </p>

                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <span className="font-bold text-slate-800">Slug:</span>{" "}
                        {doc.slug}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Alt konu:</span>{" "}
                        {doc.subtopic || "Yok"}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Kaynak:</span>{" "}
                        {doc.sourceType}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">
                          Çözüm linki:
                        </span>{" "}
                        {doc.solutionUrl ? "Var" : "Yok"}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">
                          Cevap anahtarı:
                        </span>{" "}
                        {doc.answerKeyUrl ? "Var" : "Yok"}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">Tarih:</span>{" "}
                        {doc.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="w-full xl:w-[320px]">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <button
                        type="button"
                        onClick={() => onEdit(doc)}
                        disabled={isWorking}
                        className="rounded-2xl bg-blue-800 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Düzenle
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(doc)}
                        disabled={isWorking}
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Kopyala
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTogglePublished(doc)}
                        disabled={isWorking}
                        className={`rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${
                          doc.published
                            ? "border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {doc.published ? "Taslağa Al" : "Yayına Al"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(doc)}
                        disabled={isWorking}
                        className={`rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${
                          doc.featured
                            ? "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
                        }`}
                      >
                        {doc.featured
                          ? "Öne Çıkanı Kaldır"
                          : "Öne Çıkan Yap"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(doc)}
                        disabled={isWorking}
                        className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2 xl:col-span-1"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}