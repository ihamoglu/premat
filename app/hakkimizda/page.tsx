import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "premat hakkında bilgiler, amaç, yaklaşım ve içerik düzeni bu sayfada yer alır.",
  alternates: {
    canonical: "/hakkimizda",
  },
  openGraph: {
    title: "Hakkımızda | premat",
    description:
      "premat hakkında bilgiler, amaç, yaklaşım ve içerik düzeni bu sayfada yer alır.",
    url: "https://www.premat.com.tr/hakkimizda",
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Hakkımızda | premat",
    url: "https://www.premat.com.tr/hakkimizda",
    description:
      "premat hakkında bilgiler, amaç, yaklaşım ve içerik düzeni bu sayfada yer alır.",
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
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/5">
            <div className="px-6 py-8 md:px-10 md:py-12">
              <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                Hakkımızda
              </div>

              <h1 className="text-3xl font-black text-slate-950 md:text-5xl">
                premat nedir?
              </h1>

              <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-600 md:text-base">
                {siteConfig.about.long}
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-lg font-black text-slate-950">Amaç</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    İçeriği sadece çok hale getirmek değil, düzenli ve güvenilir
                    hale getirmek.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-lg font-black text-slate-950">Yaklaşım</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Sınıf, konu ve içerik türü bazında temiz arşiv mantığı
                    kurmak.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-lg font-black text-slate-950">Hedef</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Aranan içeriğe daha kısa sürede, daha net ve daha güvenilir
                    biçimde ulaşmak.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-8 md:px-10 md:py-10">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-black text-slate-950">
                    Neden böyle bir yapı kuruldu?
                  </h2>
                  <p className="mt-3 text-sm leading-8 text-slate-600">
                    Çünkü dağınık içerik yapıları uzun vadede kalite değil,
                    karmaşa üretir. premat, sade ama güçlü bir akış kurmayı
                    hedefler.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-black text-slate-950">
                    Şu an ne durumda?
                  </h2>
                  <p className="mt-3 text-sm leading-8 text-slate-600">
                    Yayın altyapısı, panel yönetimi, SEO omurgası, görsel akış ve
                    içerik sistemi aktif durumda. Site artık gerçek kullanım
                    ölçeğine hazır.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/documents"
                  className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
                >
                  Dökümanları İncele
                </Link>

                <Link
                  href="/iletisim"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                >
                  İletişim
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}