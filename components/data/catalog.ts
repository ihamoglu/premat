export const gradeCatalog = {
  "5": [
    "Doğal Sayılar",
    "Kesirler",
    "Ondalık Gösterim",
    "Yüzdeler",
    "Temel Geometri",
    "Veri İşleme",
  ],
  "6": [
    "Doğal Sayılarla İşlemler",
    "Kesirlerle İşlemler",
    "Ondalık Gösterim",
    "Oran",
    "Cebirsel İfadeler",
    "Alan Ölçme",
    "Çember",
    "Veri Analizi",
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
} as const;

export const documentTypeCatalog = [
  "Çalışma Kağıdı",
  "Test",
  "Konu Anlatımı",
  "LGS Deneme",
] as const;

export const sourceTypeCatalog = [
  "Google Drive",
  "OneDrive",
  "Dropbox",
  "Diğer",
] as const;

export type CatalogGrade = keyof typeof gradeCatalog;

export function getTopicsByGrade(grade: string) {
  if (grade in gradeCatalog) {
    return gradeCatalog[grade as CatalogGrade];
  }

  return [];
}

export function getAllTopics() {
  return Array.from(
    new Set(Object.values(gradeCatalog).flat())
  ).sort((a, b) => a.localeCompare(b, "tr"));
}