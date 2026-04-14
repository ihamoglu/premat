import Link from "next/link";
import { DocumentItem } from "@/types/document";
import ContentImage from "@/components/common/ContentImage";

type DocumentCardProps = {
  doc: DocumentItem;
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  return (
    <article className="premat-card-3d group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm hover:border-blue-200/70 hover:shadow-blue-900/10">
      <Link href={`/documents/${doc.slug}`} className="block">
        {doc.coverImageUrl ? (
          <div className="overflow-hidden bg-slate-100">
            <ContentImage
              src={doc.coverImageUrl}
              alt={doc.title}
              width={1200}
              height={800}
              className="h-[200px] w-full object-cover transition duration-400 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div
            className="relative flex h-[200px] items-center justify-center overflow-hidden text-center"
            style={{
              background:
                "linear-gradient(135deg, #0f2d5c 0%, #1d4f91 38%, #2f6eb7 68%, #ea580c 100%)",
            }}
          >
            {/* Dekoratif matematik sembolleri */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="absolute left-4 top-4 text-4xl font-black text-white/10 select-none">
                π
              </span>
              <span className="absolute bottom-4 right-4 text-3xl font-black text-white/10 select-none">
                ∑
              </span>
              <span className="absolute right-6 top-6 text-2xl font-black text-white/10 select-none">
                √
              </span>
            </div>

            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                premat
              </div>
              <div className="mt-2 px-6 text-base font-black leading-tight text-white">
                {doc.title}
              </div>
            </div>
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {/* Sınıf badge — mavi gradient */}
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
            }}
          >
            {doc.grade}. Sınıf
          </span>

          {/* Tür badge — glassmorphism */}
          <span className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur-sm">
            {doc.type}
          </span>

          {/* Öne çıkan badge — turuncu gradient */}
          {doc.featured ? (
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{
                background:
                  "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
              }}
            >
              Öne Çıkan
            </span>
          ) : null}
        </div>

        <Link href={`/documents/${doc.slug}`} className="block">
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-950 transition group-hover:text-blue-900">
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
            className="flex-1 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-center text-sm font-bold text-blue-800 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-sm"
          >
            İncele
          </Link>

          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-2xl px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-blue-900/25 visited:text-white"
            style={{
              background:
                "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 55%, #ea580c 100%)",
              color: "#ffffff",
            }}
          >
            <span style={{ color: "#ffffff" }}>Aç</span>
          </a>
        </div>
      </div>
    </article>
  );
}
