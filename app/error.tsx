"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_20%,#f8fafc_100%)] px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div
          className="relative overflow-hidden px-8 py-8 text-white md:px-10"
          style={{
            background:
              "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 45%, #2f6eb7 70%, #ea580c 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white/90">
              SİSTEM HATASI
            </div>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-orange-300 opacity-80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-[-0.03em] md:text-4xl">
            Bir şey beklenmedik şekilde bozuldu
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
            Sayfa yüklenirken geçici bir hata oluştu. Bu her zaman kalıcı bir
            sorun değildir; çoğu durumda yeniden deneme yeterli olur.
          </p>
        </div>

        <div className="px-8 py-8 md:px-10 md:py-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">Durum</div>
              <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                Beklenmeyen hata
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">İlk adım</div>
              <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                Yeniden dene
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">Alternatif</div>
              <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                Arşive geri dön
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="premat-pulse-glow rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg,#1d4f91 0%,#2f6eb7 55%,#3b82f6 100%)",
              }}
            >
              Tekrar Dene
            </button>

            <Link
              href="/documents"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Dökümanlara Git
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Ana Sayfa
            </Link>
          </div>

          {error?.message ? (
            <div className="mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-500">
                Teknik mesaj
              </div>
              <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                {error.message}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}