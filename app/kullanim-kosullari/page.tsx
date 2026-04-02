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

      <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
        <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/5 md:p-10">
            <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
              Kullanım Koşulları
            </div>

            <h1 className="text-3xl font-black text-slate-950 md:text-5xl">
              Kullanım Koşulları
            </h1>

            <div className="mt-8 space-y-6 text-sm leading-8 text-slate-600 md:text-base">
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