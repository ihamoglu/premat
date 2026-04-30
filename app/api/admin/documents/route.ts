import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-server";
import { extractPublicStoragePath } from "@/lib/storage-paths";
import {
  normalizeOptionalPublicUrl,
  normalizeRequiredPublicUrl,
} from "@/lib/url-security";
import type {
  DocumentDifficulty,
  DocumentItem,
  DocumentLinkKind,
  SourceType,
} from "@/types/document";

const COVER_BUCKET = "document-covers";
const LINK_KINDS = new Set<DocumentLinkKind>([
  "file",
  "solution",
  "answer_key",
  "video",
  "extra",
]);
const DIFFICULTIES = new Set<DocumentDifficulty>([
  "Başlangıç",
  "Orta",
  "İleri",
  "Karma",
]);
const SOURCE_TYPES = new Set<SourceType>([
  "Google Drive",
  "OneDrive",
  "Dropbox",
  "Diğer",
]);

type SupabaseAdminClient = NonNullable<
  Awaited<ReturnType<typeof requireAdmin>>
>["supabase"];

type DocumentPayload = Partial<DocumentItem>;

function normalizeString(value: unknown, fieldName: string, maxLength = 500) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} zorunludur.`);
  }

  return value.trim().slice(0, maxLength);
}

function normalizeOptionalString(value: unknown, maxLength = 500) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : null;
}

function normalizeGrade(value: unknown) {
  if (value === "5" || value === "6" || value === "7" || value === "8") {
    return value;
  }

  throw new Error("Geçersiz sınıf seviyesi.");
}

function normalizeSourceType(value: unknown) {
  if (typeof value === "string" && SOURCE_TYPES.has(value as SourceType)) {
    return value;
  }

  return "Diğer";
}

function normalizeDifficulty(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string" && DIFFICULTIES.has(value as DocumentDifficulty)) {
    return value;
  }

  throw new Error("Geçersiz zorluk değeri.");
}

function normalizePositiveInteger(value: unknown, fieldName: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} pozitif tam sayı olmalıdır.`);
  }

  return parsed;
}

function normalizeSourceYear(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 2100) {
    throw new Error("Kaynak yılı 2000 ile 2100 arasında olmalıdır.");
  }

  return parsed;
}

function normalizeLinks(doc: DocumentPayload) {
  return (doc.links ?? [])
    .filter((link) => link.label?.trim() && link.url?.trim())
    .map((link, index) => {
      const kind = LINK_KINDS.has(link.kind) ? link.kind : "extra";

      return {
        document_id: normalizeString(doc.id, "Doküman ID", 80),
        kind,
        label: normalizeString(link.label, "Bağlantı etiketi", 120),
        url: normalizeRequiredPublicUrl(link.url, "Ek bağlantı"),
        position: index * 10,
      };
    });
}

function mapDocumentPayload(doc: DocumentPayload) {
  const id = normalizeString(doc.id, "Doküman ID", 80);
  const slug = normalizeString(doc.slug, "Slug", 180).toLowerCase();

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug yalnızca küçük harf, rakam ve tire içerebilir.");
  }

  const grade = normalizeGrade(doc.grade);
  const sourceType = normalizeSourceType(doc.sourceType);

  return {
    id,
    slug,
    title: normalizeString(doc.title, "Başlık", 220),
    description: normalizeString(doc.description, "Açıklama", 1000),
    grade,
    topic: normalizeString(doc.topic, "Konu", 300),
    subtopic: normalizeOptionalString(doc.subtopic, 300),
    type: normalizeString(doc.type, "İçerik türü", 220),
    source_type: sourceType,
    file_url: normalizeRequiredPublicUrl(doc.fileUrl, "Doküman bağlantısı"),
    solution_url: normalizeOptionalPublicUrl(doc.solutionUrl, "Çözüm bağlantısı"),
    answer_key_url: normalizeOptionalPublicUrl(
      doc.answerKeyUrl,
      "Cevap anahtarı bağlantısı"
    ),
    cover_image_url: normalizeOptionalPublicUrl(
      doc.coverImageUrl,
      "Kapak görseli bağlantısı"
    ),
    difficulty: normalizeDifficulty(doc.difficulty),
    page_count: normalizePositiveInteger(doc.pageCount, "Sayfa sayısı"),
    question_count: normalizePositiveInteger(doc.questionCount, "Soru sayısı"),
    source_year: normalizeSourceYear(doc.sourceYear),
    curriculum_code: normalizeOptionalString(doc.curriculumCode, 120),
    is_print_ready: Boolean(doc.isPrintReady),
    has_video_solution: Boolean(doc.hasVideoSolution || doc.solutionUrl),
    featured: Boolean(doc.featured),
    published: Boolean(doc.published),
  };
}

function withoutDocumentId(row: ReturnType<typeof mapDocumentPayload>) {
  const { id, ...payload } = row;
  void id;
  return payload;
}

async function syncDocumentLinks(
  supabase: SupabaseAdminClient,
  doc: DocumentPayload
) {
  const links = normalizeLinks(doc);
  const documentId = normalizeString(doc.id, "Doküman ID", 80);

  const { error: deleteError } = await supabase
    .from("document_links")
    .delete()
    .eq("document_id", documentId);

  if (deleteError) {
    throw deleteError;
  }

  if (links.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("document_links").insert(links);

  if (insertError) {
    throw insertError;
  }
}

async function removeCoverByPublicUrl(
  supabase: SupabaseAdminClient,
  publicUrl?: string | null
) {
  const path = extractPublicStoragePath(COVER_BUCKET, publicUrl);

  if (!path) {
    return;
  }

  const { error } = await supabase.storage.from(COVER_BUCKET).remove([path]);

  if (error) {
    throw error;
  }
}

function parseDocumentList(body: unknown) {
  if (
    body &&
    typeof body === "object" &&
    "documents" in body &&
    Array.isArray((body as { documents?: unknown }).documents)
  ) {
    return (body as { documents: DocumentPayload[] }).documents;
  }

  if (
    body &&
    typeof body === "object" &&
    "document" in body &&
    typeof (body as { document?: unknown }).document === "object"
  ) {
    return [(body as { document: DocumentPayload }).document];
  }

  throw new Error("Doküman verisi bulunamadı.");
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const documents = parseDocumentList(body);

    if (documents.length === 0 || documents.length > 250) {
      return NextResponse.json(
        { ok: false, message: "Doküman sayısı geçersiz." },
        { status: 400 }
      );
    }

    const rows = documents.map(mapDocumentPayload);
    const { error } = await admin.supabase.from("documents").insert(rows);

    if (error) {
      throw error;
    }

    await Promise.all(documents.map((doc) => syncDocumentLinks(admin.supabase, doc)));

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Doküman kaydedilemedi.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { document?: DocumentPayload };
    const doc = body.document;

    if (!doc?.id) {
      return NextResponse.json(
        { ok: false, message: "Güncellenecek doküman bulunamadı." },
        { status: 400 }
      );
    }

    const documentId = normalizeString(doc.id, "Doküman ID", 80);
    const { data: existingDoc, error: existingError } = await admin.supabase
      .from("documents")
      .select("cover_image_url")
      .eq("id", documentId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    const row = mapDocumentPayload(doc);
    const updatePayload = withoutDocumentId(row);
    const { error } = await admin.supabase
      .from("documents")
      .update(updatePayload)
      .eq("id", documentId);

    if (error) {
      throw error;
    }

    await syncDocumentLinks(admin.supabase, doc);

    const previousCoverUrl =
      typeof existingDoc?.cover_image_url === "string"
        ? existingDoc.cover_image_url
        : null;
    const nextCoverUrl = row.cover_image_url;

    if (previousCoverUrl && previousCoverUrl !== nextCoverUrl) {
      await removeCoverByPublicUrl(admin.supabase, previousCoverUrl);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Doküman güncellenemedi.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { id?: unknown };
    const documentId = normalizeString(body.id, "Doküman ID", 80);
    const { data: existingDoc, error: existingError } = await admin.supabase
      .from("documents")
      .select("cover_image_url")
      .eq("id", documentId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    const { error } = await admin.supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      throw error;
    }

    if (typeof existingDoc?.cover_image_url === "string") {
      await removeCoverByPublicUrl(admin.supabase, existingDoc.cover_image_url);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Doküman silinemedi.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
