# Social Media Strategie — Lieblingsbars

## Konzept

Jeden Tag wird eine neue fiktive Bar auf X (Twitter), Instagram und Facebook vorgestellt.
318 Bars = fast ein ganzes Jahr täglich Content.

## Plattformen

### X / Twitter
- Kurz, knackig, max. 240 Zeichen
- 1–2 Hashtags maximal
- Emoji gezielt einsetzen
- Ideal für Teaser und witzige One-Liner

### Instagram
- Atmosphärische Caption (3–5 Sätze)
- 5–8 relevante Hashtags
- Bild: Nano Banana Prompt → KI-generiertes Bild
- Stories mit Bar-Details zusätzlich möglich

### Facebook
- Entspannter, einladender Ton
- 2–3 Sätze, lädt zum Kommentieren/Teilen ein
- Bild wie Instagram

## Workflow

1. **Bild generieren**: Bildprompt aus der Website kopieren (Kopieren-Button)
   oder aus `social-media/image-prompts-for-nano-banana.txt` nehmen
2. **Nano Banana öffnen**: Prompt einfügen, Bild generieren und herunterladen
3. **Post planen**: Texte aus der Website oder aus `social-media/social-export.csv`
4. **Manuell posten** oder in ein Scheduling-Tool (Later, Hootsuite, etc.) importieren

## Export-Dateien

- `social-media/social-export.csv` — Alle Texte als CSV (Semikolon-getrennt, Excel-kompatibel)
- `social-media/social-plan.md` — Tägliche Posts als Markdown-Übersicht
- `social-media/image-prompts-for-nano-banana.txt` — Alle Bildprompts

Neue Exporte generieren: `npm run export-social`

## Posting-Rhythmus

- Start: 1. Januar (oder beliebiges Datum)
- 1 Bar pro Tag
- Wochenende: evtl. Best-of-Reposts

## Hashtag-Vorschläge (wiederkehrend)

`#lieblingsbars #fiktivebar #barkultur #cocktails #nachtleben #deutschebars`
