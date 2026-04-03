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

const sections: Section[] = [
  {
    title: "Event Profile",
    fields: [
      {
        key: "eventType",
        label: "Event Type",
        placeholder:
          "birthday, anniversary, wedding, elopement, civil-ceremony, vow-renewal, engagement, bridal-shower, baby-shower, graduation, retirement, holiday",
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
                <div className="mb-1 flex items-center">
                  <span className="text-xs font-medium text-stone-600">{field.label}</span>
                  {field.aiField && (
                    <AISuggestButton
                      field={field.key}
                      onSelect={(value) => setContent({ [field.key]: value })}
                    />
                  )}
                </div>
                <Input
                  label=""
                  placeholder={field.placeholder}
                  value={(content as unknown as Record<string, string>)[field.key] ?? ""}
                  multiline={field.multiline}
                  maxLength={field.maxLength}
                  onChange={(e) => setContent({ [field.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
