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

  function buildHeaderMap(cells: string[]) {
    const map = new Map<CanonicalHeader, number>();

    cells.forEach((cell, index) => {
      const normalized = normalizeHeader(cell);

      const matchedKey = (Object.keys(HEADER_ALIASES) as CanonicalHeader[]).find(
        (key) => HEADER_ALIASES[key].includes(normalized)
      );

      if (matchedKey && !map.has(matchedKey)) {
        map.set(matchedKey, index);
      }
    });

    return map;
  }

  function getCell(
    cells: string[],
    headerMap: Map<CanonicalHeader, number>,
    key: CanonicalHeader
  ) {
    const index = headerMap.get(key);
    if (index === undefined) return "";
    return (cells[index] || "").trim();
  }

  function handlePreview() {
    setStatusMessage("");
    setStatusType("");

    const normalizedText = rawText.trim();

    if (!normalizedText) {
      setPreviewRows([]);
      setStatusType("error");
      setStatusMessage("Önce tablo verisini yapıştır.");
      return;
    }

    const lines = normalizedText
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter(Boolean);

    if (lines.length < 2) {
      setPreviewRows([]);
      setStatusType("error");
      setStatusMessage("Başlık satırı ve en az bir veri satırı gerekli.");
      return;
    }

    const delimiter = detectDelimiter(lines[0]);
    const headerCells = lines[0].split(delimiter).map((cell) => cell.trim());
    const headerMap = buildHeaderMap(headerCells);

    const missingHeaders = REQUIRED_HEADERS.filter((key) => !headerMap.has(key));

    if (missingHeaders.length > 0) {
      setPreviewRows([]);
      setStatusType("error");
      setStatusMessage(
        `Başlık satırı eksik. Eksik alanlar: ${missingHeaders.join(", ")}`
      );
      return;
    }

    const reservedSlugs = new Set(documents.map((doc) => doc.slug));
    const parsed: ParsedRow[] = [];

    lines.slice(1).forEach((line, index) => {
      const rowNumber = index + 2;
      const cells = line.split(delimiter).map((cell) => cell.trim());

      const title = getCell(cells, headerMap, "title");
      const description = getCell(cells, headerMap, "description");
      const grade = getCell(cells, headerMap, "grade");
      const topic = getCell(cells, headerMap, "topic");
      const subtopic = getCell(cells, headerMap, "subtopic");
      const type = getCell(cells, headerMap, "type");
      const sourceType = getCell(cells, headerMap, "sourceType");
      const fileUrl = getCell(cells, headerMap, "fileUrl");
      const solutionUrl = getCell(cells, headerMap, "solutionUrl");
      const answerKeyUrl = getCell(cells, headerMap, "answerKeyUrl");
      const coverImageUrl = getCell(cells, headerMap, "coverImageUrl");
      const featured = getCell(cells, headerMap, "featured");
      const published = getCell(cells, headerMap, "published");

      const errors: string[] = [];

      if (!title) errors.push("Başlık boş.");
      if (!description) errors.push("Açıklama boş.");
      if (!["5", "6", "7", "8"].includes(grade)) {
        errors.push("Sınıf yalnızca 5, 6, 7 veya 8 olabilir.");
      }

      const validTopics =
        grade === "5" || grade === "6" || grade === "7" || grade === "8"
          ? getTopicsByGrade(grade)
          : [];

      if (!topic) {
        errors.push("Konu boş.");
      } else if (validTopics.length > 0 && !validTopics.includes(topic)) {
        errors.push("Konu, seçilen sınıfa uygun değil.");
      }

      if (!documentTypeCatalog.includes(type)) {
        errors.push("Tür geçersiz.");
      }

      if (!sourceTypeCatalog.includes(sourceType as SourceType)) {
        errors.push("Kaynak türü geçersiz.");
      }

      if (!fileUrl || !isValidUrl(fileUrl)) {
        errors.push("İçerik bağlantısı geçersiz.");
      }

      if (solutionUrl && !isValidUrl(solutionUrl)) {
        errors.push("Çözüm bağlantısı geçersiz.");
      }

      if (answerKeyUrl && !isValidUrl(answerKeyUrl)) {
        errors.push("Cevap anahtarı bağlantısı geçersiz.");
      }

      if (coverImageUrl && !isValidUrl(coverImageUrl)) {
        errors.push("Tanıtım görseli bağlantısı geçersiz.");
      }

      const slug = buildUniqueSlug(slugifyTr(title), reservedSlugs);

      parsed.push({
        rowNumber,
        slug,
        errors,
        data: {
          id: crypto.randomUUID(),
          slug,
          title,
          description,
          grade: (grade || "5") as GradeLevel,
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
      `Önizleme hazır. Geçerli: ${parsed.filter((x) => x.errors.length === 0).length}, Hatalı: ${parsed.filter((x) => x.errors.length > 0).length}`
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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
      <div className="mb-6">
        <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-blue-800">
          Toplu İçerik Girişi
        </div>

        <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
          Excel / Sheets’ten Çoklu Kayıt Ekle
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Excel veya Google Sheets’te hazırladığın satırları başlık satırıyla
          birlikte kopyala, buraya yapıştır, önizle ve tek seferde ekle.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Tabloyu burada yapıştır..."
            rows={16}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-400"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-800/20 transition hover:bg-blue-900"
            >
              Önizle
            </button>

            <button
              type="button"
              onClick={handleBulkInsert}
              disabled={importing || validRows.length === 0}
              className="rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? "Ekleniyor..." : "Geçerli Kayıtları Ekle"}
            </button>

            <button
              type="button"
              onClick={copyTemplate}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
            >
              Şablonu Kopyala
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
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
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-black text-slate-900">
              Beklenen Başlıklar
            </div>

            <div className="mt-3 rounded-2xl bg-white p-4 text-xs leading-7 text-slate-600">
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
              <div className="text-sm font-semibold text-slate-500">
                Önizlenen
              </div>
              <div className="mt-2 text-3xl font-black text-slate-950">
                {previewRows.length}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-500">Geçerli</div>
              <div className="mt-2 text-3xl font-black text-emerald-700">
                {validRows.length}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-500">Hatalı</div>
              <div className="mt-2 text-3xl font-black text-red-700">
                {invalidRows.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewRows.length > 0 ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Geçerli Satırlar
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
                    className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5"
                  >
                    <div className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-700">
                      Satır {row.rowNumber}
                    </div>
                    <div className="text-lg font-black text-slate-950">
                      {row.data.title}
                    </div>
                    <div className="mt-2 text-sm leading-7 text-slate-600">
                      {row.data.description}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700">
                      <div>
                        <span className="font-bold">Slug:</span> {row.slug}
                      </div>
                      <div>
                        <span className="font-bold">Sınıf:</span> {row.data.grade}
                        . Sınıf
                      </div>
                      <div>
                        <span className="font-bold">Konu:</span> {row.data.topic}
                      </div>
                      <div>
                        <span className="font-bold">Tür:</span> {row.data.type}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-950">
              Hatalı Satırlar
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
                    className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5"
                  >
                    <div className="mb-2 text-xs font-black uppercase tracking-wide text-red-700">
                      Satır {row.rowNumber}
                    </div>
                    <div className="text-lg font-black text-slate-950">
                      {row.data.title || "Başlık okunamadı"}
                    </div>

                    <div className="mt-3 space-y-2">
                      {row.errors.map((error) => (
                        <div
                          key={error}
                          className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-red-700"
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