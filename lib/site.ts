export const siteConfig = {
  name: "premat",
  shortName: "premat",
  description:
    "premat; matematik için düzenli, seçili ve güvenilir döküman arşivi sunar.",
  url: "https://www.premat.com.tr",
  locale: "tr_TR",
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