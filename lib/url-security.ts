const PRIVATE_HOST_RE =
  /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+)$/i;

function normalizeHostname(hostname: string) {
  return hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
}

export function isSafePublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = normalizeHostname(url.hostname);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    if (hostname === "::1" || PRIVATE_HOST_RE.test(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function normalizeRequiredPublicUrl(value: unknown, fieldName: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} zorunludur.`);
  }

  const normalized = value.trim();

  if (!isSafePublicHttpUrl(normalized)) {
    throw new Error(`${fieldName} geçerli bir public http/https URL olmalıdır.`);
  }

  return normalized;
}

export function normalizeOptionalPublicUrl(value: unknown, fieldName: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return normalizeRequiredPublicUrl(value, fieldName);
}
