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

      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #eef5ff 0%, #f8fbff 18%, #f8fafc 100%)",
        }}
      >
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/5">
            {/* Hero — gradient */}
            <div
              className="relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 40%, #2f6eb7 70%, #ea580c 100%)",
              }}
            >
              {/* Dekoratif glow'lar */}
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
                />
                <div
                  className="absolute -bottom-8 left-4 h-44 w-44 rounded-full opacity-15"
                  style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
                />
              </div>

              <div className="relative grid gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                    Öğretmen Alanı
                  </div>

                  <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                    Sınıf Bazlı
                    <span className="block text-blue-200">
                      Düzenli İçerik Yönetimi
                    </span>
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-8 text-blue-100 md:text-base">
                    Bu alan, öğretmenin doğru içeriğe daha hızlı ulaşmasını,
                    dağınık kaynaklar içinde vakit kaybetmemesini ve ders sürecini
                    daha kontrollü şekilde yönetmesini hedefler.
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
                        className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm md:text-sm"
                      >
                        ✓ {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/documents"
                      className="rounded-2xl border border-white/30 bg-white/90 px-5 py-3 text-sm font-bold text-blue-900 shadow-lg shadow-blue-900/15 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
                    >
                      Dökümanları İncele
                    </Link>

                    <Link
                      href="/sinif/5"
                      className="rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                    >
                      Sınıf Sayfalarına Git
                    </Link>
                  </div>
                </div>

                {/* Sağ kart */}
                <div className="grid gap-4">
                  {/* Temel Kazanım kartı — mavi tonlu */}
                  <div
                    className="relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-xl shadow-blue-900/20"
                    style={{
                      background:
                        "linear-gradient(135deg, #0f2d5c 0%, #1a3d7a 100%)",
                    }}
                  >
                    {/* Sol turuncu accent şerit */}
                    <div
                      className="absolute left-0 top-0 h-full w-1 rounded-r"
                      style={{
                        background:
                          "linear-gradient(180deg, #ea580c, #f97316)",
                      }}
                    />
                    <div className="pl-3">
                      <div className="text-sm font-bold text-blue-200">
                        Temel Kazanım
                      </div>
                      <div className="mt-3 text-2xl font-black">
                        Daha az dağınıklık, daha çok kontrol
                      </div>
                      <p className="mt-4 text-sm leading-7 text-blue-200">
                        Öğretmen için en büyük fark, içeriğin sadece çok olması
                        değil; düzenli ve kullanılabilir olmasıdır.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Kullanım", value: "Hızlı Erişim", accent: "#1d4f91", accent2: "#2f6eb7" },
                      { label: "Yapı", value: "Seçili Arşiv", accent: "#ea580c", accent2: "#f97316" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
                      >
                        <div className="text-sm font-bold text-white/70">
                          {item.label}
                        </div>
                        <div className="mt-2 text-lg font-black text-white">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature blokları */}
            <div
              className="border-t border-slate-200/60 px-6 py-8 md:px-10 md:py-10"
              style={{
                background:
                  "linear-gradient(135deg, #f8fafc 0%, #f0f6ff 100%)",
              }}
            >
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    num: "1",
                    title: "İçerik Ayıklama",
                    text: "Her şeyi yığmak yerine işe yarayan içerikleri seçmek, öğretmen açısından gerçek verim üretir.",
                    accent: "#1d4f91",
                    accent2: "#2f6eb7",
                  },
                  {
                    num: "2",
                    title: "Konuya Göre Düzen",
                    text: "Sınıf ve konu yapısı oturursa ders akışına uygun kaynak seçmek çok daha kolay hale gelir.",
                    accent: "#2f6eb7",
                    accent2: "#ea580c",
                  },
                  {
                    num: "3",
                    title: "Kullanım Kolaylığı",
                    text: "Hızlı erişim, temiz filtre ve sade görünüm; öğretmenin vakit kaybını ciddi şekilde azaltır.",
                    accent: "#ea580c",
                    accent2: "#f97316",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="premat-card-3d rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-sm"
                  >
                    {/* Numara badge */}
                    <div
                      className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white"
                      style={{
                        background: `linear-gradient(135deg, ${item.accent}, ${item.accent2})`,
                      }}
                    >
                      {item.num}
                    </div>
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

            {/* Gelişim bölümü */}
            <div
              className="border-t border-slate-200/60 px-6 py-8 md:px-10 md:py-10"
              style={{
                background:
                  "linear-gradient(135deg, #f0f6ff 0%, #fff8f2 100%)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 h-6 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #1d4f91, #ea580c)",
                  }}
                />
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
          </div>
        </section>
      </main>
    </>
  );
}
