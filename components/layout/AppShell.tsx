"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdSlot from "@/components/common/AdSlot";
import SplashScreen from "@/components/common/SplashScreen";

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

  const [hasCheckedSplash, setHasCheckedSplash] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (isPanelRoute) {
      setShowSplash(false);
      setHasCheckedSplash(true);
      return;
    }

    const alreadyShown =
      window.sessionStorage.getItem("premat-splash-shown") === "1";

    setShowSplash(!alreadyShown);
    setHasCheckedSplash(true);
  }, [isPanelRoute]);

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showSplash]);

  function handleSplashFinish() {
    window.sessionStorage.setItem("premat-splash-shown", "1");
    setShowSplash(false);
  }

  const hideShellUntilChecked = !isPanelRoute && !hasCheckedSplash;

  return (
    <>
      {showSplash ? <SplashScreen onFinish={handleSplashFinish} /> : null}

      <div
        className={`flex min-h-screen flex-col ${
          hideShellUntilChecked ? "opacity-0" : "opacity-100"
        }`}
      >
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
      </div>
    </>
  );
}