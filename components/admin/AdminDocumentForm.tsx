"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import {
  documentTypeCatalog,
  getTopicsByGrade,
  sourceTypeCatalog,
} from "@/data/catalog";
import { DocumentItem, GradeLevel, SourceType } from "@/types/document";

const gradeOptions: GradeLevel[] = ["5", "6", "7", "8"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  coverImageUrl: string;
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
  coverImageUrl: "",
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

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [localCoverPreviewUrl, setLocalCoverPreviewUrl] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const topicOptions = useMemo(() => getTopicsByGrade(form.grade), [form.grade]);
  const isEditing = Boolean(editingDoc);
  const generatedSlug = form.title ? slugifyTr(form.title) : "slug-olusturulmadi";

  useEffect(() => {
    return () => {
      if (localCoverPreviewUrl) {
        URL.revokeObjectURL(localCoverPreviewUrl);
      }
    };
  }, [localCoverPreviewUrl]);

  useEffect(() => {
    if (localCoverPreviewUrl) {
      URL.revokeObjectURL(localCoverPreviewUrl);
    }

    setCoverImageFile(null);
    setLocalCoverPreviewUrl("");
    setFileInputKey((prev) => prev + 1);

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
      coverImageUrl: editingDoc.coverImageUrl || "",
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
    if (localCoverPreviewUrl) {
      URL.revokeObjectURL(localCoverPreviewUrl);
    }

    setForm(initialState);
    setCoverImageFile(null);
    setLocalCoverPreviewUrl("");
    setFileInputKey((prev) => prev + 1);
    setStatusMessage("");
    setStatusType("");
    setCreatedDoc(null);
    onCancelEdit();
  }

  function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatusType("error");
      setStatusMessage("Yalnızca görsel dosyası yükleyebilirsin.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setStatusType("error");
      setStatusMessage("Görsel boyutu en fazla 5 MB olabilir.");
      return;
    }

    if (localCoverPreviewUrl) {
      URL.revokeObjectURL(localCoverPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setCoverImageFile(file);
    setLocalCoverPreviewUrl(previewUrl);
    setStatusType("success");
    setStatusMessage("Görsel seçildi. Kaydı kaydettiğinde yüklenecek.");
  }

  function clearCoverImage() {
    if (localCoverPreviewUrl) {
      URL.revokeObjectURL(localCoverPreviewUrl);
    }

    setCoverImageFile(null);
    setLocalCoverPreviewUrl("");
    updateField("coverImageUrl", "");
    setFileInputKey((prev) => prev + 1);
    setStatusType("");
    setStatusMessage("");
  }

  async function uploadCoverImageIfNeeded(): Promise<string | undefined> {
    if (!coverImageFile) {
      return form.coverImageUrl || undefined;
    }

    const extension = getFileExtension(coverImageFile);
    const path = `documents/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("document-covers")
      .upload(path, coverImageFile, {
        cacheControl: "3600",
        contentType: coverImageFile.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("document-covers").getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const slug = slugifyTr(form.title);
      const uploadedCoverImageUrl = await uploadCoverImageIfNeeded();

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
          coverImageUrl: uploadedCoverImageUrl,
          featured: form.featured,
          published: form.published,
        };

        await updateDocument(updatedDoc);
        await refreshDocuments();

        setCreatedDoc(updatedDoc);
        setForm(initialState);
        setCoverImageFile(null);

        if (localCoverPreviewUrl) {
          URL.revokeObjectURL(localCoverPreviewUrl);
        }

        setLocalCoverPreviewUrl("");
        setFileInputKey((prev) => prev + 1);
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
        coverImageUrl: uploadedCoverImageUrl,
        featured: form.featured,
        published: form.published,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      await addDocument(newDoc);
      await refreshDocuments();

      setCreatedDoc(newDoc);
      setForm(initialState);
      setCoverImageFile(null);

      if (localCoverPreviewUrl) {
        URL.revokeObjectURL(localCoverPreviewUrl);
      }

      setLocalCoverPreviewUrl("");
      setFileInputKey((prev) => prev + 1);
      setStatusType("success");
      setStatusMessage("Kayıt başarıyla oluşturuldu.");
      onFinish();
    } catch {
      setStatusType("error");
      setStatusMessage("Görsel veya kayıt işlemi sırasında bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  const livePreviewImage =
    localCoverPreviewUrl || form.coverImageUrl || createdDoc?.coverImageUrl;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8"
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800">
              {isEditing ? "DÜZENLEME MODU" : "YENİ KAYIT"}
            </div>

            <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">
              {isEditing ? "İçeriği düzenle" : "Yeni içerik ekle"}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Başlık, açıklama, bağlantılar, görsel ve görünürlük durumunu tek
              form üzerinden düzenle.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              Slug: {generatedSlug}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                form.published
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {form.published ? "Yayında" : "Taslak"}
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
              Temel bilgiler
            </h3>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Başlık
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Örn: 7. Sınıf Oran Orantı Yaprak Test"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="İçeriğin ne sunduğunu kısa ve net şekilde yaz."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
              Sınıf ve kategori
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Sınıf
                </label>
                <select
                  value={form.grade}
                  onChange={(e) => {
                    const value = e.target.value as GradeLevel;
                    updateField("grade", value);
                    updateField("topic", "");
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}. Sınıf
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tür
                </label>
                <select
                  value={form.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                >
                  {documentTypeCatalog.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Konu
                </label>
                <select
                  value={form.topic}
                  onChange={(e) => updateField("topic", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Alt Konu
                </label>
                <input
                  type="text"
                  value={form.subtopic}
                  onChange={(e) => updateField("subtopic", e.target.value)}
                  placeholder="Örn: Kesir Problemleri"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kaynak Türü
                </label>
                <select
                  value={form.sourceType}
                  onChange={(e) =>
                    updateField("sourceType", e.target.value as SourceType)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                >
                  {sourceTypeCatalog.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
              Bağlantılar ve görsel
            </h3>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  İçerik Bağlantısı
                </label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => updateField("fileUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Çözüm Bağlantısı
                  </label>
                  <input
                    type="url"
                    value={form.solutionUrl}
                    onChange={(e) => updateField("solutionUrl", e.target.value)}
                    placeholder="Opsiyonel çözüm bağlantısı"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Cevap Anahtarı Bağlantısı
                  </label>
                  <input
                    type="url"
                    value={form.answerKeyUrl}
                    onChange={(e) => updateField("answerKeyUrl", e.target.value)}
                    placeholder="Opsiyonel cevap anahtarı bağlantısı"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tanıtım Görseli Yükle
                </label>

                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleCoverImageChange}
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-900"
                />

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  PNG, JPG veya WEBP yükle. Maksimum 5 MB.
                </p>

                {(form.coverImageUrl || localCoverPreviewUrl) ? (
                  <button
                    type="button"
                    onClick={clearCoverImage}
                    className="mt-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Görseli Kaldır
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
              Yayın ayarları
            </h3>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="h-4 w-4"
                />
                Öne çıkarılsın
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => updateField("published", e.target.checked)}
                  className="h-4 w-4"
                />
                Yayında görünsün
              </label>
            </div>
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
              className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "İşleniyor..."
                : isEditing
                ? "Kaydı Güncelle"
                : "Kaydı Oluştur"}
            </button>

            <button
              type="button"
              onClick={resetFormCompletely}
              disabled={submitting}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isEditing ? "Düzenlemeyi İptal Et" : "Formu Temizle"}
            </button>
          </div>
        </div>
      </form>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
          <div className="mb-5">
            <div className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800">
              CANLI ÖNİZLEME
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-slate-950">
              İçerik kartı özeti
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Form alanlarının dışarıya nasıl yansıdığını burada hızlıca gör.
            </p>
          </div>

          <div className="space-y-4">
            {livePreviewImage ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <img
                  src={livePreviewImage}
                  alt={form.title || "Tanıtım görseli"}
                  className="h-[240px] w-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                Tanıtım görseli henüz eklenmedi.
              </div>
            )}

            <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] p-5 text-white">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-blue-900">
                  {form.grade}. Sınıf
                </span>

                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                  {form.type}
                </span>

                {form.featured ? (
                  <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white">
                    Öne Çıkan
                  </span>
                ) : null}
              </div>

              <h3 className="text-xl font-black leading-tight tracking-[-0.02em]">
                {form.title || "Başlık burada görünecek"}
              </h3>

              <p className="mt-3 text-sm leading-7 text-blue-50">
                {form.description || "Açıklama burada görünecek."}
              </p>

              <div className="mt-4 text-sm font-semibold text-white/90">
                {form.topic || "Konu seçilmedi"}
                {form.subtopic ? ` • ${form.subtopic}` : ""}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">Slug</div>
                <div className="mt-2 break-all text-sm font-semibold text-slate-800">
                  {generatedSlug}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">Kaynak</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {form.sourceType}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">Çözüm</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {form.solutionUrl ? "Var" : "Yok"}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">
                  Cevap Anahtarı
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {form.answerKeyUrl ? "Var" : "Yok"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
          <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-orange-800">
            KISA NOTLAR
          </div>

          <div className="mt-5 grid gap-3">
            {[
              "Başlık kısa ve aranabilir olursa arşiv kalitesi yükselir.",
              "Konu seçimi sınıfa uygun olmalı; filtre mantığı buna dayanır.",
              "Tanıtım görseli varsa kartlar daha güçlü görünür.",
              "Her içeriğe çözüm koymak şart değil ama varsa değeri artar.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}