"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import { DocumentItem } from "@/types/document";

type AdminDocumentsListProps = {
  onEdit: (doc: DocumentItem) => void;
};

export default function AdminDocumentsList({
  onEdit,
}: AdminDocumentsListProps) {
  const { documents, deleteDocument } = useDocuments();

  const sortedDocs = useMemo(() => {
    return [...documents].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [documents]);

  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `"${title}" kaydını kaldırmak istediğine emin misin?`
    );

    if (!confirmed) return;

    deleteDocument(id);
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
            Kayıt Listesi
          </div>

          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
            Mevcut İçerikler
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Sistemde görünen tüm kayıtlar burada listelenir. Dilersen içeriği
            düzenleyebilir, bağlantıyı açabilir ya da kaydı kaldırabilirsin.
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-5 py-4 text-right shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Toplam Kayıt
          </div>
          <div className="mt-1 text-3xl font-black text-slate-900">
            {sortedDocs.length}
          </div>
        </div>
      </div>

      {sortedDocs.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          Henüz kayıtlı içerik yok.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDocs.map((doc) => (
            <article
              key={doc.id}
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                      {doc.grade}. Sınıf
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                      {doc.type}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                      {doc.sourceType}
                    </span>

                    {doc.featured ? (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        Öne Çıkan
                      </span>
                    ) : null}

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        doc.published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {doc.published ? "Yayında" : "Taslak"}
                    </span>
                  </div>

                  <h3 className="truncate text-xl font-black text-slate-950">
                    {doc.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">
                    {doc.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <span>{doc.topic}</span>
                    {doc.subtopic ? <span>{doc.subtopic}</span> : null}
                    <span>{doc.createdAt}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 xl:justify-end">
                  <button
                    type="button"
                    onClick={() => onEdit(doc)}
                    className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
                  >
                    Düzenle
                  </button>

                  <Link
                    href={`/documents/${doc.slug}`}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
                  >
                    Detay
                  </Link>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-blue-800 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
                  >
                    Bağlantıyı Aç
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}