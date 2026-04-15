import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "premat kullanım koşulları sayfası. Site kullanımı ve içerik erişimiyle ilgili temel çerçeve burada yer alır.",
  alternates: {
    canonical: "/kullanim-kosullari",
  },
  openGraph: {
    title: "Kullanım Koşulları | premat",
    description:
      "Site kullanımı ve içerik erişimiyle ilgili temel çerçeve burada yer alır.",
    url: "https://www.premat.com.tr/kullanim-kosullari",
  },
};

export default function TermsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kullanım Koşulları | premat",
    url: "https://www.premat.com.tr/kullanim-kosullari",
    description:
      "Site kullanımı ve içerik erişimiyle ilgili temel çerçeve burada yer alır.",
    isPartOf: {
      "@type": "WebSite",
      name: "premat",
      url: "https://www.premat.com.tr",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />

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
                Kullanım Koşulları
              </h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:p-10">
            <div className="space-y-6 text-sm leading-8 text-slate-600 md:text-base">
              <p>
                premat üzerinde yer alan içerikler, düzenli arşiv deneyimi
                sunmak amacıyla yapılandırılmıştır. Sitenin kullanımı sırasında
                kullanıcı, bu yapının temel kurallarını kabul etmiş sayılır.
              </p>

              <p>
                Sitedeki döküman bağlantıları, içerik düzeni, görseller ve
                yönlendirmeler zaman içinde güncellenebilir, değiştirilebilir ya
                da yayından kaldırılabilir.
              </p>

              <p>
                Kullanıcı deneyimini bozan, sistemi zorlayan, kötü niyetli
                kullanım oluşturan veya teknik işleyişi hedef alan davranışlar
                kabul edilmez.
              </p>

              <p>
                premat; içerik yapısını, sayfa düzenini, hizmet kapsamını ve
                kullanım koşullarını önceden bildirmeksizin güncelleme hakkını
                saklı tutar.
              </p>

              <p>
                Üçüncü taraf bağlantılar ve servisler kullanıldığında ilgili
                servislerin kendi kullanım koşulları ve politikaları da geçerli
                olabilir.
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
                href="/gizlilik-politikasi"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
              >
                Gizlilik Politikası
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
    </>
  );
}
