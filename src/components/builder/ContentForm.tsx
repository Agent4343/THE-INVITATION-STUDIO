"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import { SuitePiece } from "@/types";
import Input from "@/components/ui/Input";
import AISuggestButton from "@/components/builder/AISuggestButton";

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  aiField?: boolean;
}

interface Section {
  title: string;
  fields: FieldDef[];
}

type EventKind =
  | "birthday"
  | "anniversary"
  | "engagement"
  | "vow-renewal"
  | "baby-shower"
  | "bridal-shower"
  | "graduation"
  | "retirement"
  | "holiday-party"
  | "corporate-event"
  | "elopement"
  | "civil-ceremony"
  | "wedding"
  | "default";

function normalizeEventKind(value?: string): EventKind {
  const v = (value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  if (v.includes("birthday")) return "birthday";
  if (v.includes("vow-renewal") || (v.includes("vow") && v.includes("renew"))) return "vow-renewal";
  if (v.includes("anniversary")) return "anniversary";
  if (v.includes("engagement")) return "engagement";
  if ((v.includes("baby") && v.includes("shower")) || v.includes("baby-shower")) return "baby-shower";
  if ((v.includes("bridal") && v.includes("shower")) || v.includes("bridal-shower")) return "bridal-shower";
  if (v.includes("graduation")) return "graduation";
  if (v.includes("retirement")) return "retirement";
  if (v.includes("holiday") || v.includes("christmas") || v.includes("new-year")) return "holiday-party";
  if (v.includes("corporate") || v.includes("company") || v.includes("team-event")) return "corporate-event";
  if (v.includes("elopement")) return "elopement";
  if (v.includes("civil-ceremony") || (v.includes("civil") && v.includes("ceremony"))) return "civil-ceremony";
  if (v.includes("wedding")) return "wedding";
  return "default";
}

const sections: Section[] = [
  {
    title: "Event Profile",
    fields: [
      {
        key: "eventType",
        label: "Event Type",
        placeholder:
          "birthday, anniversary, engagement, vow-renewal, wedding, elopement, civil-ceremony, bridal-shower, baby-shower, graduation, retirement, holiday-party, corporate-event",
        maxLength: 40,
      },
      {
        key: "invitationLine",
        label: "Invitation Line",
        placeholder:
          "invite you to celebrate with us",
        maxLength: 120,
        aiField: true,
      },
      {
        key: "hostLine",
        label: "Host Line",
        placeholder:
          "Together with our families / Hosted by our loved ones / Hosted by",
        maxLength: 120,
        aiField: true,
      },
      {
        key: "eventFormality",
        label: "Formality",
        placeholder: "Formal, Semi-Formal, Cocktail, Casual, Black Tie",
        maxLength: 30,
      },
      {
        key: "wordingTone",
        label: "Tone",
        placeholder: "Classic, Modern, Romantic, Minimal, Playful",
        maxLength: 30,
      },
      {
        key: "hostingStyle",
        label: "Hosting Style",
        placeholder: "Couple, Families, Parents, One Host",
        maxLength: 30,
      },
      {
        key: "guestCountBand",
        label: "Guest Count Band",
        placeholder: "Intimate (under 50), Medium, Large",
        maxLength: 30,
      },
      {
        key: "weddingRole",
        label: "Buyer / Planner Role",
        placeholder: "Host, Planner, Parent, Friend, Couple",
        maxLength: 30,
      },
      {
        key: "languages",
        label: "Language Preferences",
        placeholder: "English, Spanish-English, French-English",
        maxLength: 60,
      },
      {
        key: "specialRequests",
        label: "Special Requests",
        placeholder:
          "Bilingual wording, accessibility notes, cultural traditions, faith wording",
        multiline: true,
        maxLength: 250,
      },
      {
        key: "rsvpPrompt",
        label: "RSVP Prompt",
        placeholder: "Please respond by",
        maxLength: 80,
        aiField: true,
      },
      {
        key: "guestPrompt",
        label: "Guest Name Prompt",
        placeholder: "Guest Name",
        maxLength: 50,
        aiField: true,
      },
      {
        key: "relationshipLabel1",
        label: "Name 1 Label",
        placeholder: "Partner One / Parent / Honoree",
        maxLength: 30,
      },
      {
        key: "relationshipLabel2",
        label: "Name 2 Label",
        placeholder: "Partner Two / Co-Host / Honoree",
        maxLength: 30,
      },
    ],
  },
  {
    title: "Names",
    fields: [
      { key: "name1", label: "First Name", placeholder: "Alex", maxLength: 30 },
      { key: "name2", label: "Second Name", placeholder: "Jordan", maxLength: 30 },
      { key: "conjunction", label: "Conjunction", placeholder: "&", maxLength: 10 },
    ],
  },
  {
    title: "Event Details",
    fields: [
      {
        key: "preHeading",
        label: "Pre-heading",
        placeholder: "Hosted by friends and family",
        maxLength: 60,
        aiField: true,
      },
      { key: "date", label: "Date", placeholder: "Saturday, October 18, 2026", maxLength: 40 },
      { key: "time", label: "Time", placeholder: "4:30 PM", maxLength: 50 },
      { key: "venue", label: "Venue", placeholder: "Celebration Hall", maxLength: 50 },
      {
        key: "address",
        label: "Address",
        placeholder: "123 Celebration Lane, Your City, ST",
        maxLength: 80,
      },
    ],
  },
  {
    title: "RSVP",
    fields: [
      {
        key: "rsvpDeadline",
        label: "RSVP Deadline",
        placeholder: "September 1, 2026",
        maxLength: 40,
      },
    ],
  },
  {
    title: "Details Card",
    fields: [
      {
        key: "ceremonyDetails",
        label: "Ceremony Details",
        placeholder: "Ceremony begins at 4:30 PM in the garden.",
        multiline: true,
        maxLength: 200,
        aiField: true,
      },
      {
        key: "receptionDetails",
        label: "Reception Details",
        placeholder: "Reception to follow in the grand ballroom.",
        multiline: true,
        maxLength: 200,
        aiField: true,
      },
      {
        key: "dressCode",
        label: "Dress Code",
        placeholder: "Black Tie Optional",
        maxLength: 40,
        aiField: true,
      },
    ],
  },
  {
    title: "Menu",
    fields: [
      { key: "appetizer", label: "Appetizer", placeholder: "Burrata & Heirloom Tomato", maxLength: 50, aiField: true },
      { key: "entree", label: "Entree", placeholder: "Herb-Crusted Lamb", maxLength: 50, aiField: true },
      { key: "dessert", label: "Dessert", placeholder: "Vanilla Bean Panna Cotta", maxLength: 50, aiField: true },
    ],
  },
  {
    title: "Thank You",
    fields: [
      {
        key: "thankYouMessage",
        label: "Thank You Message",
        placeholder: "Thank you for sharing in our special day.",
        multiline: true,
        maxLength: 200,
        aiField: true,
      },
    ],
  },
  {
    title: "Save the Date",
    fields: [
      {
        key: "saveTheDateMessage",
        label: "Save the Date Message",
        placeholder: "Save the Date",
        maxLength: 60,
        aiField: true,
      },
    ],
  },
  {
    title: "Table & Seating",
    fields: [
      {
        key: "tableNumber",
        label: "Table Number",
        placeholder: "1",
        maxLength: 10,
      },
      {
        key: "guestName",
        label: "Guest Name",
        placeholder: "Jane Smith",
        maxLength: 40,
      },
    ],
  },
  {
    title: "Welcome Sign",
    fields: [
      {
        key: "welcomeMessage",
        label: "Welcome Message",
        placeholder: "Welcome to our Celebration",
        maxLength: 80,
        aiField: true,
      },
      {
        key: "welcomeSubtext",
        label: "Welcome Subtext",
        placeholder: "Please find your seat",
        maxLength: 100,
        aiField: true,
      },
    ],
  },
];

function getEventSpecificOverrides(eventType?: string): Partial<Record<string, FieldDef>> {
  const kind = normalizeEventKind(eventType);

  const byKind: Record<EventKind, Partial<Record<string, FieldDef>>> = {
    birthday: {
      invitationLine: { key: "invitationLine", label: "Celebration Line", placeholder: "invite you to celebrate this birthday with us", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Hosted by family and friends", maxLength: 120, aiField: true },
      preHeading: { key: "preHeading", label: "Pre-heading", placeholder: "Join us to celebrate", maxLength: 60, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Main Celebration Details", placeholder: "Birthday celebration starts at 6:00 PM with welcome drinks and photos.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "After-Party Details", placeholder: "Dinner, cake, and dancing to follow.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Style Note", placeholder: "Festive Casual", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for the Birthday Celebration", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Birthday Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for celebrating this birthday with us.", multiline: true, maxLength: 200, aiField: true },
    },
    anniversary: {
      invitationLine: { key: "invitationLine", label: "Celebration Line", placeholder: "invite you to celebrate our anniversary", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Hosted by our loved ones", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Anniversary Program", placeholder: "Anniversary celebration begins at 5:00 PM with a short toast.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Dinner and dancing to follow.", multiline: true, maxLength: 200, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Our Anniversary", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to Our Anniversary Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for celebrating our anniversary with us.", multiline: true, maxLength: 200, aiField: true },
    },
    engagement: {
      invitationLine: { key: "invitationLine", label: "Engagement Invitation Line", placeholder: "invite you to celebrate our engagement", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Together with our families", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Celebration Program", placeholder: "Engagement celebration begins at 5:30 PM with a welcome toast.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Reception Details", placeholder: "Cocktails and light bites to follow in the lounge.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Dress Code", placeholder: "Cocktail Attire", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Our Engagement Party", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to Our Engagement Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for sharing in our engagement celebration.", multiline: true, maxLength: 200, aiField: true },
    },
    "vow-renewal": {
      invitationLine: { key: "invitationLine", label: "Vow Renewal Line", placeholder: "invite you to celebrate our vow renewal", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Together with our loved ones", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Ceremony Details", placeholder: "Vow renewal begins at 4:00 PM in the garden courtyard.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Dinner, stories, and dancing to follow.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Dress Code", placeholder: "Semi-Formal", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Our Vow Renewal", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to Our Vow Renewal Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for celebrating our vow renewal with us.", multiline: true, maxLength: 200, aiField: true },
    },
    "baby-shower": {
      invitationLine: { key: "invitationLine", label: "Shower Invitation Line", placeholder: "invite you to celebrate our growing family", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Hosted by family and friends", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Shower Details", placeholder: "Baby shower starts at 11:00 AM with brunch and games.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Gift & Refreshment Details", placeholder: "Light refreshments and gift opening to follow.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Style Note", placeholder: "Pastel Garden Party", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for the Baby Shower", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Baby Shower", maxLength: 80, aiField: true },
    },
    "bridal-shower": {
      invitationLine: { key: "invitationLine", label: "Shower Invitation Line", placeholder: "invite you to join the bridal shower celebration", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Hosted with love by family and friends", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Shower Details", placeholder: "Bridal shower begins at 1:00 PM with brunch and games.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Gift opening and desserts to follow.", multiline: true, maxLength: 200, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for the Bridal Shower", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Bridal Shower", maxLength: 80, aiField: true },
    },
    graduation: {
      invitationLine: { key: "invitationLine", label: "Graduation Invitation Line", placeholder: "invite you to celebrate this graduation milestone", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Ceremony Details", placeholder: "Graduation ceremony starts at 10:00 AM at the main auditorium.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Celebration reception to follow at 12:30 PM.", multiline: true, maxLength: 200, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Graduation", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Graduation Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for celebrating this graduation with us.", multiline: true, maxLength: 200, aiField: true },
    },
    retirement: {
      invitationLine: { key: "invitationLine", label: "Retirement Invitation Line", placeholder: "invite you to celebrate a remarkable retirement", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Program Details", placeholder: "Retirement celebration starts at 6:00 PM with remarks and a toast.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Dinner and tribute stories to follow.", multiline: true, maxLength: 200, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for the Retirement Celebration", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Retirement Celebration", maxLength: 80, aiField: true },
    },
    "holiday-party": {
      invitationLine: { key: "invitationLine", label: "Holiday Invitation Line", placeholder: "invite you to our holiday party", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "You're invited to celebrate the season", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Party Details", placeholder: "Holiday party begins at 7:00 PM with seasonal drinks and appetizers.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Dinner, music, and celebration to follow.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Style Note", placeholder: "Festive Attire", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for the Holiday Party", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Holiday Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for celebrating the season with us.", multiline: true, maxLength: 200, aiField: true },
    },
    "corporate-event": {
      invitationLine: { key: "invitationLine", label: "Corporate Invitation Line", placeholder: "invite you to our corporate celebration", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "You're invited", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Program Details", placeholder: "Event opens at 6:00 PM with networking and opening remarks.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Agenda Details", placeholder: "Dinner service and keynote presentation to follow.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Dress Code", placeholder: "Business Formal", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Our Corporate Event", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to the Corporate Event", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for being part of our event.", multiline: true, maxLength: 200, aiField: true },
    },
    elopement: {
      invitationLine: { key: "invitationLine", label: "Elopement Invitation Line", placeholder: "invite you to celebrate our elopement", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "A small celebration with those we love", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Ceremony Details", placeholder: "Intimate ceremony begins at 4:00 PM on the terrace.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Champagne toast and dinner to follow.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Dress Code", placeholder: "Elegant Casual", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Our Elopement Celebration", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to Our Elopement Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for sharing in our elopement celebration.", multiline: true, maxLength: 200, aiField: true },
    },
    "civil-ceremony": {
      invitationLine: { key: "invitationLine", label: "Civil Ceremony Line", placeholder: "invite you to celebrate our civil ceremony", maxLength: 120, aiField: true },
      hostLine: { key: "hostLine", label: "Host Line", placeholder: "Together with our loved ones", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Ceremony Details", placeholder: "Civil ceremony begins at 3:30 PM in the city hall chamber.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Celebration Details", placeholder: "Refreshments and photos to follow nearby.", multiline: true, maxLength: 200, aiField: true },
      dressCode: { key: "dressCode", label: "Dress Code", placeholder: "Semi-Formal", maxLength: 40, aiField: true },
      saveTheDateMessage: { key: "saveTheDateMessage", label: "Save Message", placeholder: "Save the Date for Our Civil Ceremony", maxLength: 60, aiField: true },
      welcomeMessage: { key: "welcomeMessage", label: "Welcome Message", placeholder: "Welcome to Our Civil Ceremony Celebration", maxLength: 80, aiField: true },
      thankYouMessage: { key: "thankYouMessage", label: "Thank You Message", placeholder: "Thank you for celebrating our civil ceremony with us.", multiline: true, maxLength: 200, aiField: true },
    },
    wedding: {
      invitationLine: { key: "invitationLine", label: "Invitation Line", placeholder: "invite you to celebrate with us", maxLength: 120, aiField: true },
      ceremonyDetails: { key: "ceremonyDetails", label: "Ceremony Details", placeholder: "Ceremony begins at 4:30 PM in the garden.", multiline: true, maxLength: 200, aiField: true },
      receptionDetails: { key: "receptionDetails", label: "Reception Details", placeholder: "Reception to follow in the grand ballroom.", multiline: true, maxLength: 200, aiField: true },
    },
    default: {},
  };

  return byKind[kind];
}

const sectionToPiece: Record<string, SuitePiece> = {
  "Event Profile": "invitation",
  Names: "invitation",
  "Event Details": "invitation",
  RSVP: "rsvp",
  "Details Card": "details",
  Menu: "menu",
  "Thank You": "thankyou",
  "Save the Date": "savethedate",
  "Table & Seating": "tablenumber",
  "Welcome Sign": "welcomesign",
};

export default function ContentForm() {
  const { content, setContent, setActivePiece } = useDesignStore();
  const overrides = getEventSpecificOverrides(content.eventType);

  const handleSectionFocus = (sectionTitle: string) => {
    const piece = sectionToPiece[sectionTitle];
    if (piece) {
      setActivePiece(piece);
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title} onFocus={() => handleSectionFocus(section.title)}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-500">
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                {(() => {
                  const current = overrides[field.key] ? { ...field, ...overrides[field.key] } : field;
                  return (
                    <>
                      <div className="mb-1 flex items-center">
                        <span className="text-xs font-medium text-stone-600">{current.label}</span>
                        {current.aiField && (
                          <AISuggestButton
                            field={field.key}
                            onSelect={(value) => setContent({ [field.key]: value })}
                          />
                        )}
                      </div>
                      <Input
                        label=""
                        placeholder={current.placeholder}
                        value={(content as unknown as Record<string, string>)[field.key] ?? ""}
                        multiline={current.multiline}
                        maxLength={current.maxLength}
                        onChange={(e) => setContent({ [field.key]: e.target.value })}
                      />
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
