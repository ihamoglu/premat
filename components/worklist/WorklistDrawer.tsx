"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useWorklist } from "@/components/providers/WorklistProvider";

type CollectionResponse = {
  ok: boolean;
  message?: string;
  url?: string;
};

export default function WorklistDrawer() {
  const pathname = usePathname();
  const { items, removeItem, clearItems, moveItem } = useWorklist();
  const [isOpen, setIsOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const isPanelRoute =
    pathname === "/panel" ||
    pathname === "/panel-giris" ||
    pathname.startsWith("/panel/");

  if (isPanelRoute) {
    return null;
  }

  async function handleCreateCollection() {
    if (items.length === 0) {
      return;
    }

    setIsSharing(true);
    setStatusMessage("");
    setShareUrl("");

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Premat Çalışma Listem",
          documentIds: items.map((item) => item.id),
        }),
      });

      const data = (await response.json()) as CollectionResponse;

      if (!response.ok || !data.ok || !data.url) {
        throw new Error(data.message || "Liste oluşturulamadı.");
      }

      const absoluteUrl = `${window.location.origin}${data.url}`;
      setShareUrl(absoluteUrl);
      await navigator.clipboard.writeText(absoluteUrl);
      setStatusMessage("Paylaşım linki oluşturuldu ve panoya kopyalandı.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Liste oluşturulamadı."
      );
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {isOpen ? (
        <div className="mb-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
          {/* Gradient top accent */}
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 45%, #ea580c 100%)",
            }}
          />
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                  Çalışma Listem
                </div>
                <h2
                  className="mt-1 text-xl font-black bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                  }}
                >
                  {items.length} doküman
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-800"
              >
                Kapat
              </button>
            </div>

            <div className="mt-4 max-h-[320px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">
                  Listene henüz doküman eklenmedi.
                </div>
              ) : (
                <div className="grid gap-2">
                  {items.map((item, index) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200"
                    >
                      <Link
                        href={`/documents/${item.slug}`}
                        className="line-clamp-2 text-sm font-black text-slate-950 transition hover:text-blue-900"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-1 text-xs font-semibold text-slate-500">
                        {item.grade}. Sınıf • {item.topic}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "up")}
                          disabled={index === 0}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-800 disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "down")}
                          disabled={index === items.length - 1}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-800 disabled:opacity-40"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100"
                        >
                          Çıkar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={handleCreateCollection}
                disabled={isSharing || items.length === 0}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg,#1d4f91 0%,#2f6eb7 55%,#ea580c 100%)",
                }}
              >
                {isSharing ? "Link oluşturuluyor..." : "Paylaşılabilir Link Oluştur"}
              </button>
              <button
                type="button"
                onClick={clearItems}
                disabled={items.length === 0}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Listeyi Temizle
              </button>
            </div>

            {statusMessage ? (
              <div className="mt-3 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
                <span className="mt-0.5 shrink-0 text-blue-600">✓</span>
                <span>{statusMessage}</span>
              </div>
            ) : null}

            {shareUrl ? (
              <Link
                href={shareUrl}
                className="mt-3 block rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
              >
                Paylaşılan listeyi aç →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* FAB Button — pulse glow when items exist */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`relative rounded-2xl px-4 py-3 text-sm font-black text-white shadow-xl shadow-blue-900/25 transition hover:-translate-y-0.5 ${
          items.length > 0 ? "premat-pulse-glow" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg,#1d4f91 0%,#2f6eb7 55%,#ea580c 100%)",
        }}
      >
        Çalışma Listem
        {items.length > 0 ? (
          <span
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg,#ea580c,#f97316)",
            }}
          >
            {items.length > 9 ? "9+" : items.length}
          </span>
        ) : null}
      </button>
    </div>
  );
}
