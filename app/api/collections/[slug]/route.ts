import { NextResponse } from "next/server";
import { getPublicCollectionBySlug } from "@/lib/server-collections";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const collection = await getPublicCollectionBySlug(slug);

  if (!collection) {
    return NextResponse.json(
      { ok: false, message: "Koleksiyon bulunamadı." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    collection,
  });
}
