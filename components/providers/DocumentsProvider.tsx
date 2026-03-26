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

type DocumentsContextType = {
  documents: DocumentItem[];
  addDocument: (doc: DocumentItem) => Promise<void>;
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
    type: row.type as DocumentItem["type"],
    sourceType: row.source_type as DocumentItem["sourceType"],
    fileUrl: row.file_url,
    solutionUrl: row.solution_url || undefined,
    answerKeyUrl: row.answer_key_url || undefined,
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at.slice(0, 10),
  };
}

export function DocumentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  async function refreshDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Kayıtlar alınamadı:", error.message);
      return;
    }

    setDocuments((data as SupabaseDocumentRow[]).map(mapRowToDocument));
  }

  useEffect(() => {
    refreshDocuments();
  }, []);

  async function addDocument(doc: DocumentItem) {
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
      featured: doc.featured,
      published: doc.published,
    };

    const { error } = await supabase.from("documents").insert(insertPayload);

    if (error) {
      console.error("Kayıt eklenemedi:", error.message);
      throw error;
    }

    await refreshDocuments();
  }

  async function updateDocument(updatedDoc: DocumentItem) {
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
  }

  async function deleteDocument(id: string) {
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      console.error("Kayıt silinemedi:", error.message);
      throw error;
    }

    await refreshDocuments();
  }

  const value = useMemo(
    () => ({
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
      refreshDocuments,
    }),
    [documents]
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