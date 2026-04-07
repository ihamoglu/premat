"use client";

import { useMemo, useState } from "react";

type OrphanFile = {
  path: string;
  size: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type ScanResult = {
  ok: boolean;
  bucket: string;
  totalFiles: number;
  referencedFiles: number;
  orphanCount: number;
  totalBytes: number;
  orphanFiles: OrphanFile[];
  message?: string;
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function AdminStorageCleanup() {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [result, setResult] = useState<ScanResult | null>(null);

  const orphanPreview = useMemo(
    () => result?.orphanFiles.slice(0, 20) ?? [],
    [result]
  );

  async function scanStorage() {
    setLoading(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const response = await fetch("/api/admin/storage-orphans", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as ScanResult;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Storage taraması başarısız.");
      }

      setResult(data);
      setStatusType("success");
      setStatusMessage(
        `Tarama tamamlandı. ${data.orphanCount} adet yetim dosya bulundu.`
      );
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Storage taraması başarısız."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrphans() {
    setDeleting(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const response = await fetch("/api/admin/storage-orphans", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = (await response.json()) as {
        ok: boolean;
        deleted: number;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Silme işlemi başarısız.");
      }

      setStatusType("success");
      setStatusMessage(`${data.deleted} adet yetim dosya silindi.`);
      await scanStorage();
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Silme işlemi başarısız."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-blue-800">
            STORAGE TEMİZLİĞİ
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">
            Yetim kapak görsellerini tara
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Veritabanında karşılığı kalmamış ama storage içinde duran kapak
            görsellerini bulur. Buradaki amaç boşa duran dosyaları temizlemek.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={scanStorage}
            disabled={loading || deleting}
            className="rounded-2xl bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Taranıyor..." : "Storage'ı Tara"}
          </button>

          <button
            type="button"
            onClick={deleteOrphans}
            disabled={deleting || loading || !result || result.orphanCount === 0}
            className="rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Siliniyor..." : "Yetim Dosyaları Sil"}
          </button>
        </div>
      </div>

      {statusMessage ? (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold ${
            statusType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-xs font-medium text-slate-500">Toplam Dosya</div>
          <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-slate-950">
            {result?.totalFiles ?? 0}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-xs font-medium text-slate-500">Referanslı</div>
          <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-emerald-700">
            {result?.referencedFiles ?? 0}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-xs font-medium text-slate-500">Yetim Dosya</div>
          <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-red-700">
            {result?.orphanCount ?? 0}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
          <div className="text-xs font-medium text-slate-500">Boşa Giden Alan</div>
          <div className="mt-1 text-3xl font-black tracking-[-0.03em] text-slate-950">
            {formatBytes(result?.totalBytes ?? 0)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
              Yetim dosya önizlemesi
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              İlk 20 sonuç gösteriliyor.
            </p>
          </div>

          {result?.bucket ? (
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
              Bucket: {result.bucket}
            </span>
          ) : null}
        </div>

        {orphanPreview.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Tarama sonucu henüz yok veya yetim dosya bulunmadı.
          </div>
        ) : (
          <div className="grid gap-3">
            {orphanPreview.map((file) => (
              <div
                key={file.path}
                className="rounded-[1.4rem] border border-slate-200 bg-white p-4"
              >
                <div className="break-all text-sm font-semibold text-slate-800">
                  {file.path}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
                    Boyut: {formatBytes(file.size ?? 0)}
                  </span>
                  {file.updatedAt ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
                      Güncellendi: {new Date(file.updatedAt).toLocaleString("tr-TR")}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
