import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f0f6ff 0%, #e8f0ff 45%, #fff5f0 100%)",
      }}
    >
      {/* Üst gradient border */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 40%, #ea580c 80%, #f97316 100%)",
        }}
      />

      {/* Dekoratif arka plan — çok hafif geometrik */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, #ea580c 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, #1d4f91 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr] md:px-6 md:py-14">
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
            Dağınık içerik yerine temiz hiyerarşi, hızlı erişim ve güçlü bir
            kullanım deneyimi sunar.
          </p>

          {/* Mavi-turuncu küçük aksan şerit */}
          <div
            className="mt-5 h-[3px] w-16 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #1d4f91 0%, #ea580c 100%)",
            }}
          />
        </div>

        <div>
          <h3 className="relative pb-2 text-sm font-black uppercase tracking-[0.10em] text-slate-900">
            Gezinme
            <span
              className="absolute bottom-0 left-0 h-[2px] w-8 rounded-full"
              style={{
                background: "linear-gradient(90deg, #1d4f91, #2f6eb7)",
              }}
            />
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
            {[
              { href: "/", label: "Ana Sayfa" },
              { href: "/documents", label: "Dökümanlar" },
              { href: "/sinif/5", label: "5. Sınıf" },
              { href: "/sinif/6", label: "6. Sınıf" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 transition hover:text-blue-800"
              >
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="relative pb-2 text-sm font-black uppercase tracking-[0.10em] text-slate-900">
            Kurumsal
            <span
              className="absolute bottom-0 left-0 h-[2px] w-8 rounded-full"
              style={{
                background: "linear-gradient(90deg, #2f6eb7, #ea580c)",
              }}
            />
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
            {[
              { href: "/hakkimizda", label: "Hakkımızda" },
              { href: "/iletisim", label: "İletişim" },
              { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 transition hover:text-blue-800"
              >
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="relative pb-2 text-sm font-black uppercase tracking-[0.10em] text-slate-900">
            Politikalar
            <span
              className="absolute bottom-0 left-0 h-[2px] w-8 rounded-full"
              style={{
                background: "linear-gradient(90deg, #ea580c, #f97316)",
              }}
            />
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
            {[
              { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
              { href: "/cerez-politikasi", label: "Çerez Politikası" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 transition hover:text-blue-800"
              >
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alt bölüm — açık, logonun rengi korunsun */}
      <div className="relative border-t border-slate-200/60">
        {/* Gradient separator */}
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 40%, #ea580c 80%, #f97316 100%)",
          }}
        />

        <div
          className="mx-auto max-w-7xl px-4 py-8 md:px-6"
          style={{
            background:
              "linear-gradient(135deg, #f0f6ff 0%, #e8f0ff 60%, #fff5f0 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/brand/logo-square.png"
              alt="premat kare logo"
              width={140}
              height={140}
              className="h-auto w-[72px] md:w-[88px]"
            />

            {/* Gradient divider */}
            <div
              className="h-[1px] w-24 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #cbd5e1, transparent)",
              }}
            />

            <div className="text-center text-xs font-medium tracking-[0.10em] text-slate-500">
              © 2026 premat — Matematik için düzenli arşiv
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
