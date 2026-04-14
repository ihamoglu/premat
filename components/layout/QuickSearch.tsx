"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicDocumentSearchResult } from "@/lib/document-search";

type SearchResponse = {
  results?: PublicDocumentSearchResult[];
};

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function QuickSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicDocumentSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedQuery = query.trim();
  const locationKey = useMemo(
    () => `${pathname}?${searchKey}`,
    [pathname, searchKey]
  );

  const archiveHref = trimmedQuery
    ? `/documents?q=${encodeURIComponent(trimmedQuery)}`
    : "/documents";

  useEffect(() => {
    setIsOpen(false);
  }, [locationKey]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
          const params = new URLSearchParams();

          if (trimmedQuery) {
            params.set("q", trimmedQuery);
          }

          params.set("limit", "6");

          const response = await fetch(`/api/documents/search?${params}`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error("Search request failed");
          }

          const data = (await response.json()) as SearchResponse;
          setResults(data.results ?? []);
          setHasLoaded(true);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setResults([]);
          setErrorMessage("Arama sonuçları alınamadı.");
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      },
      trimmedQuery ? 180 : 0
    );

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isOpen, trimmedQuery]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`group relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-12 sm:w-12 ${
          isOpen
            ? "border-blue-300 text-blue-900 shadow-blue-900/15"
            : "border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-900"
        }`}
        aria-label="Arama"
        aria-expanded={isOpen}
        aria-controls="premat-quick-search-panel"
      >
        <span
          className={`absolute inset-0 transition ${
            isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(135deg, rgba(29,79,145,0.16) 0%, rgba(47,110,183,0.12) 48%, rgba(234,88,12,0.16) 100%)",
          }}
        />
        <span className="absolute inset-[1px] rounded-[0.65rem] bg-white/95 backdrop-blur-sm" />
        <span
          className={`relative inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
            isOpen
              ? "bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_60%,#ea580c_100%)] text-white shadow-md shadow-blue-900/20"
              : "bg-slate-50 text-slate-700 group-hover:bg-white group-hover:text-blue-900"
          }`}
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </span>
      </button>

      {isOpen ? (
        <div
          id="premat-quick-search-panel"
          className="fixed left-4 right-4 top-[4.75rem] z-[80] overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:w-[min(24rem,calc(100vw-2rem))]"
        >
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 45%, #ea580c 100%)",
            }}
          />

          <div className="p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-blue-300">
              <SearchIcon className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Başlık, konu veya sınıf ara"
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs font-bold uppercase tracking-[0.10em] text-slate-400">
                {trimmedQuery ? "Sonuçlar" : "Son eklenenler"}
              </div>

              <Link
                href={archiveHref}
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-800 transition hover:text-orange-600"
              >
                Tüm sonuçları arşivde gör
              </Link>
            </div>

            <div className="mt-3 max-h-[min(360px,calc(100vh-13rem))] overflow-y-auto pr-1">
              {isLoading && !hasLoaded ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-500">
                  Sonuçlar yükleniyor...
                </div>
              ) : errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-center text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              ) : results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                  <div className="text-sm font-black text-slate-900">
                    Eşleşen dosya bulunamadı
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Daha kısa veya farklı bir arama ifadesi dene.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {results.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="group rounded-2xl border border-slate-200 bg-white px-3 py-3 transition hover:border-blue-200 hover:bg-blue-50/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm font-black leading-snug text-slate-950 transition group-hover:text-blue-900">
                            {doc.title}
                          </div>
                          <div className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500">
                            {doc.topic}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-black text-blue-800">
                          {doc.grade}. Sınıf
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600">
                          {doc.type}
                        </span>
                        {doc.featured ? (
                          <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-bold text-orange-700">
                            Öne Çıkan
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
