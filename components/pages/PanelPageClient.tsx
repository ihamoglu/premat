"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDocumentForm from "@/components/admin/AdminDocumentForm";
import AdminDocumentsList from "@/components/admin/AdminDocumentsList";
import AdminBulkImport from "@/components/admin/AdminBulkImport";
import AdminBulkMetadataEditor from "@/components/admin/AdminBulkMetadataEditor";
import AdminTestBuilder from "@/components/admin/AdminTestBuilder";
import AdminReviewQueue from "@/components/admin/AdminReviewQueue";
import AdminQualityReport from "@/components/admin/AdminQualityReport";
import AdminLinkHealthCheck from "@/components/admin/AdminLinkHealthCheck";
import AdminOperationsReport from "@/components/admin/AdminOperationsReport";
import AdminStorageCleanup from "@/components/admin/AdminStorageCleanup";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  DocumentsProvider,
  useDocuments,
} from "@/components/providers/DocumentsProvider";
import { DocumentItem } from "@/types/document";

function PanelPageInner() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading, logout, userEmail } = useAuth();
  const { documents } = useDocuments();
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/panel-giris");
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
            Panel yükleniyor...
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
      <section
        className="relative overflow-hidden border-b border-slate-200/60"
        style={{
          background:
            "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 30%, #2f6eb7 65%, #ea580c 100%)",
        }}
      >
        {/* Dekoratif glow'lar */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
          />
          <div
            className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white/90 backdrop-blur-sm">
                YÖNETİM ALANI
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                İçerik yönetimi
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-lg md:leading-8">
                Yeni kayıt ekleme, mevcut içerikleri düzenleme ve arşiv akışını
                yönetme işlemleri bu panelden yapılır.
              </p>

              {userEmail ? (
                <p className="mt-4 text-sm font-semibold text-blue-200">
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
              className="rounded-2xl bg-[linear-gradient(135deg,#b91c1c_0%,#dc2626_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Yayındaki Kayıt", value: publishedCount },
              { label: "Öne Çıkan", value: featuredCount },
              { label: "Çözüm Bağlantılı", value: solvedCount },
              { label: "Yayın Dışı", value: unpublishedCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.6rem] border border-white/30 bg-white/95 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-sm transition hover:-translate-y-0.5"
              >
                <div className="text-sm font-medium text-slate-500">
                  {stat.label}
                </div>
                <div
                  className="mt-2 text-3xl font-black tracking-[-0.03em] bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #1d4f91 0%, #2f6eb7 40%, #ea580c 80%, #f97316 100%)",
            }}
          />
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-end lg:justify-between md:p-6">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                Panel akışı
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Yeni kayıt ekleme, toplu giriş, inceleme sırası ve mevcut kayıt
                düzenleme aynı sayfada akıcı şekilde toplandı.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span
                className="rounded-full px-4 py-2 text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
              >
                İnceleme
              </span>
              <span
                className="rounded-full px-4 py-2 text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg,#1d4f91,#2f6eb7)" }}
              >
                Form
              </span>
              <span
                className="rounded-full px-4 py-2 text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg,#ea580c,#f97316)" }}
              >
                Toplu Giriş
              </span>
              <span
                className="rounded-full px-4 py-2 text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
              >
                Liste ve Düzenleme
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          <AdminReviewQueue
            documents={documents}
            onEdit={(doc) => setEditingDoc(doc)}
          />

          <AdminQualityReport
            documents={documents}
            onEdit={(doc) => setEditingDoc(doc)}
          />

          <AdminDocumentForm
            editingDoc={editingDoc}
            onCancelEdit={() => setEditingDoc(null)}
            onFinish={() => setEditingDoc(null)}
          />

          <AdminBulkImport />

          <AdminBulkMetadataEditor />

          <AdminTestBuilder />

          <AdminOperationsReport documents={documents} />

          <AdminLinkHealthCheck />

          <AdminStorageCleanup />

          <AdminDocumentsList onEdit={(doc) => setEditingDoc(doc)} />
        </div>
      </section>
    </main>
  );
}

export default function PanelPageClient() {
  return (
    <DocumentsProvider scope="admin">
      <PanelPageInner />
    </DocumentsProvider>
  );
}
