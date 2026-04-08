"use client";

import { useMemo } from "react";
import { DocumentItem } from "@/types/document";

type ReviewIssue =
  | "Kapak görseli yok"
  | "Çözüm bağlantısı yok"
  | "Cevap anahtarı yok"
  | "Açıklama zayıf"
  | "Taslak durumda";

type ReviewItem = {
  doc: DocumentItem;
  issues: ReviewIssue[];
};

type AdminReviewQueueProps = {
  documents: DocumentItem[];
  onEdit: (doc: DocumentItem) => void;
};

function buildIssues(doc: DocumentItem): ReviewIssue[] {
  const issues: ReviewIssue[] = [];

  if (!doc.coverImageUrl) {
    issues.push("Kapak görseli yok");
  }

  if (!doc.solutionUrl) {
    issues.push("Çözüm bağlantısı yok");
  }

  if (!doc.answerKeyUrl) {
    issues.push("Cevap anahtarı yok");
  }

  if ((doc.description || "").trim().length < 90) {
    issues.push("Açıklama zayıf");
  }

  if (!doc.published) {
    issues.push("Taslak durumda");
  }

  return issues;
}

function badgeClass(issue: ReviewIssue) {
  switch (issue) {
    case "Taslak durumda":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "Açıklama zayıf":
      return "border-blue-200 bg-blue-50 text-blue-800";
    default:
      return "border-red-200 bg-red-50 text-red-700";
  }
}

export default function AdminReviewQueue({
  documents,
  onEdit,
}: AdminReviewQueueProps) {
  const reviewItems = useMemo<ReviewItem[]>(() => {
    return documents
      .map((doc) => ({
        doc,
        issues: buildIssues(doc),
      }))
      .filter((item) => item.issues.length > 0)
      .sort((a, b) => b.issues.length - a.issues.length);
  }, [documents]);

  const stats = useMemo(() => {
    return {
      total: reviewItems.length,
      drafts: reviewItems.filter((item) => !item.doc.published).length,
      noCover: reviewItems.filter((item) => !item.doc.coverImageUrl).length,
      weakDescription: reviewItems.filter((item) =>
        item.issues.includes("Açıklama zayıf")
      ).length,
    };
  }, [reviewItems]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-red-700">
            İNCELEME SIRASI
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">
            Önce bunları düzelt
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Eksik görsel, zayıf açıklama, çözüm bağlantısı olmayan veya taslakta
            bekleyen kayıtları önce toparla. Panel kalitesini en hızlı burada
            yükseltirsin.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-xs font-medium text-slate-500">Toplam</div>
            <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {stats.total}
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-xs font-medium text-slate-500">Taslak</div>
            <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-amber-700">
              {stats.drafts}
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-xs font-medium text-slate-500">Görselsiz</div>
            <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-red-700">
              {stats.noCover}
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-xs font-medium text-slate-500">Açıklama zayıf</div>
            <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-blue-700">
              {stats.weakDescription}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {reviewItems.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-emerald-300 bg-emerald-50 p-10 text-center text-emerald-800">
            İnceleme kuyruğunda kayıt yok. Panel temiz görünüyor.
          </div>
        ) : (
          <div className="grid gap-4">
            {reviewItems.slice(0, 8).map((item) => (
              <article
                key={item.doc.id}
                className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {item.doc.grade}. Sınıf
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.doc.type}
                      </span>

                      {item.doc.published ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Yayında
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          Taslak
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
                      {item.doc.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.doc.description || "Açıklama yok."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.issues.map((issue) => (
                        <span
                          key={issue}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                            issue
                          )}`}
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-col">
                    <button
                      type="button"
                      onClick={() => onEdit(item.doc)}
                      className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Düzenle
                    </button>

                    <a
                      href={`/documents/${item.doc.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                    >
                      Public Sayfayı Aç
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
