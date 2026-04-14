import { DocumentItem } from "@/types/document";

type DraftShape = Partial<
  Pick<
    DocumentItem,
    | "title"
    | "description"
    | "grade"
    | "topic"
    | "subtopic"
    | "type"
    | "fileUrl"
    | "solutionUrl"
    | "answerKeyUrl"
    | "coverImageUrl"
    | "difficulty"
    | "pageCount"
    | "questionCount"
    | "sourceYear"
    | "curriculumCode"
    | "isPrintReady"
    | "hasVideoSolution"
    | "featured"
    | "published"
  >
>;

export type QualityResult = {
  score: number;
  tone: "emerald" | "amber" | "red";
  label: string;
  issues: string[];
};

export type ReadinessIssue = {
  label: string;
  severity: "critical" | "warning";
};

export type PublishReadiness = {
  canPublish: boolean;
  critical: ReadinessIssue[];
  warnings: ReadinessIssue[];
};

function hasText(value: string | undefined, minLength = 1) {
  return Boolean(value && value.trim().length >= minLength);
}

function isUsableUrl(value: string | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function finalize(issues: string[]): QualityResult {
  const penalty = issues.length * 10;
  const score = Math.max(100 - penalty, 35);

  if (issues.length === 0) {
    return { score: 100, tone: "emerald", label: "Temiz", issues };
  }

  if (issues.length <= 3) {
    return { score, tone: "amber", label: "Kontrol Et", issues };
  }

  return { score, tone: "red", label: "Zayıf", issues };
}

export function getPublishReadiness(doc: DraftShape): PublishReadiness {
  const critical: ReadinessIssue[] = [];
  const warnings: ReadinessIssue[] = [];

  if (!hasText(doc.title, 10)) {
    critical.push({
      label: "Başlık en az 10 karakter olmalı.",
      severity: "critical",
    });
  }

  if (!hasText(doc.description, 30)) {
    critical.push({
      label: "Açıklama en az 30 karakter olmalı.",
      severity: "critical",
    });
  }

  if (!doc.grade) {
    critical.push({ label: "Sınıf seçilmeli.", severity: "critical" });
  }

  if (!hasText(doc.topic)) {
    critical.push({ label: "Konu seçilmeli.", severity: "critical" });
  }

  if (!hasText(doc.type)) {
    critical.push({ label: "Tür seçilmeli.", severity: "critical" });
  }

  if (!isUsableUrl(doc.fileUrl)) {
    critical.push({
      label: "Geçerli bir içerik bağlantısı girilmeli.",
      severity: "critical",
    });
  }

  if (!hasText(doc.subtopic, 3)) {
    warnings.push({
      label: "Alt konu eklenirse arama ve benzer içerik kalitesi artar.",
      severity: "warning",
    });
  }

  if (!doc.coverImageUrl) {
    warnings.push({
      label: "Kapak görseli eksik.",
      severity: "warning",
    });
  }

  if (!doc.difficulty) {
    warnings.push({
      label: "Zorluk seviyesi eksik.",
      severity: "warning",
    });
  }

  if (!doc.pageCount) {
    warnings.push({ label: "Sayfa sayısı eksik.", severity: "warning" });
  }

  if (!doc.questionCount) {
    warnings.push({ label: "Soru sayısı eksik.", severity: "warning" });
  }

  if (!doc.sourceYear) {
    warnings.push({ label: "Kaynak yılı eksik.", severity: "warning" });
  }

  if (!doc.curriculumCode) {
    warnings.push({ label: "Kazanım kodu eksik.", severity: "warning" });
  }

  if (!doc.answerKeyUrl) {
    warnings.push({
      label: "Cevap anahtarı bağlantısı yok.",
      severity: "warning",
    });
  }

  if (!doc.solutionUrl && !doc.hasVideoSolution) {
    warnings.push({
      label: "Çözüm veya video bağlantısı yok.",
      severity: "warning",
    });
  }

  return {
    canPublish: critical.length === 0,
    critical,
    warnings,
  };
}

export function assessDraftQuality(doc: DraftShape): QualityResult {
  const readiness = getPublishReadiness(doc);
  const issues = [
    ...readiness.critical.map((issue) => issue.label),
    ...readiness.warnings.map((issue) => issue.label),
  ];

  if (doc.published === false) {
    issues.push("Kayıt taslak durumda.");
  }

  return finalize(issues);
}

export function assessDocumentQuality(doc: DocumentItem): QualityResult {
  return assessDraftQuality(doc);
}
