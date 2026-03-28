"use client";

import Link from "next/link";
import { useConsent } from "@/components/providers/ConsentProvider";

export default function CookieBanner() {
  const { consent, isReady, acceptConsent, rejectConsent } = useConsent();

  if (!isReady || consent !== "unset") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 md:w-[calc(100%-3rem)] md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            Çerez Tercihi
          </div>

          <h3 className="text-lg font-black text-slate-950 md:text-xl">
            Reklam ve tercih çerezleri için onay yönetimi
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Site işleyişini geliştirmek ve reklam alanlarını yönetmek için çerez
            benzeri teknolojiler kullanılabilir. Tercihini şimdi belirleyebilirsin.
          </p>

          <Link
            href="/cerez-politikasi"
            className="mt-3 inline-flex text-sm font-bold text-blue-800 transition hover:text-blue-900"
          >
            Çerez politikasını incele
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={rejectConsent}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Reddet
          </button>

          <button
            type="button"
            onClick={acceptConsent}
            className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}