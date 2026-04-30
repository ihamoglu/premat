import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublishedDocuments } from "@/lib/server-documents";
import { checkRateLimit, getRequestFingerprint } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabasePublishableKey);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function createCollectionSlug() {
  return `liste-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, 120)
    : fallback;
}

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(
      `collections:${getRequestFingerprint(request)}`,
      {
        limit: 10,
        windowMs: 60_000,
      }
    );

    if (!rateLimit.ok) {
      return NextResponse.json(
        { ok: false, message: "Cok fazla istek." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter) },
        }
      );
    }

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      documentIds?: unknown;
    };

    const requestedIds = Array.isArray(body.documentIds)
      ? body.documentIds.filter(
          (id): id is string => typeof id === "string" && UUID_RE.test(id)
        )
      : [];

    const uniqueRequestedIds = Array.from(new Set(requestedIds)).slice(0, 60);

    if (uniqueRequestedIds.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Koleksiyon için doküman seçilmedi." },
        { status: 400 }
      );
    }

    const publishedDocuments = await getPublishedDocuments();
    const publishedIds = new Set(publishedDocuments.map((doc) => doc.id));
    const validIds = uniqueRequestedIds.filter((id) => publishedIds.has(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Yayınlanmış doküman bulunamadı." },
        { status: 400 }
      );
    }

    const publicSlug = createCollectionSlug();
    const title = normalizeText(body.title, "Çalışma Listem");
    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim().slice(0, 240)
        : null;

    const { data: collection, error: collectionError } = await supabase
      .from("document_collections")
      .insert({
        public_slug: publicSlug,
        title,
        description,
        is_public: true,
      })
      .select("id, public_slug")
      .single();

    if (collectionError || !collection) {
      throw collectionError || new Error("Koleksiyon oluşturulamadı.");
    }

    const { error: itemsError } = await supabase
      .from("document_collection_items")
      .insert(
        validIds.map((documentId, index) => ({
          collection_id: collection.id,
          document_id: documentId,
          position: index,
        }))
      );

    if (itemsError) {
      throw itemsError;
    }

    return NextResponse.json({
      ok: true,
      slug: collection.public_slug,
      url: `/koleksiyon/${collection.public_slug}`,
      documentCount: validIds.length,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Koleksiyon oluşturulamadı." },
      { status: 500 }
    );
  }
}
