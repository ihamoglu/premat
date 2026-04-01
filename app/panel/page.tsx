"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminDocumentForm from "@/components/admin/AdminDocumentForm";
import AdminDocumentsList from "@/components/admin/AdminDocumentsList";
import { useAuth } from "@/components/providers/AuthProvider";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import { DocumentItem } from "@/types/document";
import AdminBulkImport from "@/components/admin/AdminBulkImport";

export default function PanelPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, userEmail } = useAuth();
  const { documents } = useDocuments();
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/panel-giris");
    }
  }, [isAuthenticated, isLoading, router]);

  const publishedCount = useMemo(
    () => documents.filter((doc) => doc.published).length,
    [documents]
  );

  const featuredCount = useMemo(
    () => documents.filter((doc) => doc.published && doc.featured).length,
    [documents]
  );

  const solvedCount = useMemo(
    () => documents.filter((doc) => doc.published && doc.solutionUrl).length,
    [documents]
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center sm:rounded-[2rem] sm:p-10">
          <h1 className="text-2xl font-black text-slate-900">
            Oturum kontrol ediliyor...
          </h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center sm:rounded-[2rem] sm:p-10">
          <h1 className="text-2xl font-black text-slate-900">
            Yönlendiriliyorsun...
          </h1>
          <p className="mt-3 text-slate-600">Giriş ekranına geçiliyor.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
                Yönetim Alanı
              </div>

              <h1 className="text-2xl font-black text-slate-950 sm:text-3xl md:text-5xl">
                İçerik Yönetimi
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
                Yeni kayıt ekleme, mevcut içerikleri düzenleme ve arşiv akışını
                yönetme işlemleri bu panelden yapılır.
              </p>

              {userEmail ? (
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Oturum: {userEmail}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/panel-giris");
              }}
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
              <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                Yayındaki Kayıt
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {publishedCount}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
              <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                Öne Çıkan İçerik
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {featuredCount}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
              <div className="text-xs font-semibold text-slate-500 sm:text-sm">
                Çözüm Bağlantısı Olan
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {solvedCount}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8">
          <AdminDocumentForm
            editingDoc={editingDoc}
            onCancelEdit={() => setEditingDoc(null)}
            onFinish={() => setEditingDoc(null)}
          />
          <AdminBulkImport />
          <AdminDocumentsList onEdit={(doc) => setEditingDoc(doc)} />
        </div>
      </section>
    </main>
  );
}