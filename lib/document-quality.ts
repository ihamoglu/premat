import { DocumentItem } from "@/types/document";

type DraftShape = Pick<
  DocumentItem,
  | "title"
  | "description"
  | "topic"
  | "subtopic"
  | "solutionUrl"
  | "answerKeyUrl"
  | "coverImageUrl"
  | "featured"
  | "published"
>;

export type QualityResult = {
  score: number;
  tone: "emerald" | "amber" | "red";
  label: string;
  issues: string[];
};

function finalize(issues: string[]): QualityResult {
  const penalty = issues.length * 12;
  const score = Math.max(100 - penalty, 40);

  if (issues.length === 0) {
    return { score: 100, tone: "emerald", label: "Temiz", issues };
  }

  if (issues.length <= 2) {
    return { score, tone: "amber", label: "Kontrol Et", issues };
  }

  return { score, tone: "red", label: "Zayıf", issues };
}

export function assessDraftQuality(doc: DraftShape): QualityResult {
  const issues: string[] = [];

  if (!doc.title || doc.title.trim().length < 10) {
    issues.push("Başlık çok kısa.");
  }

  if (!doc.description || doc.description.trim().length < 50) {
    issues.push("Açıklama çok kısa.");
  }

  if (!doc.topic || !doc.topic.trim()) {
    issues.push("Konu seçilmemiş.");
  }

  if (!doc.subtopic || doc.subtopic.trim().length < 3) {
    issues.push("Alt konu eksik ya da çok kısa.");
  }

  if (!doc.coverImageUrl) {
    issues.push("Kapak görseli yok.");
  }

  if (!doc.solutionUrl) {
    issues.push("Çözüm bağlantısı yok.");
  }

  if (!doc.answerKeyUrl) {
    issues.push("Cevap anahtarı bağlantısı yok.");
  }

  if (!doc.published) {
    issues.push("Kayıt taslak durumda.");
  }

  return finalize(issues);
}

export function assessDocumentQuality(doc: DocumentItem): QualityResult {
  return assessDraftQuality({
    title: doc.title,
    description: doc.description,
    topic: doc.topic,
    subtopic: doc.subtopic,
    solutionUrl: doc.solutionUrl,
    answerKeyUrl: doc.answerKeyUrl,
    coverImageUrl: doc.coverImageUrl,
    featured: doc.featured,
    published: doc.published,
  });
}
