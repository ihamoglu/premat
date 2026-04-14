"use client";

import { useMemo, useState } from "react";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import { assessDocumentQuality, getPublishReadiness } from "@/lib/document-quality";
import type { DocumentItem } from "@/types/document";

type FilterKey =
  | "all"
  | "notReady"
  | "missingMetadata"
  | "missingAnswerKey"
  | "missingVideo"
  | "missingCover";

type AdminQualityReportProps = {
  documents: DocumentItem[];
  onEdit: (doc: DocumentItem) => void;
};

const filterLabels: Record<FilterKey, string> = {
  all: "Tüm kontroller",
  notReady: "Yayına hazır değil",
  missingMetadata: "Metadata eksik",
  missingAnswerKey: "Cevap anahtarı yok",
  missingVideo: "Video/çözüm yok",
  missingCover: "Kapak yok",
};

function hasMissingMetadata(doc: DocumentItem) {
  return (
    !doc.difficulty ||
    !doc.pageCount ||
    !doc.questionCount ||
    !doc.sourceYear ||
    !doc.curriculumCode
  );
}

function matchesFilter(doc: DocumentItem, filter: FilterKey) {
  if (filter === "all") return assessDocumentQuality(doc).issues.length > 0;
  if (filter === "notReady") return !getPublishReadiness(doc).canPublish;
  if (filter === "missingMetadata") return hasMissingMetadata(doc);
  if (filter === "missingAnswerKey") return !doc.answerKeyUrl;
  if (filter === "missingVideo") return !doc.solutionUrl && !doc.hasVideoSolution;
  if (filter === "missingCover") return !doc.coverImageUrl;
  return false;
}

export default function AdminQualityReport({
  documents,
  onEdit,
}: AdminQualityReportProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const stats = useMemo(
    () => ({
      notReady: documents.filter((doc) => !getPublishReadiness(doc).canPublish)
        .length,
      missingMetadata: documents.filter(hasMissingMetadata).length,
      missingAnswerKey: documents.filter((doc) => !doc.answerKeyUrl).length,
      missingVideo: documents.filter(
        (doc) => !doc.solutionUrl && !doc.hasVideoSolution
      ).length,
      missingCover: documents.filter((doc) => !doc.coverImageUrl).length,
    }),
    [documents]
  );

  const items = useMemo(
    () =>
      documents
        .filter((doc) => matchesFilter(doc, activeFilter))
        .sort((a, b) => {
          const qualityDiff =
            assessDocumentQuality(a).score - assessDocumentQuality(b).score;
          if (qualityDiff !== 0) return qualityDiff;
          return b.createdAt.localeCompare(a.createdAt);
        })
        .slice(0, 12),
    [documents, activeFilter]
  );

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="KALİTE RAPORU"
        title="Eksik alanları toparla"
        description="Yayına hazırlık, metadata, kapak, cevap anahtarı ve çözüm sinyallerini tek yerde kontrol et."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Yayına Hazır Değil" value={stats.notReady} tone="red" />
        <StatCard label="Metadata Eksik" value={stats.missingMetadata} tone="amber" />
        <StatCard label="Cevap Anahtarı Yok" value={stats.missingAnswerKey} tone="amber" />
        <StatCard label="Çözüm Yok" value={stats.missingVideo} tone="blue" />
        <StatCard label="Kapak Yok" value={stats.missingCover} tone="amber" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {(Object.keys(filterLabels) as FilterKey[]).map((key) => {
          const active = activeFilter === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? "border-blue-700 bg-blue-800 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-800"
              }`}
            >
              {filterLabels[key]}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <InlineNotice tone="success">
            Bu filtrede kontrol gerektiren kayıt görünmüyor.
          </InlineNotice>
        ) : (
          <div className="grid gap-4">
            {items.map((doc) => {
              const readiness = getPublishReadiness(doc);
              const quality = assessDocumentQuality(doc);
              const issues = [
                ...readiness.critical.map((issue) => issue.label),
                ...readiness.warnings.map((issue) => issue.label),
              ];

              return (
                <article
                  key={doc.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          {doc.grade}. Sınıf
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {doc.type}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          Kalite {quality.score}
                        </span>
                      </div>

                      <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
                        {doc.title}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {issues.slice(0, 5).map((issue) => (
                          <span
                            key={issue}
                            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEdit(doc)}
                      className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Düzenle
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
