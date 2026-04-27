"use client";

import { useEffect, useState } from "react";
import ExamCountdownDisplay from "@/components/tools/ExamCountdownDisplay";

export default function HomeCountdownWidget() {
  const [open, setOpen] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let downwardDistance = 0;
    let ticking = false;

    function updateVisibility() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 80) {
        downwardDistance = 0;
        setHiddenByScroll(false);
        setCompact(false);
      } else if (delta > 8 && !open) {
        downwardDistance += delta;
        if (downwardDistance > 120) {
          setCompact(true);
        }
        if (downwardDistance > 260) {
          window.setTimeout(() => setHiddenByScroll(true), 180);
        }
      } else if (delta < -8) {
        downwardDistance = 0;
        setHiddenByScroll(false);
        setCompact(false);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed right-4 z-[58] rounded-2xl border border-white/25 bg-[linear-gradient(135deg,#1d4f91_0%,#2f6eb7_55%,#ea580c_100%)] text-left text-white shadow-2xl shadow-blue-950/25 transition-all duration-300 hover:brightness-110 sm:bottom-auto sm:right-5 sm:top-1/2 ${
          compact ? "px-3 py-2" : "px-4 py-3"
        } ${
          hiddenByScroll
            ? "pointer-events-none bottom-3 translate-y-7 scale-75 opacity-0 sm:translate-x-8 sm:-translate-y-1/2"
            : "bottom-20 translate-y-0 scale-100 opacity-100 sm:-translate-y-1/2"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span
          className={`block text-[10px] font-black uppercase tracking-[0.18em] text-white/80 transition ${
            compact ? "sr-only" : ""
          }`}
        >
          Sınav Sayacı
        </span>
        <span className="block text-sm font-black leading-tight">
          LGS / YKS
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[75]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-blue-950/35 backdrop-blur-[3px]"
            aria-label="Sayaç panelini kapat"
          />

          <aside
            className="premat-drawer-in absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col overflow-y-auto border-l border-blue-100 bg-white shadow-2xl shadow-blue-950/25"
            role="dialog"
            aria-modal="true"
            aria-label="LGS ve YKS geri sayım paneli"
          >
            <div className="sticky top-0 z-10 border-b border-blue-100 bg-white/95 px-5 py-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                    Premat Araçları
                  </div>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                    Sınava kaç gün kaldı?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-900 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800"
                  aria-label="Sayaç panelini kapat"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.2"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              <ExamCountdownDisplay compact />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
