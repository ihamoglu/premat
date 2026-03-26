import type { Metadata } from "next";
import "./globals.css";
import { DocumentsProvider } from "@/components/providers/DocumentsProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Premat",
  description: "Ortaokul matematik doküman arşivi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <DocumentsProvider>
            <AppShell>{children}</AppShell>
          </DocumentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}