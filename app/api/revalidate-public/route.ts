import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-server";

type RevalidatePayload = {
  slug?: string;
  grade?: string;
  testSlug?: string;
};

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { ok: false, message: "Yetkisiz işlem." },
      { status: 401 }
    );
  }

  let body: RevalidatePayload = {};

  try {
    body = (await request.json()) as RevalidatePayload;
  } catch {
    body = {};
  }

  revalidateTag("documents-public", "max");
  revalidateTag("tests-public", "max");

  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/testler");
  revalidatePath("/sinif/[grade]", "page");
  revalidatePath("/documents/[slug]", "page");
  revalidatePath("/testler/[slug]", "page");

  if (
    body.grade &&
    ["5", "6", "7", "8"].includes(body.grade)
  ) {
    revalidatePath(`/sinif/${body.grade}`);
  }

  const SLUG_RE = /^[a-z0-9-]+$/;

  if (body.slug && SLUG_RE.test(body.slug.trim())) {
    revalidatePath(`/documents/${body.slug.trim()}`);
  }

  if (body.testSlug && SLUG_RE.test(body.testSlug.trim())) {
    revalidatePath(`/testler/${body.testSlug.trim()}`);
  }

  return NextResponse.json({ ok: true });
}
