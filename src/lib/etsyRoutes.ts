export interface EtsyListingRoute {
  id: string;
  event_type: string;
  listing_url: string;
  listing_label: string;
  is_active: boolean;
  updated_at?: string | null;
}

export function normalizeRouteKey(value: unknown, fallback = "default"): string {
  if (typeof value !== "string") return fallback;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return normalized || fallback;
}

export function routeCandidates(value: string): string[] {
  const key = normalizeRouteKey(value);
  return [key, "default", "all"];
}

function routeScore(
  route: EtsyListingRoute,
  eventType: string,
): number {
  const eventScore =
    route.event_type === eventType
      ? 4
      : route.event_type === "default"
        ? 2
        : route.event_type === "all"
          ? 1
          : 0;
  return eventScore;
}

export function pickBestRoute(
  routes: EtsyListingRoute[],
  eventType: string,
): EtsyListingRoute | null {
  if (!routes.length) return null;

  let best: EtsyListingRoute | null = null;
  let bestScore = -1;

  for (const route of routes) {
    const score = routeScore(route, eventType);
    if (score > bestScore) {
      best = route;
      bestScore = score;
    }
  }

  return best;
}

