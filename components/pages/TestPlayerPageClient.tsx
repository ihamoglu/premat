"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { TestSetDetail } from "@/types/test";

type PlayerState = "intro" | "running" | "finished";

export default function TestPlayerPageClient({ test }: { test: TestSetDetail }) {
  const [playerState, setPlayerState] = useState<PlayerState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const reportedRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(
    (test.durationMinutes || 20) * 60
  );

  const currentQuestion = test.questions[currentIndex];
  const totalSeconds = (test.durationMinutes || 20) * 60;
  const answeredCount = Object.keys(answers).length;
  const progressPercent =
    test.questions.length > 0
      ? Math.round((answeredCount / test.questions.length) * 100)
      : 0;

  useEffect(() => {
    if (playerState !== "running" || test.questions.length === 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setPlayerState("finished");
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [playerState, test.questions.length]);

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
      if (option?.isCorrect) correct += 1;
      else wrong += 1;
    });

    return { correct, wrong, blank };
  }, [answers, test.questions]);

  useEffect(() => {
    if (
      playerState !== "finished" ||
      reportedRef.current ||
      test.questions.length === 0
    ) {
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
        if (!error) {
          void supabase.from("test_attempt_answers").insert(answerRows);
        }
      });
  }, [answers, playerState, result, test.id, test.questions]);

  function startTest() {
    reportedRef.current = false;
    setAnswers({});
    setCurrentIndex(0);
    setSecondsLeft(totalSeconds);
    setPlayerState("running");
  }

  function restartTest() {
    startTest();
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  if (test.questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-slate-950">Test hazır değil</h1>
          <p className="mt-3 text-slate-600">Bu testte yayınlanmış soru yok.</p>
          <Link
            href="/testler"
            className="mt-6 inline-flex rounded-2xl border border-blue-200 px-5 py-3 text-sm font-bold text-blue-800"
          >
            Testlere Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_20%,#f8fafc_100%)] px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/testler" className="text-sm font-bold text-blue-800">
          ← Testlere Dön
        </Link>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0f2d5c_0%,#1d4f91_52%,#ea580c_100%)] p-5 text-white md:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs font-black">
                  <span className="rounded-full bg-white/18 px-3 py-1">
                    {test.grade}. Sınıf
                  </span>
                  <span className="rounded-full bg-white/18 px-3 py-1">
                    {test.topic}
                  </span>
                  {test.difficulty ? (
                    <span className="rounded-full bg-white/18 px-3 py-1">
                      {test.difficulty}
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] md:text-4xl">
                  {test.title}
                </h1>
                {test.description ? (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50 md:text-base">
                    {test.description}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <Metric value={test.questions.length} label="Soru" />
                <Metric value={test.durationMinutes || 20} label="Dakika" />
                <Metric value={progressPercent} label="Tamam" suffix="%" />
              </div>
            </div>
          </div>

          {playerState === "intro" ? (
            <IntroPanel test={test} onStart={startTest} />
          ) : playerState === "finished" ? (
            <ResultPanel
              result={result}
              total={test.questions.length}
              onRestart={restartTest}
            />
          ) : (
            <div className="p-4 md:p-6">
              <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-lg font-black text-blue-900">
                      {minutes}:{String(seconds).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-950">
                        Soru {currentIndex + 1}/{test.questions.length}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        {answeredCount} cevaplandı
                      </div>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white lg:w-[360px]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#1d4f91,#ea580c)] transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12">
                  {test.questions.map((question, index) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`aspect-square rounded-xl border text-sm font-black transition ${
                        currentIndex === index
                          ? "border-blue-800 bg-blue-800 text-white"
                          : answers[question.id]
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <article className="mt-5 rounded-[1.6rem] border border-slate-200 bg-white p-5 md:p-7">
                <h2 className="text-xl font-black leading-snug text-slate-950 md:text-2xl">
                  {currentQuestion.questionText}
                </h2>

                {currentQuestion.questionImageUrl ? (
                  <div className="mt-5 overflow-auto rounded-[1.4rem] border border-slate-200 bg-slate-50 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentQuestion.questionImageUrl}
                      alt={`Soru ${currentIndex + 1} görseli`}
                      className="mx-auto h-auto max-h-[62vh] max-w-full object-contain"
                    />
                  </div>
                ) : null}

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
                        className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                          active
                            ? "border-blue-800 bg-blue-50 text-blue-950 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/40"
                        }`}
                      >
                        <span className="flex gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              active
                                ? "bg-blue-800 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="pt-1">{option.text}</span>
                        </span>
                        {option.imageUrl ? (
                          <span className="mt-3 block overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={option.imageUrl}
                              alt={`${option.label} seçeneği görseli`}
                              className="mx-auto h-auto max-h-[220px] max-w-full object-contain"
                            />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap justify-between gap-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                    >
                      Önceki
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentIndex((value) =>
                          Math.min(test.questions.length - 1, value + 1)
                        )
                      }
                      className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-800"
                    >
                      Sonraki
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlayerState("finished")}
                    className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20"
                  >
                    Sınavı Bitir
                  </button>
                </div>
              </article>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur">
      <div className="text-2xl font-black">
        {value}
        {suffix}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-wide text-blue-50">
        {label}
      </div>
    </div>
  );
}

function IntroPanel({
  test,
  onStart,
}: {
  test: TestSetDetail;
  onStart: () => void;
}) {
  return (
    <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1fr_340px]">
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
          Hazır olduğunda testi başlat
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          Süre başlat düğmesine bastığında çalışır. Sorular arasında geçiş
          yapabilir, boş bırakabilir ve sınavı istediğin anda bitirebilirsin.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition hover:-translate-y-0.5"
        >
          Teste Başla
        </button>
      </div>
      <div className="rounded-[1.6rem] border border-blue-100 bg-blue-50 p-6">
        <div className="text-sm font-black text-blue-950">Test Özeti</div>
        <div className="mt-5 grid gap-3">
          <SummaryRow label="Soru sayısı" value={`${test.questions.length} soru`} />
          <SummaryRow label="Süre" value={`${test.durationMinutes || 20} dakika`} />
          <SummaryRow label="Konu" value={test.topic} />
          <SummaryRow label="Sınıf" value={`${test.grade}. Sınıf`} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
  );
}

function ResultPanel({
  result,
  total,
  onRestart,
}: {
  result: { correct: number; wrong: number; blank: number };
  total: number;
  onRestart: () => void;
}) {
  const score = total > 0 ? Math.round((result.correct / total) * 100) : 0;

  return (
    <div className="p-5 md:p-8">
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,#1d4f91,#ea580c)] text-3xl font-black text-white shadow-xl shadow-blue-900/20">
          {score}
        </div>
        <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-950">
          Test tamamlandı
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ResultMetric label="Doğru" value={result.correct} tone="emerald" />
          <ResultMetric label="Yanlış" value={result.wrong} tone="red" />
          <ResultMetric label="Boş" value={result.blank} tone="slate" />
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
        >
          Yeniden Başlat
        </button>
      </div>
    </div>
  );
}

function ResultMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "red" | "slate";
}) {
  const classes = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-800",
    slate: "border-slate-200 bg-white text-slate-900",
  };

  return (
    <div className={`rounded-2xl border p-5 ${classes[tone]}`}>
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-2 text-4xl font-black">{value}</div>
    </div>
  );
}
