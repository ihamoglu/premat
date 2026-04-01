import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Koçluk",
  description:
    "Hedef odaklı çalışma planı, düzenli takip yaklaşımı ve daha kontrollü öğrenci süreci için hazırlanan koçluk sayfası.",
  alternates: {
    canonical: "/kocluk",
  },
  openGraph: {
    title: "Koçluk | premat",
    description:
      "Hedef odaklı çalışma planı, düzenli takip yaklaşımı ve daha kontrollü öğrenci süreci için hazırlanan koçluk sayfası.",
    url: "https://www.premat.com.tr/kocluk",
  },
};

export default function KoclukPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Koçluk | premat",
    url: "https://www.premat.com.tr/kocluk",
    description:
      "Hedef odaklı çalışma planı, düzenli takip yaklaşımı ve daha kontrollü öğrenci süreci için hazırlanan koçluk sayfası.",
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
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/5">
            <div className="grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                  Koçluk Sistemi
                </div>

                <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                  Hedef Odaklı
                  <span className="block text-blue-900">
                    Çalışma ve Takip Yaklaşımı
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                  Bu alan, öğrencinin sadece içerik tüketmesini değil; hedef
                  belirlemesini, düzen kurmasını ve süreci ölçülebilir şekilde
                  yönetmesini merkeze alır. Amaç daha çok çalışmak değil, daha
                  doğru ve daha kontrollü çalışmaktır.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "Hedef bazlı çalışma düzeni",
                    "Haftalık takip mantığı",
                    "Daha kontrollü süreç yönetimi",
                    "Ölçülebilir ilerleme yaklaşımı",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 md:text-sm"
                    >
                      ✓ {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/documents"
                    className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-800/20 transition hover:bg-blue-900"
                  >
                    Dökümanları İncele
                  </Link>

                  <Link
                    href="/sinif/8"
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                  >
                    8. Sınıf İçeriklerine Git
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white shadow-xl shadow-blue-900/20">
                  <div className="text-sm font-bold text-blue-100">
                    Yaklaşımın Özeti
                  </div>
                  <div className="mt-3 text-2xl font-black">
                    Plansız yoğunluk yerine düzenli ilerleme
                  </div>
                  <p className="mt-4 text-sm leading-7 text-blue-100">
                    Koçluk bakışı; günü kurtarmaya değil, süreklilik oluşturmaya
                    odaklanır.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-500">
                      Odak
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Çalışma Disiplini
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-500">
                      Amaç
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Net İlerleme Takibi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-8 md:px-10 md:py-10">
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "1. Hedef Belirleme",
                    text: "Öğrenci önce neye ulaşmak istediğini netleştirir. Belirsiz çalışma yerine hedefli çalışma kurulur.",
                  },
                  {
                    title: "2. Düzen Kurma",
                    text: "İçerik, süre ve tekrar mantığı belli bir sisteme bağlanır. Dağınık çalışma akışı toparlanır.",
                  },
                  {
                    title: "3. Takip ve Revize",
                    text: "Süreç izlenir, güçlü ve zayıf alanlar ayrılır, plana gerektiğinde yeniden şekil verilir.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
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

            <div className="border-t border-slate-200 px-6 py-8 md:px-10 md:py-10">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-black text-slate-950">
                  Koçluk burada neye dönüşecek?
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
                  İlerleyen aşamada bu alan; öğrenci hedef takibi, dönemsel
                  planlama, çalışma akışları ve düzenli kontrol yapısının
                  sergilendiği daha güçlü bir sisteme dönüşecek. Şu an temel
                  amaç, koçluk mantığını siteye doğru çerçevede oturtmak.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}