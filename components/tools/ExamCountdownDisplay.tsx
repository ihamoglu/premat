"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCountdownParts,
  getFallbackExamCountdowns,
  type ExamCountdown,
} from "@/lib/exam-countdowns";

type ExamCountdownDisplayProps = {
  compact?: boolean;
  className?: string;
};

type CountdownsResponse = {
  ok: boolean;
  countdowns?: ExamCountdown[];
};

const successMessage =
  "PREMAT.COM.TR SINAVA GİRECEK TÜM ÖĞRENCİLERİMİZE BAŞARILAR DİLER.";

export default function ExamCountdownDisplay({
  compact = false,
  className = "",
}: ExamCountdownDisplayProps) {
  const [countdowns, setCountdowns] = useState<ExamCountdown[]>(
    getFallbackExamCountdowns()
  );
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCountdowns() {
      try {
        const response = await fetch("/api/exam-countdowns", {
          cache: "no-store",
        });
        const data = (await response.json()) as CountdownsResponse;

        if (mounted && data.ok && data.countdowns?.length) {
          setCountdowns(data.countdowns);
        }
      } catch {
        if (mounted) {
          setCountdowns(getFallbackExamCountdowns());
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadCountdowns();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const orderedCountdowns = useMemo(
    () =>
      [...countdowns].sort((a, b) =>
        a.examKey === b.examKey ? 0 : a.examKey === "lgs" ? -1 : 1
      ),
    [countdowns]
  );

  return (
    <div
      className={`grid gap-4 ${
        compact ? "grid-cols-1" : "lg:grid-cols-2"
      } ${className}`}
    >
      {orderedCountdowns.map((item) => (
        <CountdownCard
          key={item.examKey}
          countdown={item}
          now={now}
          compact={compact}
          loading={loading}
        />
      ))}
    </div>
  );
}

function CountdownCard({
  countdown,
  now,
  compact,
  loading,
}: {
  countdown: ExamCountdown;
  now: Date;
  compact: boolean;
  loading: boolean;
}) {
  const parts = getCountdownParts(countdown.examAt, now);
  const title =
    countdown.examKey === "lgs"
      ? "LGS’ye Kaç Gün Kaldı?"
      : "YKS’ye Kaç Gün Kaldı?";
  const dateLabel = new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(countdown.examAt));

  return (
    <article
      className={`relative overflow-hidden rounded-[1.75rem] border border-blue-100/70 bg-white text-white shadow-2xl shadow-blue-900/15 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          background:
            "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 45%, #2f6eb7 72%, #ea580c 100%)",
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
              {countdown.label} Sayacı
            </div>
            <h2
              className={`mt-3 font-black leading-tight tracking-[-0.03em] ${
                compact ? "text-xl" : "text-2xl sm:text-3xl"
              }`}
            >
              {title}
            </h2>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-center backdrop-blur-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/70">
              Tarih
            </div>
            <div className="mt-1 text-xs font-bold text-white">
              {dateLabel}
            </div>
          </div>
        </div>

        <div
          className={`mt-5 grid gap-2 ${
            compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          <TimeBox label="Gün" value={parts.days} loading={loading} />
          <TimeBox label="Saat" value={parts.hours} loading={loading} />
          <TimeBox label="Dakika" value={parts.minutes} loading={loading} />
          <TimeBox label="Saniye" value={parts.seconds} loading={loading} />
        </div>

        {parts.isFinalDay ? (
          <div className="mt-4 rounded-2xl border border-white/25 bg-white/15 p-3 text-center text-xs font-black leading-6 tracking-[0.08em] text-white">
            {successMessage}
          </div>
        ) : null}

        {parts.expired ? (
          <div className="mt-4 rounded-2xl border border-white/25 bg-white/15 p-3 text-sm font-semibold leading-6 text-white">
            Sınav tarihi geçti. Yeni tarih admin panelden güncellenebilir.
          </div>
        ) : null}
      </div>
    </article>
  );
}

function TimeBox({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/15 px-2 py-3 text-center shadow-inner shadow-white/5 backdrop-blur-sm">
      <div className="text-2xl font-black tabular-nums tracking-[-0.04em] text-white sm:text-3xl">
        {loading ? "--" : String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.13em] text-white/75">
        {label}
      </div>
    </div>
  );
}
