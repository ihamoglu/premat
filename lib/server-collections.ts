import { createClient } from "@supabase/supabase-js";
import type { DocumentItem, GradeLevel, SourceType } from "@/types/document";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabasePublishableKey);

type CollectionDocumentRow = {
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

type CollectionItemRow = {
  position: number;
  documents: CollectionDocumentRow | CollectionDocumentRow[] | null;
};

type CollectionRow = {
  id: string;
  public_slug: string;
  title: string;
  description: string | null;
  created_at: string;
  expires_at: string | null;
  document_collection_items: CollectionItemRow[] | null;
};

function optionalNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function mapDocument(row: CollectionDocumentRow): DocumentItem {
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
    difficulty: (row.difficulty || undefined) as DocumentItem["difficulty"],
    pageCount: optionalNumber(row.page_count),
    questionCount: optionalNumber(row.question_count),
    sourceYear: optionalNumber(row.source_year),
    curriculumCode: row.curriculum_code || undefined,
    isPrintReady: Boolean(row.is_print_ready),
    hasVideoSolution: Boolean(row.has_video_solution || row.solution_url),
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at.slice(0, 10),
  };
}

export async function getPublicCollectionBySlug(slug: string) {
  const { data, error } = await supabase
    .from("document_collections")
    .select(
      `
        id,
        public_slug,
        title,
        description,
        created_at,
        expires_at,
        document_collection_items (
          position,
          documents (*)
        )
      `
    )
    .eq("public_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Koleksiyon alınamadı:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as CollectionRow;
  const documents = (row.document_collection_items ?? [])
    .map((item) => {
      const document = Array.isArray(item.documents)
        ? item.documents[0]
        : item.documents;

      return {
        position: item.position,
        document,
      };
    })
    .filter(
      (
        item
      ): item is { position: number; document: CollectionDocumentRow } =>
        item.document != null && !!item.document.published
    )
    .sort((a, b) => a.position - b.position)
    .map((item) => mapDocument(item.document));

  return {
    id: row.id,
    slug: row.public_slug,
    title: row.title,
    description: row.description || undefined,
    createdAt: row.created_at,
    expiresAt: row.expires_at || undefined,
    documents,
  };
}
