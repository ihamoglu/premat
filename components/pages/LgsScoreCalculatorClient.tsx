"use client";

import { useMemo, useState } from "react";
import {
  calculateLgsScore,
  isLgsYear,
  lgsSubjects,
  lgsYears,
  type LgsCalculationResult,
  type LgsSubjectKey,
  type LgsYear,
} from "@/lib/lgs-score";

type SubjectFormState = Record<
  LgsSubjectKey,
  {
    correct: string;
    wrong: string;
  }
>;

const initialSubjects = lgsSubjects.reduce((acc, subject) => {
  acc[subject.key] = {
    correct: "",
    wrong: "",
  };
  return acc;
}, {} as SubjectFormState);

function parseNumber(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function formatDecimal(value: number, digits = 2) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatScore(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

export default function LgsScoreCalculatorClient() {
  const [year, setYear] = useState<LgsYear>(2025);
  const [subjects, setSubjects] = useState<SubjectFormState>(initialSubjects);
  const [religionExempt, setReligionExempt] = useState(false);
  const [foreignLanguageExempt, setForeignLanguageExempt] = useState(false);

  const hasAnyInput = useMemo(
    () =>
      lgsSubjects.some(
        (subject) =>
          subjects[subject.key].correct.trim() !== "" ||
          subjects[subject.key].wrong.trim() !== ""
      ),
    [subjects]
  );

  const validation = useMemo(() => {
    const errors: string[] = [];

    for (const subject of lgsSubjects) {
      const exempt =
        (subject.key === "religion" && religionExempt) ||
        (subject.key === "foreignLanguage" && foreignLanguageExempt);

      if (exempt) {
        continue;
      }

      const correct = parseNumber(subjects[subject.key].correct);
      const wrong = parseNumber(subjects[subject.key].wrong);
      const correctValue = correct ?? 0;

      if (Number.isNaN(correct) || Number.isNaN(wrong)) {
        errors.push(`${subject.shortLabel} için geçerli bir sayı girin.`);
        continue;
      }

      if (correctValue < 0 || (wrong !== null && wrong < 0)) {
        errors.push(`${subject.shortLabel} için negatif değer girilemez.`);
      }

      if (wrong !== null && !Number.isInteger(wrong)) {
        errors.push(`${subject.shortLabel} yanlış sayısı tam sayı olmalı.`);
      }

      if (wrong === null) {
        if (correctValue > subject.questionCount) {
          errors.push(
            `${subject.shortLabel} neti ${subject.questionCount} değerini aşamaz.`
          );
        }
      } else if (correctValue + wrong > subject.questionCount) {
        errors.push(
          `${subject.shortLabel} doğru ve yanlış toplamı ${subject.questionCount} soruyu aşamaz.`
        );
      }
    }

    return errors;
  }, [foreignLanguageExempt, religionExempt, subjects]);

  const result = useMemo<LgsCalculationResult | null>(() => {
    if (!hasAnyInput || validation.length > 0) {
      return null;
    }

    return calculateLgsScore({
      year,
      exemptions: {
        religion: religionExempt,
        foreignLanguage: foreignLanguageExempt,
      },
      subjects: lgsSubjects.reduce(
        (acc, subject) => {
          acc[subject.key] = {
            correct: parseNumber(subjects[subject.key].correct) ?? 0,
            wrong: parseNumber(subjects[subject.key].wrong),
          };
          return acc;
        },
        {} as Parameters<typeof calculateLgsScore>[0]["subjects"]
      ),
    });
  }, [
    foreignLanguageExempt,
    hasAnyInput,
    religionExempt,
    subjects,
    validation.length,
    year,
  ]);

  function updateSubject(
    subjectKey: LgsSubjectKey,
    field: "correct" | "wrong",
    value: string
  ) {
    setSubjects((current) => ({
      ...current,
      [subjectKey]: {
        ...current[subjectKey],
        [field]: value,
      },
    }));
  }

  function resetForm() {
    setSubjects(initialSubjects);
    setReligionExempt(false);
    setForeignLanguageExempt(false);
    setYear(2025);
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #eef5ff 0%, #f8fbff 22%, #f8fafc 100%)",
      }}
    >
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:items-start">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div
              className="relative overflow-hidden px-5 py-7 sm:px-7 md:px-9 md:py-9"
              style={{
                background:
                  "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 46%, #2f6eb7 74%, #ea580c 100%)",
              }}
            >
              <div className="relative">
                <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                  Premat Araçları
                </div>
                <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                  2026 LGS Puan Hesaplama
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
                  Doğru ve yanlış sayılarını girerek seçtiğin yıl verilerine göre
                  tahmini MSP, yüzdelik dilim ve sıralama sonucunu hesapla.
                </p>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7 md:p-9">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.75fr)]">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    Sınav yılı verisi
                  </span>
                  <select
                    value={year}
                    onChange={(event) => {
                      const selectedYear = Number(event.target.value);
                      if (isLgsYear(selectedYear)) {
                        setYear(selectedYear);
                      }
                    }}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  >
                    {lgsYears.map((item) => (
                      <option key={item} value={item}>
                        {item} LGS Verileriyle Hesapla
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-blue-900">
                    Net kuralı
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    3 yanlış 1 doğruyu götürür. Yanlış alanını boş bırakırsan
                    doğru alanındaki değer net olarak kabul edilir.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={religionExempt}
                    onChange={(event) => setReligionExempt(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  Din Kültürü ve Ahlak Bilgisi dersinden muafım
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={foreignLanguageExempt}
                    onChange={(event) =>
                      setForeignLanguageExempt(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  Yabancı Dil dersinden muafım
                </label>
              </div>

              {(["Sözel", "Sayısal"] as const).map((group) => (
                <div key={group}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                      {group} Bölüm
                    </h2>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="grid gap-3">
                    {lgsSubjects
                      .filter((subject) => subject.group === group)
                      .map((subject) => {
                        const exempt =
                          (subject.key === "religion" && religionExempt) ||
                          (subject.key === "foreignLanguage" &&
                            foreignLanguageExempt);
                        const net =
                          result?.subjectResults[subject.key].net ?? 0;

                        return (
                          <div
                            key={subject.key}
                            className={`grid gap-3 rounded-2xl border p-4 transition md:grid-cols-[minmax(0,1fr)_110px_110px_96px] md:items-center ${
                              exempt
                                ? "border-slate-200 bg-slate-50 opacity-70"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900">
                                {subject.label}
                              </div>
                              <div className="mt-1 text-xs font-semibold text-slate-500">
                                {subject.questionCount} soru · katsayı{" "}
                                {subject.weight}
                              </div>
                            </div>

                            <label>
                              <span className="mb-1 block text-[11px] font-black uppercase tracking-[0.10em] text-slate-400">
                                Doğru / Net
                              </span>
                              <input
                                type="number"
                                min="0"
                                max={subject.questionCount}
                                step="0.01"
                                disabled={exempt}
                                value={subjects[subject.key].correct}
                                onChange={(event) =>
                                  updateSubject(
                                    subject.key,
                                    "correct",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                              />
                            </label>

                            <label>
                              <span className="mb-1 block text-[11px] font-black uppercase tracking-[0.10em] text-slate-400">
                                Yanlış
                              </span>
                              <input
                                type="number"
                                min="0"
                                max={subject.questionCount}
                                step="1"
                                disabled={exempt}
                                value={subjects[subject.key].wrong}
                                onChange={(event) =>
                                  updateSubject(
                                    subject.key,
                                    "wrong",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                              />
                            </label>

                            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-center">
                              <div className="text-[10px] font-black uppercase tracking-[0.10em] text-blue-900">
                                Net
                              </div>
                              <div className="mt-1 text-sm font-black text-blue-900">
                                {exempt ? "Muaf" : formatDecimal(net)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                >
                  Sıfırla
                </button>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="border-b border-slate-100 p-5 sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Hesaplama Sonucu
                </div>
                <div className="mt-3 text-5xl font-black tracking-tight text-slate-950">
                  {result ? formatScore(result.score) : "—"}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-500">
                  Merkezi Sınav Puanı (MSP)
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-slate-100">
                <div className="border-r border-slate-100 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.10em] text-slate-400">
                    Yüzdelik
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-900">
                    {result ? `%${formatDecimal(result.percentile)}` : "—"}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.10em] text-slate-400">
                    Sıralama
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-900">
                    {result ? formatInteger(result.rank) : "—"}
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                {validation.length > 0 ? (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <div className="text-sm font-black text-orange-900">
                      Girişleri kontrol et
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-orange-900">
                      {validation.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {result ? (
                  <>
                    <div className="grid gap-2">
                      <ResultRow
                        label="Toplam net"
                        value={`${formatDecimal(result.totalNet)} / ${result.totalQuestions}`}
                      />
                      <ResultRow
                        label="Öğrenci sayısı"
                        value={formatInteger(result.population)}
                      />
                      <ResultRow
                        label="Veri yılı"
                        value={`${result.year} LGS`}
                      />
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-700">
                      Bu sonuç resmi değildir. Seçilen yılın referans verilerine
                      ve MEB hesaplama mantığına göre üretilmiş yaklaşık
                      tahmindir.
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}
