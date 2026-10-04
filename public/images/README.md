# public/images/

Hier kommen die von **Nano Banana** generierten Bar-Bilder hin.

## Dateinamen-Schema

```
<slug>.jpg
```

Beispiele:
- `wunderbar.jpg`
- `abbaubar.jpg`
- `ableitbar.jpg`

## Slugs

Alle Slugs findest du in `data/bars.json` im Feld `"slug"`.

Alle Image Prompts (für Nano Banana) findest du in:
```
social-media/image-prompts-for-nano-banana.txt
```

## Nach dem Hinzufügen der Bilder

```bash
node scripts/add-images.mjs
```

Dieser Script erstellt ein Manifest aller vorhandenen Bilder und zeigt
welche noch fehlen.
