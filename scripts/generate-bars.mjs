#!/usr/bin/env node
/**
 * generate-bars.mjs
 * Generates all bar content (blog posts, image prompts, social media) 
 * via Anthropic API and writes to data/bars.json
 *
 * Usage: ANTHROPIC_API_KEY=your_key node scripts/generate-bars.mjs
 * Options:
 *   --from=50    Start from bar index 50 (resume after interruption)
 *   --to=100     Stop at bar index 100
 *   --only=Wunderbar  Generate only one specific bar
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../data/bars.json");

const barNames = [
  "Abbaubar","Abbildbar","Abdichtbar","Abgrenzbar","Abhörbar","Ableitbar","Abrufbar",
  "Absehbar","Absicherbar","Abspielbar","Abstimmbar","Abwählbar","Abwandelbar","Abzählbar",
  "Aktivierbar","Analysierbar","Anfechtbar","Angreifbar","Anpassbar","Anrechenbar",
  "Anrufbar","Anschließbar","Ansprechbar","Anwendbar","Anzeigbar","Anzweifelbar",
  "Auffindbar","Aufblasbar","Aufladbar","Aufzeichenbar","Ausbaubar","Ausblendbar",
  "Ausführbar","Aushaltbar","Auslagerbar","Auslösbar","Auslesbar","Ausschaltbar",
  "Austauschbar","Auswählbar","Auswertbar","Auszahlbar","Automatisierbar",
  "Bearbeitbar","Bebaubar","Bedienbar","Bedruckbar","Beeinflussbar","Befahrbar",
  "Begehbar","Begrenzbar","Behebbar","Beheizbar","Bekämpfbar","Belastbar",
  "Beleuchtbar","Bemerkbar","Benutzbar","Beobachtbar","Berechenbar","Beschreibbar",
  "Besetzbar","Bestellbar","Bestechbar","Besteuerbar","Betreibbar","Bewohnbar",
  "Bezahlbar","Bezwingbar","Biegbar","Brauchbar","Buchbar",
  "Codierbar",
  "Darstellbar","Datierbar","Deaktivierbar","Dehnbar","Definierbar","Delegierbar",
  "Denkbar","Digitalisierbar","Dokumentierbar","Druckbar","Durchführbar",
  "Einbaubar","Eingrenzbar","Einplanbar","Einschaltbar","Einstellbar","Einteilbar",
  "Erfahrbar","Erfassbar","Erfüllbar","Erkennbar","Erklärbar","Erlebbar",
  "Ermittelbar","Erpressbar","Erreichbar","Ersetzbar","Erweiterbar","Erzwingbar",
  "Essbar","Exportierbar",
  "Fahrbar","Faltbar","Fassbar","Filterbar","Finanzierbar","Findbar","Fixierbar",
  "Formbar","Formatierbar","Fühlbar",
  "Generierbar","Geniessbar","Greifbar",
  "Haftbar","Haltbar","Handhabbar","Härtbar","Heilbar","Heizbar","Herstellbar",
  "Herzeigbar","Hörbar",
  "Importierbar","Installierbar","Integrierbar",
  "Kategorisierbar","Klappbar","Klärbar","Klonbar","Kombinierbar","Komprimierbar",
  "Konfigurierbar","Kontrollierbar","Konvertierbar","Kopierbar","Korrigierbar",
  "Korrumpierbar","Kündbar","Küssbar",
  "Ladbar","Lagerbar","Lehrbar","Lenkbar","Lernbar","Lesbar","Lieferbar",
  "Lokalisierbar","Lösbar",
  "Machbar","Manipulierbar","Messbar","Mietbar","Mischbar","Modifizierbar",
  "Nachvollziehbar","Nachweisbar","Navigierbar","Nennbar","Normierbar","Nutzbar",
  "Optimierbar",
  "Personalisierbar","Pflegbar","Planbar","Portierbar","Positionierbar",
  "Programmierbar","Protokollierbar","Prüfbar",
  "Quantifizierbar",
  "Realisierbar","Recycelbar","Reduzierbar","Referenzierbar","Registrierbar",
  "Regelbar","Reparierbar","Reproduzierbar","Rettbar","Rockbar","Rollbar","Rutschbar",
  "Sagbar","Schaltbar","Schätzbar","Scheinbar","Schmelzbar","Schneidbar","Schreibbar",
  "Schwimmbar","Sicherbar","Sichtbar","Simulierbar","Skalierbar","Sonderbar",
  "Sortierbar","Speicherbar","Sperrbar","Spielbar","Spülbar","Spürbar","Steuerbar",
  "Strafbar","Suchbar","Synchronisierbar",
  "Tastbar","Tauschbar","Teilbar","Testbar","Tragbar","Transportierbar","Trennbar",
  "Trinkbar",
  "Übersetzbar","Übertragbar","Überwindbar","Umgehbar","Umkehrbar","Umrechenbar",
  "Umsetzbar","Umwandelbar",
  "Unabsehbar","Unberechenbar","Unbrauchbar","Unessbar","Unfassbar","Unhaltbar",
  "Unheilbar","Unlenkbar","Unnahbar","Unsagbar","Unscheinbar","Unschlagbar",
  "Unsichtbar","Unspielbar","Untrennbar","Unumkehrbar","Unvermeidbar","Unvorstellbar",
  "Unwählbar","Unterscheidbar",
  "Validierbar","Veränderbar","Verarbeitbar","Verbesserbar","Verdaubar","Verdoppelbar",
  "Vereinbar","Vereinfachbar","Vererbbar","Verformbar","Vergessbar","Vergleichbar",
  "Verhandelbar","Verhinderbar","Verkaufbar","Verknüpfbar","Verkürzbar","Verlängerbar",
  "Vermeidbar","Vermietbar","Verrechenbar","Verschiebbar","Verschlüsselbar",
  "Versicherbar","Versetzbar","Vertretbar","Verwaltbar","Verwechselbar","Verwendbar",
  "Verwertbar","Verwundbar","Vervielfältigbar","Verzeihbar","Verzichtbar",
  "Visualisierbar","Vorstellbar",
  "Wählbar","Wandelbar","Waschbar","Weiterleitbar","Widerlegbar","Wiederholbar",
  "Wiederverwendbar","Wunderbar",
  "Zahlbar","Zählbar","Zerlegbar","Zitierbar","Zumutbar","Zurücksetzbar",
  "Zurückverfolgbar","Zusammenlegbar","Zuteilbar","Zuweisbar"
];

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "-");
}

async function generateBarContent(name) {
  const prompt = `Du bist Redakteur eines kultigen deutschen Bar-Blogs namens "MyW – Meine Lieblingsbars". 
Erstelle Content für eine fiktive Bar namens "${name}".

Der Name ist ein deutsches Adjektiv auf "-bar" und soll wörtlich als Barname interpretiert werden.
Sei kreativ, witzig, leicht philosophisch und manchmal absurd – aber immer mit Stil.

Antworte NUR mit einem validen JSON-Objekt, ohne Markdown-Formatierung, ohne Backticks:

{
  "tagline": "Ein kurzer, witziger Slogan für die Bar (max. 10 Wörter)",
  "city": "Eine deutsche oder österreichische Stadt, die zur Bar-Persönlichkeit passt",
  "neighborhood": "Ein passender Stadtteil",
  "concept": "2-3 Sätze: Was macht diese Bar besonders? Wie ist das Konzept? Was servieren sie?",
  "blogTitle": "Ein kreativer Titel für den Blogbeitrag (ohne den Barnamen)",
  "blogContent": "4 Absätze à 3-4 Sätze: Ein kuriöser, lustiger, leicht nachdenklicher Blogbeitrag über die Bar. Erwähne Atmosphäre, Stammgäste, einen besonderen Drink, eine merkwürdige Geschichte oder ein Erlebnis. Schreibe im Präsens, persönlich und mit Witz. KEINE Markdown-Formatierung, NUR Fließtext mit \\n\\n zwischen den Absätzen.",
  "signatureDrink": "Name eines Signature-Cocktails passend zur Bar",
  "signatureDrinkDescription": "1 Satz Beschreibung des Cocktails",
  "imagePrompt": "Ein detaillierter englischer Prompt für eine KI-Bildgenerierung. Beschreibe das Interieur oder die Außenansicht der Bar im Stil eines stimmungsvollen Nachtfoto. Inkl. Beleuchtung, Stil, Atmosphäre. Beginne mit: 'A moody bar interior/exterior photograph of '",
  "tweet": "Ein Twitter/X-Post über die Bar, max. 240 Zeichen, mit 1-2 passenden Emojis und Hashtags wie #Lieblingsbars #MyW",
  "instagram": "Ein Instagram-Caption mit 3-4 Sätzen, etwas poetischer, mit 5-8 relevanten Hashtags am Ende",
  "facebook": "Ein Facebook-Post, etwas ausführlicher (4-5 Sätze), einladend und beschreibend"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }]
  });

  const text = response.content[0].text.trim();
  // Remove potential markdown code fences
  const cleaned = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned);
}

async function main() {
  const args = process.argv.slice(2);
  const fromArg = args.find(a => a.startsWith("--from="));
  const toArg = args.find(a => a.startsWith("--to="));
  const onlyArg = args.find(a => a.startsWith("--only="));
  
  const fromIdx = fromArg ? parseInt(fromArg.split("=")[1]) : 0;
  const toIdx = toArg ? parseInt(toArg.split("=")[1]) : barNames.length;
  const onlyName = onlyArg ? onlyArg.split("=")[1] : null;

  // Load existing data
  let existingBars = [];
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    existingBars = JSON.parse(raw);
  }
  const existingMap = new Map(existingBars.map(b => [b.name, b]));

  const namesToProcess = onlyName 
    ? [onlyName]
    : barNames.slice(fromIdx, toIdx);

  console.log(`\n🍹 MyW Bar Generator`);
  console.log(`Processing ${namesToProcess.length} bars...\n`);

  for (let i = 0; i < namesToProcess.length; i++) {
    const name = namesToProcess[i];
    const globalIdx = barNames.indexOf(name);
    
    if (existingMap.has(name)) {
      console.log(`⏭  [${globalIdx + 1}/${barNames.length}] ${name} – already generated, skipping`);
      continue;
    }

    process.stdout.write(`🔄 [${globalIdx + 1}/${barNames.length}] ${name}...`);
    
    try {
      const content = await generateBarContent(name);
      const bar = {
        id: globalIdx + 1,
        name,
        slug: toSlug(name),
        publishDate: getPublishDate(globalIdx),
        ...content
      };
      
      existingMap.set(name, bar);
      
      // Save after each bar (resume-safe)
      const allBars = barNames
        .filter(n => existingMap.has(n))
        .map(n => existingMap.get(n));
      fs.writeFileSync(DATA_FILE, JSON.stringify(allBars, null, 2));
      
      console.log(` ✅ ${content.tagline}`);
      
      // Rate limiting: wait 500ms between requests
      if (i < namesToProcess.length - 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      console.log(` ❌ Error: ${err.message}`);
      // Wait longer on error, then continue
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const finalBars = barNames
    .filter(n => existingMap.has(n))
    .map(n => existingMap.get(n));
    
  fs.writeFileSync(DATA_FILE, JSON.stringify(finalBars, null, 2));
  
  console.log(`\n✨ Done! Generated ${finalBars.length}/${barNames.length} bars.`);
  console.log(`📁 Saved to data/bars.json\n`);
  
  // Generate image prompts file for nano banana
  const promptsFile = finalBars.map(b => 
    `=== ${b.name} ===\nFilename: ${b.slug}.jpg\nPrompt: ${b.imagePrompt}\n`
  ).join("\n");
  
  fs.writeFileSync(
    path.join(__dirname, "../social-media/image-prompts-for-nano-banana.txt"),
    promptsFile
  );
  console.log(`🎨 Image prompts saved to social-media/image-prompts-for-nano-banana.txt`);
  
  // Generate Buffer CSV
  generateBufferCSV(finalBars);
}

function getPublishDate(index) {
  const start = new Date("2025-01-01");
  const date = new Date(start);
  date.setDate(start.getDate() + index);
  return date.toISOString().split("T")[0];
}

function generateBufferCSV(bars) {
  const rows = ["Date,Time,Platform,Message,Image Filename,Link"];
  
  bars.forEach((bar, i) => {
    const date = getPublishDate(i);
    const url = `https://www.lieblingsbars.at/bar/${bar.slug}`;
    const img = `public/images/${bar.slug}.jpg`;
    
    // X/Twitter (10:00)
    rows.push(`${date},10:00,Twitter,"${bar.tweet.replace(/"/g, '""')}",${img},${url}`);
    // Instagram (12:00)
    rows.push(`${date},12:00,Instagram,"${bar.instagram.replace(/"/g, '""')}",${img},${url}`);
    // Facebook (18:00)
    rows.push(`${date},18:00,Facebook,"${bar.facebook.replace(/"/g, '""')}",${img},${url}`);
  });
  
  fs.writeFileSync(
    path.join(__dirname, "../social-media/buffer-schedule.csv"),
    rows.join("\n")
  );
  console.log(`📅 Buffer schedule saved to social-media/buffer-schedule.csv`);
}

main().catch(console.error);
