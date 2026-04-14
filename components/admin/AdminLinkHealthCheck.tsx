"use client";

import { useState } from "react";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";

type LinkCheckResult = {
  id: string;
  slug: string;
  title: string;
  hasIssue: boolean;
  links: Array<{
    kind: "file" | "solution" | "answerKey";
    url: string;
    ok: boolean;
    status: number | null;
    statusText: string;
  }>;
};

type LinkCheckResponse = {
  ok: boolean;
  message?: string;
  checked?: number;
  issueCount?: number;
  results?: LinkCheckResult[];
};

const linkKindLabels = {
  file: "Dosya",
  solution: "Çözüm",
  answerKey: "Cevap Anahtarı",
} as const;

export default function AdminLinkHealthCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [results, setResults] = useState<LinkCheckResult[]>([]);

  async function handleCheckLinks() {
    setIsChecking(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const response = await fetch("/api/admin/documents/link-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: 25 }),
      });

      const data = (await response.json()) as LinkCheckResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Link kontrolü başarısız.");
      }

      setResults(data.results ?? []);
      setStatusType("success");
      setStatusMessage(
        `${data.checked ?? 0} kayıt kontrol edildi. Sorunlu kayıt: ${
          data.issueCount ?? 0
        }`
      );
    } catch (error) {
      setResults([]);
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Link kontrolü başarısız."
      );
    } finally {
      setIsChecking(false);
    }
  }

  const issueResults = results.filter((item) => item.hasIssue);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="OPERASYON KONTROLÜ"
        title="Link sağlığı"
        description="Son eklenen kayıtların dosya, çözüm ve cevap anahtarı bağlantılarını manuel kontrol et."
        actions={
          <button
            type="button"
            onClick={handleCheckLinks}
            disabled={isChecking}
            className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking ? "Kontrol ediliyor..." : "Son 25 Kaydı Kontrol Et"}
          </button>
        }
      />

      {statusMessage ? (
        <div className="mt-5">
          <InlineNotice tone={statusType === "success" ? "success" : "error"}>
            {statusMessage}
          </InlineNotice>
        </div>
      ) : null}

      {issueResults.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {issueResults.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4"
            >
              <div className="text-sm font-black text-slate-950">
                {item.title}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                /documents/{item.slug}
              </div>
              <div className="mt-3 grid gap-2">
                {item.links
                  .filter((link) => !link.ok)
                  .map((link) => (
                    <div
                      key={`${item.id}-${link.kind}`}
                      className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700"
                    >
                      {linkKindLabels[link.kind]}:{" "}
                      {link.status ?? "Hata"} {link.statusText}
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
