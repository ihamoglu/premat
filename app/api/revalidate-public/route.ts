import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

type RevalidatePayload = {
  slug?: string;
  grade?: string;
  testSlug?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
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

  if (body.slug && body.slug.trim()) {
    revalidatePath(`/documents/${body.slug.trim()}`);
  }

  if (body.testSlug && body.testSlug.trim()) {
    revalidatePath(`/testler/${body.testSlug.trim()}`);
  }

  return NextResponse.json({ ok: true });
}
