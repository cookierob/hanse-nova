# Hanse Item Creator

Generiert Waren-Icons und Item-Grafiken fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Alle Prompts muessen enthalten: "Do NOT include any text or labels"
- Item-Namen werden im UI-Layer hinzugefuegt

**Model**: Gemini 2.5-flash-image (schnell, guenstig fuer Icons)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle item icon fuer [ware]"
- "generiere waren grafik"
- "handelsgut icon"
- "inventar symbol"

## Waren-Katalog

### Massengut (Bulk Goods)
```yaml
salz:
  icon_description: "Weisser Kristallhaufen in Holzschale"
  primary_color: "#e6e6fa"
  secondary: "#d2b48c"

getreide:
  icon_description: "Goldene Aehren im Jutesack"
  primary_color: "#f4d03f"
  secondary: "#8b5a2b"

holz:
  icon_description: "Gestapelte Bretter oder Baumstaemme"
  primary_color: "#8b5a2b"
  secondary: "#6b4423"

erz:
  icon_description: "Dunkle Brocken im geflochtenen Korb"
  primary_color: "#3d3d3d"
  secondary: "#5a5a5a"
```

### Nahrungsmittel (Food)
```yaml
fisch:
  icon_description: "Getrockneter Stockfisch (haengend oder liegend)"
  primary_color: "#87ceeb"
  secondary: "#c4a35a"

bier:
  icon_description: "Holzfass mit Schaum oben"
  primary_color: "#c9a227"
  secondary: "#6b4423"

honig:
  icon_description: "Goldener Tontopf mit Deckel"
  primary_color: "#ffd700"
  secondary: "#a0522d"
```

### Rohstoffe (Raw Materials)
```yaml
wolle:
  icon_description: "Flauschiger weisser Ballen"
  primary_color: "#f5f5dc"
  secondary: "#d2b48c"

pelze:
  icon_description: "Braune Tierfelle uebereinander"
  primary_color: "#6b4423"
  secondary: "#4a2c17"

wachs:
  icon_description: "Gelbe Kerzen oder Wachsbloecke"
  primary_color: "#fff1a8"
  secondary: "#e8c547"

bernstein:
  icon_description: "Orangefarbene transluzente Klumpen"
  primary_color: "#ff8c00"
  secondary: "#c9a227"
```

### Fertigwaren (Manufactured)
```yaml
tuch:
  icon_description: "Gefaltete bunte Stoffballen"
  primary_color: "#8b0000"
  secondary: "#4a2c17"

wein:
  icon_description: "Elegante Amphore oder Weinfass"
  primary_color: "#722f37"
  secondary: "#3d3d3d"

waffen:
  icon_description: "Gekreuzte Schwerter oder Axt"
  primary_color: "#5a5a5a"
  secondary: "#3d3d3d"

keramik:
  icon_description: "Bemalte Toepfe und Kruege"
  primary_color: "#a0522d"
  secondary: "#d2b48c"
```

### Luxusgueter (Luxury)
```yaml
gewuerze:
  icon_description: "Exotische Koerner in offener Schatulle"
  primary_color: "#8b4513"
  secondary: "#c9a227"

seide:
  icon_description: "Schimmernder gefalteter Stoff"
  primary_color: "#e6e6fa"
  secondary: "#87ceeb"

gold:
  icon_description: "Glaenzende Muenzen oder Barren"
  primary_color: "#ffd700"
  secondary: "#c9a227"
```

### Schmuggelware (Contraband)
```yaml
schmuggelware:
  icon_description: "Verhuellte Kiste mit Fragezeichen"
  primary_color: "#2f2f2f"
  secondary: "#5a5a5a"

gestohlenes:
  icon_description: "Aufgebrochene Truhe mit Inhalt"
  primary_color: "#8b0000"
  secondary: "#2f2f2f"
```

## Spezifikationen

```yaml
resolution: 32x32 pixels
style: "16-bit pixel art"
background: transparent
palette: "max 8 colors per icon from master palette"
```

## Workflow

1. **Ware identifizieren** aus der Anfrage
2. **Icon-Beschreibung laden** aus dem Katalog
3. **Farben bestimmen** (primaer und sekundaer)
4. **Prompt erstellen** fuer 32x32 Icon
5. **Nano Banana Pro aufrufen** zur Generierung

## Prompt-Template fuer Nano Banana Pro

```
Generate a 32x32 pixel art icon.
Style: 16-bit pixel art, clean pixels, no anti-aliasing

Subject: [WARE] - [ICON_BESCHREIBUNG]

Visual requirements:
- Clear silhouette recognizable at small size
- [BESCHREIBUNG_DETAILS]
- Medieval/Hanseatic aesthetic

Colors (limited palette):
- Primary: [PRIMAER_FARBE]
- Secondary: [SEKUNDAER_FARBE]
- Highlight: lighter variant of primary
- Shadow: darker variant of primary

Technical requirements:
- Transparent background
- 32x32 pixels exactly
- No anti-aliasing
- Maximum 8 colors
- Icon should fill ~80% of canvas
```

## Beispiel-Generierung

**Anfrage**: "Erstelle Icon fuer Bernstein"

**Generierter Prompt**:

```
Generate a 32x32 pixel art icon.
Style: 16-bit pixel art, clean pixels, no anti-aliasing

Subject: Amber (Bernstein) - Orange translucent lumps of fossilized resin

Visual requirements:
- 3-4 irregular amber pieces grouped together
- Visible internal glow/translucency effect via dithering
- Resting on small dark surface/shadow
- Medieval precious trade good aesthetic

Colors (limited palette):
- Primary: #ff8c00 (Orange amber)
- Secondary: #c9a227 (Golden tint)
- Highlight: #ffd700 (Bright spots)
- Shadow: #8b4513 (Dark amber)
- Background shadow: #2f2f2f

Technical requirements:
- Transparent background
- 32x32 pixels exactly
- No anti-aliasing
- Maximum 8 colors
- Amber pieces should fill center of canvas
```

## Datei-Organisation

```
assets/items/goods/
├── bulk/
│   ├── salz.png
│   ├── getreide.png
│   ├── holz.png
│   └── erz.png
├── food/
│   ├── fisch.png
│   ├── bier.png
│   └── honig.png
├── raw/
│   ├── wolle.png
│   ├── pelze.png
│   ├── wachs.png
│   └── bernstein.png
├── manufactured/
│   ├── tuch.png
│   ├── wein.png
│   ├── waffen.png
│   └── keramik.png
├── luxury/
│   ├── gewuerze.png
│   ├── seide.png
│   └── gold.png
└── contraband/
    ├── schmuggelware.png
    └── gestohlenes.png
```

## Batch-Generierung

Fuer Effizienz koennen alle Icons einer Kategorie zusammen generiert werden:

```
Batch: "Erstelle alle Luxusgut-Icons"
→ Generiert: gewuerze.png, seide.png, gold.png
→ Prueft Konsistenz zwischen Icons
```
