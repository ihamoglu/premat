"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/common/SplashScreen";
import WorklistDrawer from "@/components/worklist/WorklistDrawer";

function NavbarFallback() {
  return <div className="h-[74px] border-b border-slate-200 bg-white/90" />;
}

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
  const [splashState, setSplashState] = useState<"checking" | "showing" | "done">(
    isHomeRoute ? "checking" : "done"
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (!isHomeRoute) {
        setSplashState("done");
        return;
      }

      const tabAlreadyOpened =
        window.sessionStorage.getItem("premat-tab-opened") === "1";

      if (tabAlreadyOpened) {
        setSplashState("done");
        return;
      }

      window.sessionStorage.setItem("premat-tab-opened", "1");
      setSplashState("showing");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isHomeRoute]);

  useEffect(() => {
    if (splashState !== "showing") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [splashState]);

  function handleSplashFinish() {
    setSplashState("done");
  }

  const shouldRenderFallback = isHomeRoute && splashState === "checking";
  const shouldShowSplash = splashState === "showing";
  const shellIsReady = !isHomeRoute || splashState === "done";
  const brandedFallbackStyle = useMemo(
    () => ({
      background:
        "linear-gradient(148deg, #07131f 0%, #0f2d5c 24%, #1d4f91 56%, #2f6eb7 76%, #ea580c 100%)",
    }),
    []
  );

  return (
    <>
      {shouldShowSplash ? <SplashScreen onFinish={handleSplashFinish} /> : null}

      {shouldRenderFallback ? (
        <div className="min-h-screen" style={brandedFallbackStyle} aria-hidden="true" />
      ) : null}

      <div
        className={`flex min-h-screen flex-col transition-opacity duration-200 ${
          shellIsReady ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {!isPanelRoute ? (
          <Suspense fallback={<NavbarFallback />}>
            <Navbar />
          </Suspense>
        ) : null}

        <div className="flex-1">{children}</div>

        {!isPanelRoute ? <Footer /> : null}
        {!isPanelRoute ? <WorklistDrawer /> : null}
      </div>
    </>
  );
}
