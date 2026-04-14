import { NextResponse } from "next/server";
import { getPublishedDocuments } from "@/lib/server-documents";
import {
  documentMatchesSearch,
  sortDocumentsForSearch,
  toPublicDocumentSearchResult,
} from "@/lib/document-search";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

function parseLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = parseLimit(searchParams.get("limit"));

  const documents = await getPublishedDocuments();
  const matches = sortDocumentsForSearch(
    documents.filter((doc) => documentMatchesSearch(doc, query)),
    query
  )
    .slice(0, limit)
    .map(toPublicDocumentSearchResult);

  return NextResponse.json({
    query,
    results: matches,
  });
}
