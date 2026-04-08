import { QualityResult } from "@/lib/document-quality";

type QualityPillProps = {
  quality: QualityResult;
};

const toneMap = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-red-200 bg-red-50 text-red-700",
} as const;

export default function QualityPill({ quality }: QualityPillProps) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneMap[quality.tone]}`}
      title={quality.issues.join(" ")}
    >
      Kalite {quality.score}/100 · {quality.label}
    </span>
  );
}
