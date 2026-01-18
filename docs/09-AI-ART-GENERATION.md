# 09 - AI Art Generation System

## Übersicht

Alle grafischen Elemente werden vollständig KI-generiert. Das System nutzt spezialisierte Skills, die mit Anthropic-Modellen (Claude) für Prompt-Engineering und Orchestrierung arbeiten, während die eigentliche Bildgenerierung über **Nano Banana Pro / Gemini** erfolgt.

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [User Request] ──► [Skill (Anthropic)] ──► [Nano Banana Pro]  │
│                           │                        │            │
│                     Prompt-Engineering      Bildgenerierung     │
│                     Konsistenz-Prüfung      via Gemini          │
│                     Orchestrierung                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## KRITISCHE REGEL: Kein Text in Bildern

**Gemini kann keine lesbaren Texte generieren!**

Alle Prompts MÜSSEN enthalten:
```
IMPORTANT: Do NOT include any text, letters, words, or inscriptions in the image.
```

**Grund:** Gemini (alle Versionen) erzeugt unlesbaren/falschen Text.

**Lösung:** Texte werden programmatisch im Spiel hinzugefügt:
- UI-Labels → React/CSS
- Stadtnahmen → Overlay-Layer
- NPC-Namen → Dialog-System
- Item-Namen → Tooltip-System

### Model-Empfehlungen

| Model | Verwendung | Kosten |
|-------|------------|--------|
| gemini-2.5-flash-image | Icons, Sprites, UI, Effekte | Günstig |
| gemini-3-pro-image-preview | Stadtpanoramen, Events, Portraits | Teurer, detaillierter |

---

## Architektur-Prinzipien

### Skill-Schicht (Anthropic Claude)
- **Prompt Engineering**: Optimierte Prompts für konsistente Ergebnisse
- **Style Guide Enforcement**: Einhaltung des definierten Pixel-Art-Stils
- **Batch-Koordination**: Verwaltung zusammengehöriger Assets
- **Qualitätskontrolle**: Überprüfung auf Konsistenz

### Bildgenerierung (Nano Banana Pro / Gemini)
- **Eigentliche Bildgenerierung**: Alle Pixel werden von Gemini erzeugt
- **Kosteneffizient**: Optimale Nutzung der API
- **Batch-Verarbeitung**: Mehrere Assets in einem Durchlauf

---

## Globaler Style Guide

### Pixel Art Spezifikationen

```yaml
style:
  type: "16-bit pixel art"
  resolution_base: 32x32  # für Icons/Items
  resolution_characters: 64x64
  resolution_ships: 128x64
  resolution_cities: 256x192
  resolution_events: 320x180

colors:
  palette_size: 32
  anti_aliasing: false
  dithering: "ordered (2x2 Bayer)"

aesthetic:
  era: "Medieval Hanseatic (1350-1450)"
  mood: "Atmospheric, slightly melancholic"
  lighting: "Soft, natural light with warm tones"
  weather_influence: true
```

### Master-Farbpalette (32 Farben)

```
PRIMÄR (Wasser/Himmel):
#0a1628  Deep Sea Night
#1a3a5c  Baltic Blue
#2d5a87  Ocean Day
#4a90b5  Coastal Light
#87ceeb  Sky Blue

SEKUNDÄR (Holz/Schiffe):
#2d1810  Dark Oak
#4a2c17  Ship Hull
#6b4423  Deck Wood
#8b5a2b  Light Timber
#c4a35a  Rope/Canvas

AKZENT (Handel/Gold):
#8b6914  Old Gold
#c9a227  Coin Gold
#e8c547  Bright Gold
#fff1a8  Gold Highlight

STÄDTE (Stein/Ziegel):
#3d3d3d  Dark Stone
#5a5a5a  Castle Gray
#8b4513  Brick Red
#a0522d  Roof Tile
#d2b48c  Sandstone

NATUR (Vegetation):
#1a3d1a  Dark Forest
#2d5a2d  Pine Green
#4a8b4a  Grass
#7ab87a  Light Foliage

AKZENT (UI/Highlights):
#8b0000  Danger Red
#006400  Success Green
#ffd700  Warning Gold
#e6e6fa  Ice/Snow
#2f2f2f  UI Dark
#f5f5dc  UI Light
```

---

## Spezialisierte Skills

### 1. hanse-style-master (Orchestrator)

**Zweck**: Zentrale Konsistenz-Kontrolle und Style-Guide-Verwaltung

**Anthropic Model**: Opus (für komplexe Style-Entscheidungen)

**Verantwortlichkeiten**:
- Verwaltung des globalen Style Guides
- Konsistenz-Checks für alle generierten Assets
- Batch-Koordination bei zusammengehörigen Assets
- Feedback-Loop bei Style-Abweichungen

```typescript
// Skill-Konfiguration
const hanseStyleMaster = {
  name: "hanse-style-master",
  model: "opus",
  role: "orchestrator",

  capabilities: [
    "style-guide-management",
    "consistency-validation",
    "batch-coordination",
    "prompt-refinement"
  ],

  // Generiert optimierte Prompts für Nano Banana Pro
  generatePrompt(assetType: string, context: AssetContext): string {
    // Fügt automatisch Style-Guide-Constraints hinzu
    return buildOptimizedPrompt(assetType, context, GLOBAL_STYLE_GUIDE);
  }
};
```

---

### 2. hanse-city-artist

**Zweck**: Generierung aller Stadt-Grafiken und Stadtansichten

**Anthropic Model**: Sonnet (für Prompt-Optimierung)
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- Stadtpanoramen (256x192)
- Hafenansichten (256x128)
- Gebäude-Sprites (64x96)
- Marktplatz-Szenen (256x192)

#### Stadt-Identitäten

```yaml
cities:
  luebeck:
    identifier: "Königin der Hanse"
    key_elements:
      - Holstentor (markantes Doppeltor)
      - Backsteingotik
      - Sieben Türme
    color_accent: "#8b4513"  # Brick Red
    atmosphere: "Mächtig, wohlhabend, ordentlich"
    unique_props: ["Holstentor", "Marienkirche", "Salzspeicher"]

  hamburg:
    identifier: "Tor zur Welt"
    key_elements:
      - Große Hafenanlage
      - Speicherhäuser
      - Alsterfleet
    color_accent: "#4a2c17"  # Dark Timber
    atmosphere: "Geschäftig, weltoffen, neblig"
    unique_props: ["Nikolaikirche", "Speicherstadt", "Kräne"]

  rostock:
    identifier: "Perle der Ostsee"
    key_elements:
      - Kröpeliner Tor
      - Universitätsstadt
      - Warnowufer
    color_accent: "#a0522d"  # Roof Tile
    atmosphere: "Akademisch, aufstrebend"
    unique_props: ["Marienkirche", "Steintor", "Universität"]

  danzig:
    identifier: "Gold der Ostsee"
    key_elements:
      - Krantor
      - Lange Markt
      - Bernsteinhandel
    color_accent: "#c9a227"  # Coin Gold
    atmosphere: "Reich, prächtig, international"
    unique_props: ["Krantor", "Artushof", "Neptunbrunnen"]

  visby:
    identifier: "Stadt der Ruinen und Rosen"
    key_elements:
      - Stadtmauer (2km)
      - Kirchenruinen
      - Rosengärten
    color_accent: "#d2b48c"  # Sandstone
    atmosphere: "Nostalgisch, romantisch, windgepeitscht"
    unique_props: ["Ringmauer", "St. Karin", "Rosenblüten"]

  stockholm:
    identifier: "Venedig des Nordens"
    key_elements:
      - Insellage
      - Holzhäuser
      - Felsige Küste
    color_accent: "#6b4423"  # Deck Wood
    atmosphere: "Malerisch, kalt, stolz"
    unique_props: ["Gamla Stan", "Königspalast", "Schären"]

  riga:
    identifier: "Metropole des Ostens"
    key_elements:
      - Schwarzhäupterhaus
      - Düna-Fluss
      - Ordensburgen
    color_accent: "#5a5a5a"  # Castle Gray
    atmosphere: "Wehrhaft, mystisch, grenzland"
    unique_props: ["Domberg", "Schwarzhäupter", "Festung"]

  nowgorod:
    identifier: "Tor nach Russland"
    key_elements:
      - Kreml
      - Zwiebeltürme
      - Birkenwald
    color_accent: "#1a3d1a"  # Dark Forest
    atmosphere: "Fremd, kalt, geheimnisvoll"
    unique_props: ["Kreml", "Sophienkathedrale", "Handelskontor"]
```

#### Beispiel-Prompt für Nano Banana Pro

```
CITY PANORAMA - LÜBECK

Style: 16-bit pixel art, 256x192 pixels, 32-color palette
No anti-aliasing, ordered dithering allowed

Scene: Medieval Hanseatic city of Lübeck viewed from harbor
Time: Late afternoon, golden hour lighting

Required elements:
- Holstentor (iconic double gate) as central focus
- Seven church spires in background (Sieben Türme)
- Red brick Gothic architecture throughout
- Busy harbor with ships in foreground
- Merchant carts and traders

Color emphasis: Brick red (#8b4513), warm afternoon light
Mood: Prosperous, powerful, orderly

Technical: Clean pixel edges, no gradients, limited palette
```

---

### 3. hanse-ship-designer

**Zweck**: Generierung aller Schiffs-Sprites und Animationen

**Anthropic Model**: Sonnet (für technische Details)
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- Schiffs-Sprites (128x64, 4 Richtungen)
- Beschädigungs-Varianten (3 Stufen)
- Segel-Animationen (8 Frames)
- Detail-Ansichten für Upgrades

#### Schiffstypen

```yaml
ships:
  ewer:
    description: "Kleines Küstenfahrzeug"
    visual_traits:
      - Einzelmast mit Rahsegel
      - Flacher Rumpf
      - 15-20m Länge
      - Offenes Deck
    cargo_visual: "Fässer und Säcke sichtbar"
    crew_positions: [Steuermann, 2-3 Matrosen]

  kogge:
    description: "Das Arbeitstier der Hanse"
    visual_traits:
      - Hohe Bordwände
      - Quadratisches Rahsegel
      - Kastelle vorn und hinten
      - 20-30m Länge
    cargo_visual: "Geschlossener Laderaum"
    crew_positions: [Kapitän, Steuermann, 8-12 Matrosen]

  schnigge:
    description: "Schnelles Handelsschiff"
    visual_traits:
      - Schlanker Rumpf
      - Ein bis zwei Masten
      - Niedriges Profil
      - Ruder ergänzend
    cargo_visual: "Leichte Waren, Passagiere"
    crew_positions: [Navigator, 5-8 Matrosen]

  holk:
    description: "Schwerer Frachter"
    visual_traits:
      - Massiver Rumpf
      - Drei Masten möglich
      - Hohe Ladekapazität
      - 30-40m Länge
    cargo_visual: "Große Frachträume, Kräne"
    crew_positions: [Kapitän, Offiziere, 15-20 Matrosen]

  kraier:
    description: "Vielseitiges Handelsschiff"
    visual_traits:
      - Mittelgroß, wendig
      - Zwei Masten
      - Kombination aus Rah- und Lateinersegel
      - Gute Balance Größe/Geschwindigkeit
    cargo_visual: "Modularer Laderaum"
    crew_positions: [Kapitän, 10-12 Matrosen]
```

#### Animations-Frames

```
SHIP ANIMATION STATES:
├── Idle (Hafen): 4 frames, leichtes Schaukeln
├── Sailing (normal): 8 frames, Wellenbewegung
├── Sailing (Sturm): 8 frames, starkes Schaukeln
├── Damaged: Sprite-Varianten mit Löchern/Rissen
└── Sinking: 6 frames Animation
```

---

### 4. hanse-item-creator

**Zweck**: Generierung aller Waren-Icons und Item-Grafiken

**Anthropic Model**: Haiku (einfache Assets)
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- Waren-Icons (32x32)
- Inventar-Darstellungen
- Handels-Animationen

#### Waren-Kategorien

```yaml
goods_visuals:
  bulk_goods:
    salz:
      icon: "Weißer Kristallhaufen in Holzschale"
      color: "#e6e6fa"
    getreide:
      icon: "Goldene Ähren im Sack"
      color: "#f4d03f"
    holz:
      icon: "Gestapelte Bretter/Stämme"
      color: "#8b5a2b"
    erz:
      icon: "Dunkle Brocken im Korb"
      color: "#3d3d3d"

  food:
    fisch:
      icon: "Getrockneter Stockfisch"
      color: "#87ceeb"
    bier:
      icon: "Holzfass mit Schaum"
      color: "#c9a227"
    honig:
      icon: "Goldener Topf"
      color: "#ffd700"

  raw_materials:
    wolle:
      icon: "Flauschiger weißer Ballen"
      color: "#f5f5dc"
    pelze:
      icon: "Braune Tierfelle gestapelt"
      color: "#6b4423"
    wachs:
      icon: "Gelbe Kerzen/Blöcke"
      color: "#fff1a8"
    bernstein:
      icon: "Orangefarbene Klumpen"
      color: "#ff8c00"

  manufactured:
    tuch:
      icon: "Gefaltete bunte Stoffe"
      color: "#8b0000"
    wein:
      icon: "Elegante Amphore"
      color: "#722f37"
    waffen:
      icon: "Gekreuzte Schwerter"
      color: "#5a5a5a"
    keramik:
      icon: "Bemalte Töpfe"
      color: "#a0522d"

  luxury:
    gewuerze:
      icon: "Exotische Körner in Schatulle"
      color: "#8b4513"
    seide:
      icon: "Schimmernder Stoff"
      color: "#e6e6fa"
    gold:
      icon: "Glänzende Münzen/Barren"
      color: "#ffd700"

  contraband:
    schmuggelware:
      icon: "Verhüllte Kiste mit Fragezeichen"
      color: "#2f2f2f"
    gestohlenes:
      icon: "Aufgebrochene Truhe"
      color: "#8b0000"
```

---

### 5. hanse-character-artist

**Zweck**: Generierung aller Charakter-Portraits und NPCs

**Anthropic Model**: Sonnet (für Charakter-Details)
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- NPC-Portraits (64x64)
- Crew-Portraits (48x48)
- Fraktions-Vertreter (64x64)

#### Charakter-Archetypen

```yaml
characters:
  merchants:
    base_traits:
      - Wohlgenährt, selbstbewusst
      - Teure Kleidung (Pelzkragen, Samthut)
      - Siegelring, Geldbeutel sichtbar
    variations:
      - Jung/dynamisch vs. Alt/erfahren
      - Regional (deutsch, skandinavisch, russisch)

  sailors:
    base_traits:
      - Wettergegerbt, muskulös
      - Einfache Kleidung (Leinen, Wolle)
      - Narben, Tätowierungen möglich
    variations:
      - Matrose, Steuermann, Kapitän
      - Gesund vs. erschöpft

  nobles:
    base_traits:
      - Aufrechte Haltung
      - Prunkvolle Kleidung, Wappen
      - Arroganter Blick
    variations:
      - Ritter, Graf, Herzog
      - Regional (deutsch, dänisch, schwedisch)

  clergy:
    base_traits:
      - Kutten/Roben
      - Religiöse Symbole
      - Demütig oder mächtig
    variations:
      - Mönch, Priester, Bischof
      - Arm/bescheiden vs. Reich/korrupt

  pirates:
    base_traits:
      - Wild, gefährlich
      - Waffen sichtbar
      - Beutestücke, fremde Kleidung
    variations:
      - Kapitän (charismatisch)
      - Crew (brutal, vernarbt)
```

#### Wiederkehrende NPCs

```yaml
recurring_npcs:
  erik_der_rote:
    role: "Piratenkapitän (kann Feind oder Verbündeter sein)"
    visual:
      - Roter Bart, Augenklappe
      - Norwegische Kleidung
      - Axt am Gürtel
    expressions: [neutral, grinsend, wütend, verschwörerisch]

  bruder_johannes:
    role: "Wandernder Mönch mit Geheimnissen"
    visual:
      - Braune Kutte, Kapuze
      - Intelligente Augen
      - Mysteriöse Artefakte
    expressions: [freundlich, wissend, besorgt, verängstigt]

  helena_von_danzig:
    role: "Einflussreiche Händlerin"
    visual:
      - Elegante Kleidung, Schleier
      - Selbstbewusst, schön
      - Geschäftstüchtig
    expressions: [neutral, charmant, kühl, geschäftig]

  der_graue_wolf:
    role: "Mysteriöser Informant"
    visual:
      - Grauer Umhang, verborgen
      - Nur Augen sichtbar
      - Schatten-Ästhetik
    expressions: [neutral, warnend, verschwörerisch]
```

---

### 6. hanse-event-illustrator

**Zweck**: Generierung von Event-Illustrationen

**Anthropic Model**: Sonnet (für narrative Szenen)
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- Event-Szenen (320x180)
- Stimmungs-Bilder
- Entscheidungs-Illustrationen

#### Event-Kategorien

```yaml
event_scenes:
  sea_events:
    storm:
      elements: [Dunkle Wolken, hohe Wellen, Schiff in Not]
      mood: "Dramatisch, gefährlich"
      lighting: "Blitze, dunkler Himmel"

    pirates:
      elements: [Piratenschiff, schwarze Flagge, Kampf]
      mood: "Bedrohlich, actionreich"
      lighting: "Nebel oder Dämmerung"

    discovery:
      elements: [Treibgut, mysteriöser Fund, Schiff]
      mood: "Neugierig, geheimnisvoll"
      lighting: "Morgendämmerung"

  city_events:
    market:
      elements: [Marktstand, Händler, Waren]
      mood: "Geschäftig, bunt"
      lighting: "Tageslicht"

    tavern:
      elements: [Innenraum, Feuer, Trinker]
      mood: "Warm, gesellig oder gefährlich"
      lighting: "Kerzenlicht, Feuerschein"

    guild:
      elements: [Prunkvoller Saal, Kaufleute, Verhandlung]
      mood: "Förmlich, bedeutsam"
      lighting: "Fenster-Tageslicht"

  faction_events:
    hanse_council:
      elements: [Rathaus, Delegierte, Wappen]
      mood: "Offiziell, mächtig"

    pirate_hideout:
      elements: [Höhle, Beute, Piraten]
      mood: "Gesetzlos, gefährlich"

    church_ceremony:
      elements: [Kathedrale, Kerzen, Geistliche]
      mood: "Feierlich, mystisch"

    noble_court:
      elements: [Thronsaal, Adelige, Wachen]
      mood: "Prächtig, intrigant"
```

---

### 7. hanse-ui-generator

**Zweck**: Generierung aller UI-Elemente

**Anthropic Model**: Haiku (einfache UI-Elemente)
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- Buttons (verschiedene Größen)
- Fenster-Rahmen
- Icons (Navigation, Status)
- Hintergründe

#### UI Style Guide

```yaml
ui_style:
  theme: "Mittelalterliches Pergament/Holz"

  panels:
    background: "Pergament-Textur (#f5f5dc)"
    border: "Holzrahmen (#4a2c17)"
    shadow: "Leichter Schlagschatten"

  buttons:
    default:
      background: "#6b4423"
      border: "#2d1810"
      text: "#f5f5dc"
    hover:
      background: "#8b5a2b"
    pressed:
      background: "#4a2c17"
    disabled:
      background: "#5a5a5a"
      text: "#8b8b8b"

  icons:
    style: "16x16 oder 24x24 pixel"
    categories:
      - Navigation (Kompass, Anker, Karte)
      - Status (Herz, Münze, Schild)
      - Aktionen (Hand, Schwert, Buch)
      - Fraktionen (Wappen-Varianten)

  typography_hints:
    style: "Pixel font, medieval feel"
    headers: "Ornate, larger"
    body: "Clean, readable"
```

---

### 8. hanse-weather-effects

**Zweck**: Generierung von Wetter- und Umgebungseffekten

**Anthropic Model**: Haiku
**Bildgenerierung**: Nano Banana Pro / Gemini

**Assets**:
- Wetter-Overlays
- Partikel-Sprites
- Tageszeit-Paletten

```yaml
weather_effects:
  rain:
    particles: "Diagonale Linien, bläulich"
    overlay: "Leichte Verdunkelung, Reflexionen"

  snow:
    particles: "Weiße Punkte, langsam fallend"
    overlay: "Aufhellung, Kälte-Töne"

  fog:
    overlay: "Weiß-graue Schleier, Transparenz 40-70%"

  storm:
    particles: "Starker Regen + Blitze"
    overlay: "Dramatische Verdunkelung"
    screen_shake: true

time_of_day:
  dawn:
    color_shift: "Orange/Rosa Töne"
    intensity: 0.2
  day:
    color_shift: null
    intensity: 1.0
  dusk:
    color_shift: "Orange/Rot Töne"
    intensity: 0.3
  night:
    color_shift: "Blau/Violett Töne"
    intensity: 0.5
    stars: true
```

---

## Skill-Implementierung

### Basis-Struktur für alle Skills

Jeder Skill folgt diesem Pattern:

```typescript
// .claude/skills/hanse-[name].md

// 1. SKILL DEFINITION
// - Name, Beschreibung, Trigger-Phrasen
// - Anthropic Model für Orchestrierung

// 2. STYLE GUIDE IMPORT
// - Referenz auf globale Palette
// - Asset-spezifische Constraints

// 3. PROMPT TEMPLATES
// - Optimierte Prompts für Nano Banana Pro
// - Variablen für Kontext (Stadt, Schiff, etc.)

// 4. GENERATION WORKFLOW
// - Aufruf von Nano Banana Pro via Tool
// - Konsistenz-Checks
// - Output-Handling

// 5. QUALITY ASSURANCE
// - Validierung gegen Style Guide
// - Regeneration bei Abweichung
```

### Beispiel: hanse-item-creator Skill

```markdown
---
name: hanse-item-creator
description: Generiert Waren-Icons und Item-Grafiken für Hanse Nova
triggers:
  - "erstelle item icon für"
  - "generiere waren-icon"
  - "item grafik für"
model: haiku
---

## Aufgabe
Du generierst Pixel-Art-Icons für Handelswaren im Hanse Nova Spiel.

## Style Guide
- Format: 32x32 Pixel
- Palette: 32 Farben (siehe Master-Palette)
- Kein Anti-Aliasing
- Klare Silhouetten

## Workflow

1. **Input analysieren**: Welche Ware? Welche Variante?

2. **Prompt erstellen** für Nano Banana Pro:

```
Generate a 32x32 pixel art icon.
Style: 16-bit, clean pixels, no anti-aliasing
Subject: [WARE] - [BESCHREIBUNG]
Colors: Limited palette, emphasis on [HAUPTFARBE]
Background: Transparent
```

3. **Nano Banana Pro aufrufen**:
   - Nutze das nano-banana-pro Skill/Tool
   - Übergib den optimierten Prompt
   - Spezifiziere 32x32 Auflösung

4. **Output validieren**:
   - Korrekte Größe?
   - Palette eingehalten?
   - Silhouette erkennbar?

5. **Bei Bedarf regenerieren** mit angepasstem Prompt
```

---

## Konsistenz-Mechanismen

### 1. Seed-Management

```yaml
consistency:
  city_seeds:
    luebeck: "hanse-luebeck-v1"
    hamburg: "hanse-hamburg-v1"
    # ... etc

  ship_seeds:
    kogge: "hanse-ship-kogge-v1"
    # ... etc

  character_seeds:
    erik_der_rote: "hanse-npc-erik-v1"
    # ... etc
```

### 2. Reference Image System

Für maximale Konsistenz können bereits generierte Assets als Referenz verwendet werden:

```
GENERATION WITH REFERENCE:

1. Existierendes Asset laden (z.B. Lübeck-Panorama Tag)
2. Prompt erweitern: "Match the style of the reference image"
3. Variante generieren (z.B. Lübeck-Panorama Nacht)
```

### 3. Batch-Generierung

Zusammengehörige Assets sollten in einem Batch generiert werden:

```yaml
batch_example:
  name: "Lübeck Complete"
  assets:
    - luebeck_panorama_day
    - luebeck_panorama_night
    - luebeck_panorama_storm
    - luebeck_harbor
    - luebeck_market

  shared_elements:
    - Holstentor (immer sichtbar)
    - Sieben Türme (im Hintergrund)
    - Brick-Red Farbschema
```

---

## Datei-Organisation

```
hanse-nova/
├── assets/
│   ├── cities/
│   │   ├── luebeck/
│   │   │   ├── panorama_day.png
│   │   │   ├── panorama_night.png
│   │   │   ├── panorama_storm.png
│   │   │   ├── harbor.png
│   │   │   └── market.png
│   │   ├── hamburg/
│   │   └── .../
│   ├── ships/
│   │   ├── kogge/
│   │   │   ├── sprite_n.png
│   │   │   ├── sprite_e.png
│   │   │   ├── sprite_s.png
│   │   │   ├── sprite_w.png
│   │   │   ├── damaged_1.png
│   │   │   ├── damaged_2.png
│   │   │   └── damaged_3.png
│   │   └── .../
│   ├── items/
│   │   ├── goods/
│   │   │   ├── salz.png
│   │   │   ├── getreide.png
│   │   │   └── .../
│   │   └── equipment/
│   ├── characters/
│   │   ├── npcs/
│   │   │   ├── erik_der_rote/
│   │   │   │   ├── neutral.png
│   │   │   │   ├── angry.png
│   │   │   │   └── friendly.png
│   │   │   └── .../
│   │   └── crew/
│   ├── events/
│   │   ├── sea/
│   │   ├── city/
│   │   └── faction/
│   ├── ui/
│   │   ├── buttons/
│   │   ├── panels/
│   │   ├── icons/
│   │   └── backgrounds/
│   └── effects/
│       ├── weather/
│       └── particles/
│
├── .claude/
│   └── skills/
│       ├── hanse-style-master.md
│       ├── hanse-city-artist.md
│       ├── hanse-ship-designer.md
│       ├── hanse-item-creator.md
│       ├── hanse-character-artist.md
│       ├── hanse-event-illustrator.md
│       ├── hanse-ui-generator.md
│       └── hanse-weather-effects.md
```

---

## Generation Workflow

### Kompletter Ablauf für ein neues Asset

```
┌─────────────────────────────────────────────────────────────────┐
│                    ASSET GENERATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. USER REQUEST                                                │
│     "Erstelle das Stadtpanorama für Danzig"                    │
│                                                                 │
│  2. SKILL SELECTION (Anthropic)                                │
│     → hanse-city-artist wird aktiviert                         │
│                                                                 │
│  3. CONTEXT GATHERING (Anthropic/Sonnet)                       │
│     → Lädt Danzig-Spezifikationen aus Style Guide              │
│     → Prüft existierende Danzig-Assets für Konsistenz          │
│                                                                 │
│  4. PROMPT ENGINEERING (Anthropic/Sonnet)                      │
│     → Erstellt optimierten Prompt für Gemini                   │
│     → Inkludiert Style-Constraints                             │
│     → Fügt Danzig-spezifische Elemente hinzu                   │
│                                                                 │
│  5. IMAGE GENERATION (Nano Banana Pro / Gemini)                │
│     → Übergibt Prompt an Gemini                                │
│     → Erhält generiertes Bild                                  │
│                                                                 │
│  6. VALIDATION (Anthropic/Sonnet)                              │
│     → Prüft auf Style-Konformität                              │
│     → Prüft auf Danzig-spezifische Elemente                    │
│     → Bei Problemen: Zurück zu Schritt 4 mit Anpassungen       │
│                                                                 │
│  7. OUTPUT                                                      │
│     → Speichert als assets/cities/danzig/panorama_day.png      │
│     → Aktualisiert Asset-Registry                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Kostenoptimierung

### Model-Auswahl nach Komplexität

| Asset-Typ | Anthropic Model | Grund |
|-----------|-----------------|-------|
| UI Icons | Haiku | Einfach, viele Varianten |
| Item Icons | Haiku | Standardisiert |
| Weather Effects | Haiku | Einfache Muster |
| Ship Sprites | Sonnet | Technische Details |
| Character Portraits | Sonnet | Emotionen, Details |
| Event Scenes | Sonnet | Narrative Komplexität |
| City Panoramas | Sonnet | Viele Details, Konsistenz |
| Style Decisions | Opus | Komplexe Entscheidungen |

### Batch-Effizienz

```yaml
efficiency_tips:
  - Ähnliche Assets gruppieren (alle Schiffe zusammen)
  - Varianten in einem Durchlauf (Tag/Nacht/Sturm)
  - Templates wiederverwenden
  - Nur bei Bedarf Opus nutzen
```

---

## Nächste Schritte

1. **Skills implementieren**: Alle 8 Skills als .md Dateien erstellen
2. **Test-Generation**: Erste Assets für Lübeck und Kogge generieren
3. **Style-Validierung**: Konsistenz zwischen Assets prüfen
4. **Pipeline automatisieren**: Batch-Generation für alle Assets
