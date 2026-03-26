import { Suspense } from "react";
import DocumentsPageClient from "@/components/pages/DocumentsPageClient";

function DocumentsPageFallback() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Dökümanlar yükleniyor...
          </h1>
        </div>
      </section>
    </main>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<DocumentsPageFallback />}>
      <DocumentsPageClient />
    </Suspense>
  );
}