export async function fetchAdminJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, init);
  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok || !data) {
    throw new Error(data?.message || "Admin işlemi tamamlanamadı.");
  }

  return data as T;
}

export async function uploadAdminImage(
  file: File,
  usage: "document-cover" | "question-image"
) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("usage", usage);

  const result = await fetchAdminJson<{ ok: true; publicUrl: string }>(
    "/api/admin/storage/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  return result.publicUrl;
}
