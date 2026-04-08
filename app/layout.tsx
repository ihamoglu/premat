import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import AutoAdsLoader from "@/components/ads/AutoAdsLoader";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Matematik İçin Düzenli ve Güvenilir Dökümanlar`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.longDescription,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Matematik İçin Düzenli ve Güvenilir Dökümanlar`,
    description: siteConfig.longDescription,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 512,
        height: 512,
        alt: `${siteConfig.name} kare logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Matematik İçin Düzenli ve Güvenilir Dökümanlar`,
    description: siteConfig.longDescription,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  icons: {
    icon: "/brand/logo-square.png",
    shortcut: "/brand/logo-square.png",
    apple: "/brand/logo-square.png",
  },
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
