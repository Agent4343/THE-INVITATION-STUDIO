type ContentRecord = Record<string, unknown>;

function isContentRecord(value: unknown): value is ContentRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readLower(content: ContentRecord, key: string): string {
  const value = content[key];
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function writeIfChanged(
  content: ContentRecord,
  key: string,
  nextValue: string,
): boolean {
  if (content[key] === nextValue) return false;
  content[key] = nextValue;
  return true;
}

export function normalizeLegacyDesignContent(input: unknown): {
  content: ContentRecord;
  changed: boolean;
} {
  const normalized: ContentRecord = isContentRecord(input) ? { ...input } : {};
  let changed = !isContentRecord(input);

  if (readLower(normalized, "preHeading") === "together with their families") {
    changed = writeIfChanged(
      normalized,
      "preHeading",
      "Hosted by friends and family",
    ) || changed;
  }
  if (readLower(normalized, "preHeading") === "hosted by their loved ones") {
    changed = writeIfChanged(
      normalized,
      "preHeading",
      "Hosted by friends and family",
    ) || changed;
  }

  if (
    readLower(normalized, "invitationLine") ===
    "invite you to celebrate their marriage"
  ) {
    changed = writeIfChanged(
      normalized,
      "invitationLine",
      "invite you to celebrate with us",
    ) || changed;
  }

  if (readLower(normalized, "welcomeMessage") === "welcome to our wedding") {
    changed = writeIfChanged(
      normalized,
      "welcomeMessage",
      "Welcome to Our Celebration",
    ) || changed;
  }

  if (
    ["emma rose", "name one", "host name"].includes(
      readLower(normalized, "name1"),
    )
  ) {
    changed = writeIfChanged(normalized, "name1", "") || changed;
  }

  if (
    ["james william", "name two", "co-host name"].includes(
      readLower(normalized, "name2"),
    )
  ) {
    changed = writeIfChanged(normalized, "name2", "") || changed;
  }

  if (
    ["the grand estate", "your event venue"].includes(
      readLower(normalized, "venue"),
    )
  ) {
    changed = writeIfChanged(normalized, "venue", "") || changed;
  }

  if (
    [
      "123 garden lane, napa valley, california",
      "your event location",
      "your event address",
    ].includes(readLower(normalized, "address"))
  ) {
    changed = writeIfChanged(normalized, "address", "") || changed;
  }

  if (
    ["half past four in the afternoon", "your event time"].includes(
      readLower(normalized, "time"),
    )
  ) {
    changed = writeIfChanged(normalized, "time", "") || changed;
  }

  if (readLower(normalized, "date") === "your event date") {
    changed = writeIfChanged(normalized, "date", "") || changed;
  }

  const eventType = String(normalized.eventType ?? "").trim();
  if (!eventType) {
    changed = writeIfChanged(normalized, "eventType", "celebration") || changed;
  }

  return { content: normalized, changed };
}
