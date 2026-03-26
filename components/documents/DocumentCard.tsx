import Link from "next/link";
import { DocumentItem } from "@/types/document";

type DocumentCardProps = {
  doc: DocumentItem;
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-5 text-white">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-block rounded-full bg-orange-400 px-3 py-1 text-xs font-bold">
            {doc.grade}. Sınıf
          </span>

          {doc.featured ? (
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              Öne Çıkan
            </span>
          ) : null}
        </div>

        <h3 className="min-h-[56px] text-xl font-extrabold leading-tight">
          {doc.title}
        </h3>

        <p className="mt-3 text-sm text-blue-50">
          {doc.topic}
          {doc.subtopic ? ` • ${doc.subtopic}` : ""}
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {doc.type}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {doc.sourceType}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {doc.description}
        </p>

        <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Yayın</span>
          <span>{doc.createdAt}</span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={`/documents/${doc.slug}`}
            className="flex-1 rounded-2xl bg-blue-800 px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
          >
            İncele
          </Link>

          {doc.solutionUrl ? (
            <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-700">
              Çözümlü
            </span>
          ) : (
            <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-500">
              Çözüm Yok
            </span>
          )}
        </div>
      </div>
    </article>
  );
}