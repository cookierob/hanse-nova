# Hanse UI Generator

Generiert UI-Elemente und Interface-Grafiken fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Alle Prompts muessen enthalten: "Do NOT include any text or letters"
- Button-Texte, Labels etc. werden programmatisch hinzugefuegt
- Nur Symbole und Icons generieren

**Model**: Gemini 2.5-flash-image (schnell fuer UI-Elemente)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle ui element [typ]"
- "generiere button [name]"
- "ui panel design"
- "interface grafik"
- "icon fuer [funktion]"

## UI Theme

### Grundlegendes Design-Konzept
```yaml
theme: "Mittelalterliches Pergament und Holz"
era: "Hansezeit 1350-1450"
feel: "Handgefertigt, wertig, historisch"
```

### Panel-Design
```yaml
panels:
  background:
    texture: "Pergament/Papier"
    color: "#f5f5dc"
    noise: "subtle, aged paper feel"

  border:
    style: "Holzrahmen"
    color: "#4a2c17"
    width: "3-4 pixels"
    corners: "leicht ornamentiert"

  shadow:
    type: "drop shadow"
    color: "#2f2f2f"
    offset: "2-3 pixels"
    opacity: "30-40%"
```

### Button-Styles
```yaml
buttons:
  default:
    background: "#6b4423"
    border: "#2d1810"
    text: "#f5f5dc"
    texture: "wood grain subtle"

  hover:
    background: "#8b5a2b"
    border: "#4a2c17"
    effect: "slight glow"

  pressed:
    background: "#4a2c17"
    border: "#2d1810"
    effect: "inset shadow"

  disabled:
    background: "#5a5a5a"
    text: "#8b8b8b"
    effect: "none"

  danger:
    background: "#8b0000"
    border: "#4a0000"

  success:
    background: "#006400"
    border: "#003200"
```

## UI Element-Typen

### Navigation Icons (24x24)
```yaml
icons:
  compass:
    description: "Mittelalterlicher Kompass"
    usage: "Karte/Navigation"

  anchor:
    description: "Schiffsanker"
    usage: "Hafen/Anlegen"

  map:
    description: "Gerollte Karte"
    usage: "Weltkarte oeffnen"

  ship_wheel:
    description: "Steuerrad"
    usage: "Schiffssteuerung"

  chest:
    description: "Schatztruhe"
    usage: "Inventar"

  coins:
    description: "Muenzstapel"
    usage: "Finanzen/Handel"

  scroll:
    description: "Papierrolle"
    usage: "Logbuch/Nachrichten"

  flag:
    description: "Wehende Flagge"
    usage: "Fraktionen"
```

### Status Icons (16x16)
```yaml
status_icons:
  heart:
    description: "Herz"
    usage: "Gesundheit/Moral"
    colors: ["#8b0000", "#ff4500"]

  shield:
    description: "Schild"
    usage: "Verteidigung/Schutz"
    colors: ["#5a5a5a", "#8b8b8b"]

  sword:
    description: "Schwert"
    usage: "Kampf/Angriff"
    colors: ["#5a5a5a", "#c9a227"]

  star:
    description: "Stern"
    usage: "Reputation/Rang"
    colors: ["#ffd700", "#c9a227"]

  clock:
    description: "Sanduhr"
    usage: "Zeit/Warten"
    colors: ["#c4a35a", "#8b5a2b"]

  weather_sun:
    description: "Sonne"
    usage: "Gutes Wetter"
    colors: ["#ffd700", "#ff8c00"]

  weather_storm:
    description: "Wolke mit Blitz"
    usage: "Sturm"
    colors: ["#5a5a5a", "#ffd700"]

  warning:
    description: "Ausrufezeichen"
    usage: "Warnung/Achtung"
    colors: ["#ffd700", "#8b0000"]
```

### Fraktions-Wappen (32x32)
```yaml
faction_icons:
  hanse:
    description: "Doppeladler oder Kogge"
    colors: ["#8b0000", "#c9a227"]
    background: "#f5f5dc"

  pirates:
    description: "Totenkopf mit Knochen"
    colors: ["#2f2f2f", "#f5f5dc"]
    background: "#2f2f2f"

  church:
    description: "Kreuz mit Strahlen"
    colors: ["#c9a227", "#f5f5dc"]
    background: "#4a2c17"

  nobility:
    description: "Krone oder Loewe"
    colors: ["#ffd700", "#8b0000"]
    background: "#4a2c17"
```

### Fenster-Elemente
```yaml
window_elements:
  title_bar:
    height: "16-20 pixels"
    background: "#4a2c17"
    text_color: "#f5f5dc"
    ornaments: "corner decorations"

  close_button:
    size: "12x12"
    symbol: "X"
    colors: ["#8b0000", "#f5f5dc"]

  scroll_bar:
    width: "8 pixels"
    track: "#d2b48c"
    thumb: "#6b4423"
    arrows: "medieval style"

  divider:
    style: "ornamental line"
    height: "3 pixels"
    color: "#4a2c17"
```

### Spezial-UI
```yaml
special_elements:
  health_bar:
    type: "segmented"
    segments: 10
    full_color: "#8b0000"
    empty_color: "#3d3d3d"
    border: "#2d1810"

  gold_counter:
    icon: "coin"
    font_style: "medieval numerals"
    color: "#c9a227"

  cargo_slot:
    size: "40x40"
    background: "#d2b48c"
    border: "#6b4423"
    empty_indicator: "subtle grid"

  tooltip_frame:
    background: "#f5f5dc"
    border: "#4a2c17"
    arrow: "pointing direction"
```

## Spezifikationen

```yaml
resolutions:
  small_icons: 16x16
  medium_icons: 24x24
  large_icons: 32x32
  buttons: "variable width, 24-32px height"
  panels: "variable, 9-slice ready"

style: "16-bit pixel art"
palette: "from master palette"
```

## Workflow

1. **Element-Typ identifizieren** (Icon, Button, Panel, etc.)
2. **Groesse und Verwendung** bestimmen
3. **Style-Variante** waehlen (default, hover, etc.)
4. **Prompt erstellen** mit allen Details
5. **Nano Banana Pro aufrufen** zur Generierung

## Prompt-Template fuer Nano Banana Pro

### Fuer Icons
```
Generate a [SIZE] pixel art UI icon.
Style: 16-bit pixel art, clean pixels, no anti-aliasing

Subject: [ICON_BESCHREIBUNG]
Usage: [VERWENDUNGSZWECK]
Theme: Medieval Hanseatic, handcrafted feel

Visual requirements:
- Clear silhouette at small size
- [SPEZIFISCHE_DETAILS]
- Must be recognizable instantly

Colors:
- Primary: [HAUPTFARBE]
- Secondary: [SEKUNDAERFARBE]
- Outline: #2d1810 (1px)

IMPORTANT: Do NOT include any text, letters, or labels.
Icons should be purely symbolic - text added programmatically.

Technical requirements:
- Transparent background
- [SIZE] pixels exactly
- Pixel-perfect edges
- No anti-aliasing
```

### Fuer Buttons
```
Generate a pixel art UI button.
Style: 16-bit pixel art, medieval theme

Button type: [TYP - default/danger/success]
State: [ZUSTAND - normal/hover/pressed/disabled]
Size: [BREITE]x[HOEHE] pixels

Visual requirements:
- Wood/parchment texture feel
- Subtle border (2-3px)
- [ZUSAETZLICHE_DETAILS]

Colors:
- Background: [HINTERGRUND]
- Border: [RAHMEN]
- Highlight: [HIGHLIGHT fuer 3D-Effekt]

Technical requirements:
- Tileable for variable width (9-slice)
- Clear pressed/unpressed states
- No anti-aliasing
```

## Beispiel-Generierung

**Anfrage**: "Erstelle Inventar-Icon (Schatztruhe)"

**Generierter Prompt**:

```
Generate a 24x24 pixel art UI icon.
Style: 16-bit pixel art, clean pixels, no anti-aliasing

Subject: Treasure chest - wooden chest with metal bands
Usage: Inventory/cargo access button
Theme: Medieval Hanseatic, handcrafted feel

Visual requirements:
- Wooden chest with rounded lid
- Metal bands/hinges visible (2-3)
- Slight highlight suggesting treasure inside
- Must be recognizable instantly as "inventory"

Colors:
- Primary: #6b4423 (wood)
- Secondary: #c9a227 (metal/gold)
- Dark: #2d1810 (shadows)
- Outline: #2d1810 (1px)

Technical requirements:
- Transparent background
- 24x24 pixels exactly
- Pixel-perfect edges
- No anti-aliasing
```

## Datei-Organisation

```
assets/ui/
├── icons/
│   ├── navigation/
│   │   ├── compass.png
│   │   ├── anchor.png
│   │   ├── map.png
│   │   └── ship_wheel.png
│   ├── status/
│   │   ├── heart.png
│   │   ├── shield.png
│   │   └── warning.png
│   └── faction/
│       ├── hanse.png
│       ├── pirates.png
│       ├── church.png
│       └── nobility.png
├── buttons/
│   ├── default/
│   │   ├── normal.png
│   │   ├── hover.png
│   │   └── pressed.png
│   ├── danger/
│   └── success/
├── panels/
│   ├── main_panel.9.png
│   ├── tooltip.9.png
│   └── dialog.9.png
└── elements/
    ├── scrollbar.png
    ├── divider.png
    └── close_button.png
```

## 9-Slice Ready Assets

Fuer skalierbare Panels, generiere:
```
Panel-Struktur (9-slice):
┌───┬───────┬───┐
│ 1 │   2   │ 3 │  <- Ecken (1,3,7,9) bleiben fix
├───┼───────┼───┤  <- Kanten (2,4,6,8) werden gestreckt
│ 4 │   5   │ 6 │  <- Mitte (5) wird gekachelt/gestreckt
├───┼───────┼───┤
│ 7 │   8   │ 9 │
└───┴───────┴───┘
```
