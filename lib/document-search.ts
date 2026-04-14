import type { DocumentItem } from "@/types/document";

export type PublicDocumentSearchResult = Pick<
  DocumentItem,
  | "id"
  | "slug"
  | "title"
  | "grade"
  | "topic"
  | "subtopic"
  | "type"
  | "createdAt"
  | "featured"
>;

export function normalizeDocumentSearchText(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, " ")
    .trim();
}

function getDocumentSearchFields(doc: DocumentItem) {
  return [
    doc.title,
    doc.description,
    doc.grade,
    `${doc.grade}. sınıf`,
    doc.topic,
    doc.subtopic || "",
    doc.type,
    doc.slug,
  ];
}

export function documentMatchesSearch(doc: DocumentItem, query: string) {
  const normalizedQuery = normalizeDocumentSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const terms = normalizedQuery.split(" ").filter(Boolean);
  const haystack = normalizeDocumentSearchText(
    getDocumentSearchFields(doc).join(" ")
  );

  return terms.every((term) => haystack.includes(term));
}

export function getDocumentSearchScore(doc: DocumentItem, query: string) {
  const normalizedQuery = normalizeDocumentSearchText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const title = normalizeDocumentSearchText(doc.title);
  const topic = normalizeDocumentSearchText(doc.topic);
  const type = normalizeDocumentSearchText(doc.type);
  const slug = normalizeDocumentSearchText(doc.slug);

  let score = 0;

  if (title === normalizedQuery) score += 80;
  if (title.startsWith(normalizedQuery)) score += 50;
  if (title.includes(normalizedQuery)) score += 35;
  if (topic.includes(normalizedQuery)) score += 20;
  if (type.includes(normalizedQuery)) score += 12;
  if (slug.includes(normalizedQuery)) score += 10;
  if (doc.featured) score += 5;

  return score;
}

export function sortDocumentsForSearch(
  documents: DocumentItem[],
  query: string
) {
  const normalizedQuery = normalizeDocumentSearchText(query);

  return [...documents].sort((a, b) => {
    if (normalizedQuery) {
      const scoreDiff =
        getDocumentSearchScore(b, normalizedQuery) -
        getDocumentSearchScore(a, normalizedQuery);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function toPublicDocumentSearchResult(
  doc: DocumentItem
): PublicDocumentSearchResult {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    grade: doc.grade,
    topic: doc.topic,
    subtopic: doc.subtopic,
    type: doc.type,
    createdAt: doc.createdAt,
    featured: doc.featured,
  };
}
