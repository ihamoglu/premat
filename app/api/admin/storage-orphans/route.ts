import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { extractPublicStoragePath } from "@/lib/storage-paths";

const BUCKET = "document-covers";
const ROOT_PREFIX = "documents";
const LIST_PAGE_SIZE = 100;

type StorageObjectEntry = {
  id?: string | null;
  name: string;
  metadata?: Record<string, unknown> | null;
};

type OrphanFile = {
  path: string;
  size: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return null;
  }

  return supabase;
}

function joinPath(prefix: string, name: string) {
  return prefix ? `${prefix}/${name}` : name;
}

async function listFilesRecursively(
  supabase: Awaited<ReturnType<typeof createClient>>,
  prefix: string
): Promise<string[]> {
  const collected: string[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: LIST_PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw error;
    }

    const entries = (data ?? []) as StorageObjectEntry[];

    for (const entry of entries) {
      const fullPath = joinPath(prefix, entry.name);

      if (entry.id) {
        collected.push(fullPath);
      } else {
        const nested = await listFilesRecursively(supabase, fullPath);
        collected.push(...nested);
      }
    }

    if (entries.length < LIST_PAGE_SIZE) {
      break;
    }

    offset += LIST_PAGE_SIZE;
  }

  return collected;
}

async function getReferencedStoragePaths(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("cover_image_url")
    .not("cover_image_url", "is", null);

  if (documentsError) {
    throw documentsError;
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("question_image_url")
    .not("question_image_url", "is", null);

  if (questionsError) {
    throw questionsError;
  }

  const documentCoverPaths = (documents ?? [])
    .map((row) => extractPublicStoragePath(BUCKET, row.cover_image_url))
    .filter((path): path is string => !!path);

  const questionImagePaths = (questions ?? [])
    .map((row) => extractPublicStoragePath(BUCKET, row.question_image_url))
    .filter((path): path is string => !!path);

  return new Set([...documentCoverPaths, ...questionImagePaths]);
}

async function getFileMeta(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string
): Promise<OrphanFile> {
  const folderParts = path.split("/");
  const name = folderParts.pop() || "";
  const folder = folderParts.join("/");

  const { data } = await supabase.storage.from(BUCKET).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  const match = ((data ?? []) as Array<
    StorageObjectEntry & {
      created_at?: string | null;
      updated_at?: string | null;
      metadata?: { size?: number } | null;
    }
  >).find((item) => item.name === name);

  return {
    path,
    size: match?.metadata?.size ?? null,
    createdAt: match?.created_at ?? null,
    updatedAt: match?.updated_at ?? null,
  };
}

export async function GET() {
  try {
    const supabase = await ensureAdmin();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const [referencedPaths, allFiles] = await Promise.all([
      getReferencedStoragePaths(supabase),
      listFilesRecursively(supabase, ROOT_PREFIX),
    ]);

    const orphanPaths = allFiles.filter((path) => !referencedPaths.has(path));
    const orphanFiles = await Promise.all(
      orphanPaths.map((path) => getFileMeta(supabase, path))
    );

    const totalBytes = orphanFiles.reduce(
      (sum, file) => sum + (file.size ?? 0),
      0
    );

    return NextResponse.json({
      ok: true,
      bucket: BUCKET,
      totalFiles: allFiles.length,
      referencedFiles: referencedPaths.size,
      orphanCount: orphanFiles.length,
      totalBytes,
      orphanFiles,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Storage taraması başarısız.";

    return NextResponse.json(
      { ok: false, message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await ensureAdmin();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    let body: { paths?: string[] } = {};

    try {
      body = (await request.json()) as { paths?: string[] };
    } catch {
      body = {};
    }

    let targetPaths = Array.isArray(body.paths)
      ? body.paths.filter((item) => typeof item === "string" && item.startsWith(`${ROOT_PREFIX}/`))
      : [];

    if (targetPaths.length === 0) {
      const [referencedPaths, allFiles] = await Promise.all([
        getReferencedStoragePaths(supabase),
        listFilesRecursively(supabase, ROOT_PREFIX),
      ]);

      targetPaths = allFiles.filter((path) => !referencedPaths.has(path));
    }

    if (targetPaths.length === 0) {
      return NextResponse.json({
        ok: true,
        deleted: 0,
        paths: [],
      });
    }

    const { error } = await supabase.storage.from(BUCKET).remove(targetPaths);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      deleted: targetPaths.length,
      paths: targetPaths,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Storage silme işlemi başarısız.";

    return NextResponse.json(
      { ok: false, message },
      { status: 500 }
    );
  }
}
