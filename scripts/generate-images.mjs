#!/usr/bin/env node
/**
 * Generiert Bilder für alle 299 Lieblingsbars via Gemini Imagen 3
 * Speichert sie unter public/bars/{slug}.jpg
 * 
 * Nutzung:
 *   GEMINI_API_KEY=xxx node scripts/generate-images.mjs [--start 0] [--count 10] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const START_IDX = process.argv.includes('--start')
  ? parseInt(process.argv[process.argv.indexOf('--start') + 1]) : 0;
const COUNT = process.argv.includes('--count')
  ? parseInt(process.argv[process.argv.indexOf('--count') + 1]) : 299;
const ONLY_SLUG = process.argv.includes('--slug')
  ? process.argv[process.argv.indexOf('--slug') + 1] : null;

if (!GEMINI_API_KEY && !DRY_RUN) {
  console.error('❌ Fehler: GEMINI_API_KEY fehlt');
  process.exit(1);
}

const bars = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/bars.json'), 'utf-8'));
const outDir = path.join(ROOT, 'public/bars');
fs.mkdirSync(outDir, { recursive: true });

// Progress-Log
const logPath = path.join(ROOT, 'scripts/generate-progress.json');
let progress = {};
if (fs.existsSync(logPath)) {
  progress = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  console.log(`✓ Progress geladen: ${Object.keys(progress).length} bereits fertig`);
}

async function generateImage(bar) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
  const payload = {
    instances: [{ prompt: bar.imagePrompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "16:9",
      safetyFilterLevel: "block_few",
      personGeneration: "dont_allow",
    }
  };
  
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini ${resp.status}: ${err.slice(0, 300)}`);
  }
  
  const data = await resp.json();
  if (!data.predictions?.[0]?.bytesBase64Encoded) {
    throw new Error(`Kein Bild in Antwort: ${JSON.stringify(data).slice(0, 200)}`);
  }
  
  return Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  let subset = ONLY_SLUG 
    ? bars.filter(b => b.slug === ONLY_SLUG)
    : bars.slice(START_IDX, START_IDX + COUNT);
  
  console.log(`\n🍸 Starte Bildgenerierung für ${subset.length} Bars (ab Index ${START_IDX})`);
  if (DRY_RUN) console.log('  [DRY RUN]');
  
  let generated = 0, skipped = 0, errors = 0;
  
  for (const bar of subset) {
    const outPath = path.join(outDir, `${bar.slug}.jpg`);
    
    if (progress[bar.slug] || fs.existsSync(outPath)) {
      console.log(`  ⏭  ${bar.name}`);
      skipped++;
      continue;
    }
    
    process.stdout.write(`  🎨 ${bar.name}... `);
    
    if (DRY_RUN) {
      console.log('[DRY RUN]');
      generated++;
      continue;
    }
    
    try {
      const imgBuf = await generateImage(bar);
      fs.writeFileSync(outPath, imgBuf);
      progress[bar.slug] = { file: outPath, ts: new Date().toISOString() };
      fs.writeFileSync(logPath, JSON.stringify(progress, null, 2));
      generated++;
      console.log(`✓ (${Math.round(imgBuf.length/1024)}KB)`);
      await sleep(1200); // Rate limit: ~50 req/min
    } catch (err) {
      console.log(`✗ ${err.message}`);
      errors++;
      await sleep(3000);
    }
  }
  
  console.log(`\n✅ Fertig! Generiert: ${generated}, Übersprungen: ${skipped}, Fehler: ${errors}`);
  console.log(`   Bilder in: public/bars/`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
