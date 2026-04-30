type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function getRequestFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim();
  const fallbackIp =
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown-ip";
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";

  return `${ip || fallbackIp}:${userAgent.slice(0, 120)}`;
}

export function checkRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { ok: true, retryAfter: 0 };
  }

  if (current.count >= options.limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { ok: true, retryAfter: 0 };
}
