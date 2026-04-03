interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function cleanupExpiredBuckets(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (current.count >= config.maxRequests) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000),
      ),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { limited: false, retryAfterSeconds: 0 };
}
