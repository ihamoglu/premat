import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "premat gizlilik politikası sayfası. Site üzerinde işlenen temel bilgiler ve kullanım çerçevesi burada yer alır.",
  alternates: {
    canonical: "/gizlilik-politikasi",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #eef5ff 0%, #f8fbff 18%, #f8fafc 100%)",
      }}
    >
      {/* Gradient hero strip */}
      <section
        className="border-b border-slate-200/60"
        style={{
          background:
            "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 45%, #2f6eb7 70%, #ea580c 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            ← Ana Sayfa
          </Link>
          <div className="mt-4">
            <div className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
              Hukuki Bilgi
            </div>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Gizlilik Politikası
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:p-10">
          <div className="space-y-6 text-sm leading-8 text-slate-600 md:text-base">
            <p>
              premat, ziyaretçi deneyimini iyileştirmek, site işleyişini
              sürdürebilmek ve içerik erişimini yönetebilmek amacıyla temel
              düzeyde teknik veriler işleyebilir.
            </p>

            <p>
              Bu sitede yer alan formlar, bağlantılar ve oturum işlemleri
              kullanıcının talep ettiği hizmeti sunmak amacıyla çalışır.
              Gerektiğinde sistem güvenliği, hata takibi ve içerik düzeni için
              sınırlı kayıtlar tutulabilir.
            </p>

            <p>
              Üçüncü taraf hizmetler kullanıldığında, ilgili hizmetlerin kendi
              veri işleme ve gizlilik politikaları da devreye girebilir.
              İlerleyen süreçte bu sayfa güncel servisler ve kullanım
              senaryolarına göre güncellenecektir.
            </p>

            <p>
              Bu politika, site yapısı geliştikçe ve yeni servisler eklendikçe
              güncellenebilir.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg,#1d4f91 0%,#2f6eb7 55%,#ea580c 100%)",
              }}
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/cerez-politikasi"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Çerez Politikası
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
