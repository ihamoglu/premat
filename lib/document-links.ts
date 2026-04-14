import type { DocumentItem, DocumentLink } from "@/types/document";

const linkLabels: Record<DocumentLink["kind"], string> = {
  file: "Dökümanı Aç",
  solution: "Çözümü Aç",
  answer_key: "Cevap Anahtarını Aç",
  video: "Video Çözüm",
  extra: "Ek Bağlantı",
};

export function getDocumentLinks(doc: DocumentItem): DocumentLink[] {
  const explicitLinks = (doc.links ?? []).filter((link) => link.url.trim());

  if (explicitLinks.length > 0) {
    return [...explicitLinks].sort((a, b) => a.position - b.position);
  }

  const links: DocumentLink[] = [
    {
      kind: "file",
      label: linkLabels.file,
      url: doc.fileUrl,
      position: 0,
    },
  ];

  if (doc.solutionUrl) {
    links.push({
      kind: doc.hasVideoSolution ? "video" : "solution",
      label: doc.hasVideoSolution ? linkLabels.video : linkLabels.solution,
      url: doc.solutionUrl,
      position: 10,
    });
  }

  if (doc.answerKeyUrl) {
    links.push({
      kind: "answer_key",
      label: linkLabels.answer_key,
      url: doc.answerKeyUrl,
      position: 20,
    });
  }

  return links;
}

export function getDocumentEventTypeForLink(kind: DocumentLink["kind"]) {
  if (kind === "file") return "file_open";
  if (kind === "answer_key") return "answer_key_open";
  if (kind === "solution" || kind === "video") return "solution_open";
  return "file_open";
}
