import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)] px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 md:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
          404
        </div>

        <h1 className="text-3xl font-black text-slate-950 md:text-4xl">
          Aradığın sayfa bulunamadı
        </h1>

        <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
          Bağlantı hatalı olabilir, içerik yayından kaldırılmış olabilir ya da
          doğrudan geçersiz bir sayfaya gitmiş olabilirsin.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
            Dökümanları Aç
          </Link>
        </div>
      </div>
    </main>
  );
}