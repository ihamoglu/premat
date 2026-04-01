"use client";

import Script from "next/script";
import { useConsent } from "@/components/providers/ConsentProvider";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AutoAdsLoader() {
  const { isReady, canShowAds } = useConsent();

  if (!ADSENSE_CLIENT || !isReady || !canShowAds) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}