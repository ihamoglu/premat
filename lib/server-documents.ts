import { createClient } from "@supabase/supabase-js";

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
  featured: boolean;
  published: boolean;
  created_at: string;
};

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

  return data as ServerDocumentRow | null;
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