import Link from "next/link";

export default function OgretmenPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 md:p-10">
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            Öğretmen
          </div>

          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            Ders Sürecini Destekleyen Seçili İçerikler
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
            Bu alan, öğretmenlerin ders sürecini daha kontrollü yürütmesi,
            seçili içeriklere daha hızlı ulaşması ve sınıf bazlı planlamayı daha
            rahat yapması için hazırlanıyor. İlerleyen aşamada burada öğretmen
            odaklı içerik ve düzenler yer alacak.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Sınıf bazlı düzenli arşiv",
              "Ders akışına uygun içerik seçimi",
              "Kontrollü ve sade kullanım",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Ana Sayfaya Dön
            </Link>

            <Link
              href="/documents"
              className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
            >
              Dökümanları İncele
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}