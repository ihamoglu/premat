import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  DocumentDifficulty,
  DocumentItem,
  GradeLevel,
  SourceType,
} from "@/types/document";
import { getRelatedDocuments } from "@/lib/related-documents";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabasePublishableKey);

export type ServerDocumentRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  grade: string;
  topic: string;
  subtopic: string | null;
  type: string;
  source_type: string;
  file_url: string;
  solution_url: string | null;
  answer_key_url: string | null;
  cover_image_url: string | null;
  difficulty?: string | null;
  page_count?: number | null;
  question_count?: number | null;
  source_year?: number | null;
  curriculum_code?: string | null;
  is_print_ready?: boolean | null;
  has_video_solution?: boolean | null;
  featured: boolean;
  published: boolean;
  created_at: string;
};

function mapOptionalNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function mapRowToDocument(row: ServerDocumentRow): DocumentItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    grade: row.grade as GradeLevel,
    topic: row.topic,
    subtopic: row.subtopic || undefined,
    type: row.type,
    sourceType: row.source_type as SourceType,
    fileUrl: row.file_url,
    solutionUrl: row.solution_url || undefined,
    answerKeyUrl: row.answer_key_url || undefined,
    coverImageUrl: row.cover_image_url || undefined,
    difficulty: (row.difficulty || undefined) as
      | DocumentDifficulty
      | undefined,
    pageCount: mapOptionalNumber(row.page_count),
    questionCount: mapOptionalNumber(row.question_count),
    sourceYear: mapOptionalNumber(row.source_year),
    curriculumCode: row.curriculum_code || undefined,
    isPrintReady: Boolean(row.is_print_ready),
    hasVideoSolution: Boolean(row.has_video_solution || row.solution_url),
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at.slice(0, 10),
  };
}

function mapRows(rows: ServerDocumentRow[] | null) {
  return (rows ?? []).map(mapRowToDocument);
}

type PopularityRow = {
  document_id: string;
  popularity_score: number;
};

async function attachPopularityScores(documents: DocumentItem[]) {
  if (documents.length === 0) {
    return documents;
  }

  const { data, error } = await supabase
    .rpc("get_public_document_popularity")
    .abortSignal(AbortSignal.timeout(5000));

  if (error) {
    return documents;
  }

  const scores = new Map(
    ((data ?? []) as PopularityRow[]).map((item) => [
      item.document_id,
      Number(item.popularity_score) || 0,
    ])
  );

  return documents.map((doc) => ({
    ...doc,
    popularityScore: scores.get(doc.id) ?? 0,
  }));
}

const CACHE_TAG = "documents-public";
const CACHE_SECONDS = 300;

const getPublishedDocumentsCached = unstable_cache(
  async (limitValue: number | null) => {
    let query = supabase
      .from("documents")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (limitValue) {
      query = query.limit(limitValue);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Yayındaki dökümanlar alınamadı:", error.message);
      return [];
    }

    return attachPopularityScores(mapRows(data as ServerDocumentRow[] | null));
  },
  ["documents-public-list"],
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_SECONDS,
  }
);

const getPublishedDocumentsByGradeCached = unstable_cache(
  async (
    grade: GradeLevel,
    excludeSlug?: string,
    excludeTopic?: string,
    limitValue?: number
  ) => {
    let query = supabase
      .from("documents")
      .select("*")
      .eq("published", true)
      .eq("grade", grade)
      .order("created_at", { ascending: false });

    if (excludeSlug) {
      query = query.neq("slug", excludeSlug);
    }

    if (excludeTopic) {
      query = query.neq("topic", excludeTopic);
    }

    if (limitValue) {
      query = query.limit(limitValue);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Sınıfa göre dökümanlar alınamadı:", error.message);
      return [];
    }

    return mapRows(data as ServerDocumentRow[] | null);
  },
  ["documents-public-grade"],
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_SECONDS,
  }
);

const getPublishedDocumentsByTopicCached = unstable_cache(
  async (topic: string, excludeSlug?: string, limitValue?: number) => {
    let query = supabase
      .from("documents")
      .select("*")
      .eq("published", true)
      .eq("topic", topic)
      .order("created_at", { ascending: false });

    if (excludeSlug) {
      query = query.neq("slug", excludeSlug);
    }

    if (limitValue) {
      query = query.limit(limitValue);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Konuya göre dökümanlar alınamadı:", error.message);
      return [];
    }

    return mapRows(data as ServerDocumentRow[] | null);
  },
  ["documents-public-topic"],
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_SECONDS,
  }
);

const getPublishedDocumentBySlugCached = unstable_cache(
  async (slug: string) => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("Slug ile döküman alınamadı:", error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapRowToDocument(data as ServerDocumentRow);
  },
  ["documents-public-slug"],
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_SECONDS,
  }
);

const getPublishedDocumentsForSitemapCached = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("slug, topic, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Sitemap için dökümanlar alınamadı:", error.message);
      return [];
    }

    return (data ?? []) as { slug: string; topic: string; created_at: string }[];
  },
  ["documents-public-sitemap"],
  {
    tags: [CACHE_TAG],
    revalidate: CACHE_SECONDS,
  }
);

export async function getPublishedDocuments(limit?: number) {
  return getPublishedDocumentsCached(limit ?? null);
}

export async function getPublishedDocumentsByGrade(
  grade: GradeLevel,
  options?: {
    excludeSlug?: string;
    excludeTopic?: string;
    limit?: number;
  }
) {
  return getPublishedDocumentsByGradeCached(
    grade,
    options?.excludeSlug,
    options?.excludeTopic,
    options?.limit
  );
}

export async function getPublishedDocumentsByTopic(
  topic: string,
  options?: {
    excludeSlug?: string;
    limit?: number;
  }
) {
  return getPublishedDocumentsByTopicCached(
    topic,
    options?.excludeSlug,
    options?.limit
  );
}

export async function getPublishedDocumentBySlug(slug: string) {
  return getPublishedDocumentBySlugCached(slug);
}

export async function getPublishedDocumentsForSitemap() {
  return getPublishedDocumentsForSitemapCached();
}

export async function getRelatedPublishedDocuments(
  doc: DocumentItem,
  limit = 6
) {
  const documents = await getPublishedDocuments();

  return getRelatedDocuments(doc, documents, limit);
}
