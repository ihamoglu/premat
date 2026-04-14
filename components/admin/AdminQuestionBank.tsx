"use client";

import { useMemo, useState } from "react";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import { supabase } from "@/lib/supabase";
import {
  documentDifficultyCatalog,
  getTopicsByGrade,
} from "@/data/catalog";
import type { DocumentDifficulty, GradeLevel } from "@/types/document";

const optionLabels = ["A", "B", "C", "D"];

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

export default function AdminQuestionBank() {
  const [grade, setGrade] = useState<GradeLevel>("8");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"" | DocumentDifficulty>("Orta");
  const [questionText, setQuestionText] = useState("");
  const [solutionText, setSolutionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctLabel, setCorrectLabel] = useState("A");
  const [testTitle, setTestTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("20");
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const topicOptions = useMemo(() => getTopicsByGrade(grade), [grade]);

  function updateOption(index: number, value: string) {
    setOptions((current) =>
      current.map((option, itemIndex) => (itemIndex === index ? value : option))
    );
  }

  async function saveQuestion() {
    setStatusMessage("");
    setStatusType("");

    if (!topic || questionText.trim().length < 8 || options.some((item) => !item.trim())) {
      setStatusType("error");
      setStatusMessage("Konu, soru metni ve dört seçenek dolu olmalı.");
      return;
    }

    setIsSaving(true);

    try {
      const questionId = crypto.randomUUID();
      const { error: questionError } = await supabase.from("questions").insert({
        id: questionId,
        grade,
        topic,
        difficulty: difficulty || null,
        question_text: questionText.trim(),
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
        description="İlk sürümde soru ve dört seçenek girilir. İstersen aynı işlemle tek soruluk test seti de oluşturabilirsin."
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <select value={grade} onChange={(e) => { setGrade(e.target.value as GradeLevel); setTopic(""); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="5">5. Sınıf</option>
          <option value="6">6. Sınıf</option>
          <option value="7">7. Sınıf</option>
          <option value="8">8. Sınıf</option>
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Konu seç</option>
          {topicOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Zorluk yok</option>
          {documentDifficultyCatalog.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
          Yayında
        </label>
      </div>

      <div className="mt-5 grid gap-5">
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={4} placeholder="Soru metni" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400" />
        <div className="grid gap-3 md:grid-cols-2">
          {optionLabels.map((label, index) => (
            <label key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-2 block text-xs font-bold text-slate-500">Seçenek {label}</span>
              <input value={options[index]} onChange={(e) => updateOption(index, e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400" />
            </label>
          ))}
        </div>
        <select value={correctLabel} onChange={(e) => setCorrectLabel(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          {optionLabels.map((label) => <option key={label} value={label}>Doğru cevap: {label}</option>)}
        </select>
        <textarea value={solutionText} onChange={(e) => setSolutionText(e.target.value)} rows={3} placeholder="Çözüm açıklaması" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400" />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <input value={testTitle} onChange={(e) => setTestTitle(e.target.value)} placeholder="Aynı anda test oluşturmak için başlık yaz" className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400" />
          <input type="number" min={1} value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="Süre" className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400" />
        </div>
      </div>

      {statusMessage ? (
        <div className="mt-5">
          <InlineNotice tone={statusType === "success" ? "success" : "error"}>
            {statusMessage}
          </InlineNotice>
        </div>
      ) : null}

      <button type="button" onClick={saveQuestion} disabled={isSaving} className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
        {isSaving ? "Kaydediliyor..." : "Soruyu Kaydet"}
      </button>
    </section>
  );
}
