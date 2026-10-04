#!/usr/bin/env node
/**
 * export-buffer.mjs
 * Exports a Buffer-compatible CSV for scheduling all bars across
 * X/Twitter, Instagram, and Facebook.
 *
 * Usage: node scripts/export-buffer.mjs [--site=https://yoursite.com]
 * 
 * Output: social-media/buffer-schedule.csv
 *
 * Buffer CSV Format:
 * Date, Time, Platform, Message, Image Filename, Link
 *
 * In Buffer: go to "Import" → "CSV" and upload the file.
 * Each platform needs to be connected in your Buffer account.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../data/bars.json");
const OUT_FILE = path.join(__dirname, "../social-media/buffer-schedule.csv");

const args = process.argv.slice(2);
const siteArg = args.find((a) => a.startsWith("--site="));
const SITE_URL = siteArg
  ? siteArg.split("=")[1]
  : "https://www.lieblingsbars.at";

const bars = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// CSV header
const rows = [
  '"Date","Time","Platform","Message","Image Filename","Link"',
];

bars.forEach((bar, i) => {
  const date = bar.publishDate || getDateOffset(i);
  const url = `${SITE_URL}/bar/${bar.slug}/`;
  const img = `public/images/${bar.slug}.jpg`;

  const xMsg = (bar.tweet || `${bar.name}: ${bar.tagline} #Lieblingsbars #MyW`)
    .replace(/"/g, '""');
  const igMsg = (bar.instagram || `${bar.tagline} – ${bar.name} #Lieblingsbars`)
    .replace(/"/g, '""');
  const fbMsg = (bar.facebook || bar.concept || bar.tagline)
    .replace(/"/g, '""');

  // X/Twitter at 10:00
  rows.push(`"${date}","10:00","Twitter","${xMsg}","${img}","${url}"`);
  // Instagram at 12:00
  rows.push(`"${date}","12:00","Instagram","${igMsg}","${img}","${url}"`);
  // Facebook at 18:00
  rows.push(`"${date}","18:00","Facebook","${fbMsg}","${img}","${url}"`);
});

fs.writeFileSync(OUT_FILE, rows.join("\n"), "utf8");

console.log(`\n📅 Buffer CSV Export`);
console.log(`✅ ${bars.length * 3} posts scheduled across 3 platforms`);
console.log(`   ${bars.length} × X/Twitter @ 10:00`);
console.log(`   ${bars.length} × Instagram @ 12:00`);
console.log(`   ${bars.length} × Facebook @ 18:00`);
console.log(`📁 Saved to social-media/buffer-schedule.csv`);
console.log(`\nNext step: In Buffer → Import → CSV → upload the file.\n`);

function getDateOffset(index) {
  const start = new Date("2025-01-01");
  const d = new Date(start);
  d.setDate(d.getDate() + index);
  return d.toISOString().split("T")[0];
}
