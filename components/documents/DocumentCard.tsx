import Link from "next/link";
import { DocumentItem } from "@/types/document";

type DocumentCardProps = {
  doc: DocumentItem;
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.85rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_60px_rgba(37,99,235,0.10)]">
      <Link href={`/documents/${doc.slug}`} className="block">
        {doc.coverImageUrl ? (
          <div className="relative overflow-hidden bg-slate-100">
            <img
              src={doc.coverImageUrl}
              alt={doc.title}
              className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/5 to-transparent" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold text-blue-900 shadow-sm backdrop-blur">
                {doc.grade}. Sınıf
              </span>

              <span className="rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                {doc.type}
              </span>

              {doc.featured ? (
                <span className="rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  Öne Çıkan
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="relative flex h-[220px] items-end overflow-hidden bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#fff7ed_100%)] p-5">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-orange-100 blur-3xl" />

            <div className="relative w-full">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-900">
                  {doc.grade}. Sınıf
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                  {doc.type}
                </span>

                {doc.featured ? (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-orange-800">
                    Öne Çıkan
                  </span>
                ) : null}
              </div>

              <div className="text-xs font-black tracking-[0.12em] text-blue-800">
                PREMAT
              </div>
              <div className="mt-3 line-clamp-3 text-xl font-black leading-tight tracking-[-0.03em] text-slate-950">
                {doc.title}
              </div>
            </div>
          </div>
        )}
      </Link>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
            {doc.topic}
          </span>

          {doc.subtopic ? (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
              {doc.subtopic}
            </span>
          ) : null}

          {doc.solutionUrl ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              Çözüm bağlantısı var
            </span>
          ) : null}
        </div>

        <Link href={`/documents/${doc.slug}`} className="mt-4 block">
          <h3 className="line-clamp-2 text-[1.35rem] font-black leading-[1.15] tracking-[-0.03em] text-slate-950 transition group-hover:text-blue-900">
            {doc.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {doc.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/documents/${doc.slug}`}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Detayı İncele
          </Link>

          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Dökümanı Aç
          </a>
        </div>
      </div>
    </article>
  );
}