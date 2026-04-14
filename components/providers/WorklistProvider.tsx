"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DocumentItem } from "@/types/document";

export type WorklistItem = Pick<
  DocumentItem,
  "id" | "slug" | "title" | "grade" | "topic" | "type"
>;

type WorklistContextType = {
  items: WorklistItem[];
  addItem: (doc: WorklistItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  moveItem: (id: string, direction: "up" | "down") => void;
  hasItem: (id: string) => boolean;
};

const STORAGE_KEY = "premat_worklist_v1";
const WorklistContext = createContext<WorklistContextType | undefined>(
  undefined
);

function parseStoredItems(value: string | null): WorklistItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as WorklistItem[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.slug === "string" &&
        typeof item.title === "string"
    );
  } catch {
    return [];
  }
}

function trackCollectionAdd(documentId: string) {
  void fetch("/api/documents/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentId,
      eventType: "collection_add",
    }),
  }).catch(() => undefined);
}

export function WorklistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WorklistItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setItems(parseStoredItems(window.localStorage.getItem(STORAGE_KEY)));
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const addItem = useCallback((doc: WorklistItem) => {
    setItems((current) => {
      if (current.some((item) => item.id === doc.id)) {
        return current;
      }

      trackCollectionAdd(doc.id);
      return [...current, doc].slice(0, 60);
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const moveItem = useCallback((id: string, direction: "up" | "down") => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);

      if (index === -1) {
        return current;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  }, []);

  const hasItem = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearItems,
      moveItem,
      hasItem,
    }),
    [items, addItem, removeItem, clearItems, moveItem, hasItem]
  );

  return (
    <WorklistContext.Provider value={value}>
      {children}
    </WorklistContext.Provider>
  );
}

export function useWorklist() {
  const context = useContext(WorklistContext);

  if (!context) {
    throw new Error("useWorklist must be used inside WorklistProvider");
  }

  return context;
}
