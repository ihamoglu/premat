import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import AutoAdsLoader from "@/components/ads/AutoAdsLoader";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.premat.com.tr"),
  title: {
    default: "premat | Matematik İçin Düzenli ve Güvenilir Dökümanlar",
    template: "%s | premat",
  },
  description:
    "premat; matematik için düzenli, seçili ve güvenilir döküman arşivi sunar. Sınıf, konu ve içerik türüne göre filtrelenmiş içeriklere hızlı erişim sağlar.",
  applicationName: "premat",
  keywords: [
    "premat",
    "matematik",
    "matematik dökümanları",
    "ortaokul matematik",
    "çalışma kağıtları",
    "kazanım testleri",
    "deneme sınavları",
    "meb içerikleri",
    "yazılı soruları",
  ],
  authors: [{ name: "premat" }],
  creator: "premat",
  publisher: "premat",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.premat.com.tr",
    siteName: "premat",
    title: "premat | Matematik İçin Düzenli ve Güvenilir Dökümanlar",
    description:
      "Sınıf, konu ve içerik türüne göre düzenlenmiş matematik döküman arşivi.",
    images: [
      {
        url: "/brand/logo-square.png",
        width: 512,
        height: 512,
        alt: "premat kare logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "premat | Matematik İçin Düzenli ve Güvenilir Dökümanlar",
    description:
      "Sınıf, konu ve içerik türüne göre düzenlenmiş matematik döküman arşivi.",
    images: ["/brand/logo-square.png"],
  },
  icons: {
    icon: "/brand/logo-square.png",
    shortcut: "/brand/logo-square.png",
    apple: "/brand/logo-square.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <AutoAdsLoader />
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}