"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import { supabase } from "@/lib/supabase";
import {
  documentDifficultyCatalog,
  getTopicsByGrade,
} from "@/data/catalog";
import type { DocumentDifficulty, GradeLevel } from "@/types/document";

const optionLabels = ["A", "B", "C", "D"];
const MAX_QUESTION_IMAGE_SIZE = 5 * 1024 * 1024;

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

function isValidHttpUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export default function AdminQuestionBank() {
  const [grade, setGrade] = useState<GradeLevel>("8");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"" | DocumentDifficulty>("Orta");
  const [questionText, setQuestionText] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [questionImageFile, setQuestionImageFile] = useState<File | null>(null);
  const [localQuestionImagePreviewUrl, setLocalQuestionImagePreviewUrl] =
    useState("");
  const localQuestionImagePreviewUrlRef = useRef("");
  const [imageInputKey, setImageInputKey] = useState(0);
  const [solutionText, setSolutionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctLabel, setCorrectLabel] = useState("A");
  const [testTitle, setTestTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("20");
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "warning" | "error" | ""
  >("");

  const topicOptions = useMemo(() => getTopicsByGrade(grade), [grade]);
  const questionImagePreviewUrl =
    localQuestionImagePreviewUrl || questionImageUrl.trim();

  useEffect(() => {
    return () => {
      if (localQuestionImagePreviewUrlRef.current) {
        URL.revokeObjectURL(localQuestionImagePreviewUrlRef.current);
      }
    };
  }, []);

  function updateLocalQuestionImagePreviewUrl(value: string) {
    localQuestionImagePreviewUrlRef.current = value;
    setLocalQuestionImagePreviewUrl(value);
  }

  function updateOption(index: number, value: string) {
    setOptions((current) =>
      current.map((option, itemIndex) => (itemIndex === index ? value : option))
    );
  }

  function handleQuestionImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusType("error");
      setStatusMessage("Yalnızca görsel dosyası yükleyebilirsin.");
      setImageInputKey((value) => value + 1);
      return;
    }

    if (file.size > MAX_QUESTION_IMAGE_SIZE) {
      setStatusType("error");
      setStatusMessage("Soru görseli en fazla 5 MB olabilir.");
      setImageInputKey((value) => value + 1);
      return;
    }

    if (localQuestionImagePreviewUrlRef.current) {
      URL.revokeObjectURL(localQuestionImagePreviewUrlRef.current);
    }

    setQuestionImageFile(file);
    updateLocalQuestionImagePreviewUrl(URL.createObjectURL(file));
    setQuestionImageUrl("");
    setStatusType("warning");
    setStatusMessage("Soru görseli seçildi. Kaydettiğinde yüklenecek.");
  }

  function clearQuestionImage() {
    if (localQuestionImagePreviewUrlRef.current) {
      URL.revokeObjectURL(localQuestionImagePreviewUrlRef.current);
    }

    setQuestionImageFile(null);
    updateLocalQuestionImagePreviewUrl("");
    setQuestionImageUrl("");
    setImageInputKey((value) => value + 1);
  }

  async function uploadQuestionImageIfNeeded() {
    if (!questionImageFile) {
      return questionImageUrl.trim() || null;
    }

    const extension = getFileExtension(questionImageFile);
    const path = `documents/questions/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("document-covers")
      .upload(path, questionImageFile, {
        cacheControl: "3600",
        contentType: questionImageFile.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("document-covers").getPublicUrl(path);
    return data.publicUrl;
  }

  async function saveQuestion() {
    setStatusMessage("");
    setStatusType("");

    if (!topic || questionText.trim().length < 8 || options.some((item) => !item.trim())) {
      setStatusType("error");
      setStatusMessage("Konu, soru metni ve dört seçenek dolu olmalı.");
      return;
    }

    if (!questionImageFile && !isValidHttpUrl(questionImageUrl)) {
      setStatusType("error");
      setStatusMessage("Soru görseli için geçerli bir http/https URL gir.");
      return;
    }

    setIsSaving(true);

    try {
      const questionId = crypto.randomUUID();
      const uploadedQuestionImageUrl = await uploadQuestionImageIfNeeded();
      const { error: questionError } = await supabase.from("questions").insert({
        id: questionId,
        grade,
        topic,
        difficulty: difficulty || null,
        question_text: questionText.trim(),
        question_image_url: uploadedQuestionImageUrl,
        solution_text: solutionText.trim() || null,
        published,
      });

      if (questionError) throw questionError;

      const { error: optionError } = await supabase
        .from("question_options")
        .insert(
          optionLabels.map((label, index) => ({
            question_id: questionId,
            label,
            text: options[index].trim(),
            is_correct: label === correctLabel,
          }))
        );

      if (optionError) throw optionError;

      if (testTitle.trim()) {
        const setId = crypto.randomUUID();
        const { error: setError } = await supabase.from("question_sets").insert({
          id: setId,
          slug: `${slugifyTr(testTitle)}-${Date.now()}`,
          title: testTitle.trim(),
          description: `${topic} konusu için kısa online test.`,
          grade,
          topic,
          difficulty: difficulty || null,
          duration_minutes: Number(durationMinutes) || null,
          published,
        });

        if (setError) throw setError;

        const { error: itemError } = await supabase
          .from("question_set_items")
          .insert({
            question_set_id: setId,
            question_id: questionId,
            position: 0,
          });

        if (itemError) throw itemError;
      }

      setStatusType("success");
      setStatusMessage("Soru kaydedildi.");
      setQuestionText("");
      setQuestionImageUrl("");
      setQuestionImageFile(null);
      if (localQuestionImagePreviewUrlRef.current) {
        URL.revokeObjectURL(localQuestionImagePreviewUrlRef.current);
      }
      updateLocalQuestionImagePreviewUrl("");
      setImageInputKey((value) => value + 1);
      setSolutionText("");
      setOptions(["", "", "", ""]);
      setTestTitle("");
      setPublished(false);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Soru kaydı sırasında hata oluştu."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="SORU HAVUZU"
        title="Online test için soru ekle"
        description="Soru metni, soru görseli, seçenekler ve çözüm açıklamasını gir. İstersen aynı işlemle tek soruluk test seti de oluşturabilirsin."
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <select
          value={grade}
          onChange={(e) => {
            setGrade(e.target.value as GradeLevel);
            setTopic("");
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        >
          <option value="5">5. Sınıf</option>
          <option value="6">6. Sınıf</option>
          <option value="7">7. Sınıf</option>
          <option value="8">8. Sınıf</option>
        </select>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        >
          <option value="">Konu seç</option>
          {topicOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        >
          <option value="">Zorluk yok</option>
          {documentDifficultyCatalog.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          Yayında
        </label>
      </div>

      <div className="mt-5 grid gap-5">
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={4}
          placeholder="Soru metni"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <input
              key={imageInputKey}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleQuestionImageChange}
              className="mb-3 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-900"
            />
            <input
              type="url"
              value={questionImageUrl}
              onChange={(e) => {
                if (localQuestionImagePreviewUrlRef.current) {
                  URL.revokeObjectURL(localQuestionImagePreviewUrlRef.current);
                }

                setQuestionImageFile(null);
                updateLocalQuestionImagePreviewUrl("");
                setQuestionImageUrl(e.target.value);
              }}
              placeholder="Soru görseli URL'si"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Bilgisayardan görsel yükleyebilir veya doğrudan görsel URL adresi
              girebilirsin. Büyük veya küçük görseller test ekranında taşmadan
              gösterilir.
            </p>
            {questionImagePreviewUrl ? (
              <button
                type="button"
                onClick={clearQuestionImage}
                className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Görseli Kaldır
              </button>
            ) : null}
          </div>

          {questionImagePreviewUrl ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={questionImagePreviewUrl}
                alt="Soru görseli önizleme"
                className="mx-auto max-h-[260px] max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
              Soru görseli eklenmedi.
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {optionLabels.map((label, index) => (
            <label
              key={label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="mb-2 block text-xs font-bold text-slate-500">
                Seçenek {label}
              </span>
              <input
                value={options[index]}
                onChange={(e) => updateOption(index, e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>
          ))}
        </div>

        <select
          value={correctLabel}
          onChange={(e) => setCorrectLabel(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        >
          {optionLabels.map((label) => (
            <option key={label} value={label}>
              Doğru cevap: {label}
            </option>
          ))}
        </select>

        <textarea
          value={solutionText}
          onChange={(e) => setSolutionText(e.target.value)}
          rows={3}
          placeholder="Çözüm açıklaması"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
        />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <input
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Aynı anda test oluşturmak için başlık yaz"
            className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
          />
          <input
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="Süre"
            className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
          />
        </div>
      </div>

      {statusMessage ? (
        <div className="mt-5">
          <InlineNotice
            tone={
              statusType === "success"
                ? "success"
                : statusType === "warning"
                  ? "warning"
                  : "error"
            }
          >
            {statusMessage}
          </InlineNotice>
        </div>
      ) : null}

      <button
        type="button"
        onClick={saveQuestion}
        disabled={isSaving}
        className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Kaydediliyor..." : "Soruyu Kaydet"}
      </button>
    </section>
  );
}
