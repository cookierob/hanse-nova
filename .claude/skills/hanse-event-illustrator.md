# Hanse Event Illustrator

Generiert Event-Illustrationen und Szenen-Bilder fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Alle Prompts muessen enthalten: "Do NOT include any text, dialogue, or inscriptions"
- Event-Texte und Dialoge werden im UI-Layer hinzugefuegt

**Model**: Gemini 3-pro-image-preview (fuer detaillierte Szenen)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle event bild fuer [event]"
- "generiere szene [beschreibung]"
- "event illustration [typ]"
- "stimmungsbild [situation]"

## Event-Kategorien

### See-Events (Sea Events)

#### Sturm (Storm)
```yaml
elements:
  - Dunkle, bedrohliche Wolken
  - Hohe Wellen, Gischt
  - Schiff in Not, schraeg
  - Blitze am Himmel
  - Peitschender Regen

mood: "Dramatisch, gefaehrlich, ueberwaeltigend"
lighting: "Blitze erhellen die Szene, sonst dunkel"
colors:
  primary: "#0a1628"  # Deep Sea Night
  accent: "#ffd700"   # Lightning
  water: "#1a3a5c"    # Baltic Blue dark
```

#### Piraten (Pirates)
```yaml
elements:
  - Piratenschiff naehert sich
  - Schwarze Flagge (Totenkopf oder Vitalienbrueder)
  - Bewaffnete Piraten an Deck
  - Spielerschiff in Gefahr
  - Moeglicher Kampf

mood: "Bedrohlich, actionreich, spannend"
lighting: "Nebel oder Daemmerung"
colors:
  ships: "#4a2c17"
  flag: "#2f2f2f"
  accent: "#8b0000"  # Danger
```

#### Entdeckung (Discovery)
```yaml
elements:
  - Treibgut im Wasser
  - Mysterioeser Fund (Kiste, Wrack, Flaschenpost)
  - Neugierige Crew am Gelaender
  - Ruhige See

mood: "Neugierig, geheimnisvoll, hoffnungsvoll"
lighting: "Morgendaemmerung, goldenes Licht"
colors:
  water: "#4a90b5"
  sky: "#87ceeb"
  discovery: "#c9a227"
```

#### Seemonster (Sea Monster)
```yaml
elements:
  - Tentakel oder Finne aus dem Wasser
  - Panische Crew
  - Aufgewuehltes Wasser
  - Schiff weicht aus

mood: "Schrecken, Mythos, Gefahr"
lighting: "Trueb, neblig"
colors:
  creature: "#1a3d1a"
  water: "#1a3a5c"
  ship: "#4a2c17"
```

### Stadt-Events (City Events)

#### Markt (Market)
```yaml
elements:
  - Belebter Marktplatz
  - Haendlerstaende mit Waren
  - Diverse NPCs (Kaeufer, Verkaeufer)
  - Stadtarchitektur im Hintergrund
  - Warenstapel, Faesser, Saecke

mood: "Geschaeftig, bunt, lebendig"
lighting: "Helles Tageslicht"
colors:
  goods: diverse
  buildings: stadtspezifisch
  crowd: gemischt
```

#### Taverne (Tavern)
```yaml
elements:
  - Innenraum, Holzbalken
  - Offenes Feuer oder Kamin
  - Gaeste an Tischen
  - Bierkruege, Essen
  - Wirt hinter Tresen

mood_variants:
  friendly: "Warm, gesellig, einladend"
  dangerous: "Dunkel, Spannung, versteckte Waffen"
  secretive: "Schattige Ecken, Fluestergespraeche"

lighting: "Kerzenlicht, Feuerschein, warm"
colors:
  wood: "#6b4423"
  fire: "#ff8c00"
  shadow: "#2d1810"
```

#### Gilde (Guild Hall)
```yaml
elements:
  - Prunkvoller Saal
  - Lange Tische mit Kaufleuten
  - Wappen und Banner
  - Verhandlung im Gange
  - Dokumente, Siegel

mood: "Foermlich, bedeutsam, maechttig"
lighting: "Fenster-Tageslicht, Kerzenhalter"
colors:
  wood: "#8b5a2b"
  fabric: "#8b0000"
  gold: "#c9a227"
```

#### Kirche (Church)
```yaml
elements:
  - Gotischer Innenraum
  - Hohe Fenster, Lichtstrahlen
  - Altar, Kerzen
  - Geistliche in Roben
  - Betende Figuren

mood: "Feierlich, mystisch, ehrfuerchtig"
lighting: "Lichtstrahlen durch Fenster"
colors:
  stone: "#5a5a5a"
  light: "#fff1a8"
  robes: "#2f2f2f"
```

### Fraktions-Events

#### Hanse-Rat (Hanse Council)
```yaml
elements:
  - Grosser Ratssaal (Luebeck?)
  - Delegierte an Tischen
  - Hanse-Wappen prominent
  - Offizielle Atmosphaere
  - Stadtvertreter erkennbar

mood: "Offiziell, maechttig, politisch"
colors:
  dominant: "#8b0000"  # Hanse Red
  accent: "#c9a227"    # Gold
```

#### Piratenversteck (Pirate Hideout)
```yaml
elements:
  - Hoehle oder versteckter Hafen
  - Beutekisten, Gold
  - Piraten bei der Teilung
  - Schiffe im Hintergrund
  - Fackeln, Lagerfeuer

mood: "Gesetzlos, gefaehrlich, verboten"
colors:
  cave: "#2f2f2f"
  fire: "#ff8c00"
  gold: "#ffd700"
```

#### Kirchenzeremonie (Church Ceremony)
```yaml
elements:
  - Kathedrale, gross
  - Viele Kerzen
  - Prozession oder Messe
  - Bischof in Ornaten
  - Weihrauch-Nebel

mood: "Feierlich, heilig, beeindruckend"
colors:
  gold: "#c9a227"
  white: "#f5f5dc"
  purple: "#4a2c17"
```

#### Adelshof (Noble Court)
```yaml
elements:
  - Thronsaal oder Audienzzimmer
  - Adelige in Prachtkleidung
  - Wachen in Ruestung
  - Wappen, Banner
  - Intrigante Blicke

mood: "Praechtig, intrigant, gefaehrlich"
colors:
  rich_fabrics: "#8b0000", "#4a2c17"
  gold: "#ffd700"
  armor: "#5a5a5a"
```

## Spezifikationen

```yaml
resolution: 320x180 pixels  # 16:9 aspect ratio
style: "16-bit pixel art"
palette: "32 colors from master palette"
```

## Workflow

1. **Event-Typ identifizieren** (See/Stadt/Fraktion)
2. **Spezifisches Event waehlen** aus Katalog
3. **Variante/Stimmung bestimmen**
4. **Alle Elemente sammeln** fuer den Prompt
5. **Nano Banana Pro aufrufen** zur Generierung

## Prompt-Template fuer Nano Banana Pro

```
Generate a 320x180 pixel art event illustration.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing

Scene: [EVENT_TYP] - [SPEZIFISCHE_SITUATION]
Setting: [ORT - See/Stadt/Innenraum]

Required elements:
- [ELEMENT_1]
- [ELEMENT_2]
- [ELEMENT_3]
- [ELEMENT_4]

Composition:
- [VORDERGRUND]
- [MITTELGRUND - Hauptaktion]
- [HINTERGRUND]

Lighting: [LICHTQUELLE und STIMMUNG]
Time: [TAGESZEIT]
Weather: [WETTER falls relevant]

Color palette emphasis:
- Primary: [HAUPTFARBE]
- Secondary: [SEKUNDAERFARBE]
- Accent: [AKZENTFARBE]

Mood: [STIMMUNG in 3-5 Worten]

IMPORTANT: Do NOT include any text, dialogue bubbles, signs, or inscriptions.
All storytelling through visuals only. Text added in UI layer.

Technical requirements:
- Cinematic 16:9 composition
- Clear focal point
- Wide panoramic format
- No anti-aliasing
```

## Beispiel-Generierung

**Anfrage**: "Erstelle Event-Bild fuer Piratenueberfall auf See"

**Generierter Prompt**:

```
Generate a 320x180 pixel art event illustration.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing

Scene: Sea Event - Pirate Attack
Setting: Open Baltic Sea, afternoon

Required elements:
- Player's merchant ship (Kogge) on right, defensive
- Pirate ship (Schnigge) approaching from left, aggressive
- Black pirate flag with skull visible
- Armed pirates visible on deck, some swinging ropes
- Crew on player ship preparing defense
- Cannons/crossbows aimed

Composition:
- Foreground: Waves, spray between ships
- Middle: Both ships, main action
- Background: Stormy sky, distant coastline

Lighting: Dramatic afternoon light breaking through clouds
Time: Late afternoon
Weather: Overcast, wind visible in sails

Color palette emphasis:
- Primary: #1a3a5c (Baltic Blue) for sea
- Secondary: #4a2c17 (Ship Hull) for vessels
- Accent: #8b0000 (Danger Red) for pirate flag, blood

Mood: Tense, dangerous, action-about-to-happen

Technical requirements:
- Cinematic composition, ships at angles
- Clear focal point on approaching pirates
- 320x180 pixels exactly
- No anti-aliasing
```

## Datei-Organisation

```
assets/events/
├── sea/
│   ├── storm_01.png
│   ├── storm_02.png
│   ├── pirates_attack.png
│   ├── pirates_negotiate.png
│   ├── discovery_flotsam.png
│   ├── discovery_survivor.png
│   └── sea_monster.png
├── city/
│   ├── market_busy.png
│   ├── tavern_friendly.png
│   ├── tavern_dangerous.png
│   ├── guild_meeting.png
│   └── church_ceremony.png
└── faction/
    ├── hanse_council.png
    ├── pirate_hideout.png
    ├── church_blessing.png
    └── noble_audience.png
```
