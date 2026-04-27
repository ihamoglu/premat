"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import AdminExamCountdownSettings from "@/components/admin/AdminExamCountdownSettings";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  DocumentsProvider,
  useDocuments,
} from "@/components/providers/DocumentsProvider";
import { DocumentItem } from "@/types/document";

type PanelSection = "overview" | "documents" | "tests" | "tools" | "operations";

const panelSections: Array<{
  id: PanelSection;
  label: string;
  description: string;
}> = [
  {
    id: "overview",
    label: "Genel Bakış",
    description: "İnceleme kuyruğu ve kalite özeti",
  },
  {
    id: "documents",
    label: "Dökümanlar",
    description: "Kayıt ekleme, import ve liste yönetimi",
  },
  {
    id: "tests",
    label: "Testler",
    description: "Online test oluşturucu",
  },
  {
    id: "tools",
    label: "Araçlar",
    description: "Sayaç ve araç ayarları",
  },
  {
    id: "operations",
    label: "Kalite ve Operasyon",
    description: "Raporlar, link kontrolleri ve storage temizliği",
  },
];

function PanelPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isAdmin, isLoading, logout, userEmail } = useAuth();
  const { documents } = useDocuments();
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentSection = useMemo<PanelSection>(() => {
    const section = searchParams.get("section");

    if (
      section === "overview" ||
      section === "documents" ||
      section === "tests" ||
      section === "tools" ||
      section === "operations"
    ) {
      return section;
    }

    return "overview";
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const stats = useMemo(
    () => ({
      published: documents.filter((doc) => doc.published).length,
      featured: documents.filter((doc) => doc.published && doc.featured).length,
      solved: documents.filter((doc) => doc.published && doc.solutionUrl).length,
      drafts: documents.filter((doc) => !doc.published).length,
    }),
    [documents]
  );

  function navigateToSection(section: PanelSection) {
    setDrawerOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function openEditor(doc: DocumentItem) {
    setEditingDoc(doc);
    navigateToSection("documents");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0a1730] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-700 bg-slate-900/70 p-10 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-white">
            Panel yükleniyor...
          </h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#0a1730] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-700 bg-slate-900/70 p-10 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-white">
            Yetkisiz erişim
          </h1>
          <p className="mt-3 text-slate-300">
            Bu alan yalnızca tanımlı admin hesabına açıktır. Oturum doğrulaması
            tamamlanmadıysa sayfayı yenile.
          </p>
        </div>
      </main>
    );
  }

  const activeSectionMeta = panelSections.find(
    (section) => section.id === currentSection
  )!;

  return (
    <main className="min-h-screen bg-[#081326] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[300px] shrink-0 border-r border-slate-800 bg-[#0b1830] xl:flex xl:flex-col">
          <div className="border-b border-slate-800 px-6 py-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-200/70">
              Premat Yönetici Paneli
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white">
              Yönetim Merkezi
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              İçerik, test ve operasyon araçları tek panelde toplandı.
            </p>
          </div>

          <nav className="flex-1 px-4 py-5">
            <div className="space-y-2">
              {panelSections.map((section) => {
                const active = currentSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => navigateToSection(section.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-orange-300/40 bg-[linear-gradient(135deg,rgba(234,88,12,0.18),rgba(29,79,145,0.28))] shadow-lg shadow-slate-950/20"
                        : "border-transparent bg-transparent hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="text-sm font-black text-white">{section.label}</div>
                    <div className="mt-1 text-xs leading-6 text-slate-300">
                      {section.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-slate-800 px-6 py-5 text-sm text-slate-300">
            {userEmail ? (
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Oturum
                </div>
                <div className="mt-2 break-all font-semibold text-white">
                  {userEmail}
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-slate-800 bg-[#0d1b35]/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:border-blue-400 hover:text-white xl:hidden"
                  aria-label="Bölüm menüsünü aç"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h10" />
                  </svg>
                </button>

                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-200/70">
                    {activeSectionMeta.label}
                  </div>
                  <div className="mt-1 truncate text-lg font-black tracking-[-0.02em] text-white sm:text-2xl">
                    {activeSectionMeta.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {userEmail ? (
                  <div className="hidden rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-200 lg:block">
                    {userEmail}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.push("/panel-giris");
                  }}
                  className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-white transition hover:border-orange-300 hover:bg-slate-900"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-800 bg-[linear-gradient(135deg,#102243_0%,#143261_45%,#1d4f91_75%,#ea580c_100%)] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
              <div className="grid gap-6 px-5 py-6 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div>
                  <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/90">
                    premat operasyon
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white md:text-5xl">
                    Güvenli içerik yönetimi
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
                    Canlı sistemi bozmadan döküman, test ve operasyon akışlarını
                    tek panelde yönet. Bölüm değiştirerek yalnız ilgili araçları aç.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Yayındaki Kayıt", value: stats.published },
                    { label: "Öne Çıkan", value: stats.featured },
                    { label: "Çözüm Linkli", value: stats.solved },
                    { label: "Taslak", value: stats.drafts },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.4rem] border border-white/20 bg-white/95 p-4 text-slate-950 shadow-lg shadow-slate-950/10"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {stat.label}
                      </div>
                      <div className="mt-2 text-3xl font-black tracking-[-0.03em]">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {currentSection === "overview" ? (
                <>
                  <AdminReviewQueue documents={documents} onEdit={openEditor} />
                  <AdminQualityReport documents={documents} onEdit={openEditor} />
                </>
              ) : null}

              {currentSection === "documents" ? (
                <>
                  <AdminDocumentForm
                    editingDoc={editingDoc}
                    onCancelEdit={() => setEditingDoc(null)}
                    onFinish={() => setEditingDoc(null)}
                  />
                  <AdminBulkImport />
                  <AdminBulkMetadataEditor />
                  <AdminDocumentsList onEdit={(doc) => setEditingDoc(doc)} />
                </>
              ) : null}

              {currentSection === "tests" ? <AdminTestBuilder /> : null}

              {currentSection === "tools" ? (
                <AdminExamCountdownSettings />
              ) : null}

              {currentSection === "operations" ? (
                <>
                  <AdminOperationsReport documents={documents} />
                  <AdminLinkHealthCheck />
                  <AdminStorageCleanup />
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[80] xl:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label="Bölüm menüsünü kapat"
          />

          <aside className="premat-drawer-in absolute left-0 top-0 flex h-full w-[88%] max-w-[320px] flex-col border-r border-slate-800 bg-[#0b1830] shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-200/70">
                  Premat Yönetici Paneli
                </div>
                <div className="mt-2 text-xl font-black tracking-[-0.03em] text-white">
                  Bölümler
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/50 text-slate-100"
                aria-label="Kapat"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {panelSections.map((section) => {
                const active = currentSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => navigateToSection(section.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-orange-300/40 bg-[linear-gradient(135deg,rgba(234,88,12,0.18),rgba(29,79,145,0.28))]"
                        : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    <div className="text-sm font-black text-white">{section.label}</div>
                    <div className="mt-1 text-xs leading-6 text-slate-300">
                      {section.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      ) : null}
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
