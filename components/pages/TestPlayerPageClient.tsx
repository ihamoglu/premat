"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TestSetDetail } from "@/types/test";
import { supabase } from "@/lib/supabase";

export default function TestPlayerPageClient({ test }: { test: TestSetDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const reportedRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(
    (test.durationMinutes || 20) * 60
  );

  const currentQuestion = test.questions[currentIndex];

  useEffect(() => {
    if (finished || test.questions.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setFinished(true);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, test.questions.length]);

  const result = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let blank = 0;

    test.questions.forEach((question) => {
      const selected = answers[question.id];
      if (!selected) {
        blank += 1;
        return;
      }

      const option = question.options.find((item) => item.id === selected);
      if (option?.isCorrect) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });

    return { correct, wrong, blank };
  }, [answers, test.questions]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    if (!finished || reportedRef.current || test.questions.length === 0) {
      return;
    }

    reportedRef.current = true;

    const attemptId = crypto.randomUUID();
    const answerRows = test.questions.map((question) => {
      const selectedOptionId = answers[question.id] || null;
      const selectedOption = question.options.find(
        (option) => option.id === selectedOptionId
      );

      return {
        attempt_id: attemptId,
        question_id: question.id,
        selected_option_id: selectedOptionId,
        is_correct: selectedOption ? selectedOption.isCorrect : null,
      };
    });

    void supabase
      .from("test_attempts")
      .insert({
        id: attemptId,
        question_set_id: test.id,
        completed_at: new Date().toISOString(),
        correct_count: result.correct,
        wrong_count: result.wrong,
        blank_count: result.blank,
      })
      .then(({ error }) => {
        if (error) {
          return;
        }

        void supabase.from("test_attempt_answers").insert(answerRows);
      });
  }, [answers, finished, result, test.id, test.questions]);

  if (test.questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">Test hazır değil</h1>
          <p className="mt-3 text-slate-600">Bu testte yayınlanmış soru yok.</p>
          <Link href="/testler" className="mt-6 inline-flex rounded-2xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-800">
            Testlere Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <Link href="/testler" className="text-sm font-bold text-blue-800">
              ← Testlere Dön
            </Link>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">
              {test.title}
            </h1>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-lg font-black text-blue-900">
            {minutes}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {finished ? (
            <div>
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
                Sonuç
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">
                Test tamamlandı
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="text-sm font-semibold text-emerald-700">Doğru</div>
                  <div className="mt-2 text-4xl font-black text-emerald-800">{result.correct}</div>
                </div>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <div className="text-sm font-semibold text-red-700">Yanlış</div>
                  <div className="mt-2 text-4xl font-black text-red-800">{result.wrong}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-600">Boş</div>
                  <div className="mt-2 text-4xl font-black text-slate-900">{result.blank}</div>
                </div>
              </div>
              <button type="button" onClick={() => { setFinished(false); reportedRef.current = false; setAnswers({}); setCurrentIndex(0); setSecondsLeft((test.durationMinutes || 20) * 60); }} className="mt-6 rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50">
                Yeniden Başlat
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                  Soru {currentIndex + 1}/{test.questions.length}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {currentQuestion.topic}
                </span>
              </div>

              <h2 className="text-2xl font-black leading-snug text-slate-950">
                {currentQuestion.questionText}
              </h2>

              <div className="mt-6 grid gap-3">
                {currentQuestion.options.map((option) => {
                  const active = answers[currentQuestion.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [currentQuestion.id]: option.id,
                        }))
                      }
                      className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition ${
                        active
                          ? "border-blue-700 bg-blue-50 text-blue-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                      }`}
                    >
                      {option.label}) {option.text}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Önceki
                </button>
                <button type="button" onClick={() => setCurrentIndex((value) => Math.min(test.questions.length - 1, value + 1))} className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-800">
                  Sonraki
                </button>
                <button type="button" onClick={() => setFinished(true)} className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20">
                  Sınavı Bitir
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-black text-slate-950">Soru Navigasyonu</div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {test.questions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`aspect-square rounded-xl border text-sm font-black ${
                  currentIndex === index
                    ? "border-blue-700 bg-blue-800 text-white"
                    : answers[question.id]
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
