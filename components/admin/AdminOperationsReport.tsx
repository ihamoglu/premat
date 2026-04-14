"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";
import type { DocumentItem } from "@/types/document";

type OperationSummary = {
  ok: boolean;
  message?: string;
  topDocuments?: Array<{
    documentId: string;
    title: string;
    slug: string;
    total: number;
    fileOpen: number;
    detailView: number;
  }>;
};

export default function AdminOperationsReport({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [topDocuments, setTopDocuments] = useState<
    NonNullable<OperationSummary["topDocuments"]>
  >([]);

  const missingSolutionCount = useMemo(
    () => documents.filter((doc) => doc.published && !doc.solutionUrl).length,
    [documents]
  );

  const missingAnswerKeyCount = useMemo(
    () => documents.filter((doc) => doc.published && !doc.answerKeyUrl).length,
    [documents]
  );

  const videoReadyCount = useMemo(
    () => documents.filter((doc) => doc.published && doc.hasVideoSolution).length,
    [documents]
  );

  async function loadOperations() {
    setIsLoading(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const response = await fetch("/api/admin/documents/operations");
      const data = (await response.json()) as OperationSummary;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Operasyon raporu alınamadı.");
      }

      setTopDocuments(data.topDocuments ?? []);
      setStatusType("success");
      setStatusMessage("Operasyon verisi güncellendi.");
    } catch (error) {
      setTopDocuments([]);
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Operasyon raporu alınamadı."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="OPERASYON RAPORU"
        title="İçerik kullanım sinyalleri"
        description="Eksik bağlantıları ve son event kayıtlarına göre öne çıkan dokümanları kontrol et."
        actions={
          <button
            type="button"
            onClick={loadOperations}
            disabled={isLoading}
            className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Yükleniyor..." : "Kullanımı Getir"}
          </button>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Çözüm Eksik" value={missingSolutionCount} tone="amber" />
        <StatCard
          label="Cevap Anahtarı Eksik"
          value={missingAnswerKeyCount}
          tone="amber"
        />
        <StatCard label="Video Çözüm" value={videoReadyCount} tone="blue" />
      </div>

      {statusMessage ? (
        <div className="mt-5">
          <InlineNotice tone={statusType === "success" ? "success" : "error"}>
            {statusMessage}
          </InlineNotice>
        </div>
      ) : null}

      {topDocuments.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {topDocuments.map((item) => (
            <article
              key={item.documentId}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={`/documents/${item.slug}`}
                    className="text-sm font-black text-slate-950 transition hover:text-blue-900"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Detay: {item.detailView} • Dosya açma: {item.fileOpen}
                  </div>
                </div>
                <div className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-black text-blue-800">
                  {item.total} event
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
