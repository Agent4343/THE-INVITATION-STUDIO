export interface Template {
  id: string;
  name: string;
  layout: "centered" | "left" | "split";
  ornament: boolean;
  borderStyle: "thin" | "double" | "none";
  spacingRatio: number;
  thumbnail: string;
}

export interface Palette {
  id: string;
  name: string;
  bg: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
}

export interface Font {
  id: string;
  name: string;
  googleFontsFamily: string;
  category: "serif" | "sans-serif" | "script";
  previewWeight: number;
}

export interface DesignContent {
  name1: string;
  name2: string;
  preHeading: string;
  conjunction: string;
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
}

export type SuitePiece = "invitation" | "rsvp" | "details" | "menu" | "thankyou";

export type BuilderStep = "template" | "palette" | "font" | "content" | "preview";

export interface Design {
  id: string;
  accessCodeId: string;
  templateId: string;
  paletteId: string;
  fontId: string;
  content: DesignContent;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccessCode {
  id: string;
  code: string;
  etsyOrderId: string | null;
  status: "unused" | "active" | "completed" | "expired";
  designId: string | null;
  activatedAt: string | null;
  createdAt: string;
}

export interface PrintOrder {
  id: string;
  designId: string;
  stripeSessionId: string | null;
  prodigiOrderId: string | null;
  status: "pending" | "paid" | "submitted" | "printing" | "shipped" | "delivered" | "cancelled";
  items: PrintItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  amountPaid: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrintItem {
  piece: SuitePiece;
  quantity: number;
  paper: "standard" | "premium" | "cotton";
}

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
