import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/ui/SectionHeader";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)] px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] px-8 py-8 text-white md:px-10">
          <SectionHeader
            eyebrow="404 SAYFA BULUNAMADI"
            title="Aradığın sayfa burada değil"
            description="Bağlantı hatalı olabilir, içerik yayından kaldırılmış olabilir ya da doğrudan geçersiz bir adrese gelmiş olabilirsin."
          />
        </div>

        <div className="px-8 py-8 md:px-10 md:py-10">
          <EmptyState
            title="Sayfa yok"
            description="Ana sayfaya dönebilir veya doküman arşivini açabilirsin."
            action={
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                >
                  Ana Sayfaya Dön
                </Link>

                <Link
                  href="/documents"
                  className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Dökümanları Aç
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </main>
  );
}
