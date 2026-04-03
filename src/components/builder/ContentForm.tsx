"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import { SuitePiece } from "@/types";
import Input from "@/components/ui/Input";

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
}

interface Section {
  title: string;
  fields: FieldDef[];
}

const sections: Section[] = [
  {
    title: "Names",
    fields: [
      { key: "name1", label: "First Name", placeholder: "Emma", maxLength: 30 },
      { key: "name2", label: "Second Name", placeholder: "James", maxLength: 30 },
      { key: "conjunction", label: "Conjunction", placeholder: "&", maxLength: 10 },
    ],
  },
  {
    title: "Event Details",
    fields: [
      {
        key: "preHeading",
        label: "Pre-heading",
        placeholder: "Together with their families",
        maxLength: 60,
      },
      { key: "date", label: "Date", placeholder: "Saturday, October 18, 2026", maxLength: 40 },
      { key: "time", label: "Time", placeholder: "Half past four in the afternoon", maxLength: 50 },
      { key: "venue", label: "Venue", placeholder: "The Grand Estate", maxLength: 50 },
      {
        key: "address",
        label: "Address",
        placeholder: "123 Garden Lane, Napa Valley, CA",
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
      },
      {
        key: "receptionDetails",
        label: "Reception Details",
        placeholder: "Reception to follow in the grand ballroom.",
        multiline: true,
        maxLength: 200,
      },
      {
        key: "dressCode",
        label: "Dress Code",
        placeholder: "Black Tie Optional",
        maxLength: 40,
      },
    ],
  },
  {
    title: "Menu",
    fields: [
      { key: "appetizer", label: "Appetizer", placeholder: "Burrata & Heirloom Tomato", maxLength: 50 },
      { key: "entree", label: "Entree", placeholder: "Herb-Crusted Lamb", maxLength: 50 },
      { key: "dessert", label: "Dessert", placeholder: "Vanilla Bean Panna Cotta", maxLength: 50 },
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
      },
    ],
  },
];

const sectionToPiece: Record<string, SuitePiece> = {
  Names: "invitation",
  "Event Details": "invitation",
  RSVP: "rsvp",
  "Details Card": "details",
  Menu: "menu",
  "Thank You": "thankyou",
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
              <Input
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={(content as unknown as Record<string, string>)[field.key] ?? ""}
                multiline={field.multiline}
                maxLength={field.maxLength}
                onChange={(e) => setContent({ [field.key]: e.target.value })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
