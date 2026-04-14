import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "premat iletişim sayfası. Siteyle ilgili geri bildirim, öneri ve iletişim bilgileri burada yer alır.",
  alternates: {
    canonical: "/iletisim",
  },
  openGraph: {
    title: "İletişim | premat",
    description:
      "premat ile ilgili geri bildirim, öneri ve iletişim bilgileri burada yer alır.",
    url: "https://www.premat.com.tr/iletisim",
  },
};

export default function ContactPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "İletişim | premat",
    url: "https://www.premat.com.tr/iletisim",
    description:
      "premat ile ilgili geri bildirim, öneri ve iletişim bilgileri burada yer alır.",
    isPartOf: {
      "@type": "WebSite",
      name: "premat",
      url: "https://www.premat.com.tr",
    },
  };

  const hasEmail = Boolean(siteConfig.contact.email);
  const hasPhone = Boolean(siteConfig.contact.phone);
  const hasInstagram = Boolean(siteConfig.contact.instagram);

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
              className="relative overflow-hidden px-6 py-10 md:px-10 md:py-12"
              style={{
                background:
                  "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 40%, #2f6eb7 70%, #ea580c 100%)",
              }}
            >
              {/* Dekoratif glow'lar */}
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute -right-10 -top-10 h-52 w-52 rounded-full opacity-20"
                  style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
                />
                <div
                  className="absolute -bottom-6 left-6 h-36 w-36 rounded-full opacity-15"
                  style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
                />
              </div>

              <div className="relative">
                <div className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  İletişim
                </div>

                <h1 className="text-3xl font-black text-white md:text-5xl">
                  Geri Bildirim ve
                  <span className="block text-blue-200">İletişim Alanı</span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-blue-100 md:text-base">
                  Siteyle ilgili görüş, öneri, içerik düzeni, hata bildirimi ve
                  genel iletişim başlıkları için bu alan kullanılacaktır.
                  İletişim bilgilerinin tamamı tek yerden yönetilecek şekilde
                  düzenlenmiştir.
                </p>
              </div>
            </div>

            {/* İçerik */}
            <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      label: "Amaç",
                      value: "Hızlı ve net iletişim",
                      accent: "#1d4f91",
                      accent2: "#2f6eb7",
                    },
                    {
                      label: "Kapsam",
                      value: "Öneri, hata ve içerik bildirimi",
                      accent: "#ea580c",
                      accent2: "#f97316",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5"
                    >
                      {/* Accent şerit */}
                      <div
                        className="mb-3 h-[2px] w-8 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${item.accent}, ${item.accent2})`,
                        }}
                      />
                      <div className="text-sm font-bold text-slate-500">
                        {item.label}
                      </div>
                      <div className="mt-2 text-lg font-black text-slate-950">
                        {item.value}
                      </div>
                    </div>
                  ))}
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
                    href="/hakkimizda"
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                  >
                    Hakkımızda
                  </Link>
                </div>
              </div>

              {/* İletişim kartları */}
              <div className="grid gap-4">
                {hasEmail ? (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="group rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #1d4f91, #2f6eb7)",
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div className="text-sm font-bold text-slate-500">E-posta</div>
                    </div>
                    <div className="mt-3 break-all text-lg font-black text-slate-950">
                      {siteConfig.contact.email}
                    </div>
                  </a>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6">
                    <div className="text-sm font-bold text-slate-500">E-posta</div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Henüz eklenmedi
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      E-posta adresi daha sonra eklenecek.
                    </p>
                  </div>
                )}

                {hasPhone ? (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="group rounded-[1.75rem] border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #2f6eb7, #3b82f6)",
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                        </svg>
                      </div>
                      <div className="text-sm font-bold text-slate-500">Telefon</div>
                    </div>
                    <div className="mt-3 text-lg font-black text-slate-950">
                      {siteConfig.contact.phone}
                    </div>
                  </a>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6">
                    <div className="text-sm font-bold text-slate-500">Telefon</div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Henüz eklenmedi
                    </div>
                  </div>
                )}

                {hasInstagram ? (
                  <a
                    href={siteConfig.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-[1.75rem] border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md hover:shadow-orange-900/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #ea580c, #f97316)",
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                      </div>
                      <div className="text-sm font-bold text-slate-500">
                        Instagram / Sosyal Kanal
                      </div>
                    </div>
                    <div className="mt-3 break-all text-lg font-black text-slate-950">
                      {siteConfig.contact.instagram}
                    </div>
                  </a>
                ) : (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6">
                    <div className="text-sm font-bold text-slate-500">
                      Sosyal Kanal
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Henüz eklenmedi
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alt bölüm */}
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
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    İletişim bilgisi eklemek çok kolay
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                    Mail, telefon veya sosyal kanal eklemek için ayrı ayrı sayfa
                    bozmayacaksın. Sadece{" "}
                    <span className="font-bold text-slate-900">data/site.ts</span>{" "}
                    içindeki iletişim alanını doldurman yeterli.
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
