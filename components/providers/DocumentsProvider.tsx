"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { DocumentDifficulty, DocumentItem } from "@/types/document";
import { useAuth } from "@/components/providers/AuthProvider";
import { extractPublicStoragePath } from "@/lib/storage-paths";

type DocumentsScope = "public" | "admin";

type DocumentsContextType = {
  documents: DocumentItem[];
  addDocument: (doc: DocumentItem) => Promise<void>;
  bulkAddDocuments: (docs: DocumentItem[]) => Promise<void>;
  updateDocument: (doc: DocumentItem) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
};

const DocumentsContext = createContext<DocumentsContextType | undefined>(
  undefined
);

const COVER_BUCKET = "document-covers";

type SupabaseDocumentRow = {
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

function mapRowToDocument(row: SupabaseDocumentRow): DocumentItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    grade: row.grade as DocumentItem["grade"],
    topic: row.topic,
    subtopic: row.subtopic || undefined,
    type: row.type,
    sourceType: row.source_type as DocumentItem["sourceType"],
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

function getDocumentMetadataPayload(doc: DocumentItem) {
  return {
    difficulty: doc.difficulty || null,
    page_count: doc.pageCount || null,
    question_count: doc.questionCount || null,
    source_year: doc.sourceYear || null,
    curriculum_code: doc.curriculumCode || null,
    is_print_ready: doc.isPrintReady,
    has_video_solution: doc.hasVideoSolution || Boolean(doc.solutionUrl),
  };
}

async function revalidatePublicContent(payload?: {
  slug?: string;
  grade?: string;
}) {
  try {
    await fetch("/api/revalidate-public", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload ?? {}),
    });
  } catch (error) {
    console.error("Public içerik revalidate çağrısı başarısız:", error);
  }
}

async function removeCoverImageByPublicUrl(publicUrl?: string | null) {
  const path = extractPublicStoragePath(COVER_BUCKET, publicUrl);

  if (!path) {
    return;
  }

  const { error } = await supabase.storage.from(COVER_BUCKET).remove([path]);

  if (error) {
    console.error("Eski kapak görseli silinemedi:", error.message);
  }
}

export function DocumentsProvider({
  children,
  scope = "public",
}: {
  children: React.ReactNode;
  scope?: DocumentsScope;
}) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const ensureAdminAccess = useCallback(() => {
    if (scope !== "admin" || !isAuthenticated || !isAdmin) {
      throw new Error("Bu işlem yalnızca admin scope içinde çalışır.");
    }
  }, [scope, isAuthenticated, isAdmin]);

  const refreshDocuments = useCallback(async () => {
    if (scope === "admin") {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated || !isAdmin) {
        setDocuments([]);
        return;
      }
    }

    let query = supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (scope === "public") {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Kayıtlar alınamadı:", error.message);
      return;
    }

    setDocuments((data as SupabaseDocumentRow[]).map(mapRowToDocument));
  }, [scope, isLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshDocuments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshDocuments]);

  const addDocument = useCallback(async (doc: DocumentItem) => {
    ensureAdminAccess();

    const insertPayload = {
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      grade: doc.grade,
      topic: doc.topic,
      subtopic: doc.subtopic || null,
      type: doc.type,
      source_type: doc.sourceType,
      file_url: doc.fileUrl,
      solution_url: doc.solutionUrl || null,
      answer_key_url: doc.answerKeyUrl || null,
      cover_image_url: doc.coverImageUrl || null,
      ...getDocumentMetadataPayload(doc),
      featured: doc.featured,
      published: doc.published,
    };

    const { error } = await supabase.from("documents").insert(insertPayload);

    if (error) {
      console.error("Kayıt eklenemedi:", error.message);
      throw error;
    }

    await refreshDocuments();
    await revalidatePublicContent({
      slug: doc.slug,
      grade: doc.grade,
    });
  }, [ensureAdminAccess, refreshDocuments]);

  const bulkAddDocuments = useCallback(async (docs: DocumentItem[]) => {
    ensureAdminAccess();

    if (docs.length === 0) {
      return;
    }

    const insertPayload = docs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      grade: doc.grade,
      topic: doc.topic,
      subtopic: doc.subtopic || null,
      type: doc.type,
      source_type: doc.sourceType,
      file_url: doc.fileUrl,
      solution_url: doc.solutionUrl || null,
      answer_key_url: doc.answerKeyUrl || null,
      cover_image_url: doc.coverImageUrl || null,
      ...getDocumentMetadataPayload(doc),
      featured: doc.featured,
      published: doc.published,
    }));

    const { error } = await supabase.from("documents").insert(insertPayload);

    if (error) {
      console.error("Toplu kayıt eklenemedi:", error.message);
      throw error;
    }

    await refreshDocuments();
    await revalidatePublicContent();
  }, [ensureAdminAccess, refreshDocuments]);

  const updateDocument = useCallback(async (updatedDoc: DocumentItem) => {
    ensureAdminAccess();

    const existingDoc = documents.find((doc) => doc.id === updatedDoc.id);

    const updatePayload = {
      slug: updatedDoc.slug,
      title: updatedDoc.title,
      description: updatedDoc.description,
      grade: updatedDoc.grade,
      topic: updatedDoc.topic,
      subtopic: updatedDoc.subtopic || null,
      type: updatedDoc.type,
      source_type: updatedDoc.sourceType,
      file_url: updatedDoc.fileUrl,
      solution_url: updatedDoc.solutionUrl || null,
      answer_key_url: updatedDoc.answerKeyUrl || null,
      cover_image_url: updatedDoc.coverImageUrl || null,
      ...getDocumentMetadataPayload(updatedDoc),
      featured: updatedDoc.featured,
      published: updatedDoc.published,
    };

    const { error } = await supabase
      .from("documents")
      .update(updatePayload)
      .eq("id", updatedDoc.id);

    if (error) {
      console.error("Kayıt güncellenemedi:", error.message);
      throw error;
    }

    const oldCoverUrl = existingDoc?.coverImageUrl || null;
    const newCoverUrl = updatedDoc.coverImageUrl || null;

    if (oldCoverUrl && oldCoverUrl !== newCoverUrl) {
      await removeCoverImageByPublicUrl(oldCoverUrl);
    }

    await refreshDocuments();
    await revalidatePublicContent({
      slug: updatedDoc.slug,
      grade: updatedDoc.grade,
    });
  }, [documents, ensureAdminAccess, refreshDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    ensureAdminAccess();

    const targetDoc = documents.find((doc) => doc.id === id);

    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      console.error("Kayıt silinemedi:", error.message);
      throw error;
    }

    if (targetDoc?.coverImageUrl) {
      await removeCoverImageByPublicUrl(targetDoc.coverImageUrl);
    }

    await refreshDocuments();
    await revalidatePublicContent({
      slug: targetDoc?.slug,
      grade: targetDoc?.grade,
    });
  }, [documents, ensureAdminAccess, refreshDocuments]);

  const value = useMemo(
    () => ({
      documents,
      addDocument,
      bulkAddDocuments,
      updateDocument,
      deleteDocument,
      refreshDocuments,
    }),
    [
      documents,
      addDocument,
      bulkAddDocuments,
      updateDocument,
      deleteDocument,
      refreshDocuments,
    ]
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error("useDocuments must be used inside DocumentsProvider");
  }

  return context;
}
