# MyW – Meine Lieblingsbars 🍸

> 318 fiktive Bars. Jede ein Universum. Von Abbaubar bis Zuweisbar.

Ein Blog-Universum basierend auf deutschen Adjektiven auf „-bar" — jede Bar hat ihren eigenen Blogbeitrag, Signature Drink, Nano Banana Bild-Prompt und Social Media Content.

---

## 🗂 Projektstruktur

```
lieblingsbars/
├── data/
│   ├── bars.json                  # Alle Bar-Daten (generiert)
│   ├── bar-names.js               # Rohe Liste aller 318 Bar-Namen
│   └── image-manifest.json        # Bild-Status (nach add-images.mjs)
├── scripts/
│   ├── generate-bars.mjs          # Content-Generierung via Anthropic API
│   ├── add-images.mjs             # Bild-Manifest updaten
│   └── export-buffer.mjs          # Buffer CSV exportieren
├── public/
│   └── images/                    # Nano Banana Bilder (slug.jpg)
├── social-media/
│   ├── STRATEGY.md                # Social Media Strategie
│   ├── buffer-schedule.csv        # Buffer Import-Datei
│   └── image-prompts-for-nano-banana.txt  # Alle Image Prompts
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── globals.css
│   │   ├── page.js                # Homepage mit Suchfunktion
│   │   └── bar/[slug]/page.js     # Einzelne Bar-Seite
│   └── components/
│       └── CopyButton.js
├── next.config.mjs
└── package.json
```

---

## 🚀 Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Content generieren (alle 318 Bars)

```bash
ANTHROPIC_API_KEY=sk-ant-... npm run generate
```

**Optionen:**
```bash
# Ab einer bestimmten Bar weitermachen (nach Unterbrechung)
ANTHROPIC_API_KEY=... node scripts/generate-bars.mjs --from=50

# Nur eine bestimmte Bar (testen)
ANTHROPIC_API_KEY=... node scripts/generate-bars.mjs --only=Wunderbar

# Bereich eingrenzen
ANTHROPIC_API_KEY=... node scripts/generate-bars.mjs --from=0 --to=30
```

> **Tipp:** Die Generierung ist resume-safe — sie überspringt bereits generierte Bars.
> Die 318 Bars brauchen bei ~0,5s pro Request ca. 3-4 Minuten.

### 3. Bilder via Nano Banana generieren

Alle Prompts findest du in:
```
social-media/image-prompts-for-nano-banana.txt
```

Nach der vollständigen Generierung (Schritt 2) werden alle 318 Prompts dort gespeichert.

**Workflow:**
1. Öffne `image-prompts-for-nano-banana.txt`
2. Für jede Bar den Prompt in Nano Banana eingeben
3. Bild speichern als: `<slug>.jpg` (z.B. `wunderbar.jpg`)
4. In `public/images/` ablegen
5. Manifest updaten: `node scripts/add-images.mjs`

### 4. Website lokal testen

```bash
npm run dev
```

→ Öffne [http://localhost:3000](http://localhost:3000)

---

## 📤 Deployment auf GitHub + Vercel

### GitHub Repository erstellen

```bash
# Im Projektordner:
git init
git add .
git commit -m "feat: MyW Lieblingsbars initial commit"

# GitHub Repository erstellen (auf github.com/new)
git remote add origin https://github.com/DEIN-USERNAME/lieblingsbars.git
git push -u origin main
```

### Vercel verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. **New Project** → **Import Git Repository**
3. Wähle `lieblingsbars` aus deinem GitHub Account
4. **Framework Preset:** Next.js (automatisch erkannt)
5. **Root Directory:** `.` (Projektroot)
6. **Build Command:** `npm run build`
7. **Output Directory:** `out`
8. **Deploy** klicken

✅ Vercel deployed automatisch bei jedem `git push`!

### Domain konfigurieren

In Vercel → Settings → Domains:
- `lieblingsbars.at` oder `meinelieblingsbar.at` hinzufügen
- DNS bei deinem Provider auf Vercel zeigen

---

## 📱 Social Media mit Buffer

### Buffer CSV importieren

```bash
# Buffer CSV generieren (mit deiner Website-URL):
node scripts/export-buffer.mjs --site=https://lieblingsbars.vercel.app
```

Dann in Buffer:
1. **Publish** → **Import** → **CSV**
2. Datei `social-media/buffer-schedule.csv` hochladen
3. Posting-Kanäle zuweisen (X, Instagram, Facebook)
4. Bilder zu Posts hinzufügen (aus `public/images/`)

**Posting-Plan:**
- 🐦 X/Twitter: 10:00 Uhr täglich
- 📸 Instagram: 12:00 Uhr täglich  
- 👥 Facebook: 18:00 Uhr täglich

### Bilder in Buffer

Für beste Ergebnisse: Bilder direkt in Buffer uploaden oder
die Bild-URLs von deiner gehosteten Website verwenden:
```
https://lieblingsbars.vercel.app/images/wunderbar.jpg
```

---

## 🔄 Workflow nach der Ersteinrichtung

```
Tag 1: node scripts/generate-bars.mjs   # Alle Inhalte generieren
Tag 2: Nano Banana Bilder erstellen      # Mit den Prompts
Tag 3: node scripts/add-images.mjs      # Bilder einchecken
Tag 4: git push                         # Auto-Deploy via Vercel
Tag 5: Buffer CSV importieren           # Social Posts planen
```

---

## 📝 Content-Update (einzelne Bar nachbearbeiten)

```bash
# Eine Bar neu generieren:
ANTHROPIC_API_KEY=... node scripts/generate-bars.mjs --only=Wunderbar
```

Dann: `git add data/bars.json && git commit -m "update: Wunderbar" && git push`

---

## 🛠 Scripts Übersicht

| Script | Beschreibung |
|--------|-------------|
| `npm run dev` | Lokale Entwicklung |
| `npm run build` | Production Build |
| `npm run generate` | Alle 318 Bars via Anthropic API generieren |
| `node scripts/add-images.mjs` | Bild-Manifest nach Nano Banana Update |
| `node scripts/export-buffer.mjs` | Buffer CSV neu exportieren |

---

## 🎨 Design

Die Website nutzt ein **dunkles, editoriales Magazin-Aesthetic**:
- **Schriften:** Playfair Display (Display), DM Mono (Monospace), DM Sans (Body)
- **Farben:** Tiefes Schwarz + warme Bernstein/Gold-Akzente
- **Stil:** High-end Bar Guide trifft Underground-Zine

---

*MyW – Meine Lieblingsbars · 318 Bars · Eine Welt*
