"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdSlot from "@/components/common/AdSlot";
import CookieBanner from "@/components/common/CookieBanner";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPanelRoute =
    pathname === "/panel" ||
    pathname === "/panel-giris" ||
    pathname.startsWith("/panel/");

  return (
    <div className="flex min-h-screen flex-col">
      {!isPanelRoute ? <Navbar /> : null}

      {!isPanelRoute ? (
        <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] py-6">
          <AdSlot label="Üst Reklam Alanı" compact />
        </div>
      ) : null}

      <div className="flex-1">{children}</div>

      {!isPanelRoute ? (
        <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#f4f8ff_100%)] py-8">
          <AdSlot label="Alt Reklam Alanı" />
        </div>
      ) : null}

      {!isPanelRoute ? <Footer /> : null}
      {!isPanelRoute ? <CookieBanner /> : null}
    </div>
  );
}