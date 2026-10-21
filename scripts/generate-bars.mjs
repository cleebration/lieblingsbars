#!/usr/bin/env node
/**
 * generate-bars.mjs
 * Generates content for all bars using the Anthropic API.
 * Resume-safe: skips already-generated entries.
 *
 * Usage:
 *   node scripts/generate-bars.mjs              # all bars
 *   node scripts/generate-bars.mjs --from=50    # start from bar 50
 *   node scripts/generate-bars.mjs --to=100     # stop at bar 100
 *   node scripts/generate-bars.mjs --only=Wunderbar
 *   node scripts/generate-bars.mjs --batch=10   # generate N then stop
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BARS_JSON = join(ROOT, "data", "bars.json");
const NAMES_FILE = join(ROOT, "data", "bar-names.js");

// ── Parse CLI args ──
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith("--"))
    .map(a => {
      const [k, v] = a.slice(2).split("=");
      return [k, v ?? true];
    })
);

const FROM = args.from ? parseInt(args.from) : 1;
const TO = args.to ? parseInt(args.to) : Infinity;
const ONLY = args.only ?? null;
const BATCH = args.batch ? parseInt(args.batch) : Infinity;

// ── Load names ──
const namesContent = readFileSync(NAMES_FILE, "utf-8");
const match = namesContent.match(/\[([^\]]+)\]/s);
const barNames = match
  ? match[1].split(",").map(n => n.trim().replace(/^"|"$/g, "").replace(/'/g, "")).filter(Boolean)
  : [];

console.log(`📋 Loaded ${barNames.length} bar names`);

// ── Load existing data ──
let existing = [];
if (existsSync(BARS_JSON)) {
  try {
    existing = JSON.parse(readFileSync(BARS_JSON, "utf-8"));
    console.log(`📂 Found ${existing.length} existing bars in bars.json`);
  } catch {
    console.log("⚠️  Could not parse bars.json, starting fresh");
  }
}

const existingNames = new Set(existing.map(b => b.name));

// ── Filter names to generate ──
let toGenerate = barNames
  .map((name, i) => ({ name, id: i + 1 }))
  .filter(({ id }) => id >= FROM && id <= TO)
  .filter(({ name }) => !ONLY || name === ONLY)
  .filter(({ name }) => !existingNames.has(name));

if (toGenerate.length === 0) {
  console.log("✅ All bars already generated!");
  exportImagePrompts(existing);
  process.exit(0);
}

if (BATCH < Infinity) {
  toGenerate = toGenerate.slice(0, BATCH);
}

console.log(`🎯 Generating ${toGenerate.length} bars (${FROM}–${Math.min(TO, barNames.length)})`);

// ── Anthropic client ──
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ Missing ANTHROPIC_API_KEY environment variable");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── German cities list ──
const CITIES = [
  { city: "Berlin", neighborhoods: ["Mitte", "Prenzlauer Berg", "Kreuzberg", "Neukölln", "Friedrichshain", "Charlottenburg", "Wedding", "Schöneberg"] },
  { city: "Hamburg", neighborhoods: ["Schanzenviertel", "Altona", "St. Pauli", "Ottensen", "Eimsbüttel", "Barmbek", "Winterhude"] },
  { city: "München", neighborhoods: ["Maxvorstadt", "Schwabing", "Glockenbachviertel", "Haidhausen", "Bogenhausen", "Au"] },
  { city: "Köln", neighborhoods: ["Ehrenfeld", "Nippes", "Deutz", "Südstadt", "Belgisches Viertel", "Mühlheim"] },
  { city: "Frankfurt", neighborhoods: ["Bornheim", "Sachsenhausen", "Nordend", "Westend", "Bockenheim"] },
  { city: "Leipzig", neighborhoods: ["Connewitz", "Plagwitz", "Lindenau", "Gohlis", "Schleußig"] },
  { city: "Stuttgart", neighborhoods: ["West", "Heslach", "Degerloch", "Bad Cannstatt", "Feuerbach"] },
  { city: "Düsseldorf", neighborhoods: ["Flingern", "Bilk", "Friedrichstadt", "Pempelfort", "Oberkassel"] },
  { city: "Dresden", neighborhoods: ["Neustadt", "Pieschen", "Löbtau", "Striesen", "Gorbitz"] },
  { city: "Hannover", neighborhoods: ["List", "Linden", "Oststadt", "Calenberger Neustadt"] },
];

function getCity(id) {
  return CITIES[id % CITIES.length];
}

// ── Generate single bar ──
async function generateBar(name, id) {
  const { city, neighborhoods } = getCity(id);
  const neighborhood = neighborhoods[id % neighborhoods.length];

  const publishDate = new Date(2025, 0, 1 + (id - 1));
  const dateStr = publishDate.toISOString().split("T")[0];

  const prompt = `Du bist ein kreativer Barkultur-Autor. Erfinde eine fiktive Bar namens "${name}" in ${city} (Viertel: ${neighborhood}).

Der Name "${name}" ist ein deutsches Adjektiv mit der Endung "-bar" (z.B. trinkbar, machbar, vorstellbar). Spiele mit der Bedeutung des Wortes.

Antworte NUR mit einem validen JSON-Objekt (kein Markdown, kein Text drumherum):

{
  "tagline": "Kurze, witzige/nachdenkliche Tagline (max. 8 Wörter)",
  "concept": "2-3 Sätze Konzeptbeschreibung der Bar. Witzig, quirky, leicht absurd.",
  "blogTitle": "Kreativer Blogtitel (kein Clickbait, etwas literarischer)",
  "blogContent": "3-4 Absätze Blogbeitrag über diese Bar. Stil: feuilletonistisch, mit Humor und einer Prise Melancholie. Absätze durch doppelte Leerzeile trennen. Keine Überschriften.",
  "signatureDrink": "Name des Signature Drinks",
  "signatureDrinkDescription": "2-3 Sätze Beschreibung des Drinks — Zutaten, Geschmack, Wirkung.",
  "imagePrompt": "A moody bar interior photograph of ${name}, [3-5 visual details that match the bar's concept and name], cinematic lighting, film grain, editorial photography, dark and atmospheric",
  "tweet": "Tweet für X/Twitter (max 240 Zeichen, kein #hashtag-Spam, max 2 Tags, mit Emoji)",
  "instagram": "Instagram-Caption (3-5 Sätze, atmosphärisch, mit 5-8 passenden Hashtags am Ende)",
  "facebook": "Facebook-Post (entspannt, 2-3 Sätze, lädt zum Teilen ein)"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  const data = JSON.parse(jsonMatch[0]);

  return {
    id,
    name,
    slug: name.toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    publishDate: dateStr,
    city,
    neighborhood,
    ...data,
  };
}

// ── Main loop ──
async function main() {
  let generated = 0;
  let failed = 0;

  for (const { name, id } of toGenerate) {
    process.stdout.write(`  [${id}/${barNames.length}] ${name} … `);
    try {
      const bar = await generateBar(name, id);

      // Insert at correct position
      const insertIdx = existing.findIndex(b => b.id > id);
      if (insertIdx === -1) {
        existing.push(bar);
      } else {
        existing.splice(insertIdx, 0, bar);
      }

      // Save after each bar (resume-safe)
      writeFileSync(BARS_JSON, JSON.stringify(existing, null, 2));
      process.stdout.write(`✓ ${bar.city}\n`);
      generated++;

      // Small delay to be nice to the API
      if (generated < toGenerate.length) {
        await new Promise(r => setTimeout(r, 300));
      }
    } catch (err) {
      process.stdout.write(`✗ ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n✅ Done: ${generated} generated, ${failed} failed`);
  console.log(`📊 Total bars in bars.json: ${existing.length}`);

  // Export image prompts
  exportImagePrompts(existing);
}

function exportImagePrompts(bars) {
  const dir = join(ROOT, "social-media");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const lines = bars.map(b =>
    `=== ${b.name} (#${b.id}) ===\n${b.imagePrompt || "(kein Prompt)"}\n`
  );

  const outPath = join(dir, "image-prompts-for-nano-banana.txt");
  writeFileSync(outPath, lines.join("\n"));
  console.log(`🖼  Image prompts exported: ${outPath}`);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
