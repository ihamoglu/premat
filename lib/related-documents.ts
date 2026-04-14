import type { DocumentItem } from "@/types/document";

function getRelatedScore(source: DocumentItem, candidate: DocumentItem) {
  if (source.id === candidate.id || source.slug === candidate.slug) {
    return 0;
  }

  let score = 0;

  if (candidate.topic === source.topic) score += 60;
  if (candidate.subtopic && candidate.subtopic === source.subtopic) score += 30;
  if (candidate.grade === source.grade) score += 24;
  if (candidate.type === source.type) score += 16;
  if (candidate.difficulty && candidate.difficulty === source.difficulty) {
    score += 8;
  }
  if (candidate.featured) score += 5;
  if (candidate.hasVideoSolution) score += 3;
  if (candidate.answerKeyUrl) score += 2;

  return score;
}

export function getRelatedDocuments(
  source: DocumentItem,
  documents: DocumentItem[],
  limit = 6
) {
  return documents
    .map((doc) => ({
      doc,
      score: getRelatedScore(source, doc),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.doc.createdAt.localeCompare(a.doc.createdAt);
    })
    .slice(0, limit)
    .map((item) => item.doc);
}
