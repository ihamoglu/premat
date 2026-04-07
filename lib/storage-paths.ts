export function extractPublicStoragePath(
  bucket: string,
  publicUrl?: string | null
) {
  if (!publicUrl) {
    return null;
  }

  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const encodedPath = url.pathname.slice(markerIndex + marker.length);
    const decodedPath = decodeURIComponent(encodedPath);

    return decodedPath || null;
  } catch {
    return null;
  }
}
