import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr_0.9fr] md:px-6">
        <div>
          <Image
            src="/brand/logo-horizontal.png"
            alt="premat logo"
            width={260}
            height={80}
            className="h-auto w-[150px] md:w-[180px]"
          />

          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
            Matematik için düzenli, seçili ve güvenilir döküman arşivi.
            Sade yapı, hızlı erişim ve temiz görünüm üzerine kuruldu.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
            Gezinme
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-600">
            <Link href="/" className="transition hover:text-blue-800">
              Ana Sayfa
            </Link>
            <Link href="/documents" className="transition hover:text-blue-800">
              Dökümanlar
            </Link>
            <Link href="/sinif/5" className="transition hover:text-blue-800">
              5. Sınıf
            </Link>
            <Link href="/sinif/6" className="transition hover:text-blue-800">
              6. Sınıf
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
            Kurumsal
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-600">
            <Link
              href="/gizlilik-politikasi"
              className="transition hover:text-blue-800"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/cerez-politikasi"
              className="transition hover:text-blue-800"
            >
              Çerez Politikası
            </Link>
            <Link href="/iletisim" className="transition hover:text-blue-800">
              İletişim
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-8 text-center md:px-6">
        <div className="mb-3 flex justify-center">
          <Image
            src="/brand/logo-square.png"
            alt="premat kare logo"
            width={90}
            height={90}
            className="h-auto w-[70px] md:w-[85px]"
          />
        </div>

        <div className="text-xs font-semibold tracking-wide text-slate-500">
          © 2026 premat
        </div>
      </div>
    </footer>
  );
}