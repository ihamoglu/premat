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
import { fetchAdminJson } from "@/lib/admin-api-client";
import {
  DocumentDifficulty,
  DocumentItem,
  DocumentLink,
  DocumentLinkKind,
} from "@/types/document";
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

type SupabaseDocumentLinkRow = {
  id: string;
  document_id: string;
  kind: string;
  label: string;
  url: string;
  position: number;
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

function mapRowToDocumentLink(row: SupabaseDocumentLinkRow): DocumentLink {
  return {
    id: row.id,
    kind: row.kind as DocumentLinkKind,
    label: row.label,
    url: row.url,
    position: row.position,
  };
}

async function attachDocumentLinks(documents: DocumentItem[]) {
  if (documents.length === 0) {
    return documents;
  }

  const { data, error } = await supabase
    .from("document_links")
    .select("*")
    .in(
      "document_id",
      documents.map((doc) => doc.id)
    )
    .order("position", { ascending: true });

  if (error) {
    return documents;
  }

  const grouped = new Map<string, DocumentLink[]>();

  ((data ?? []) as SupabaseDocumentLinkRow[]).forEach((row) => {
    const current = grouped.get(row.document_id) ?? [];
    current.push(mapRowToDocumentLink(row));
    grouped.set(row.document_id, current);
  });

  return documents.map((doc) => ({
    ...doc,
    links: grouped.get(doc.id) ?? [],
  }));
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
    console.error("Public content revalidate failed:", error);
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
      throw new Error("Bu islem yalnizca admin scope icinde calisir.");
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
      console.error("Kayitlar alinamadi:", error.message);
      return;
    }

    const mapped = (data as SupabaseDocumentRow[]).map(mapRowToDocument);
    setDocuments(await attachDocumentLinks(mapped));
  }, [scope, isLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshDocuments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshDocuments]);

  const addDocument = useCallback(async (doc: DocumentItem) => {
    ensureAdminAccess();

    await fetchAdminJson<{ ok: true; count: number }>("/api/admin/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document: doc }),
    });
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

    await fetchAdminJson<{ ok: true; count: number }>("/api/admin/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documents: docs }),
    });
    await refreshDocuments();
    await revalidatePublicContent();
  }, [ensureAdminAccess, refreshDocuments]);

  const updateDocument = useCallback(async (updatedDoc: DocumentItem) => {
    ensureAdminAccess();

    await fetchAdminJson<{ ok: true }>("/api/admin/documents", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document: updatedDoc }),
    });
    await refreshDocuments();
    await revalidatePublicContent({
      slug: updatedDoc.slug,
      grade: updatedDoc.grade,
    });
  }, [ensureAdminAccess, refreshDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    ensureAdminAccess();

    const targetDoc = documents.find((doc) => doc.id === id);

    await fetchAdminJson<{ ok: true }>("/api/admin/documents", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
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
