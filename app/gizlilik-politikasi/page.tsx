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
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 md:p-10">
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            Gizlilik Politikası
          </div>

          <h1 className="text-3xl font-black text-slate-950 md:text-5xl">
            Gizlilik Politikası
          </h1>

          <div className="mt-6 space-y-6 text-sm leading-8 text-slate-600 md:text-base">
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

          <div className="mt-8">
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}