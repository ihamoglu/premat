"use client";

import { useEffect, useMemo, useState } from "react";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import { documentTypeCatalog, getTopicsByGrade, sourceTypeCatalog } from "@/data/catalog";
import {
  DocumentItem,
  GradeLevel,
  SourceType,
} from "@/types/document";

const gradeOptions: GradeLevel[] = ["5", "6", "7", "8"];

type FormState = {
  title: string;
  description: string;
  grade: GradeLevel;
  topic: string;
  subtopic: string;
  type: string;
  sourceType: SourceType;
  fileUrl: string;
  solutionUrl: string;
  answerKeyUrl: string;
  featured: boolean;
  published: boolean;
};

type AdminDocumentFormProps = {
  editingDoc: DocumentItem | null;
  onCancelEdit: () => void;
  onFinish: () => void;
};

const initialState: FormState = {
  title: "",
  description: "",
  grade: "5",
  topic: "",
  subtopic: "",
  type: documentTypeCatalog[0],
  sourceType: sourceTypeCatalog[0],
  fileUrl: "",
  solutionUrl: "",
  answerKeyUrl: "",
  featured: false,
  published: true,
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

export default function AdminDocumentForm({
  editingDoc,
  onCancelEdit,
  onFinish,
}: AdminDocumentFormProps) {
  const { addDocument, updateDocument, refreshDocuments } = useDocuments();

  const [form, setForm] = useState<FormState>(initialState);
  const [createdDoc, setCreatedDoc] = useState<DocumentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const topicOptions = useMemo(() => getTopicsByGrade(form.grade), [form.grade]);

  useEffect(() => {
    if (!editingDoc) {
      setForm(initialState);
      return;
    }

    setForm({
      title: editingDoc.title,
      description: editingDoc.description,
      grade: editingDoc.grade,
      topic: editingDoc.topic,
      subtopic: editingDoc.subtopic || "",
      type: editingDoc.type,
      sourceType: editingDoc.sourceType,
      fileUrl: editingDoc.fileUrl,
      solutionUrl: editingDoc.solutionUrl || "",
      answerKeyUrl: editingDoc.answerKeyUrl || "",
      featured: editingDoc.featured,
      published: editingDoc.published,
    });
  }, [editingDoc]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetFormCompletely() {
    setForm(initialState);
    setStatusMessage("");
    setStatusType("");
    onCancelEdit();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const slug = slugifyTr(form.title);

      if (editingDoc) {
        const updatedDoc: DocumentItem = {
          ...editingDoc,
          slug,
          title: form.title,
          description: form.description,
          grade: form.grade,
          topic: form.topic,
          subtopic: form.subtopic || undefined,
          type: form.type,
          sourceType: form.sourceType,
          fileUrl: form.fileUrl,
          solutionUrl: form.solutionUrl || undefined,
          answerKeyUrl: form.answerKeyUrl || undefined,
          featured: form.featured,
          published: form.published,
        };

        await updateDocument(updatedDoc);
        await refreshDocuments();

        setCreatedDoc(updatedDoc);
        setForm(initialState);
        setStatusType("success");
        setStatusMessage("Kayıt başarıyla güncellendi.");
        onFinish();
        return;
      }

      const newDoc: DocumentItem = {
        id: crypto.randomUUID(),
        slug,
        title: form.title,
        description: form.description,
        grade: form.grade,
        topic: form.topic,
        subtopic: form.subtopic || undefined,
        type: form.type,
        sourceType: form.sourceType,
        fileUrl: form.fileUrl,
        solutionUrl: form.solutionUrl || undefined,
        answerKeyUrl: form.answerKeyUrl || undefined,
        featured: form.featured,
        published: form.published,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      await addDocument(newDoc);
      await refreshDocuments();

      setCreatedDoc(newDoc);
      setForm(initialState);
      setStatusType("success");
      setStatusMessage("Kayıt başarıyla oluşturuldu.");
      onFinish();
    } catch {
      setStatusType("error");
      setStatusMessage("İşlem sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8"
      >
        <div className="mb-6">
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            {editingDoc ? "Düzenleme Modu" : "Yeni Kayıt"}
          </div>

          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
            {editingDoc ? "İçeriği Düzenle" : "Yeni İçerik Ekle"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Başlık, açıklama, bağlantı ve görünürlük bilgilerini düzenleyerek
            arşivdeki kaydı oluşturabilir ya da güncelleyebilirsin.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Başlık
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Örn: 7. Sınıf Oran Orantı Yaprak Test"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Açıklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="İçeriğin ne sunduğunu kısa ve net şekilde yaz."
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Sınıf
              </label>
              <select
                value={form.grade}
                onChange={(e) => {
                  const value = e.target.value as GradeLevel;
                  updateField("grade", value);
                  updateField("topic", "");
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}. Sınıf
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Tür
              </label>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              >
                {documentTypeCatalog.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Konu
              </label>
              <select
                value={form.topic}
                onChange={(e) => updateField("topic", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                required
              >
                <option value="">Konu seç</option>
                {topicOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Alt Konu
              </label>
              <input
                type="text"
                value={form.subtopic}
                onChange={(e) => updateField("subtopic", e.target.value)}
                placeholder="Örn: Kesir Problemleri"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Kaynak Türü
            </label>
            <select
              value={form.sourceType}
              onChange={(e) =>
                updateField("sourceType", e.target.value as SourceType)
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
            >
              {sourceTypeCatalog.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              İçerik Bağlantısı
            </label>
            <input
              type="url"
              value={form.fileUrl}
              onChange={(e) => updateField("fileUrl", e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Çözüm Bağlantısı
              </label>
              <input
                type="url"
                value={form.solutionUrl}
                onChange={(e) => updateField("solutionUrl", e.target.value)}
                placeholder="Opsiyonel çözüm bağlantısı"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Cevap Anahtarı Bağlantısı
              </label>
              <input
                type="url"
                value={form.answerKeyUrl}
                onChange={(e) => updateField("answerKeyUrl", e.target.value)}
                placeholder="Opsiyonel cevap anahtarı bağlantısı"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="h-4 w-4"
              />
              Öne çıkarılsın
            </label>

            <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => updateField("published", e.target.checked)}
                className="h-4 w-4"
              />
              Yayında görünsün
            </label>
          </div>

          {statusMessage ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                statusType === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {statusMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-blue-800 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-800/20 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "İşleniyor..."
                : editingDoc
                ? "Kaydı Güncelle"
                : "Kaydı Oluştur"}
            </button>

            {editingDoc ? (
              <button
                type="button"
                onClick={resetFormCompletely}
                disabled={submitting}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Düzenlemeyi İptal Et
              </button>
            ) : null}
          </div>
        </div>
      </form>

      <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
        <div className="mb-5">
          <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            Önizleme
          </div>

          <h2 className="mt-4 text-2xl font-black text-slate-950">
            Canlı Görünüm
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Formdan çıkan içerik burada özet olarak görünür.
          </p>
        </div>

        {!createdDoc ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Henüz önizleme oluşturulmadı.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white">
              <div className="mb-3 inline-block rounded-full bg-orange-400 px-3 py-1 text-xs font-bold">
                {createdDoc.grade}. Sınıf
              </div>

              <h3 className="text-xl font-black leading-tight">
                {createdDoc.title}
              </h3>

              <p className="mt-3 text-sm text-blue-50">
                {createdDoc.topic}
                {createdDoc.subtopic ? ` • ${createdDoc.subtopic}` : ""}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-3 text-sm text-slate-700">
                <div>
                  <span className="font-bold">Bağlantı Adresi:</span>{" "}
                  {createdDoc.slug}
                </div>
                <div>
                  <span className="font-bold">Tür:</span> {createdDoc.type}
                </div>
                <div>
                  <span className="font-bold">Kaynak:</span>{" "}
                  {createdDoc.sourceType}
                </div>
                <div>
                  <span className="font-bold">Çözüm:</span>{" "}
                  {createdDoc.solutionUrl ? "Var" : "Yok"}
                </div>
                <div>
                  <span className="font-bold">Cevap Anahtarı:</span>{" "}
                  {createdDoc.answerKeyUrl ? "Var" : "Yok"}
                </div>
                <div>
                  <span className="font-bold">Görünürlük:</span>{" "}
                  {createdDoc.published ? "Yayında" : "Taslak"}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}