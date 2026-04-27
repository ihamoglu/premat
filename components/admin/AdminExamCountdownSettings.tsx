"use client";

import { useEffect, useMemo, useState } from "react";
import {
  examCountdownKeys,
  fallbackExamCountdowns,
  type ExamCountdown,
  type ExamCountdownKey,
} from "@/lib/exam-countdowns";

type AdminCountdownResponse = {
  ok: boolean;
  message?: string;
  countdowns?: ExamCountdown[];
};

type FormState = Record<ExamCountdownKey, string>;

const labels: Record<ExamCountdownKey, string> = {
  lgs: "LGS",
  yks: "YKS",
};

export default function AdminExamCountdownSettings() {
  const [form, setForm] = useState<FormState>(() => ({
    lgs: toDatetimeLocalValue(fallbackExamCountdowns.lgs.examAt),
    yks: toDatetimeLocalValue(fallbackExamCountdowns.yks.examAt),
  }));
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error" | "warning";
    message: string;
  }>({ type: "loading", message: "Sınav tarihleri yükleniyor..." });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/exam-countdowns", {
          cache: "no-store",
        });
        const data = (await response.json()) as AdminCountdownResponse;

        if (!mounted) {
          return;
        }

        if (data.countdowns?.length) {
          setForm(toFormState(data.countdowns));
        }

        if (data.ok) {
          setStatus({ type: "idle", message: "" });
        } else {
          setStatus({
            type: "warning",
            message:
              data.message ||
              "Sayaç tablosu okunamadı. Fallback tarihler gösteriliyor.",
          });
        }
      } catch {
        if (mounted) {
          setStatus({
            type: "warning",
            message: "Sayaç tarihleri okunamadı. Fallback tarihler gösteriliyor.",
          });
        }
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const previewItems = useMemo(
    () =>
      examCountdownKeys.map((key) => ({
        key,
        label: labels[key],
        value: form[key],
      })),
    [form]
  );

  async function saveSettings() {
    const invalidKey = examCountdownKeys.find((key) => !form[key]);

    if (invalidKey) {
      setStatus({
        type: "error",
        message: `${labels[invalidKey]} için geçerli bir tarih girin.`,
      });
      return;
    }

    setSaving(true);
    setStatus({ type: "loading", message: "Tarihler kaydediliyor..." });

    try {
      const response = await fetch("/api/admin/exam-countdowns", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countdowns: examCountdownKeys.map((key) => ({
            examKey: key,
            label: labels[key],
            examAt: `${form[key]}:00+03:00`,
          })),
        }),
      });
      const data = (await response.json()) as AdminCountdownResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Tarihler kaydedilemedi.");
      }

      if (data.countdowns?.length) {
        setForm(toFormState(data.countdowns));
      }

      setStatus({
        type: "success",
        message: "Sınav tarihleri kaydedildi.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Tarihler kaydedilemedi.";

      setStatus({ type: "error", message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/45 shadow-xl shadow-black/10">
      <div className="border-b border-slate-800 bg-slate-900/70 px-5 py-5 sm:px-6">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-orange-100/70">
          Araç ayarları
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
          LGS/YKS Geri Sayım Tarihleri
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
          Bu tarihler public sayaç sayfasında ve ana sayfadaki sağ sabit sayaç
          panelinde kullanılır. Saatler Türkiye saatine göre kaydedilir.
        </p>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
        {previewItems.map((item) => (
          <label
            key={item.key}
            className="block rounded-2xl border border-slate-800 bg-slate-900/55 p-4"
          >
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              {item.label} sınav tarihi
            </span>
            <input
              type="datetime-local"
              value={item.value}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [item.key]: event.target.value,
                }))
              }
              className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 text-sm font-bold text-white outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-300/10"
            />
            <span className="mt-2 block text-xs leading-5 text-slate-400">
              Kaydedilecek saat dilimi: Europe/Istanbul (+03:00)
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {status.message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              status.type === "success"
                ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                : status.type === "error"
                  ? "border-orange-300/30 bg-orange-400/12 text-orange-100"
                  : "border-slate-700 bg-slate-900/60 text-slate-200"
            }`}
          >
            {status.message}
          </div>
        ) : (
          <div className="text-sm text-slate-400">
            LGS ve YKS tarihlerini güncel tut.
          </div>
        )}

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Tarihleri Kaydet"}
        </button>
      </div>
    </section>
  );
}

function toFormState(countdowns: ExamCountdown[]): FormState {
  const next: FormState = {
    lgs: toDatetimeLocalValue(fallbackExamCountdowns.lgs.examAt),
    yks: toDatetimeLocalValue(fallbackExamCountdowns.yks.examAt),
  };

  countdowns.forEach((item) => {
    next[item.examKey] = toDatetimeLocalValue(item.examAt);
  });

  return next;
}

function toDatetimeLocalValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get(
    "minute"
  )}`;
}
