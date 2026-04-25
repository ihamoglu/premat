export const siteConfig = {
  name: "premat",
  shortName: "preMat",
  description:
    "premat, matematik için düzenli, seçili ve güvenilir döküman arşivi sunar.",
  longDescription:
    "premat, matematik için düzenli, seçili ve güvenilir döküman arşivi sunar. Sınıf, konu ve içerik türüne göre filtrelenmiş içeriklere hızlı erişim sağlar.",
  url: "https://www.premat.com.tr",
  locale: "tr_TR",
  ogImage: "/brand/logo-square.png",
  keywords: [
    "premat",
    "matematik",
    "matematik dökümanları",
    "ortaokul matematik",
    "çalışma kağıtları",
    "kazanım testleri",
    "deneme sınavları",
    "yazılı soruları",
  ],
};

export const siteUrl = siteConfig.url;

export function absoluteUrl(path: string = "") {
  if (!path) return siteUrl;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
