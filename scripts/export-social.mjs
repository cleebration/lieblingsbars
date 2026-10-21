#!/usr/bin/env node
/**
 * export-social.mjs
 * Exportiert Social-Media-Texte als CSV für manuelles Posting
 * oder Import in ein beliebiges Scheduling-Tool.
 *
 * Usage: node scripts/export-social.mjs
 * Output: social-media/social-export.csv
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BARS_JSON = join(ROOT, "data", "bars.json");
const OUT_DIR = join(ROOT, "social-media");

if (!existsSync(BARS_JSON)) {
  console.error("❌ bars.json nicht gefunden. Bitte zuerst generate-bars.mjs ausführen.");
  process.exit(1);
}

const bars = JSON.parse(readFileSync(BARS_JSON, "utf-8"));
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// ── CSV Export ──
function escapeCsv(str) {
  if (!str) return "";
  return `"${String(str).replace(/"/g, '""')}"`;
}

const header = ["Datum", "Bar", "Stadt", "X/Twitter", "Instagram", "Facebook"].join(";");
const rows = bars.map(bar => {
  return [
    bar.publishDate,
    escapeCsv(bar.name),
    escapeCsv(bar.city),
    escapeCsv(bar.tweet),
    escapeCsv(bar.instagram),
    escapeCsv(bar.facebook),
  ].join(";");
});

const csv = [header, ...rows].join("\n");
const csvPath = join(OUT_DIR, "social-export.csv");
writeFileSync(csvPath, "﻿" + csv); // BOM für Excel
console.log(`✅ CSV exportiert: ${csvPath} (${bars.length} Bars)`);

// ── Tägliche Post-Liste (Markdown) ──
const mdLines = ["# Social Media Plan — Lieblingsbars\n", "Ein Post pro Tag, je nach gewünschtem Datum anpassen.\n"];
bars.forEach(bar => {
  mdLines.push(`## ${bar.publishDate} — ${bar.name}`);
  mdLines.push(`**Stadt:** ${bar.city}, ${bar.neighborhood}\n`);
  mdLines.push(`**X/Twitter:**\n${bar.tweet || "–"}\n`);
  mdLines.push(`**Instagram:**\n${bar.instagram || "–"}\n`);
  mdLines.push(`**Facebook:**\n${bar.facebook || "–"}\n`);
  mdLines.push("---\n");
});

const mdPath = join(OUT_DIR, "social-plan.md");
writeFileSync(mdPath, mdLines.join("\n"));
console.log(`✅ Markdown exportiert: ${mdPath}`);
