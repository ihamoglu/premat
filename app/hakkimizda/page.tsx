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

      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #eef5ff 0%, #f8fbff 18%, #f8fafc 100%)",
        }}
      >
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/5">
            {/* Hero header — gradient */}
            <div
              className="relative overflow-hidden px-6 py-10 md:px-10 md:py-14"
              style={{
                background:
                  "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 40%, #2f6eb7 70%, #ea580c 100%)",
              }}
            >
              {/* Dekoratif glow'lar */}
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute -right-12 -top-12 h-56 w-56 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
                />
                <div
                  className="absolute -bottom-8 left-4 h-40 w-40 rounded-full opacity-15"
                  style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
                />
              </div>

              {/* Arka plan semboller */}
              <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
                <span className="absolute right-[6%] top-[10%] text-7xl font-black text-white/5">π</span>
                <span className="absolute bottom-[8%] left-[3%] text-6xl font-black text-white/5">∑</span>
              </div>

              <div className="relative">
                <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  Hakkımızda
                </div>

                <h1 className="text-3xl font-black text-white md:text-5xl">
                  premat nedir?
                </h1>

                <p className="mt-5 max-w-4xl text-sm leading-8 text-blue-100 md:text-base">
                  {siteConfig.about.long}
                </p>
              </div>
            </div>

            {/* Feature kartları */}
            <div className="px-6 py-8 md:px-10 md:py-10">
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "Amaç",
                    text: "İçeriği sadece çok hale getirmek değil, düzenli ve güvenilir hale getirmek.",
                    accentColor: "#1d4f91",
                    accentColor2: "#2f6eb7",
                  },
                  {
                    title: "Yaklaşım",
                    text: "Sınıf, konu ve içerik türü bazında temiz arşiv mantığı kurmak.",
                    accentColor: "#2f6eb7",
                    accentColor2: "#ea580c",
                  },
                  {
                    title: "Hedef",
                    text: "Aranan içeriğe daha kısa sürede, daha net ve daha güvenilir biçimde ulaşmak.",
                    accentColor: "#ea580c",
                    accentColor2: "#f97316",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="premat-card-3d rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm"
                  >
                    {/* Accent şerit */}
                    <div
                      className="mb-4 h-[3px] w-10 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${item.accentColor}, ${item.accentColor2})`,
                      }}
                    />
                    <h2 className="text-lg font-black text-slate-950">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alt bölüm */}
            <div
              className="border-t border-slate-200/60 px-6 py-8 md:px-10 md:py-10"
              style={{
                background:
                  "linear-gradient(135deg, #f8fafc 0%, #f0f6ff 100%)",
              }}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <h2 className="text-xl font-black text-slate-950">
                    Neden böyle bir yapı kuruldu?
                  </h2>
                  <p className="mt-3 text-sm leading-8 text-slate-600">
                    Çünkü dağınık içerik yapıları uzun vadede kalite değil,
                    karmaşa üretir. premat, sade ama güçlü bir akış kurmayı
                    hedefler.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md">
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
                  className="rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:brightness-[1.06]"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 55%, #ea580c 100%)",
                  }}
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
