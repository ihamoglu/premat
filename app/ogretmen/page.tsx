import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Öğretmen",
  description:
    "Öğretmenler için sınıf bazlı, seçili ve düzenli döküman akışı sunan öğretmen sayfası.",
  alternates: {
    canonical: "/ogretmen",
  },
  openGraph: {
    title: "Öğretmen | premat",
    description:
      "Öğretmenler için sınıf bazlı, seçili ve düzenli döküman akışı sunan öğretmen sayfası.",
    url: "https://www.premat.com.tr/ogretmen",
  },
};

export default function OgretmenPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Öğretmen | premat",
    url: "https://www.premat.com.tr/ogretmen",
    description:
      "Öğretmenler için sınıf bazlı, seçili ve düzenli döküman akışı sunan öğretmen sayfası.",
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
            <div className="grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                  Öğretmen Alanı
                </div>

                <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                  Sınıf Bazlı
                  <span className="block text-blue-900">
                    Düzenli İçerik Yönetimi
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                  Bu alan, öğretmenin doğru içeriğe daha hızlı ulaşmasını,
                  dağınık kaynaklar içinde vakit kaybetmemesini ve ders sürecini
                  daha kontrollü şekilde yönetmesini hedefler. Amaç sadece
                  döküman toplamak değil; kullanım kolaylığı olan temiz bir akış
                  kurmaktır.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "Sınıf bazlı düzenli yapı",
                    "Hızlı konu erişimi",
                    "Seçili içerik mantığı",
                    "Ders sürecine uygun akış",
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
                    Arşivi İncele
                  </Link>

                  <Link
                    href="/sinif/5"
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                  >
                    Sınıf Sayfalarına Git
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-xl shadow-slate-900/20">
                  <div className="text-sm font-bold text-slate-200">
                    Temel Kazanım
                  </div>
                  <div className="mt-3 text-2xl font-black">
                    Daha az dağınıklık, daha çok kontrol
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-200">
                    Öğretmen için en büyük fark, içeriğin sadece çok olması
                    değil; düzenli ve kullanılabilir olmasıdır.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-500">
                      Kullanım
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Hızlı Erişim
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-500">
                      Yapı
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Seçili Arşiv
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-8 md:px-10 md:py-10">
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: "1. İçerik Ayıklama",
                    text: "Her şeyi yığmak yerine işe yarayan içerikleri seçmek, öğretmen açısından gerçek verim üretir.",
                  },
                  {
                    title: "2. Konuya Göre Düzen",
                    text: "Sınıf ve konu yapısı oturursa ders akışına uygun kaynak seçmek çok daha kolay hale gelir.",
                  },
                  {
                    title: "3. Kullanım Kolaylığı",
                    text: "Hızlı erişim, temiz filtre ve sade görünüm; öğretmenin vakit kaybını ciddi şekilde azaltır.",
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
                  Bu alan ileride nasıl büyüyecek?
                </h2>
                <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
                  Öğretmen sayfası ilerleyen aşamada; sınıf düzeyine göre
                  planlanmış içerik akışları, daha güçlü filtreler ve öğretmen
                  odaklı kullanım senaryolarıyla genişletilecek. Şu anki amaç,
                  bu alanı boş bir link olmaktan çıkarıp gerçek bir yönlendirme
                  sayfasına dönüştürmek.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}