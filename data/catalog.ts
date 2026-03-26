import type { GradeLevel, SourceType } from "@/types/document";

export const gradeCatalog: Record<GradeLevel, string[]> = {
  "5": [
    "1. Tema (Geometrik Şekiller)",
    "2.Tema (Sayılar ve İşlemler: Doğal Sayılarla İşlemler)",
    "3.Tema (Geometrik Nicelikler)",
    "4.Tema (Sayılar ve Nicelikler: Kesirler)",
    "5.Tema (İstatistiksel Araştırma Süreci)",
    "6.Tema (İşlemlerle Cebirsel Düşünme)",
    "7.Tema (Veriden Olasılığa)",
  ],
  "6": [
    "1.Tema (Sayılar ve Nicelikler – 1)",
    "2.Tema (İstatistiksel Araştırma Süreci)",
    "3.Tema (Sayılar ve Nicelikler – 2)",
    "4.Tema (Veriden Olasılığa)",
    "5.Tema (Geometrik Şekiller)",
    "6.Tema (İşlemlerle Cebirsel Düşünme ve Değişimler)",
    "7.Tema (Geometrik Nicelikler)",
  ],
  "7": [
    "Tam Sayılar",
    "Rasyonel Sayılar",
    "Cebirsel İfadeler",
    "Oran Orantı",
    "Yüzdeler",
    "Doğrular ve Açılar",
    "Çokgenler",
    "Çember ve Daire",
    "Veri Analizi",
  ],
  "8": [
    "Çarpanlar ve Katlar",
    "Üslü İfadeler",
    "Kareköklü İfadeler",
    "Veri Analizi",
    "Basit Olayların Olasılığı",
    "Cebirsel İfadeler ve Özdeşlikler",
    "Doğrusal Denklemler",
    "Eşitsizlikler",
    "Üçgenler",
    "Dönüşüm Geometrisi",
    "Geometrik Cisimler",
    "LGS Hazırlık",
  ],
};

export const documentTypeCatalog: string[] = [
  "MEB Ders Kitabı ve Cevapları",
  "MEB İçerikleri",
  "Çalışma Kağıtları",
  "Kazanım Testleri",
  "Deneme Sınavları",
  "Yazılı Soruları",
  "Etkinlikler",
];

export const sourceTypeCatalog: SourceType[] = [
  "Google Drive",
  "OneDrive",
  "Dropbox",
  "Diğer",
];

export function getTopicsByGrade(grade: string): string[] {
  if (grade === "5" || grade === "6" || grade === "7" || grade === "8") {
    return gradeCatalog[grade];
  }

  return [];
}

export function getAllTopics(): string[] {
  return Array.from(new Set(Object.values(gradeCatalog).flat())).sort((a, b) =>
    a.localeCompare(b, "tr")
  );
}