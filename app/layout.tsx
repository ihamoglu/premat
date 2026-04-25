import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { WorklistProvider } from "@/components/providers/WorklistProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import AutoAdsLoader from "@/components/ads/AutoAdsLoader";
import { absoluteUrl, siteConfig } from "@/lib/site";

const defaultTitle = `${siteConfig.name} | Matematik İçin Düzenli ve Güvenilir Döküman Arşivi`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.longDescription,
  applicationName: siteConfig.shortName,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.shortName }],
  creator: siteConfig.shortName,
  publisher: siteConfig.shortName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: defaultTitle,
    description: siteConfig.longDescription,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImage),
        width: 512,
        height: 512,
        alt: `${siteConfig.shortName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteConfig.longDescription,
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
        <ConsentProvider>
          <AuthProvider>
            <WorklistProvider>
              <Suspense fallback={null}>
                <GoogleAnalytics />
              </Suspense>
              <AutoAdsLoader />
              <AppShell>{children}</AppShell>
            </WorklistProvider>
          </AuthProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
