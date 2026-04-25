import type { DocumentItem } from "@/types/document";

export const ALL_TOPICS_LABEL = "Tüm Konular";
export const PAST_EXAMS_TYPE = "Çıkmış Sorular";
export const MEB_LABEL = "MEB";

function splitDelimitedValue(value: string | undefined) {
  return Array.from(
    new Set(
      (value ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

export function parseDocumentTopics(value: string | undefined) {
  return splitDelimitedValue(value);
}

export function parseDocumentTypes(value: string | undefined) {
  return splitDelimitedValue(value);
}

export function normalizeTopicSelection(topics: string[]) {
  const cleaned = Array.from(
    new Set(
      topics
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

  return cleaned.includes(ALL_TOPICS_LABEL) ? [ALL_TOPICS_LABEL] : cleaned;
}

export function normalizeTypeSelection(types: string[]) {
  const cleaned = Array.from(
    new Set(
      types
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

  return cleaned.includes(PAST_EXAMS_TYPE) ? [PAST_EXAMS_TYPE] : cleaned;
}

export function isAllTopicsValue(value: string | undefined) {
  return parseDocumentTopics(value).includes(ALL_TOPICS_LABEL);
}

export function isPastExamValue(value: string | undefined) {
  return parseDocumentTypes(value).includes(PAST_EXAMS_TYPE);
}

export function matchesDelimitedSelection(
  value: string | undefined,
  selection: string
) {
  if (!selection) {
    return true;
  }

  return splitDelimitedValue(value).includes(selection);
}

export function getPrimaryTopicValue(value: string | undefined) {
  const topics = parseDocumentTopics(value);

  if (topics.includes(ALL_TOPICS_LABEL)) {
    return ALL_TOPICS_LABEL;
  }

  return topics[0] ?? "";
}

export function getTopicDisplayText(
  topic: string | undefined,
  subtopic?: string | null
) {
  const baseTopic = isAllTopicsValue(topic) ? ALL_TOPICS_LABEL : (topic ?? "");

  if (!baseTopic) {
    return "";
  }

  if (isAllTopicsValue(topic) || !subtopic?.trim()) {
    return baseTopic;
  }

  return `${baseTopic} • ${subtopic.trim()}`;
}

export function getDenseTopicDisplay(
  doc: Pick<DocumentItem, "topic" | "subtopic">
) {
  return getTopicDisplayText(
    doc.topic,
    isAllTopicsValue(doc.topic) ? "" : doc.subtopic
  );
}

export function getTypeDisplayList(value: string | undefined) {
  return parseDocumentTypes(value);
}

export function hasMebBadge(doc: Pick<DocumentItem, "type">) {
  return isPastExamValue(doc.type);
}
