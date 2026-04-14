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
                <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                  Çalışma Listem
                </div>
                <h2 className="mt-1 text-xl font-black text-slate-950">
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
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
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
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 disabled:opacity-40"
                        >
                          Yukarı
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "down")}
                          disabled={index === items.length - 1}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 disabled:opacity-40"
                        >
                          Aşağı
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700"
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
                className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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
              <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
                {statusMessage}
              </div>
            ) : null}

            {shareUrl ? (
              <Link
                href={shareUrl}
                className="mt-3 block rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-700"
              >
                Paylaşılan listeyi aç
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-4 py-3 text-sm font-black text-white shadow-xl shadow-blue-900/25 transition hover:-translate-y-0.5"
      >
        Çalışma Listem ({items.length})
      </button>
    </div>
  );
}
