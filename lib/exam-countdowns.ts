export type ExamCountdownKey = "lgs" | "yks";

export type ExamCountdown = {
  examKey: ExamCountdownKey;
  label: string;
  examAt: string;
  active: boolean;
  updatedAt?: string | null;
};

export type ExamCountdownRow = {
  exam_key: string;
  label: string;
  exam_at: string;
  active: boolean;
  updated_at?: string | null;
};

export const examCountdownKeys: ExamCountdownKey[] = ["lgs", "yks"];

export const fallbackExamCountdowns: Record<ExamCountdownKey, ExamCountdown> = {
  lgs: {
    examKey: "lgs",
    label: "LGS",
    examAt: "2026-06-13T09:30:00+03:00",
    active: true,
  },
  yks: {
    examKey: "yks",
    label: "YKS",
    examAt: "2026-06-20T10:15:00+03:00",
    active: true,
  },
};

export function getFallbackExamCountdowns() {
  return examCountdownKeys.map((key) => fallbackExamCountdowns[key]);
}

export function mapExamCountdownRow(row: ExamCountdownRow): ExamCountdown | null {
  if (!isExamCountdownKey(row.exam_key)) {
    return null;
  }

  return {
    examKey: row.exam_key,
    label: row.label,
    examAt: row.exam_at,
    active: row.active,
    updatedAt: row.updated_at ?? null,
  };
}

export function mergeWithFallbacks(rows: ExamCountdown[]) {
  const byKey = new Map<ExamCountdownKey, ExamCountdown>();

  getFallbackExamCountdowns().forEach((item) => byKey.set(item.examKey, item));
  rows.forEach((item) => byKey.set(item.examKey, item));

  return examCountdownKeys.map((key) => byKey.get(key)!);
}

export function isExamCountdownKey(value: string): value is ExamCountdownKey {
  return value === "lgs" || value === "yks";
}

export function getCountdownParts(examAt: string, now = new Date()) {
  const target = new Date(examAt);
  const diffMs = target.getTime() - now.getTime();

  if (!Number.isFinite(target.getTime()) || diffMs <= 0) {
    return {
      expired: true,
      isFinalDay: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    expired: false,
    isFinalDay: diffMs <= 86400000,
    days,
    hours,
    minutes,
    seconds,
  };
}
