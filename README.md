# Lieblingsbars

318 fiktive Bars — jede benannt nach einem deutschen Adjektiv auf -bar.

## Stack

- **Next.js 14** mit Static Export (`output: "export"`)
- **Anthropic API** für Content-Generierung
- **Vercel** für Hosting
- **Nano Banana** für KI-generierte Barbilder

## Setup

```bash
npm install
```

## Content generieren

```bash
# API-Key setzen
export ANTHROPIC_API_KEY=sk-ant-...

# Alle 318 Bars generieren (resume-safe)
npm run generate

# Nur eine bestimmte Range
node scripts/generate-bars.mjs --from=1 --to=50

# Nur eine Bar
node scripts/generate-bars.mjs --only=Wunderbar

# In Batches (z.B. 20 auf einmal)
node scripts/generate-bars.mjs --batch=20
```

## Lokal entwickeln

```bash
npm run dev
# → http://localhost:3000
```

## Bauen & deployen

```bash
npm run build
# → ./out/ (statische HTML-Dateien)
```

Vercel deployed automatisch bei jedem Push auf `main`.

## Social Media

Social-Media-Texte exportieren:

```bash
npm run export-social
# → social-media/social-export.csv (für beliebige Scheduling-Tools)
# → social-media/social-plan.md (Übersicht)
# → social-media/image-prompts-for-nano-banana.txt
```

**Workflow:**
1. Bildprompt von der Website kopieren (Kopieren-Button auf jeder Bar-Seite)
2. In Nano Banana einfügen → Bild generieren
3. Text aus `social-export.csv` oder direkt von der Website nehmen
4. In Scheduling-Tool (Later, Hootsuite, etc.) einplanen oder manuell posten

## Projektstruktur

```
lieblingsbars/
├── data/
│   ├── bars.json          # Generierte Inhalte (318 Bars)
│   └── bar-names.js       # Alle 318 Bar-Namen
├── scripts/
│   ├── generate-bars.mjs  # Anthropic API Generator
│   └── export-social.mjs  # Social Media CSV Export
├── social-media/
│   ├── STRATEGY.md        # Social Media Strategie
│   ├── social-export.csv  # (nach Export)
│   ├── social-plan.md     # (nach Export)
│   └── image-prompts-for-nano-banana.txt
├── src/
│   └── app/               # Next.js App Router
└── public/
    └── images/            # Nano Banana Bilder (manuell ablegen)
```
