"use client";

import { useMemo, useState } from "react";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import {
  documentTypeCatalog,
  getTopicsByGrade,
  sourceTypeCatalog,
} from "@/data/catalog";
import { DocumentItem, GradeLevel, SourceType } from "@/types/document";

type CanonicalHeader =
  | "title"
  | "description"
  | "grade"
  | "topic"
  | "subtopic"
  | "type"
  | "sourceType"
  | "fileUrl"
  | "solutionUrl"
  | "answerKeyUrl"
  | "coverImageUrl"
  | "featured"
  | "published";

type ParsedRow = {
  rowNumber: number;
  slug: string;
  data: DocumentItem;
  errors: string[];
};

const REQUIRED_HEADERS: CanonicalHeader[] = [
  "title",
  "description",
  "grade",
  "topic",
  "type",
  "sourceType",
  "fileUrl",
];

const HEADER_ALIASES: Record<CanonicalHeader, string[]> = {
  title: ["title", "baslik"],
  description: ["description", "aciklama"],
  grade: ["grade", "sinif", "sinifduzeyi"],
  topic: ["topic", "konu"],
  subtopic: ["subtopic", "altkonu"],
  type: ["type", "tur", "icerikturu"],
  sourceType: ["sourcetype", "kaynakturu", "kaynaktur"],
  fileUrl: ["fileurl", "dosyalinki", "icerikbaglantisi", "link"],
  solutionUrl: ["solutionurl", "cozumlinki", "cozumbaglantisi"],
  answerKeyUrl: [
    "answerkeyurl",
    "cevapanahtariurl",
    "cevapanahtarilinki",
    "cevapanahtaribaglantisi",
  ],
  coverImageUrl: [
    "coverimageurl",
    "kapakgorseli",
    "tanitimgorseli",
    "gorselurl",
  ],
  featured: ["featured", "onecikan"],
  published: ["published", "yayinda", "yayin"],
};

function slugifyTr(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeHeader(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "");
}

function detectDelimiter(firstLine: string) {
  if (firstLine.includes("\t")) return "\t";

  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;

  return semicolonCount >= commaCount ? ";" : ",";
}

function parseBoolean(value: string, fallback: boolean) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) return fallback;

  if (
    ["1", "true", "evet", "yes", "var", "yayinda", "on"].includes(normalized)
  ) {
    return true;
  }

  if (
    ["0", "false", "hayir", "hayır", "no", "yok", "taslak", "off"].includes(
      normalized
    )
  ) {
    return false;
  }

  return fallback;
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function buildUniqueSlug(baseSlug: string, reserved: Set<string>) {
  let candidate = baseSlug || "kayit";

  if (!reserved.has(candidate)) {
    reserved.add(candidate);
    return candidate;
  }

  let counter = 2;
  while (reserved.has(`${candidate}-${counter}`)) {
    counter += 1;
  }

  const finalSlug = `${candidate}-${counter}`;
  reserved.add(finalSlug);
  return finalSlug;
}

const templateText = [
  [
    "title",
    "description",
    "grade",
    "topic",
    "subtopic",
    "type",
    "sourceType",
    "fileUrl",
    "solutionUrl",
    "answerKeyUrl",
    "coverImageUrl",
    "featured",
    "published",
  ].join("\t"),
  [
    "8. Sınıf Üslü İfadeler Çalışma Kağıdı",
    "Üslü ifadeler konusuna yönelik seçili çalışma kağıdı.",
    "8",
    "Üslü İfadeler",
    "Temel Sorular",
    "Çalışma Kağıtları",
    "Google Drive",
    "https://ornek.com/dokuman.pdf",
    "https://ornek.com/cozum.pdf",
    "https://ornek.com/cevap.pdf",
    "https://ornek.com/gorsel.jpg",
    "evet",
    "evet",
  ].join("\t"),
].join("\n");

export default function AdminBulkImport() {
  const { documents, bulkAddDocuments } = useDocuments();

  const [rawText, setRawText] = useState("");
  const [previewRows, setPreviewRows] = useState<ParsedRow[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [importing, setImporting] = useState(false);

  const validRows = useMemo(
    () => previewRows.filter((row) => row.errors.length === 0),
    [previewRows]
  );

  const invalidRows = useMemo(
    () => previewRows.filter((row) => row.errors.length > 0),
    [previewRows]
  );

  function copyTemplate() {
    navigator.clipboard.writeText(templateText);
    setStatusType("success");
    setStatusMessage("Şablon panoya kopyalandı.");
  }

  function clearAll() {
    setRawText("");
    setPreviewRows([]);
    setStatusType("");
    setStatusMessage("");
  }

  function handlePreview() {
    setStatusMessage("");
    setStatusType("");

    const trimmed = rawText.trim();

    if (!trimmed) {
      setStatusType("error");
      setStatusMessage("Önizleme için önce veri yapıştırmalısın.");
      setPreviewRows([]);
      return;
    }

    const lines = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      setStatusType("error");
      setStatusMessage(
        "En az bir başlık satırı ve bir veri satırı bulunmalı."
      );
      setPreviewRows([]);
      return;
    }

    const delimiter = detectDelimiter(lines[0]);
    const headerCells = lines[0].split(delimiter).map((cell) => cell.trim());

    const headerMap = new Map<CanonicalHeader, number>();

    headerCells.forEach((header, index) => {
      const normalized = normalizeHeader(header);

      (
        Object.entries(HEADER_ALIASES) as Array<[CanonicalHeader, string[]]>
      ).forEach(([canonical, aliases]) => {
        if (aliases.includes(normalized)) {
          headerMap.set(canonical, index);
        }
      });
    });

    const missingRequired = REQUIRED_HEADERS.filter(
      (header) => !headerMap.has(header)
    );

    if (missingRequired.length > 0) {
      setStatusType("error");
      setStatusMessage(
        `Eksik başlıklar var: ${missingRequired.join(", ")}`
      );
      setPreviewRows([]);
      return;
    }

    const existingSlugs = new Set(documents.map((doc) => doc.slug));
    const parsed: ParsedRow[] = [];

    lines.slice(1).forEach((line, lineIndex) => {
      const cells = line.split(delimiter).map((cell) => cell.trim());

      function getCell(header: CanonicalHeader) {
        const index = headerMap.get(header);
        return index === undefined ? "" : cells[index] || "";
      }

      const title = getCell("title");
      const description = getCell("description");
      const grade = getCell("grade");
      const topic = getCell("topic");
      const subtopic = getCell("subtopic");
      const type = getCell("type");
      const sourceType = getCell("sourceType");
      const fileUrl = getCell("fileUrl");
      const solutionUrl = getCell("solutionUrl");
      const answerKeyUrl = getCell("answerKeyUrl");
      const coverImageUrl = getCell("coverImageUrl");
      const featured = getCell("featured");
      const published = getCell("published");

      const errors: string[] = [];

      if (!title) errors.push("Başlık boş.");
      if (!description) errors.push("Açıklama boş.");

      if (!["5", "6", "7", "8"].includes(grade)) {
        errors.push("Sınıf 5, 6, 7 veya 8 olmalı.");
      }

      if (!topic) {
        errors.push("Konu boş.");
      } else if (
        ["5", "6", "7", "8"].includes(grade) &&
        !getTopicsByGrade(grade as GradeLevel).includes(topic)
      ) {
        errors.push("Konu seçilen sınıfla uyuşmuyor.");
      }

      if (!type) {
        errors.push("Tür boş.");
      } else if (!documentTypeCatalog.includes(type)) {
        errors.push("Tür katalogda yok.");
      }

      if (!sourceType) {
        errors.push("Kaynak türü boş.");
      } else if (!sourceTypeCatalog.includes(sourceType as SourceType)) {
        errors.push("Kaynak türü geçersiz.");
      }

      if (!fileUrl) {
        errors.push("İçerik bağlantısı boş.");
      } else if (!isValidUrl(fileUrl)) {
        errors.push("İçerik bağlantısı geçerli bir URL değil.");
      }

      if (solutionUrl && !isValidUrl(solutionUrl)) {
        errors.push("Çözüm bağlantısı geçersiz.");
      }

      if (answerKeyUrl && !isValidUrl(answerKeyUrl)) {
        errors.push("Cevap anahtarı bağlantısı geçersiz.");
      }

      if (coverImageUrl && !isValidUrl(coverImageUrl)) {
        errors.push("Kapak görseli bağlantısı geçersiz.");
      }

      const slug = buildUniqueSlug(slugifyTr(title), existingSlugs);

      parsed.push({
        rowNumber: lineIndex + 2,
        slug,
        errors,
        data: {
          id: crypto.randomUUID(),
          slug,
          title,
          description,
          grade: grade as GradeLevel,
          topic,
          subtopic: subtopic || undefined,
          type,
          sourceType: sourceType as SourceType,
          fileUrl,
          solutionUrl: solutionUrl || undefined,
          answerKeyUrl: answerKeyUrl || undefined,
          coverImageUrl: coverImageUrl || undefined,
          featured: parseBoolean(featured, false),
          published: parseBoolean(published, true),
          createdAt: new Date().toISOString().slice(0, 10),
        },
      });
    });

    setPreviewRows(parsed);
    setStatusType("success");
    setStatusMessage(
      `Önizleme hazır. Geçerli: ${
        parsed.filter((x) => x.errors.length === 0).length
      }, Hatalı: ${parsed.filter((x) => x.errors.length > 0).length}`
    );
  }

  async function handleBulkInsert() {
    if (validRows.length === 0) {
      setStatusType("error");
      setStatusMessage("Eklenecek geçerli kayıt yok.");
      return;
    }

    setImporting(true);
    setStatusType("");
    setStatusMessage("");

    try {
      await bulkAddDocuments(validRows.map((row) => row.data));
      setStatusType("success");
      setStatusMessage(`${validRows.length} kayıt toplu olarak eklendi.`);
      setRawText("");
      setPreviewRows([]);
    } catch {
      setStatusType("error");
      setStatusMessage("Toplu ekleme sırasında hata oluştu.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <div className="mb-6">
        <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800">
          TOPLU İÇERİK GİRİŞİ
        </div>

        <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">
          Excel / Sheets’ten çoklu kayıt ekle
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Excel veya Google Sheets’te hazırladığın satırları başlık satırıyla
          birlikte kopyala, buraya yapıştır, önizle ve tek seferde ekle.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Tabloyu burada yapıştır..."
            rows={16}
            className="w-full rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-400"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Önizle
            </button>

            <button
              type="button"
              onClick={handleBulkInsert}
              disabled={importing || validRows.length === 0}
              className="rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? "Ekleniyor..." : "Geçerli Kayıtları Ekle"}
            </button>

            <button
              type="button"
              onClick={copyTemplate}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Şablonu Kopyala
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Alanı Temizle
            </button>
          </div>

          {statusMessage ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                statusType === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <div className="text-sm font-semibold text-slate-900">
              Beklenen başlıklar
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-7 text-slate-600">
              title, description, grade, topic, subtopic, type, sourceType,
              fileUrl, solutionUrl, answerKeyUrl, coverImageUrl, featured,
              published
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-500">
              En temiz yöntem: Excel veya Google Sheets’te tabloyu başlık
              satırıyla birlikte seçip doğrudan yapıştır.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-500">
                Önizlenen
              </div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                {previewRows.length}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-500">Geçerli</div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-emerald-700">
                {validRows.length}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-500">Hatalı</div>
              <div className="mt-2 text-3xl font-black tracking-[-0.03em] text-red-700">
                {invalidRows.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewRows.length > 0 ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
              Geçerli satırlar
            </h3>

            <div className="mt-4 grid gap-4">
              {validRows.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  Geçerli satır yok.
                </div>
              ) : (
                validRows.map((row) => (
                  <div
                    key={`${row.rowNumber}-${row.slug}`}
                    className="rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-5"
                  >
                    <div className="mb-2 text-xs font-semibold tracking-[0.08em] text-emerald-700">
                      SATIR {row.rowNumber}
                    </div>

                    <div className="text-lg font-black tracking-[-0.02em] text-slate-950">
                      {row.data.title}
                    </div>

                    <div className="mt-2 text-sm leading-7 text-slate-600">
                      {row.data.description}
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-700">
                      <div>
                        <span className="font-semibold">Slug:</span> {row.slug}
                      </div>
                      <div>
                        <span className="font-semibold">Sınıf:</span>{" "}
                        {row.data.grade}. Sınıf
                      </div>
                      <div>
                        <span className="font-semibold">Konu:</span>{" "}
                        {row.data.topic}
                      </div>
                      <div>
                        <span className="font-semibold">Tür:</span>{" "}
                        {row.data.type}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">
              Hatalı satırlar
            </h3>

            <div className="mt-4 grid gap-4">
              {invalidRows.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  Hatalı satır yok.
                </div>
              ) : (
                invalidRows.map((row) => (
                  <div
                    key={`${row.rowNumber}-${row.slug}`}
                    className="rounded-[1.6rem] border border-red-200 bg-red-50 p-5"
                  >
                    <div className="mb-2 text-xs font-semibold tracking-[0.08em] text-red-700">
                      SATIR {row.rowNumber}
                    </div>

                    <div className="text-lg font-black tracking-[-0.02em] text-slate-950">
                      {row.data.title || "Başlık okunamadı"}
                    </div>

                    <div className="mt-3 space-y-2">
                      {row.errors.map((error) => (
                        <div
                          key={error}
                          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700"
                        >
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}