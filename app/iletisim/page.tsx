import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "premat iletişim sayfası. Siteyle ilgili genel iletişim ve güncellenecek iletişim alanı burada yer alır.",
  alternates: {
    canonical: "/iletisim",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 md:p-10">
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            İletişim
          </div>

          <h1 className="text-3xl font-black text-slate-950 md:text-5xl">
            İletişim
          </h1>

          <div className="mt-6 space-y-6 text-sm leading-8 text-slate-600 md:text-base">
            <p>
              premat ile ilgili geri bildirim, içerik önerisi veya genel iletişim
              talepleri için bu sayfa ilerleyen süreçte güncellenecektir.
            </p>

            <p>
              Şu aşamada site altyapısı, içerik düzeni ve yayın yapısı aktif
              olarak geliştirilmektedir.
            </p>

            <p>
              İletişim alanı, kullanılacak resmi kanal netleştiğinde bu sayfada
              açık ve doğrudan biçimde yayınlanacaktır.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}