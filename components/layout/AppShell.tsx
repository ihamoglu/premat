"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

  const isHomeRoute = pathname === "/";

  const [hasCheckedSplash, setHasCheckedSplash] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const tabAlreadyOpened =
      window.sessionStorage.getItem("premat-tab-opened") === "1";

    if (!tabAlreadyOpened) {
      window.sessionStorage.setItem("premat-tab-opened", "1");

      if (isHomeRoute) {
        setShowSplash(true);
      }
    }

    setHasCheckedSplash(true);
  }, [isHomeRoute]);

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
    setShowSplash(false);
  }

  const hideShellUntilChecked = isHomeRoute && !hasCheckedSplash;

  return (
    <>
      {showSplash ? <SplashScreen onFinish={handleSplashFinish} /> : null}

      <div
        className={`flex min-h-screen flex-col ${
          hideShellUntilChecked ? "opacity-0" : "opacity-100"
        }`}
      >
        {!isPanelRoute ? <Navbar /> : null}
        <div className="flex-1">{children}</div>
        {!isPanelRoute ? <Footer /> : null}
      </div>
    </>
  );
}