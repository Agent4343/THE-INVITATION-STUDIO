/**
 * Generate batch access codes and insert them into Supabase.
 *
 * Usage:  tsx scripts/generate-codes.ts [count]
 * Example: tsx scripts/generate-codes.ts 50
 */

import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

// Alphanumeric uppercase, excluding ambiguous characters: 0, O, 1, I, L
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  const bytes = crypto.randomBytes(12); // plenty of entropy
  const segments: string[] = [];

  for (let seg = 0; seg < 3; seg++) {
    let part = "";
    for (let i = 0; i < 4; i++) {
      const idx = bytes[seg * 4 + i] % ALPHABET.length;
      part += ALPHABET[idx];
    }
    segments.push(part);
  }

  return segments.join("-"); // XXXX-XXXX-XXXX
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const count = Math.max(1, parseInt(process.argv[2] ?? "100", 10));

  console.log(`Generating ${count} access codes...\n`);

  // Generate unique codes
  const codeSet = new Set<string>();
  while (codeSet.size < count) {
    codeSet.add(generateCode());
  }

  const rows = Array.from(codeSet).map((code) => ({
    code,
    status: "unused" as const,
  }));

  // Insert into Supabase
  const { data, error } = await supabase
    .from("access_codes")
    .insert(rows)
    .select("code");

  if (error) {
    console.error("Supabase insert failed:", error.message);
    process.exit(1);
  }

  // Print codes to stdout
  console.log("Generated codes:");
  console.log("─".repeat(16));
  for (const row of data ?? []) {
    console.log(row.code);
  }
  console.log("─".repeat(16));
  console.log(`\nTotal: ${data?.length ?? 0} codes inserted.`);
}

main();
