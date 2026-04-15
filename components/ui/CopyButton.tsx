"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  idleLabel?: string;
  successLabel?: string;
  className?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function CopyButton({
  text,
  idleLabel = "Kopyala",
  successLabel = "Kopyalandı",
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={joinClasses(
        state === "error"
          ? "rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition"
          : "rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800",
        className
      )}
    >
      {state === "copied"
        ? successLabel
        : state === "error"
          ? "Kopyalanamadı"
          : idleLabel}
    </button>
  );
}
