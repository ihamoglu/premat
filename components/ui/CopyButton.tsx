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
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={joinClasses(
        "rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-800",
        className
      )}
    >
      {copied ? successLabel : idleLabel}
    </button>
  );
}
