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

      <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/5">
            <div className="grid gap-8 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                  İletişim
                </div>

                <h1 className="text-3xl font-black text-slate-950 md:text-5xl">
                  Geri Bildirim ve
                  <span className="block text-blue-900">İletişim Alanı</span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                  Siteyle ilgili görüş, öneri, içerik düzeni, hata bildirimi ve
                  genel iletişim başlıkları için bu alan kullanılacaktır.
                  İletişim bilgilerinin tamamı tek yerden yönetilecek şekilde
                  düzenlenmiştir.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-500">
                      Amaç
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Hızlı ve net iletişim
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-500">
                      Kapsam
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      Öneri, hata ve içerik bildirimi
                    </div>
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
                    href="/hakkimizda"
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                  >
                    Hakkımızda
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {hasEmail ? (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="text-sm font-bold text-slate-500">E-posta</div>
                    <div className="mt-2 break-all text-lg font-black text-slate-950">
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
                      E-posta adresi daha sonra eklenecek. İstersen sadece
                      `data/site.ts` içinden doldurman yeterli.
                    </p>
                  </div>
                )}

                {hasPhone ? (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="text-sm font-bold text-slate-500">Telefon</div>
                    <div className="mt-2 text-lg font-black text-slate-950">
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
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="text-sm font-bold text-slate-500">
                      Instagram / Sosyal Kanal
                    </div>
                    <div className="mt-2 break-all text-lg font-black text-slate-950">
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

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-8 md:px-10 md:py-10">
              <h2 className="text-2xl font-black text-slate-950">
                İletişim bilgisi eklemek çok kolay
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                Mail, telefon veya sosyal kanal eklemek için ayrı ayrı sayfa
                bozmayacaksın. Sadece <span className="font-bold">data/site.ts</span>{" "}
                içindeki iletişim alanını doldurman yeterli.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}