"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="tr">
      <body className="min-h-screen bg-[linear-gradient(180deg,#0f172a_0%,#1e3a5f_48%,#f8fafc_48%,#f8fafc_100%)]">
        <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 md:px-6">
          <div className="w-full max-w-4xl overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.20)]">
            <div className="bg-[linear-gradient(135deg,#103b73_0%,#1d4f91_32%,#2f6eb7_68%,#ea580c_100%)] px-8 py-10 text-white md:px-10">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white/90">
                KRİTİK HATA
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.03em] md:text-4xl">
                Uygulama genelinde bir hata oluştu
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
                Bu hata normal sayfa hatasından daha geniş bir alana etki etmiş
                olabilir. İlk doğru hareket sistemi yeniden denemek.
              </p>
            </div>

            <div className="px-8 py-8 md:px-10 md:py-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Ne yapmalı
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    Uygulamayı yeniden dene
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Alternatif
                  </div>
                  <div className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                    Ana sayfaya dön
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Yeniden Dene
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                >
                  Ana Sayfaya Git
                </button>
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
      </body>
    </html>
  );
}