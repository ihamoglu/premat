"use client";

import type { DocumentItem } from "@/types/document";
import { useWorklist } from "@/components/providers/WorklistProvider";

type WorklistAddButtonProps = {
  doc: DocumentItem;
  variant?: "card" | "detail";
};

export default function WorklistAddButton({
  doc,
  variant = "card",
}: WorklistAddButtonProps) {
  const { addItem, hasItem } = useWorklist();
  const isAdded = hasItem(doc.id);

  const baseClass =
    variant === "detail"
      ? "block w-full rounded-2xl border px-5 py-4 text-center text-sm font-bold transition hover:-translate-y-0.5"
      : "rounded-2xl border px-4 py-3 text-center text-sm font-bold transition hover:-translate-y-0.5";

  return (
    <button
      type="button"
      onClick={() =>
        addItem({
          id: doc.id,
          slug: doc.slug,
          title: doc.title,
          grade: doc.grade,
          topic: doc.topic,
          type: doc.type,
        })
      }
      className={`${baseClass} ${
        isAdded
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
      }`}
    >
      {isAdded ? "Listemde" : "Listeme Ekle"}
    </button>
  );
}
