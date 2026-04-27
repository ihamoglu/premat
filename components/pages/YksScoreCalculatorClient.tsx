"use client";

import { useMemo, useState } from "react";
import {
  calculateYksScore,
  isYksYear,
  yksScoreTypes,
  yksSubjects,
  yksYears,
  type YksCalculationResult,
  type YksScoreType,
  type YksSubjectKey,
  type YksYear,
} from "@/lib/yks-score";

type SubjectFormState = Record<
  YksSubjectKey,
  {
    correct: string;
    wrong: string;
  }
>;

const initialSubjects = yksSubjects.reduce((acc, subject) => {
  acc[subject.key] = {
    correct: "",
    wrong: "",
  };
  return acc;
}, {} as SubjectFormState);

const groupLabels = {
  TYT: "TYT Testleri",
  AYT: "AYT Testleri",
  YDT: "Yabancı Dil Testi",
} as const;

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
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

function formatOptionalScore(value: number | null) {
  return value === null ? "—" : formatScore(value);
}

function formatOptionalPercentile(value: number | null) {
  return value === null ? "—" : `%${formatDecimal(value)}`;
}

function formatOptionalRank(value: number | null) {
  return value === null ? "—" : formatInteger(value);
}

export default function YksScoreCalculatorClient() {
  const [year, setYear] = useState<YksYear>(2025);
  const [subjects, setSubjects] = useState<SubjectFormState>(initialSubjects);
  const [obpInput, setObpInput] = useState("");
  const [previousPlacement, setPreviousPlacement] = useState(false);
  const [vocationalExtra, setVocationalExtra] = useState(false);
  const [activeScoreType, setActiveScoreType] = useState<YksScoreType>("tyt");

  const validation = useMemo(() => {
    const errors: string[] = [];

    for (const subject of yksSubjects) {
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

    const obp = parseNumber(obpInput);
    if (Number.isNaN(obp)) {
      errors.push("OBP için geçerli bir sayı girin.");
    } else if (
      obp !== null &&
      !((obp >= 50 && obp <= 100) || (obp >= 250 && obp <= 500))
    ) {
      errors.push("OBP alanı 50-100 diploma notu veya 250-500 OBP olmalı.");
    }

    return errors;
  }, [obpInput, subjects]);

  const result = useMemo<YksCalculationResult | null>(() => {
    if (validation.length > 0) {
      return null;
    }

    return calculateYksScore({
      year,
      subjects: yksSubjects.reduce(
        (acc, subject) => {
          acc[subject.key] = {
            correct: parseNumber(subjects[subject.key].correct) ?? 0,
            wrong: parseNumber(subjects[subject.key].wrong),
          };
          return acc;
        },
        {} as Parameters<typeof calculateYksScore>[0]["subjects"]
      ),
      obp: parseNumber(obpInput),
      previousPlacement,
      vocationalExtra,
    });
  }, [
    obpInput,
    previousPlacement,
    subjects,
    validation.length,
    vocationalExtra,
    year,
  ]);

  const activeResult = result?.scores[activeScoreType] ?? null;
  const activeMeta = yksScoreTypes.find((item) => item.key === activeScoreType);

  function updateSubject(
    subjectKey: YksSubjectKey,
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
    setObpInput("");
    setPreviousPlacement(false);
    setVocationalExtra(false);
    setActiveScoreType("tyt");
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
                  YKS Puan Hesaplama
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
                  TYT, AYT ve YDT netlerini girerek seçtiğin yıl verilerine göre
                  ham puan, yerleştirme puanı, yaklaşık yüzdelik dilim ve
                  sıralama sonucunu hesapla.
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
                      if (isYksYear(selectedYear)) {
                        setYear(selectedYear);
                      }
                    }}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  >
                    {yksYears.map((item) => (
                      <option key={item} value={item}>
                        {item} YKS Verileriyle Hesapla
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-blue-900">
                    Net kuralı
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    4 yanlış 1 doğruyu götürür. Yanlış alanı boş bırakılırsa
                    doğru alanındaki değer net olarak kabul edilir.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.10em] text-slate-500">
                    Diploma notu / OBP
                  </span>
                  <input
                    type="number"
                    min="50"
                    max="500"
                    step="0.01"
                    value={obpInput}
                    onChange={(event) => setObpInput(event.target.value)}
                    placeholder="Örn. 88,40 veya 442"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={previousPlacement}
                    onChange={(event) =>
                      setPreviousPlacement(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  Geçen yıl bir programa yerleştim
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={vocationalExtra}
                    onChange={(event) =>
                      setVocationalExtra(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  Mesleki ek puan sonucunu da göster
                </label>
              </div>

              {(["TYT", "AYT", "YDT"] as const).map((group) => (
                <div key={group}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                      {groupLabels[group]}
                    </h2>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="grid gap-3">
                    {yksSubjects
                      .filter((subject) => subject.group === group)
                      .map((subject) => {
                        const net = result?.nets[subject.key] ?? 0;

                        return (
                          <div
                            key={subject.key}
                            className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition md:grid-cols-[minmax(0,1fr)_110px_110px_96px] md:items-center"
                          >
                            <div>
                              <div className="font-bold text-slate-900">
                                {subject.label}
                              </div>
                              <div className="mt-1 text-xs font-semibold text-slate-500">
                                {subject.questionCount} soru
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
                                value={subjects[subject.key].correct}
                                onChange={(event) =>
                                  updateSubject(
                                    subject.key,
                                    "correct",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
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
                                value={subjects[subject.key].wrong}
                                onChange={(event) =>
                                  updateSubject(
                                    subject.key,
                                    "wrong",
                                    event.target.value
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                              />
                            </label>

                            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-center">
                              <div className="text-[10px] font-black uppercase tracking-[0.10em] text-blue-900">
                                Net
                              </div>
                              <div className="mt-1 text-sm font-black text-blue-900">
                                {formatDecimal(net)}
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

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {yksScoreTypes.map((scoreType) => (
                    <button
                      key={scoreType.key}
                      type="button"
                      onClick={() => setActiveScoreType(scoreType.key)}
                      className={`h-10 rounded-xl border text-xs font-black transition ${
                        activeScoreType === scoreType.key
                          ? "border-blue-700 bg-blue-800 text-white shadow-md shadow-blue-900/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                      }`}
                    >
                      {scoreType.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 text-5xl font-black tracking-tight text-slate-950">
                  {activeResult?.score !== null && activeResult
                    ? formatScore(activeResult.score)
                    : "—"}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-500">
                  {activeMeta?.longLabel ?? "YKS"} ham puani
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-slate-100">
                <div className="border-r border-slate-100 p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.10em] text-slate-400">
                    Yüzdelik
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-900">
                    {formatOptionalPercentile(activeResult?.percentile ?? null)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[11px] font-black uppercase tracking-[0.10em] text-slate-400">
                    Sıralama
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-900">
                    {formatOptionalRank(activeResult?.rank ?? null)}
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

                {activeResult && !activeResult.valid ? (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
                    {activeResult.reason}
                  </div>
                ) : null}

                {result ? (
                  <>
                    <div className="grid gap-2">
                      <ResultRow
                        label="TYT toplam net"
                        value={`${formatDecimal(result.totals.tyt)} / 120`}
                      />
                      <ResultRow
                        label="AYT toplam net"
                        value={`${formatDecimal(result.totals.ayt)} / 160`}
                      />
                      <ResultRow
                        label="YDT net"
                        value={`${formatDecimal(result.totals.ydt)} / 80`}
                      />
                      <ResultRow
                        label="Aday sayısı"
                        value={
                          activeResult
                            ? formatInteger(activeResult.population)
                            : "—"
                        }
                      />
                      <ResultRow label="Veri yili" value={`${result.year} YKS`} />
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Yerleştirme Puanı
                      </div>
                      <div className="grid gap-2">
                        <ResultRow
                          label={`Y-${activeMeta?.label ?? ""} puanı`}
                          value={formatOptionalScore(
                            activeResult?.placementScore ?? null
                          )}
                        />
                        <ResultRow
                          label="Yerleştirme yüzdeliği"
                          value={formatOptionalPercentile(
                            activeResult?.placementPercentile ?? null
                          )}
                        />
                        <ResultRow
                          label="Yerleştirme sıralaması"
                          value={formatOptionalRank(
                            activeResult?.placementRank ?? null
                          )}
                        />
                        {vocationalExtra ? (
                          <>
                            <ResultRow
                              label="Ek puanlı yerleştirme"
                              value={formatOptionalScore(
                                activeResult?.vocationalPlacementScore ?? null
                              )}
                            />
                            <ResultRow
                              label="Ek puanlı sıralama"
                              value={formatOptionalRank(
                                activeResult?.vocationalPlacementRank ?? null
                              )}
                            />
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-700">
                      Bu sonuç resmi değildir. Seçilen yılın yerel referans
                      profiline, ÖSYM net kurallarına ve OBP katkılarına göre
                      üretilmiş yaklaşık tahmindir.
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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="text-right text-sm font-black text-slate-900">
        {value}
      </span>
    </div>
  );
}
