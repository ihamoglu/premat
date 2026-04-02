import Link from "next/link";
import { DocumentItem } from "@/types/document";

type DocumentCardProps = {
  doc: DocumentItem;
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8">
      <Link href={`/documents/${doc.slug}`} className="block">
        {doc.coverImageUrl ? (
          <div className="overflow-hidden bg-slate-100">
            <img
              src={doc.coverImageUrl}
              alt={doc.title}
              className="h-[200px] w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] text-center">
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-blue-800">
                premat
              </div>
              <div className="mt-2 px-6 text-lg font-black text-slate-900">
                {doc.title}
              </div>
            </div>
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            {doc.grade}. Sınıf
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {doc.type}
          </span>
          {doc.featured ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              Öne Çıkan
            </span>
          ) : null}
        </div>

        <Link href={`/documents/${doc.slug}`} className="block">
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-950">
            {doc.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {doc.description}
        </p>

        <div className="mt-4 text-sm text-slate-500">
          <span className="font-bold text-slate-700">Konu:</span> {doc.topic}
          {doc.subtopic ? ` • ${doc.subtopic}` : ""}
        </div>

        <div className="mt-5 flex gap-3">
          <Link
            href={`/documents/${doc.slug}`}
            className="flex-1 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-center text-sm font-bold text-blue-800 transition hover:bg-blue-50"
          >
            Detayı İncele
          </Link>

          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-4 py-3 text-center text-sm font-bold !text-white transition hover:brightness-[1.03] visited:!text-white"
          >
            Dökümanı Aç
          </a>
        </div>
      </div>
    </article>
  );
}