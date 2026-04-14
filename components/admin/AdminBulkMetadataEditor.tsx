"use client";

import { useMemo, useState } from "react";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDocuments } from "@/components/providers/DocumentsProvider";
import {
  documentDifficultyCatalog,
  documentTypeCatalog,
  getAllTopics,
} from "@/data/catalog";
import type { DocumentDifficulty, DocumentItem } from "@/types/document";

type BulkState = {
  difficulty: "" | DocumentDifficulty;
  sourceYear: string;
  topic: string;
  type: string;
  isPrintReady: "" | "true" | "false";
  hasVideoSolution: "" | "true" | "false";
  published: "" | "true" | "false";
};

const initialBulkState: BulkState = {
  difficulty: "",
  sourceYear: "",
  topic: "",
  type: "",
  isPrintReady: "",
  hasVideoSolution: "",
  published: "",
};

function parseOptionalYear(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 2000 && parsed <= 2100
    ? parsed
    : undefined;
}

function applyBulkState(doc: DocumentItem, state: BulkState): DocumentItem {
  return {
    ...doc,
    difficulty: state.difficulty || doc.difficulty,
    sourceYear: state.sourceYear ? parseOptionalYear(state.sourceYear) : doc.sourceYear,
    topic: state.topic || doc.topic,
    type: state.type || doc.type,
    isPrintReady:
      state.isPrintReady === "true"
        ? true
        : state.isPrintReady === "false"
          ? false
          : doc.isPrintReady,
    hasVideoSolution:
      state.hasVideoSolution === "true"
        ? true
        : state.hasVideoSolution === "false"
          ? false
          : doc.hasVideoSolution,
    published:
      state.published === "true"
        ? true
        : state.published === "false"
          ? false
          : doc.published,
  };
}

export default function AdminBulkMetadataEditor() {
  const { documents, updateDocument } = useDocuments();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkState, setBulkState] = useState<BulkState>(initialBulkState);
  const [isWorking, setIsWorking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const selectedDocuments = useMemo(
    () => documents.filter((doc) => selectedIds.includes(doc.id)),
    [documents, selectedIds]
  );

  const hasChanges = Object.values(bulkState).some(Boolean);

  function toggleDoc(doc: DocumentItem) {
    setSelectedIds((current) =>
      current.includes(doc.id)
        ? current.filter((id) => id !== doc.id)
        : [...current, doc.id]
    );
  }

  function selectMissingMetadata() {
    setSelectedIds(
      documents
        .filter(
          (doc) =>
            !doc.difficulty ||
            !doc.sourceYear ||
            !doc.pageCount ||
            !doc.questionCount ||
            !doc.curriculumCode
        )
        .map((doc) => doc.id)
    );
  }

  async function applyChanges() {
    if (selectedDocuments.length === 0 || !hasChanges) {
      setStatusType("error");
      setStatusMessage("Önce kayıt seç ve en az bir alan belirle.");
      return;
    }

    if (
      bulkState.sourceYear &&
      !parseOptionalYear(bulkState.sourceYear)
    ) {
      setStatusType("error");
      setStatusMessage("Yıl değeri 2000-2100 aralığında olmalı.");
      return;
    }

    const confirmed = window.confirm(
      `${selectedDocuments.length} kayıt toplu güncellenecek. Devam edilsin mi?`
    );

    if (!confirmed) {
      return;
    }

    setIsWorking(true);
    setStatusMessage("");
    setStatusType("");

    try {
      for (const doc of selectedDocuments) {
        await updateDocument(applyBulkState(doc, bulkState));
      }

      setStatusType("success");
      setStatusMessage(`${selectedDocuments.length} kayıt güncellendi.`);
      setBulkState(initialBulkState);
      setSelectedIds([]);
    } catch {
      setStatusType("error");
      setStatusMessage("Toplu güncelleme sırasında hata oluştu.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <SectionHeader
        eyebrow="TOPLU METADATA"
        title="Seçili kayıtları birlikte düzenle"
        description="Zorluk, yıl, konu, tür, yazdırma/video ve yayın durumunu çoklu kayıt için tek işlemde güncelle."
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => setSelectedIds(documents.map((doc) => doc.id))} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800">
          Tümünü Seç
        </button>
        <button type="button" onClick={selectMissingMetadata} className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100">
          Metadata Eksikleri Seç
        </button>
        <button type="button" onClick={() => setSelectedIds([])} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800">
          Seçimi Temizle
        </button>
        <span className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
          {selectedDocuments.length} kayıt seçili
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <select value={bulkState.difficulty} onChange={(e) => setBulkState((prev) => ({ ...prev, difficulty: e.target.value as BulkState["difficulty"] }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Zorluk değiştirme</option>
          {documentDifficultyCatalog.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input type="number" min={2000} max={2100} value={bulkState.sourceYear} onChange={(e) => setBulkState((prev) => ({ ...prev, sourceYear: e.target.value }))} placeholder="Yıl değiştirme" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400" />
        <select value={bulkState.topic} onChange={(e) => setBulkState((prev) => ({ ...prev, topic: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Konu değiştirme</option>
          {getAllTopics().map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        <select value={bulkState.type} onChange={(e) => setBulkState((prev) => ({ ...prev, type: e.target.value }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Tür değiştirme</option>
          {documentTypeCatalog.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select value={bulkState.isPrintReady} onChange={(e) => setBulkState((prev) => ({ ...prev, isPrintReady: e.target.value as BulkState["isPrintReady"] }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Yazdırma değiştirme</option>
          <option value="true">Yazdırmaya hazır</option>
          <option value="false">Hazır değil</option>
        </select>
        <select value={bulkState.hasVideoSolution} onChange={(e) => setBulkState((prev) => ({ ...prev, hasVideoSolution: e.target.value as BulkState["hasVideoSolution"] }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Video değiştirme</option>
          <option value="true">Video var</option>
          <option value="false">Video yok</option>
        </select>
        <select value={bulkState.published} onChange={(e) => setBulkState((prev) => ({ ...prev, published: e.target.value as BulkState["published"] }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400">
          <option value="">Yayın değiştirme</option>
          <option value="true">Yayına al</option>
          <option value="false">Taslağa al</option>
        </select>
        <button type="button" onClick={applyChanges} disabled={isWorking} className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
          {isWorking ? "Güncelleniyor..." : "Toplu Güncelle"}
        </button>
      </div>

      {statusMessage ? (
        <div className="mt-5">
          <InlineNotice tone={statusType === "success" ? "success" : "error"}>
            {statusMessage}
          </InlineNotice>
        </div>
      ) : null}

      <div className="mt-6 grid max-h-[460px] gap-3 overflow-auto pr-1">
        {documents.slice(0, 80).map((doc) => (
          <label key={doc.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-white">
            <input type="checkbox" checked={selectedIds.includes(doc.id)} onChange={() => toggleDoc(doc)} className="mt-1 h-4 w-4" />
            <span className="min-w-0">
              <span className="block text-sm font-black text-slate-950">{doc.title}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                {doc.grade}. Sınıf · {doc.topic} · {doc.type}
              </span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
