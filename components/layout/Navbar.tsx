"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/documents", label: "Dökümanlar" },
  { href: "/sinif/5", label: "5. Sınıf" },
  { href: "/sinif/6", label: "6. Sınıf" },
  { href: "/sinif/7", label: "7. Sınıf" },
  { href: "/sinif/8", label: "8. Sınıf" },
  { href: "/kocluk", label: "Koçluk" },
  { href: "/ogretmen", label: "Öğretmen" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-800 xl:hidden"
              aria-label="Menüyü aç"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>

            <Link href="/" className="shrink-0">
              <Image
                src="/brand/logo-horizontal.png"
                alt="premat logo"
                width={260}
                height={80}
                className="h-auto w-[140px] sm:w-[155px] md:w-[190px]"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-2 xl:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold tracking-[0.01em] transition ${
                    active
                      ? "bg-blue-50 text-blue-900 ring-1 ring-blue-100 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
            aria-label="Menüyü kapat"
          />

          <aside className="absolute left-0 top-0 flex h-full w-[88%] max-w-[360px] flex-col border-r border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <Image
                src="/brand/logo-horizontal.png"
                alt="premat logo"
                width={220}
                height={70}
                className="h-auto w-[135px]"
                priority
              />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-800"
                aria-label="Menüyü kapat"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] px-4 py-5">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold tracking-[0.08em] text-blue-800">
                  PREMAT NAVİGASYON
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sınıflara, arşive ve ek sayfalara mobilde de düzenli şekilde
                  buradan geçebilirsin.
                </p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-blue-50 text-blue-900 ring-1 ring-blue-100"
                          : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-lg leading-none">›</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-slate-200 px-4 py-5">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Aradığın içeriğe hızlı gitmek için önce sınıfı, sonra döküman
                türünü seçmen en temiz akış olur.
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}