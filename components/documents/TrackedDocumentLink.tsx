"use client";

import type { CSSProperties } from "react";

type TrackedDocumentLinkProps = {
  documentId: string;
  href: string;
  eventType: "file_open" | "solution_open" | "answer_key_open";
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function TrackedDocumentLink({
  documentId,
  href,
  eventType,
  children,
  className,
  style,
}: TrackedDocumentLinkProps) {
  function trackEvent() {
    void fetch("/api/documents/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        eventType,
      }),
    }).catch(() => undefined);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackEvent}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
