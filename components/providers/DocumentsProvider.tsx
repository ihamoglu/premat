"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { DocumentItem } from "@/types/document";
import { useAuth } from "@/components/providers/AuthProvider";

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
  featured: boolean;
  published: boolean;
  created_at: string;
};

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
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at.slice(0, 10),
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

export function DocumentsProvider({
  children,
  scope = "public",
}: {
  children: React.ReactNode;
  scope?: DocumentsScope;
}) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  function ensureAdminAccess() {
    if (scope !== "admin" || !isAuthenticated || !isAdmin) {
      throw new Error("Bu işlem yalnızca admin scope içinde çalışır.");
    }
  }

  async function refreshDocuments() {
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
  }

  useEffect(() => {
    if (scope === "public") {
      refreshDocuments();
      return;
    }

    if (!isLoading) {
      refreshDocuments();
    }
  }, [scope, isAuthenticated, isAdmin, isLoading]);

  async function addDocument(doc: DocumentItem) {
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
  }

  async function bulkAddDocuments(docs: DocumentItem[]) {
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
  }

  async function updateDocument(updatedDoc: DocumentItem) {
    ensureAdminAccess();

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

    await refreshDocuments();
    await revalidatePublicContent({
      slug: updatedDoc.slug,
      grade: updatedDoc.grade,
    });
  }

  async function deleteDocument(id: string) {
    ensureAdminAccess();

    const targetDoc = documents.find((doc) => doc.id === id);

    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      console.error("Kayıt silinemedi:", error.message);
      throw error;
    }

    await refreshDocuments();
    await revalidatePublicContent({
      slug: targetDoc?.slug,
      grade: targetDoc?.grade,
    });
  }

  const value = useMemo(
    () => ({
      documents,
      addDocument,
      bulkAddDocuments,
      updateDocument,
      deleteDocument,
      refreshDocuments,
    }),
    [documents, scope, isAuthenticated, isAdmin, isLoading]
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