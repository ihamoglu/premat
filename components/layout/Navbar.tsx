"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { documentTypeCatalog } from "@/data/catalog";
import QuickSearch from "@/components/layout/QuickSearch";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const desktopNavItems: NavItem[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/documents", label: "Dökümanlar" },
  { href: "/testler", label: "Testler" },
  { href: "/araclar", label: "Araçlar" },
  { href: "/sinif/5", label: "5. Sınıf" },
  { href: "/sinif/6", label: "6. Sınıf" },
  { href: "/sinif/7", label: "7. Sınıf" },
  { href: "/sinif/8", label: "8. Sınıf" },
  { href: "https://prekoc.com.tr", label: "Koçluk", external: true },
  { href: "/ogretmen", label: "Öğretmen" },
];

const mobileMainItems: NavItem[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/documents", label: "Dökümanlar" },
  { href: "/testler", label: "Testler" },
  { href: "/araclar", label: "Araçlar" },
  { href: "https://prekoc.com.tr", label: "Koçluk", external: true },
  { href: "/ogretmen", label: "Öğretmen" },
];

const toolNavItems: NavItem[] = [
  { href: "/araclar/lgs-puan-hesaplama", label: "LGS Puan Hesaplama" },
  { href: "/araclar/yks-puan-hesaplama", label: "YKS Puan Hesaplama" },
  { href: "/araclar/sinava-kac-gun-kaldi", label: "LGS/YKS Geri Sayım" },
];

const mobileGradeItems = [
  { grade: "5", label: "5. Sınıf" },
  { grade: "6", label: "6. Sınıf" },
  { grade: "7", label: "7. Sınıf" },
  { grade: "8", label: "8. Sınıf" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGrade, setOpenGrade] = useState<string | null>(null);
  const [openMobileTools, setOpenMobileTools] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const locationKey = useMemo(
    () => `${pathname}?${searchKey}`,
    [pathname, searchKey]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setOpenGrade(null);
      setOpenMobileTools(false);
      setToolsMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [locationKey]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isHomePage = pathname === "/";
  const headerBg = isScrolled
    ? "bg-white/97 backdrop-blur-xl shadow-sm shadow-slate-900/5"
    : isHomePage
      ? "bg-white/85 backdrop-blur-xl"
      : "bg-white/95 backdrop-blur-lg";

  return (
    <>
      <div className="sticky top-0 z-50">
        <header
          className={`border-b border-slate-200/70 transition-all duration-300 ${headerBg}`}
        >
          <div
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 40%, #ea580c 80%, #f97316 100%)",
            }}
          />

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 xl:hidden"
                aria-label="Menüyü aç"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 transition group-hover:scale-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h12" />
                  <path d="M4 17h8" />
                </svg>
              </button>

              <Link href="/" className="shrink-0 transition hover:opacity-85">
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

            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 xl:flex">
                {desktopNavItems.map((item) => {
                  const active = item.external
                    ? false
                    : isActive(pathname, item.href);

                  const baseClass =
                    "relative rounded-full px-4 py-2 text-sm font-semibold tracking-[0.01em] transition duration-200";
                  const inactiveClass =
                    "text-slate-700 hover:bg-blue-50 hover:text-blue-900";
                  const className = `${baseClass} ${
                    active ? "" : inactiveClass
                  }`;

                  const activeStyle = active
                    ? {
                        background:
                          "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(29,79,145,0.22)",
                      }
                    : undefined;

                  if (item.href === "/araclar") {
                    return (
                      <div
                        key={item.href}
                        className="relative"
                        onMouseEnter={() => setToolsMenuOpen(true)}
                        onMouseLeave={() => setToolsMenuOpen(false)}
                        onBlur={(event) => {
                          const nextTarget = event.relatedTarget;
                          if (
                            nextTarget instanceof Node &&
                            event.currentTarget.contains(nextTarget)
                          ) {
                            return;
                          }

                          setToolsMenuOpen(false);
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setToolsMenuOpen((current) => !current)
                          }
                          onFocus={() => setToolsMenuOpen(true)}
                          className={className}
                          style={activeStyle}
                          aria-expanded={toolsMenuOpen}
                          aria-haspopup="menu"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {item.label}
                            <svg
                              viewBox="0 0 24 24"
                              className={`h-3.5 w-3.5 transition-transform ${
                                toolsMenuOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </span>
                        </button>

                        {toolsMenuOpen ? (
                          <div
                            className="absolute left-0 top-full z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/12"
                            role="menu"
                          >
                            <Link
                              href="/araclar"
                              className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-900"
                              role="menuitem"
                            >
                              Tüm Araçlar
                            </Link>
                            {toolNavItems.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-900"
                                role="menuitem"
                              >
                                {tool.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return item.external ? (
                    <a key={item.label} href={item.href} className={className} style={activeStyle}>
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={className}
                      style={activeStyle}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <QuickSearch />
            </div>
          </div>
        </header>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px]"
            aria-label="Menüyü kapat"
          />

          <aside className="premat-drawer-in absolute left-0 top-0 flex h-full w-[88%] max-w-[360px] flex-col shadow-2xl shadow-slate-900/25">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:text-blue-800"
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

            <div
              className="h-[3px] w-full"
              style={{
                background:
                  "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 40%, #ea580c 80%, #f97316 100%)",
              }}
            />

            <nav className="flex-1 overflow-y-auto bg-white px-4 py-4">
              <div className="space-y-2">
                {mobileMainItems.map((item) => {
                  const active = item.external
                    ? false
                    : isActive(pathname, item.href);
                  const className = `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_100%)] text-white shadow-md shadow-blue-900/20"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
                  }`;

                  if (item.href === "/araclar") {
                    return (
                      <div
                        key={item.label}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMobileTools((current) => !current)
                          }
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition ${
                            active
                              ? "bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_100%)] text-white shadow-md shadow-blue-900/20"
                              : "text-slate-700 hover:bg-blue-50 hover:text-blue-900"
                          }`}
                          aria-expanded={openMobileTools}
                        >
                          <span>{item.label}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openMobileTools ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </button>

                        {openMobileTools ? (
                          <div className="border-t border-blue-100 bg-blue-50/60 px-3 py-3">
                            <div className="grid gap-2">
                              <Link
                                href="/araclar"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setOpenGrade(null);
                                  setOpenMobileTools(false);
                                }}
                                className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                              >
                                Tüm Araçlar
                              </Link>
                              {toolNavItems.map((tool) => (
                                <Link
                                  key={tool.href}
                                  href={tool.href}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setOpenGrade(null);
                                    setOpenMobileTools(false);
                                  }}
                                  className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                                >
                                  {tool.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  return item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOpenGrade(null);
                        setOpenMobileTools(false);
                      }}
                      className={className}
                    >
                      <span>{item.label}</span>
                      <span className="text-lg leading-none opacity-60">&gt;</span>
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setOpenGrade(null);
                        setOpenMobileTools(false);
                      }}
                      className={className}
                    >
                      <span>{item.label}</span>
                      <span className="text-lg leading-none opacity-60">&gt;</span>
                    </Link>
                  );
                })}

                <div className="px-1 pb-1 pt-3">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Sınıf Arşivleri
                  </div>
                </div>

                {mobileGradeItems.map((item) => {
                  const isOpen = openGrade === item.grade;

                  return (
                    <div
                      key={item.grade}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGrade((prev) =>
                            prev === item.grade ? null : item.grade
                          )
                        }
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition ${
                          isOpen
                            ? "bg-blue-50 text-blue-900"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white"
                            style={{
                              background:
                                "linear-gradient(135deg,#1d4f91,#2f6eb7)",
                            }}
                          >
                            {item.grade}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>

                      {isOpen ? (
                        <div className="border-t border-blue-100 bg-blue-50/60 px-3 py-3">
                          <div className="grid gap-2">
                            {documentTypeCatalog.map((type) => (
                              <Link
                                key={`${item.grade}-${type}`}
                                href={{
                                  pathname: "/documents",
                                  query: {
                                    grade: item.grade,
                                    type,
                                  },
                                }}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setOpenGrade(null);
                                }}
                                className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                              >
                                {type}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center text-[10px] font-semibold tracking-[0.08em] text-slate-400">
              PREMAT - MATEMATİK ARŞİVİ
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
