"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import Input from "@/components/ui/Input";

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

interface Section {
  title: string;
  fields: FieldDef[];
}

const sections: Section[] = [
  {
    title: "Names",
    fields: [
      { key: "name1", label: "First Name", placeholder: "Emma" },
      { key: "name2", label: "Second Name", placeholder: "James" },
      { key: "conjunction", label: "Conjunction", placeholder: "&" },
    ],
  },
  {
    title: "Event Details",
    fields: [
      {
        key: "preHeading",
        label: "Pre-heading",
        placeholder: "Together with their families",
      },
      { key: "date", label: "Date", placeholder: "Saturday, October 18, 2026" },
      { key: "time", label: "Time", placeholder: "Half past four in the afternoon" },
      { key: "venue", label: "Venue", placeholder: "The Grand Estate" },
      {
        key: "address",
        label: "Address",
        placeholder: "123 Garden Lane, Napa Valley, CA",
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
      },
      {
        key: "receptionDetails",
        label: "Reception Details",
        placeholder: "Reception to follow in the grand ballroom.",
        multiline: true,
      },
      {
        key: "dressCode",
        label: "Dress Code",
        placeholder: "Black Tie Optional",
      },
    ],
  },
  {
    title: "Menu",
    fields: [
      { key: "appetizer", label: "Appetizer", placeholder: "Burrata & Heirloom Tomato" },
      { key: "entree", label: "Entree", placeholder: "Herb-Crusted Lamb" },
      { key: "dessert", label: "Dessert", placeholder: "Vanilla Bean Panna Cotta" },
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
      },
    ],
  },
];

export default function ContentForm() {
  const { content, setContent } = useDesignStore();

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
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
                onChange={(e) => setContent({ [field.key]: e.target.value })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
