import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublishedDocuments } from "@/lib/server-documents";
import { checkRateLimit, getRequestFingerprint } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabasePublishableKey);

const eventTypes = new Set([
  "detail_view",
  "file_open",
  "solution_open",
  "answer_key_open",
  "collection_add",
]);

function hashUserAgent(value: string | null) {
  if (!value) {
    return null;
  }

  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(
      `document-events:${getRequestFingerprint(request)}`,
      {
        limit: 60,
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
      documentId?: unknown;
      eventType?: unknown;
    };

    if (
      typeof body.documentId !== "string" ||
      typeof body.eventType !== "string" ||
      !eventTypes.has(body.eventType)
    ) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz event." },
        { status: 400 }
      );
    }

    const publishedDocuments = await getPublishedDocuments();
    const exists = publishedDocuments.some((doc) => doc.id === body.documentId);

    if (!exists) {
      return NextResponse.json(
        { ok: false, message: "Doküman bulunamadı." },
        { status: 404 }
      );
    }

    const { error } = await supabase.from("document_events").insert({
      document_id: body.documentId,
      event_type: body.eventType,
      user_agent_hash: hashUserAgent(request.headers.get("user-agent")),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
