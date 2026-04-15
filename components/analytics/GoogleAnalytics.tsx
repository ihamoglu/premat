"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useConsent } from "@/components/providers/ConsentProvider";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const hasTrackedRouteChange = useRef(false);
  const { canTrack, isReady } = useConsent();

  useEffect(() => {
    if (
      !canTrack ||
      !GA_MEASUREMENT_ID ||
      typeof window === "undefined" ||
      typeof window.gtag !== "function"
    ) {
      return;
    }

    if (!hasTrackedRouteChange.current) {
      hasTrackedRouteChange.current = true;
      return;
    }

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    });
  }, [pathname, canTrack]);

  if (!GA_MEASUREMENT_ID || !isReady || !canTrack) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}