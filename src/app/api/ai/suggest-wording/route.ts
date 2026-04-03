import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAnthropicClient } from "@/lib/anthropic";

const VALID_FIELDS = [
  "preHeading",
  "invitationLine",
  "hostLine",
  "rsvpPrompt",
  "guestPrompt",
  "ceremonyDetails",
  "receptionDetails",
  "dressCode",
  "thankYouMessage",
  "appetizer",
  "entree",
  "dessert",
] as const;

type Field = (typeof VALID_FIELDS)[number];

const VALID_TONES = ["formal", "romantic", "modern", "playful", "rustic"] as const;

type Tone = (typeof VALID_TONES)[number];

const FIELD_GUIDANCE: Record<Field, string> = {
  preHeading:
    "A short phrase that appears above the names, typically 3-8 words. Examples: 'Together with their loved ones', 'With joy in our hearts'.",
  invitationLine:
    "A short invitation sentence suitable for birthdays, anniversaries, weddings, showers, and other celebrations. Example: 'invite you to celebrate with us'.",
  hostLine:
    "A concise line introducing hosts. Examples: 'Together with our families', 'Hosted by the Johnson family'.",
  rsvpPrompt:
    "A short RSVP prompt. Examples: 'Please respond by', 'Kindly RSVP by'.",
  guestPrompt:
    "A short label for guest/place card line. Examples: 'Guest Name', 'Name'.",
  ceremonyDetails:
    "A brief, elegant description of the ceremony. Include the date, time, and venue naturally. Keep it to 2-3 sentences maximum.",
  receptionDetails:
    "A short invitation to the reception celebration. 1-2 sentences, warm and welcoming.",
  dressCode:
    "A concise dress code note, typically one short phrase or sentence. Examples: 'Black Tie', 'Garden Party Attire', 'Cocktail Attire Requested'.",
  thankYouMessage:
    "A heartfelt thank-you message from the couple. 1-2 sentences expressing gratitude for attending.",
  appetizer:
    "A single appetizer dish name with a brief elegant description. Example: 'Seared Scallops with citrus beurre blanc'.",
  entree:
    "A single entrée dish name with a brief elegant description. Example: 'Pan-Roasted Filet Mignon with truffle demi-glace'.",
  dessert:
    "A single dessert dish name with a brief elegant description. Example: 'Vanilla Bean Crème Brûlée with fresh berries'.",
};

interface RequestBody {
  field: string;
  context: {
    name1?: string;
    name2?: string;
    date?: string;
    time?: string;
    venue?: string;
  };
  tone?: string;
}

export async function POST(request: Request) {
  try {
    // Verify JWT
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    try {
      verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { field, context, tone = "romantic" } = body;

    // Validate field
    if (!field || !VALID_FIELDS.includes(field as Field)) {
      return NextResponse.json(
        { error: `Invalid field. Must be one of: ${VALID_FIELDS.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate tone
    if (!VALID_TONES.includes(tone as Tone)) {
      return NextResponse.json(
        { error: `Invalid tone. Must be one of: ${VALID_TONES.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate context
    if (!context || typeof context !== "object") {
      return NextResponse.json(
        { error: "context is required and must be an object" },
        { status: 400 },
      );
    }

    const { name1, name2, date, time, venue } = context;

    const systemPrompt = [
      "You are an expert event stationery copywriter.",
      "You write elegant, concise text for invitations and event stationery.",
      "You always respond with exactly 3 suggestions, one per line, numbered 1-3.",
      "Do not include any other text, explanations, or formatting — just the three numbered suggestions.",
    ].join(" ");

    const userPrompt = [
      `Write 3 ${tone} wording suggestions for the "${field}" section of event stationery.`,
      name1 && name2 ? `The couple: ${name1} & ${name2}.` : "",
      date ? `Date: ${date}.` : "",
      time ? `Time: ${time}.` : "",
      venue ? `Venue: ${venue}.` : "",
      "",
      `Guidelines for this field: ${FIELD_GUIDANCE[field as Field]}`,
    ]
      .filter(Boolean)
      .join("\n");

    const anthropic = getAnthropicClient();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract text from the response
    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // Parse numbered suggestions (lines starting with 1., 2., 3.)
    const suggestions = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 3);

    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate suggestions" },
        { status: 500 },
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI suggest-wording error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
