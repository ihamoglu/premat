import type { Metadata } from "next";
import ExamCountdownDisplay from "@/components/tools/ExamCountdownDisplay";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "LGS ve YKS Geri Sayım",
  description:
    "LGS ve YKS sınavlarına kaç gün, saat, dakika ve saniye kaldığını gösteren Premat geri sayım aracı.",
  alternates: {
    canonical: "/araclar/sinava-kac-gun-kaldi",
  },
  openGraph: {
    title: `LGS ve YKS Geri Sayım | ${siteConfig.name}`,
    description:
      "LGS ve YKS için güncel sınav tarihiyle çalışan geri sayım aracı.",
    url: absoluteUrl("/araclar/sinava-kac-gun-kaldi"),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

export default function ExamCountdownPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `LGS ve YKS Geri Sayım | ${siteConfig.name}`,
    url: absoluteUrl("/araclar/sinava-kac-gun-kaldi"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "LGS ve YKS sınavlarına kalan süreyi gün, saat, dakika ve saniye olarak gösteren araç.",
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
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div
              className="relative overflow-hidden px-5 py-8 sm:px-7 md:px-10 md:py-12"
              style={{
                background:
                  "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 46%, #2f6eb7 74%, #ea580c 100%)",
              }}
            >
              <div className="relative">
                <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                  Premat Araçları
                </div>
                <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                  LGS ve YKS Geri Sayım
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-base">
                  Sınav tarihine kalan süreyi canlı takip et. Son 24 saate
                  girildiğinde başarı mesajı otomatik olarak görünür.
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-7 md:p-9">
              <ExamCountdownDisplay />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
