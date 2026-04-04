const SESSION_KEY = "analytics_session_id";

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "server";
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = createSessionId();
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

export async function trackEvent(
  eventName: string,
  metadata: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        path: window.location.pathname,
        sessionId: getAnalyticsSessionId(),
        metadata,
      }),
      keepalive: true,
    });
  } catch {
    // No-op on analytics failures.
  }
}
