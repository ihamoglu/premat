"use client";

import { useMemo, useState } from "react";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import EmptyState from "@/components/ui/EmptyState";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
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

function ActionButton({
  children,
  tone = "neutral",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  const classes = {
    neutral:
      "border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-800",
    primary:
      "bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] text-white shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 hover:shadow-xl",
    success:
      "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    warning:
      "border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger: "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
  };

  return (
    <button
      {...props}
      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${classes[tone]} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
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

  const publishedCount = useMemo(
    () => documents.filter((doc) => doc.published).length,
    [documents]
  );

  const featuredCount = useMemo(
    () => documents.filter((doc) => doc.featured).length,
    [documents]
  );

  const draftCount = useMemo(
    () => documents.filter((doc) => !doc.published).length,
    [documents]
  );

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
        doc.published ? "Kayıt yayından kaldırıldı." : "Kayıt yayına alındı."
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
        doc.featured ? "Öne çıkarma kaldırıldı." : "Kayıt öne çıkanlara alındı."
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

  async function handleCopyLink(doc: DocumentItem) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/documents/${doc.slug}`);
      setStatusType("success");
      setStatusMessage("Detay bağlantısı panoya kopyalandı.");
    } catch {
      setStatusType("error");
      setStatusMessage("Bağlantı kopyalanamadı.");
    }
  }

  function resetFilters() {
    setSearch("");
    setSelectedGrade("Tümü");
    setSelectedType("");
    setSelectedTopic("");
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="KAYIT YÖNETİMİ"
        title="Mevcut içerikler"
        description="Kayıtları ara, filtrele, düzenle, kopyala veya yayın durumlarını buradan yönet."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Kayıt" value={documents.length} />
        <StatCard label="Yayında" value={publishedCount} tone="emerald" />
        <StatCard label="Taslak" value={draftCount} tone="amber" />
        <StatCard label="Öne Çıkan" value={featuredCount} tone="blue" />
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 md:p-5">
        <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr_auto]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık, konu, açıklama veya slug ile ara"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400"
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
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Temizle
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            Gösterilen kayıt: {filteredDocuments.length}
          </span>
          {selectedGrade !== "Tümü" ? (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800">
              {selectedGrade}. Sınıf
            </span>
          ) : null}
          {selectedTopic ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
              {selectedTopic}
            </span>
          ) : null}
          {selectedType ? (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
              {selectedType}
            </span>
          ) : null}
        </div>
      </div>

      {statusMessage ? (
        <div className="mt-5">
          <InlineNotice tone={statusType === "success" ? "success" : "error"}>
            {statusMessage}
          </InlineNotice>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {filteredDocuments.length === 0 ? (
          <EmptyState
            title="Filtreye uygun kayıt bulunamadı"
            description="Daha geniş bir aralıkla arama yap veya filtreleri temizle."
            action={
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
              >
                Filtreleri Temizle
              </button>
            }
          />
        ) : (
          filteredDocuments.map((doc) => {
            const isWorking = workingId === doc.id;

            return (
              <article
                key={doc.id}
                className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-[0_18px_50px_rgba(37,99,235,0.08)]"
              >
                <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {doc.grade}. Sınıf
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {doc.type}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {doc.topic}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        doc.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {doc.published ? "Yayında" : "Taslak"}
                    </span>
                    {doc.featured ? (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        Öne Çıkan
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-5 p-5 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                      {doc.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {doc.description}
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-medium text-slate-500">Slug</div>
                        <div className="mt-2 break-all text-sm font-semibold text-slate-800">
                          {doc.slug}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-medium text-slate-500">Alt Konu</div>
                        <div className="mt-2 text-sm font-semibold text-slate-800">
                          {doc.subtopic || "Yok"}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-medium text-slate-500">Kaynak</div>
                        <div className="mt-2 text-sm font-semibold text-slate-800">
                          {doc.sourceType}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                      <a
                        href={`/documents/${doc.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-800 transition hover:text-blue-900"
                      >
                        Public detay →
                      </a>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-800 transition hover:text-blue-900"
                      >
                        Dosya bağlantısı →
                      </a>
                      {doc.solutionUrl ? (
                        <a
                          href={doc.solutionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 transition hover:text-emerald-800"
                        >
                          Çözüm bağlantısı →
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <ActionButton
                        type="button"
                        onClick={() => onEdit(doc)}
                        disabled={isWorking}
                        tone="primary"
                      >
                        Düzenle
                      </ActionButton>

                      <ActionButton
                        type="button"
                        onClick={() => handleDuplicate(doc)}
                        disabled={isWorking}
                      >
                        Kopyala
                      </ActionButton>

                      <ActionButton
                        type="button"
                        onClick={() => handleCopyLink(doc)}
                        disabled={isWorking}
                      >
                        Linki Kopyala
                      </ActionButton>

                      <ActionButton
                        type="button"
                        onClick={() => handleTogglePublished(doc)}
                        disabled={isWorking}
                        tone={doc.published ? "warning" : "success"}
                      >
                        {doc.published ? "Taslağa Al" : "Yayına Al"}
                      </ActionButton>

                      <ActionButton
                        type="button"
                        onClick={() => handleToggleFeatured(doc)}
                        disabled={isWorking}
                        tone={doc.featured ? "neutral" : "warning"}
                      >
                        {doc.featured ? "Öne Çıkanı Kaldır" : "Öne Çıkan Yap"}
                      </ActionButton>

                      <ActionButton
                        type="button"
                        onClick={() => handleDelete(doc)}
                        disabled={isWorking}
                        tone="danger"
                        className="sm:col-span-2 xl:col-span-1"
                      >
                        Sil
                      </ActionButton>
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
