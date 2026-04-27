import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Araçlar",
  description:
    "premat araçları; LGS ve YKS puan hesaplama ile öğrenciler için pratik hesaplama yardımcıları.",
  alternates: {
    canonical: "/araclar",
  },
  openGraph: {
    title: `Araçlar | ${siteConfig.name}`,
    description:
      "LGS ve YKS puan hesaplama ile öğrenciler için pratik premat araçları.",
    url: absoluteUrl("/araclar"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

const tools = [
  {
    href: "/araclar/lgs-puan-hesaplama",
    title: "LGS Puan Hesaplama",
    description:
      "2018-2025 LGS verileriyle MSP, net, yaklaşık yüzdelik dilim ve sıralama tahmini.",
    badge: "Hesaplama Aracı",
  },
  {
    href: "/araclar/yks-puan-hesaplama",
    title: "YKS Puan Hesaplama",
    description:
      "2018-2025 YKS verileriyle TYT, SAY, SÖZ, EA ve DİL puan tahmini.",
    badge: "Hesaplama Aracı",
  },
  {
    href: "/araclar/sinava-kac-gun-kaldi",
    title: "LGS/YKS Geri Sayım",
    description:
      "LGS ve YKS sınavlarına kalan gün, saat, dakika ve saniyeyi canlı takip et.",
    badge: "Sayaç Aracı",
  },
];

export default function ToolsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Araçlar | ${siteConfig.name}`,
    url: absoluteUrl("/araclar"),
    description:
      "premat araçları; LGS ve YKS puan hesaplama ile öğrenciler için pratik hesaplama yardımcıları.",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #eef5ff 0%, #f8fbff 22%, #f8fafc 100%)",
        }}
      >
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
          >
            <div
              className="px-6 py-10 md:px-10 md:py-14"
              style={{
                background:
                  "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 42%, #2f6eb7 75%, #ea580c 100%)",
              }}
            >
              <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                Premat Araçları
              </div>
              <h1 className="text-3xl font-black text-white md:text-5xl">
                Eğitim araçları
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
                Öğrenciler ve veliler için hızlı, sade ve güvenilir yardımcı
                araçlar.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-2 md:p-9 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10"
                >
                  <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.10em] text-blue-800">
                    {tool.badge}
                  </div>
                  <h2 className="text-xl font-black text-slate-950">
                    {tool.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {tool.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-800 transition group-hover:gap-3">
                    Aracı aç
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
