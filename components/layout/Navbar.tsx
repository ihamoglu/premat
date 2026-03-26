"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ANA SAYFA" },
  { href: "/documents", label: "DÖKÜMANLAR" },
  { href: "/sinif/5", label: "5. SINIF" },
  { href: "/sinif/6", label: "6. SINIF" },
  { href: "/sinif/7", label: "7. SINIF" },
  { href: "/sinif/8", label: "8. SINIF" },
  { href: "/kocluk", label: "KOÇLUK" },
  { href: "/ogretmen", label: "ÖĞRETMEN" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/logo-horizontal.png"
            alt="premat logo"
            width={260}
            height={80}
            className="h-auto w-[150px] md:w-[190px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-xs font-black tracking-wide transition ${
                isActive(pathname, item.href)
                  ? "text-blue-700"
                  : "text-slate-700 hover:text-blue-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}