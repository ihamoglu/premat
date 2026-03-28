"use client";

import { useConsent } from "@/components/providers/ConsentProvider";

export default function CookiePreferencePanel() {
  const {
    consent,
    isReady,
    acceptConsent,
    rejectConsent,
    resetConsent,
  } = useConsent();

  const statusText =
    consent === "accepted"
      ? "Reklam ve tercih çerezleri için onay verilmiş."
      : consent === "rejected"
      ? "Reklam ve tercih çerezleri reddedilmiş."
      : "Henüz tercih yapılmamış.";

  if (!isReady) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
        Çerez tercih bilgisi yükleniyor...
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <div className="text-sm font-black text-slate-900">
        Mevcut Tercih Durumu
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-600">{statusText}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={acceptConsent}
          className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
        >
          Kabul Et
        </button>

        <button
          type="button"
          onClick={rejectConsent}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
        >
          Reddet
        </button>

        <button
          type="button"
          onClick={resetConsent}
          className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
        >
          Tercihi Sıfırla
        </button>
      </div>
    </div>
  );
}