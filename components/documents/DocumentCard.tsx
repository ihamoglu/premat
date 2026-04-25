import Link from "next/link";
import { DocumentItem } from "@/types/document";
import ContentImage from "@/components/common/ContentImage";
import { topicToSlug } from "@/lib/topic-slugs";
import WorklistAddButton from "@/components/worklist/WorklistAddButton";
import TrackedDocumentLink from "@/components/documents/TrackedDocumentLink";
import {
  getDenseTopicDisplay,
  getPrimaryTopicValue,
  getTypeDisplayList,
  hasMebBadge,
  MEB_LABEL,
} from "@/lib/document-taxonomy";

type DocumentCardProps = {
  doc: DocumentItem;
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  const metadataBadges = [
    doc.difficulty || null,
    doc.pageCount ? `${doc.pageCount} sayfa` : null,
    doc.questionCount ? `${doc.questionCount} soru` : null,
    doc.hasVideoSolution ? "Video çözüm" : null,
    doc.answerKeyUrl ? "Cevap anahtarı" : null,
    doc.isPrintReady ? "Yazdırmaya hazır" : null,
  ].filter(Boolean);

  const typeBadges = getTypeDisplayList(doc.type);
  const primaryTopic = getPrimaryTopicValue(doc.topic);
  const topicDisplay = getDenseTopicDisplay(doc);

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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="absolute left-4 top-4 select-none text-4xl font-black text-white/10">
                π
              </span>
              <span className="absolute bottom-4 right-4 select-none text-3xl font-black text-white/10">
                ∑
              </span>
              <span className="absolute right-6 top-6 select-none text-2xl font-black text-white/10">
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
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 100%)",
            }}
          >
            {doc.grade}. Sınıf
          </span>

          {typeBadges.length > 0 ? (
            typeBadges.slice(0, 2).map((type) => (
              <span
                key={type}
                className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur-sm"
              >
                {type}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs font-bold text-slate-600 backdrop-blur-sm">
              Tür belirtilmedi
            </span>
          )}

          {hasMebBadge(doc) ? (
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              {MEB_LABEL}
            </span>
          ) : null}

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

        {metadataBadges.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {metadataBadges.slice(0, 4).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        <Link href={`/documents/${doc.slug}`} className="block">
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-950 transition group-hover:text-blue-900">
            {doc.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {doc.description}
        </p>

        {topicDisplay ? (
          <div className="mt-4 text-sm text-slate-500">
            <span className="font-bold text-slate-700">Konu:</span>{" "}
            {primaryTopic ? (
              <Link
                href={`/konu/${topicToSlug(primaryTopic)}`}
                className="font-semibold transition hover:text-blue-800"
              >
                {topicDisplay}
              </Link>
            ) : (
              <span className="font-semibold text-slate-700">{topicDisplay}</span>
            )}
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          <Link
            href={`/documents/${doc.slug}`}
            className="flex-1 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-center text-sm font-bold text-blue-800 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-sm"
          >
            İncele
          </Link>

          <TrackedDocumentLink
            documentId={doc.id}
            href={doc.fileUrl}
            eventType="file_open"
            className="flex-1 rounded-2xl px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-blue-900/25 visited:text-white"
            style={{
              background:
                "linear-gradient(135deg, #1d4f91 0%, #2f6eb7 55%, #ea580c 100%)",
              color: "#ffffff",
            }}
          >
            <span style={{ color: "#ffffff" }}>Aç</span>
          </TrackedDocumentLink>
        </div>

        <div className="mt-3">
          <WorklistAddButton doc={doc} />
        </div>
      </div>
    </article>
  );
}
