import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

type EventRow = {
  document_id: string;
  event_type: string;
  documents:
    | {
        title: string;
        slug: string;
      }
    | Array<{
        title: string;
        slug: string;
      }>
    | null;
};

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return null;
  }

  return supabase;
}

export async function GET() {
  try {
    const supabase = await ensureAdmin();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("document_events")
      .select("document_id, event_type, documents(title, slug)")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    const counts = new Map<
      string,
      {
        documentId: string;
        title: string;
        slug: string;
        total: number;
        fileOpen: number;
        detailView: number;
      }
    >();

    ((data ?? []) as unknown as EventRow[]).forEach((event) => {
      const document = Array.isArray(event.documents)
        ? event.documents[0]
        : event.documents;

      if (!document) {
        return;
      }

      const current =
        counts.get(event.document_id) ??
        {
          documentId: event.document_id,
          title: document.title,
          slug: document.slug,
          total: 0,
          fileOpen: 0,
          detailView: 0,
        };

      current.total += 1;

      if (event.event_type === "file_open") {
        current.fileOpen += 1;
      }

      if (event.event_type === "detail_view") {
        current.detailView += 1;
      }

      counts.set(event.document_id, current);
    });

    return NextResponse.json({
      ok: true,
      topDocuments: Array.from(counts.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 8),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Operasyon raporu alınamadı.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
