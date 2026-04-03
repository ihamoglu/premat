"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminDocumentForm from "@/components/admin/AdminDocumentForm";
import AdminDocumentsList from "@/components/admin/AdminDocumentsList";
import AdminBulkImport from "@/components/admin/AdminBulkImport";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  DocumentsProvider,
  useDocuments,
} from "@/components/providers/DocumentsProvider";
import { DocumentItem } from "@/types/document";

function PanelPageContent() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, logout, userEmail } = useAuth();
  const { documents } = useDocuments();
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/panel-giris");
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

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

  const unpublishedCount = useMemo(
    () => documents.filter((doc) => !doc.published).length,
    [documents]
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_20%,#f8fafc_100%)] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
            Oturum kontrol ediliyor...
          </h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_20%,#f8fafc_100%)] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
            Yetkisiz erişim
          </h1>
          <p className="mt-3 text-slate-600">
            Bu alan yalnızca tanımlı admin hesabına açıktır.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_18%,#f8fafc_100%)]">
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#103b73_0%,#1d4f91_28%,#2f6eb7_62%,#f8fbff_62%,#f8fbff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800 shadow-sm">
                YÖNETİM ALANI
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                İçerik yönetimi
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 md:text-lg md:leading-8">
                Yeni kayıt ekleme, mevcut içerikleri düzenleme ve arşiv akışını
                yönetme işlemleri bu panelden yapılır.
              </p>

              {userEmail ? (
                <p className="mt-4 text-sm font-semibold text-blue-100">
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
              className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-700/20 transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.6rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
              <div className="text-sm font-medium text-slate-500">
                Yayındaki Kayıt
              </div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                {publishedCount}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
              <div className="text-sm font-medium text-slate-500">
                Öne Çıkan
              </div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                {featuredCount}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
              <div className="text-sm font-medium text-slate-500">
                Çözüm Bağlantılı
              </div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                {solvedCount}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/40 bg-white/95 p-5 shadow-lg shadow-slate-900/10">
              <div className="text-sm font-medium text-slate-500">
                Yayın Dışı
              </div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                {unpublishedCount}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                Panel akışı
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Yeni kayıt ekleme, toplu giriş ve mevcut kayıt düzenleme aynı
                sayfada akıcı şekilde toplandı.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800">
                Form
              </span>
              <span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-800">
                Toplu Giriş
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
                Liste ve Düzenleme
              </span>
            </div>
          </div>
        </div>

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

export default function PanelPage() {
  return (
    <DocumentsProvider scope="admin">
      <PanelPageContent />
    </DocumentsProvider>
  );
}