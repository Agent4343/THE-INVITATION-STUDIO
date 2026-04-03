export interface EtsyLineItem {
  id: string;
  title: string;
  quantity: number;
}

interface EtsyDraftOrderPayload {
  eventType: string;
  eventFormality: string;
  guestCountBand: string;
  weddingRole: string;
  languages: string;
  specialRequests: string;
  wordingTone: string;
  hostingStyle: string;
  relationshipLabel1: string;
  relationshipLabel2: string;
  names: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  rsvpDeadline: string;
  ceremonyDetails: string;
  receptionDetails: string;
  dressCode: string;
  appetizer: string;
  entree: string;
  dessert: string;
  thankYouMessage: string;
  saveTheDateMessage: string;
  tableNumber: string;
  guestName: string;
  welcomeMessage: string;
  welcomeSubtext: string;
  invitationLine: string;
  hostLine: string;
  rsvpPrompt: string;
  guestPrompt: string;
  listingTemplate: string;
  palette: string;
  font: string;
  lineItems: EtsyLineItem[];
  bundleDealEligible: boolean;
  bundleDealCode: string;
  bundleDealMessage: string;
}

const MAX_NOTE_LENGTH = 1000;
const BUNDLE_DEAL_CODE = "STUDIO4PLUS";

export const ETSY_ITEM_CATALOG: Array<{ id: string; title: string }> = [
  { id: "invitation", title: "Main Invitation" },
  { id: "rsvp", title: "RSVP Card" },
  { id: "details", title: "Details Card" },
  { id: "menu", title: "Menu Card" },
  { id: "thankyou", title: "Thank You Card" },
  { id: "savethedate", title: "Save the Date" },
  { id: "tablenumber", title: "Table Number" },
  { id: "placecard", title: "Place Card" },
  { id: "welcomesign", title: "Welcome Sign" },
];

export interface EtsySelectionInput {
  id?: string;
  quantity?: number;
}

function pickString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeText(value: unknown, fallback = "", max = 160): string {
  const normalized = pickString(value, fallback).replace(/\s+/g, " ").trim();
  return normalized.slice(0, max);
}

function normalizeMultiline(value: unknown, fallback = "", max = 280): string {
  const normalized = pickString(value, fallback)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  return normalized.slice(0, max);
}

export function buildEtsyDraftPayload(input: {
  content: Record<string, unknown>;
  templateName: string;
  paletteName: string;
  fontName: string;
  selectedItems?: EtsySelectionInput[];
}): EtsyDraftOrderPayload {
  const c = input.content;
  const eventType = normalizeText(c.eventType, "wedding", 32).toLowerCase();
  const eventFormality = normalizeText(c.eventFormality, "classic", 32).toLowerCase();
  const guestCountBand = normalizeText(c.guestCountBand, "medium", 32).toLowerCase();
  const weddingRole = normalizeText(c.weddingRole, "couple", 32).toLowerCase();
  const languages = normalizeText(c.languages, "English", 60);
  const specialRequests = normalizeMultiline(c.specialRequests, "", 300);
  const wordingTone = normalizeText(c.wordingTone, "classic", 32).toLowerCase();
  const hostingStyle = normalizeText(c.hostingStyle, "couple", 32).toLowerCase();

  const lineItems = normalizeSelectedItems(input.selectedItems);
  const bundleDealEligible = lineItems.length > 3;
  const bundleDealMessage = bundleDealEligible
    ? `Mix & Match 4+ perk unlocked. Ask seller to apply ${BUNDLE_DEAL_CODE} for bundle savings and coordinated finishing recommendations.`
    : `Add 4 or more different pieces to unlock the ${BUNDLE_DEAL_CODE} bundle perk on Etsy.`;

  return {
    eventType,
    eventFormality,
    guestCountBand,
    weddingRole,
    languages,
    specialRequests,
    wordingTone,
    hostingStyle,
    relationshipLabel1: normalizeText(c.relationshipLabel1, "Partner One", 40),
    relationshipLabel2: normalizeText(c.relationshipLabel2, "Partner Two", 40),
    names: `${normalizeText(c.name1, "Partner One", 50)} & ${normalizeText(c.name2, "Partner Two", 50)}`,
    date: normalizeText(c.date, "", 80),
    time: normalizeText(c.time, "", 80),
    venue: normalizeText(c.venue, "", 120),
    address: normalizeText(c.address, "", 140),
    rsvpDeadline: normalizeText(c.rsvpDeadline, "", 80),
    ceremonyDetails: normalizeMultiline(c.ceremonyDetails, "", 300),
    receptionDetails: normalizeMultiline(c.receptionDetails, "", 300),
    dressCode: normalizeText(c.dressCode, "", 80),
    appetizer: normalizeText(c.appetizer, "", 120),
    entree: normalizeText(c.entree, "", 120),
    dessert: normalizeText(c.dessert, "", 120),
    thankYouMessage: normalizeMultiline(c.thankYouMessage, "", 300),
    saveTheDateMessage: normalizeText(c.saveTheDateMessage, "", 120),
    tableNumber: normalizeText(c.tableNumber, "", 20),
    guestName: normalizeText(c.guestName, "", 80),
    welcomeMessage: normalizeText(c.welcomeMessage, "", 120),
    welcomeSubtext: normalizeText(c.welcomeSubtext, "", 140),
    invitationLine: normalizeText(c.invitationLine, "Invite you to celebrate", 160),
    hostLine: normalizeText(c.hostLine, "", 160),
    rsvpPrompt: normalizeText(c.rsvpPrompt, "Please respond by", 100),
    guestPrompt: normalizeText(c.guestPrompt, "Guest Name", 80),
    listingTemplate: normalizeText(input.templateName, "Classic Elegance", 60),
    palette: normalizeText(input.paletteName, "Sage & Gold", 60),
    font: normalizeText(input.fontName, "Playfair Display", 60),
    lineItems,
    bundleDealEligible,
    bundleDealCode: BUNDLE_DEAL_CODE,
    bundleDealMessage,
  };
}

export function toEtsyPersonalizationNote(
  payload: EtsyDraftOrderPayload,
): string {
  const lines = [
    "INVITATION STUDIO ORDER",
    `Event Type: ${payload.eventType}`,
    `Event Formality: ${payload.eventFormality}`,
    `Guest Count Band: ${payload.guestCountBand}`,
    `Buyer Role: ${payload.weddingRole}`,
    `Wording Tone: ${payload.wordingTone}`,
    `Hosting Style: ${payload.hostingStyle}`,
    `Languages: ${payload.languages}`,
    `Label 1: ${payload.relationshipLabel1}`,
    `Label 2: ${payload.relationshipLabel2}`,
    `Names: ${payload.names}`,
    `Date: ${payload.date || "-"}`,
    `Time: ${payload.time || "-"}`,
    `Venue: ${payload.venue || "-"}`,
    `Address: ${payload.address || "-"}`,
    `RSVP Deadline: ${payload.rsvpDeadline || "-"}`,
    `Invitation Line: ${payload.invitationLine}`,
    `Host Line: ${payload.hostLine || "-"}`,
    `RSVP Prompt: ${payload.rsvpPrompt || "-"}`,
    `Guest Prompt: ${payload.guestPrompt || "-"}`,
    `Template: ${payload.listingTemplate}`,
    `Palette: ${payload.palette}`,
    `Font: ${payload.font}`,
    `Ceremony: ${payload.ceremonyDetails || "-"}`,
    `Reception: ${payload.receptionDetails || "-"}`,
    `Dress Code: ${payload.dressCode || "-"}`,
    `Menu: ${payload.appetizer || "-"} | ${payload.entree || "-"} | ${payload.dessert || "-"}`,
    `Thank You: ${payload.thankYouMessage || "-"}`,
    `Save the Date: ${payload.saveTheDateMessage || "-"}`,
    `Table Number Sample: ${payload.tableNumber || "-"}`,
    `Guest Name Sample: ${payload.guestName || "-"}`,
    `Welcome Message: ${payload.welcomeMessage || "-"}`,
    `Welcome Subtext: ${payload.welcomeSubtext || "-"}`,
    `Special Requests: ${payload.specialRequests || "-"}`,
    `Selected Items: ${payload.lineItems.map((item) => `${item.title} x${item.quantity}`).join(", ")}`,
    `Bundle Deal Eligible: ${payload.bundleDealEligible ? "Yes" : "No"}`,
    `Bundle Deal Code: ${payload.bundleDealCode}`,
    `Bundle Deal Note: ${payload.bundleDealMessage}`,
  ];

  return lines.join("\n").slice(0, MAX_NOTE_LENGTH);
}

export function normalizeSelectedItems(input?: EtsySelectionInput[]): EtsyLineItem[] {
  if (!Array.isArray(input) || input.length === 0) {
    return [{ id: "invitation", title: "Main Invitation", quantity: 1 }];
  }

  const byId = new Map(ETSY_ITEM_CATALOG.map((item) => [item.id, item.title]));
  const selected: EtsyLineItem[] = [];

  for (const raw of input) {
    const id = normalizeText(raw?.id, "", 40);
    if (!id || !byId.has(id)) continue;
    const quantityRaw = Number(raw?.quantity);
    const quantity = Number.isInteger(quantityRaw)
      ? Math.max(1, Math.min(500, quantityRaw))
      : 1;
    selected.push({ id, title: byId.get(id) || id, quantity });
  }

  if (selected.length === 0) {
    return [{ id: "invitation", title: "Main Invitation", quantity: 1 }];
  }

  const merged = new Map<string, EtsyLineItem>();
  for (const item of selected) {
    const existing = merged.get(item.id);
    if (existing) {
      existing.quantity = Math.min(500, existing.quantity + item.quantity);
    } else {
      merged.set(item.id, { ...item });
    }
  }

  return Array.from(merged.values()).slice(0, 9);
}

export function deriveDealFromSelection(
  selectedItems: EtsyLineItem[],
): { eligible: boolean; code: string; message: string } {
  const eligible = selectedItems.length > 3;
  const message = eligible
    ? `Mix & Match 4+ perk unlocked. Ask seller to apply ${BUNDLE_DEAL_CODE} for bundle savings and coordinated finishing recommendations.`
    : `Add 4 or more different pieces to unlock the ${BUNDLE_DEAL_CODE} bundle perk on Etsy.`;

  return {
    eligible,
    code: BUNDLE_DEAL_CODE,
    message,
  };
}

