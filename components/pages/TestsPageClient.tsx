"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TestSetSummary } from "@/types/test";

export default function TestsPageClient({ tests }: { tests: TestSetSummary[] }) {
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const topics = useMemo(
    () => Array.from(new Set(tests.map((test) => test.topic))).sort(),
    [tests]
  );

  const filtered = useMemo(
    () =>
      tests.filter((test) => {
        const gradeMatch = grade ? test.grade === grade : true;
        const topicMatch = topic ? test.topic === topic : true;
        const difficultyMatch = difficulty
          ? test.difficulty === difficulty
          : true;

        return gradeMatch && topicMatch && difficultyMatch;
      }),
    [tests, grade, topic, difficulty]
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200/60 bg-[linear-gradient(135deg,#0f2d5c_0%,#1d4f91_45%,#ea580c_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <Link
            href="/"
            className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            ← Ana Sayfa
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90">
              Online Testler
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
              Süreli matematik testleri
            </h1>
            <p className="mt-4 text-base leading-8 text-blue-100 md:text-lg">
              Yayındaki testleri sınıf, konu ve zorlukla filtrele; hazır
              olduğunda tek pencere içinde çözmeye başla.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
          <div className="grid gap-4 md:grid-cols-4">
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
            >
              <option value="">Tüm sınıflar</option>
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
              <option value="">Tüm konular</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
            >
              <option value="">Tüm zorluklar</option>
              <option value="Başlangıç">Başlangıç</option>
              <option value="Orta">Orta</option>
              <option value="İleri">İleri</option>
              <option value="Karma">Karma</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setGrade("");
                setTopic("");
                setDifficulty("");
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              Yayında test bulunamadı.
            </div>
          ) : (
            filtered.map((test) => (
              <Link
                key={test.id}
                href={`/testler/${test.slug}`}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {test.grade}. Sınıf
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {test.topic}
                  </span>
                  {test.difficulty ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      {test.difficulty}
                    </span>
                  ) : null}
                </div>
                <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                  {test.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {test.description || "Online test"}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                  <span>{test.questionCount} soru</span>
                  <span>·</span>
                  <span>{test.durationMinutes || 20} dk</span>
                  <span>·</span>
                  <span>Teste başla</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
