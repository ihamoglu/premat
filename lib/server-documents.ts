import { createClient } from "@supabase/supabase-js";
import { DocumentItem, GradeLevel, SourceType } from "@/types/document";

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
  featured: boolean;
  published: boolean;
  created_at: string;
};

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
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at.slice(0, 10),
  };
}

function mapRows(rows: ServerDocumentRow[] | null) {
  return (rows ?? []).map(mapRowToDocument);
}

export async function getPublishedDocuments(limit?: number) {
  let query = supabase
    .from("documents")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Yayındaki dökümanlar alınamadı:", error.message);
    return [];
  }

  return mapRows(data as ServerDocumentRow[] | null);
}

export async function getPublishedDocumentsByGrade(
  grade: GradeLevel,
  options?: {
    excludeSlug?: string;
    excludeTopic?: string;
    limit?: number;
  }
) {
  let query = supabase
    .from("documents")
    .select("*")
    .eq("published", true)
    .eq("grade", grade)
    .order("created_at", { ascending: false });

  if (options?.excludeSlug) {
    query = query.neq("slug", options.excludeSlug);
  }

  if (options?.excludeTopic) {
    query = query.neq("topic", options.excludeTopic);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Sınıfa göre dökümanlar alınamadı:", error.message);
    return [];
  }

  return mapRows(data as ServerDocumentRow[] | null);
}

export async function getPublishedDocumentsByTopic(
  topic: string,
  options?: {
    excludeSlug?: string;
    limit?: number;
  }
) {
  let query = supabase
    .from("documents")
    .select("*")
    .eq("published", true)
    .eq("topic", topic)
    .order("created_at", { ascending: false });

  if (options?.excludeSlug) {
    query = query.neq("slug", options.excludeSlug);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Konuya göre dökümanlar alınamadı:", error.message);
    return [];
  }

  return mapRows(data as ServerDocumentRow[] | null);
}

export async function getPublishedDocumentBySlug(slug: string) {
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
}

export async function getPublishedDocumentsForSitemap() {
  const { data, error } = await supabase
    .from("documents")
    .select("slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Sitemap için dökümanlar alınamadı:", error.message);
    return [];
  }

  return (data ?? []) as { slug: string; created_at: string }[];
}