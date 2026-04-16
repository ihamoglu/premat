"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TestSetSummary } from "@/types/test";

const difficultyBadgeStyle: Record<string, string> = {
  Başlangıç: "linear-gradient(135deg,#059669,#10b981)",
  Orta: "linear-gradient(135deg,#1d4f91,#2f6eb7)",
  İleri: "linear-gradient(135deg,#ea580c,#f97316)",
  Karma: "linear-gradient(135deg,#7c3aed,#9333ea)",
};

function ClockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export default function TestsPageClient({ tests }: { tests: TestSetSummary[] }) {
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const topics = useMemo(
    () =>
      Array.from(
        new Set(
          tests.flatMap((test) =>
            test.topic
              .split(", ")
              .map((t) => t.trim())
              .filter(Boolean)
          )
        )
      ).sort(),
    [tests]
  );

  const filtered = useMemo(
    () =>
      tests.filter((test) => {
        const gradeMatch = grade ? test.grade === grade : true;
        const topicMatch = topic
          ? test.topic
              .split(", ")
              .map((t) => t.trim())
              .includes(topic)
          : true;
        const difficultyMatch = difficulty
          ? test.difficulty === difficulty
          : true;

        return gradeMatch && topicMatch && difficultyMatch;
      }),
    [tests, grade, topic, difficulty]
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #eef5ff 0%, #f8fbff 18%, #f8fafc 100%)",
      }}
    >
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden border-b border-slate-200/60"
        style={{
          background:
            "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 45%, #2f6eb7 70%, #ea580c 100%)",
        }}
      >
        {/* Dekoratif glow'lar */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -right-12 -top-12 h-56 w-56 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
          />
          <div
            className="absolute -bottom-8 left-[20%] h-40 w-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
          />
        </div>
        {/* Dekoratif arka plan sembolleri */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <span className="premat-float absolute right-[6%] top-[10%] text-[7rem] font-black text-white/5">
            ?
          </span>
          <span className="premat-float-slow absolute bottom-[8%] left-[3%] text-6xl font-black text-white/5">
            ✓
          </span>
          <span className="premat-float-fast absolute left-[55%] top-[15%] text-4xl font-black text-white/4">
            π
          </span>
          <span className="premat-float absolute right-[20%] bottom-[18%] text-3xl font-black text-white/4">
            ∞
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            ← Ana Sayfa
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
              Online Testler
            </div>
            <h1
              className="premat-gradient-text-animated mt-5 text-4xl font-black tracking-[-0.04em] md:text-6xl"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#ffffff 0%,#bfdbfe 45%,#fde68a 80%,#ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% 200%",
              }}
            >
              Süreli matematik testleri
            </h1>
            <p className="mt-4 text-base leading-8 text-blue-100 md:text-lg">
              Yayındaki testleri sınıf, konu ve zorlukla filtrele; hazır
              olduğunda tek pencere içinde çözmeye başla.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { label: "Toplam Test", value: tests.length },
              { label: "Yayındaki", value: tests.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.2rem] border border-white/30 bg-white/15 px-5 py-3 backdrop-blur-sm"
              >
                <div className="text-xs font-semibold text-white/70">{stat.label}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {/* Glassmorphism filter panel */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 45%, #ea580c 100%)",
            }}
          />
          <div className="p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                {
                  value: grade,
                  onChange: setGrade,
                  options: [
                    { value: "", label: "Tüm sınıflar" },
                    { value: "5", label: "5. Sınıf" },
                    { value: "6", label: "6. Sınıf" },
                    { value: "7", label: "7. Sınıf" },
                    { value: "8", label: "8. Sınıf" },
                  ],
                },
                {
                  value: topic,
                  onChange: setTopic,
                  options: [
                    { value: "", label: "Tüm konular" },
                    ...topics.map((item) => ({ value: item, label: item })),
                  ],
                },
                {
                  value: difficulty,
                  onChange: setDifficulty,
                  options: [
                    { value: "", label: "Tüm zorluklar" },
                    { value: "Başlangıç", label: "Başlangıç" },
                    { value: "Orta", label: "Orta" },
                    { value: "İleri", label: "İleri" },
                    { value: "Karma", label: "Karma" },
                  ],
                },
              ].map((sel, i) => (
                <select
                  key={i}
                  value={sel.value}
                  onChange={(e) => sel.onChange(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                >
                  {sel.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}

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
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white">
              <div
                className="h-[3px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg,#1d4f91,#2f6eb7,#ea580c)",
                }}
              />
              <div className="p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
                  <ClockIcon className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-black text-slate-950">
                  Yayında test bulunamadı
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Farklı bir filtre kombinasyonu dene.
                </p>
              </div>
            </div>
          ) : (
            filtered.map((test, i) => (
              <Link
                key={test.id}
                href={`/testler/${test.slug}`}
                className="premat-card-3d premat-fade-in-up group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
              >
                {/* Zorluk renkli üst şerit */}
                <div
                  className="absolute inset-x-0 top-0 h-[3px] rounded-t-[1.75rem]"
                  style={{
                    background:
                      difficultyBadgeStyle[test.difficulty ?? ""] ??
                      "linear-gradient(90deg,#1d4f91,#2f6eb7)",
                  }}
                />
                {/* Dekoratif saat ikonu arka planda */}
                <div className="pointer-events-none absolute right-4 top-4 text-slate-900/5">
                  <ClockIcon className="h-16 w-16" />
                </div>

                <div className="relative mb-4 flex flex-wrap gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-black text-white"
                    style={{
                      background: "linear-gradient(135deg,#1d4f91,#2f6eb7)",
                    }}
                  >
                    {test.grade}. Sınıf
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {test.topic}
                  </span>
                  {test.difficulty ? (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-black text-white"
                      style={{
                        background:
                          difficultyBadgeStyle[test.difficulty] ??
                          "linear-gradient(135deg,#475569,#64748b)",
                      }}
                    >
                      {test.difficulty}
                    </span>
                  ) : null}
                </div>

                <h2 className="relative text-2xl font-black tracking-[-0.03em] text-slate-950 transition group-hover:text-blue-900">
                  {test.title}
                </h2>
                <p className="relative mt-3 text-sm leading-7 text-slate-600">
                  {test.description || "Online test"}
                </p>

                <div className="relative mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#1d4f91,#ea580c)",
                      }}
                    />
                    {test.questionCount} soru
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#1d4f91,#ea580c)",
                      }}
                    />
                    {test.durationMinutes || 20} dk
                  </span>
                  <span
                    className="ml-auto rounded-full px-3 py-1 text-xs font-black text-white"
                    style={{
                      background: "linear-gradient(135deg,#ea580c,#f97316)",
                    }}
                  >
                    Teste başla →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
