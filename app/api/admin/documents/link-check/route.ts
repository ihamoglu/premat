import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

type LinkKind = "file" | "solution" | "answerKey";

type LinkCheckRow = {
  id: string;
  slug: string;
  title: string;
  file_url: string;
  solution_url: string | null;
  answer_key_url: string | null;
};

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

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

function parseLimit(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

async function checkUrl(url: string) {
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
    }

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      statusText:
        error instanceof Error ? error.message : "Bağlantı kontrol edilemedi.",
    };
  }
}

function collectLinks(row: LinkCheckRow) {
  const links: Array<{ kind: LinkKind; url: string }> = [
    { kind: "file", url: row.file_url },
  ];

  if (row.solution_url) {
    links.push({ kind: "solution", url: row.solution_url });
  }

  if (row.answer_key_url) {
    links.push({ kind: "answerKey", url: row.answer_key_url });
  }

  return links;
}

export async function POST(request: Request) {
  try {
    const supabase = await ensureAdmin();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    let body: { limit?: number; ids?: string[] } = {};

    try {
      body = (await request.json()) as { limit?: number; ids?: string[] };
    } catch {
      body = {};
    }

    let query = supabase
      .from("documents")
      .select("id, slug, title, file_url, solution_url, answer_key_url")
      .order("created_at", { ascending: false })
      .limit(parseLimit(body.limit));

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      query = query.in("id", body.ids.slice(0, MAX_LIMIT));
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as LinkCheckRow[];
    const results = await Promise.all(
      rows.map(async (row) => {
        const links = await Promise.all(
          collectLinks(row).map(async (link) => ({
            kind: link.kind,
            url: link.url,
            ...(await checkUrl(link.url)),
          }))
        );

        return {
          id: row.id,
          slug: row.slug,
          title: row.title,
          links,
          hasIssue: links.some((link) => !link.ok),
        };
      })
    );

    return NextResponse.json({
      ok: true,
      checked: results.length,
      issueCount: results.filter((item) => item.hasIssue).length,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Link kontrolü başarısız.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
