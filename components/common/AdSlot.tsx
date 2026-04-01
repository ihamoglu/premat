"use client";

type AdSlotProps = {
  label?: string;
  compact?: boolean;
};

export default function AdSlot({
  label = "Google Reklam Alanı",
  compact = false,
}: AdSlotProps) {
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

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Bu alan Google reklam yerleşimi için hazırlanmıştır. Reklam ve
            kullanıcı rızası yönetimi Google CMP yapısına göre çalışacaktır.
          </p>
        </div>
      </div>
    </section>
  );
}