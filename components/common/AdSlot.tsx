"use client";

import { useConsent } from "@/components/providers/ConsentProvider";

type AdSlotProps = {
  label?: string;
  compact?: boolean;
};

export default function AdSlot({
  label = "Google Reklam Alanı",
  compact = false,
}: AdSlotProps) {
  const { canShowAds, consent, isReady, resetConsent } = useConsent();

  const content = !isReady ? (
    <p className="mt-2 text-sm leading-7 text-slate-500">
      Reklam tercihi kontrol ediliyor...
    </p>
  ) : canShowAds ? (
    <p className="mt-2 text-sm leading-7 text-slate-500">
      Bu alan reklam yerleşimi için hazır. Gerçek Google AdSense kodu daha sonra
      burada çalıştırılacaktır.
    </p>
  ) : (
    <div>
      <p className="mt-2 text-sm leading-7 text-slate-500">
        Reklam çerezleri kapalı olduğu için bu alanda reklam gösterimi pasif
        durumda.
      </p>

      {consent === "rejected" ? (
        <button
          type="button"
          onClick={resetConsent}
          className="mt-4 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
        >
          Çerez Tercihini Güncelle
        </button>
      ) : null}
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div
        className={`rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 text-center shadow-sm ${
          compact ? "px-4 py-6" : "px-4 py-10 md:px-6 md:py-12"
        }`}
      >
        <div className="mx-auto max-w-2xl">
          <div className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
            Reklam
          </div>

          <h3 className="mt-4 text-lg font-black text-slate-900 md:text-xl">
            {label}
          </h3>

          {content}
        </div>
      </div>
    </section>
  );
}