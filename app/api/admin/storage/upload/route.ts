import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-server";

const BUCKET = "document-covers";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function getPrefix(usage: FormDataEntryValue | null) {
  if (usage === "document-cover") {
    return "documents";
  }

  if (usage === "question-image") {
    return "documents/questions";
  }

  throw new Error("Geçersiz görsel kullanım alanı.");
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const prefix = getPrefix(formData.get("usage"));

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Görsel dosyası bulunamadı." },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { ok: false, message: "Yalnızca JPG, PNG veya WEBP görsel yüklenebilir." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { ok: false, message: "Görsel boyutu en fazla 5 MB olabilir." },
        { status: 400 }
      );
    }

    const extension = getFileExtension(file);
    const path = `${prefix}/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await admin.supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      throw error;
    }

    const { data } = admin.supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      bucket: BUCKET,
      path,
      publicUrl: data.publicUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Görsel yükleme başarısız.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
