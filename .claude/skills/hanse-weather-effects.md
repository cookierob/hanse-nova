# Hanse Weather Effects

Generiert Wetter-Overlays, Partikel-Sprites und Tageszeit-Effekte fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Wetter-Effekte enthalten niemals Text
- Reine visuelle Overlays und Partikel

**Model**: Gemini 2.5-flash-image (schnell fuer Effekte)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle wetter effekt [typ]"
- "generiere regen overlay"
- "schnee partikel"
- "tageszeit palette [zeit]"
- "nebel effekt"

## Wetter-Typen

### Regen (Rain)
```yaml
intensity_levels:
  light:
    particle_density: "niedrig"
    angle: "leicht diagonal (10-15 grad)"
    overlay_opacity: "20%"

  normal:
    particle_density: "mittel"
    angle: "diagonal (20-25 grad)"
    overlay_opacity: "30%"

  heavy:
    particle_density: "hoch"
    angle: "stark diagonal (30-40 grad)"
    overlay_opacity: "40%"

particles:
  shape: "kurze diagonale Linien (2-4 pixels)"
  color: "#87ceeb"  # Sky Blue, transparent
  speed: "schnell fallend"

overlay:
  color_shift: "leichte Verdunkelung, blaeulich"
  reflection: "Pfuetzen-Highlights auf Boden"
```

### Schnee (Snow)
```yaml
intensity_levels:
  light:
    particle_density: "niedrig"
    size: "1-2 pixels"

  normal:
    particle_density: "mittel"
    size: "1-3 pixels"

  blizzard:
    particle_density: "sehr hoch"
    size: "1-4 pixels"
    angle: "horizontal getrieben"

particles:
  shape: "runde Punkte, verschiedene Groessen"
  color: "#f5f5dc"  # Off-white
  speed: "langsam fallend, leicht schwebend"
  pattern: "zufaellig, nicht gleichmaessig"

overlay:
  color_shift: "Aufhellung, Kaelte-Toene (blaeulich)"
  accumulation: "weisse Schicht auf Oberflaechen"
```

### Nebel (Fog)
```yaml
intensity_levels:
  light:
    visibility: "80%"
    layers: 1

  medium:
    visibility: "50%"
    layers: 2

  thick:
    visibility: "20%"
    layers: 3

overlay:
  color: "#d2d2d2"  # Light gray
  opacity: "variabel 20-70%"
  pattern: "weiche Schleier, parallax-fähig"
  movement: "langsam treibend"
```

### Sturm (Storm)
```yaml
components:
  rain:
    intensity: "heavy"
    angle: "sehr diagonal (40-50 grad)"

  lightning:
    frequency: "zufaellig, 5-15 Sekunden"
    flash: "kurzer weisser Bildschirmblitz"
    bolt: "gezackte Linie optional"

  waves:
    height: "erhoeht"
    spray: "Gischt-Partikel"

overlay:
  color_shift: "stark verdunkelt, dramatisch"
  screen_shake: "optional, subtle"

colors:
  sky: "#0a1628"
  lightning: "#fff1a8"
  rain: "#4a90b5"
```

### Wind (ohne Niederschlag)
```yaml
visual_indicators:
  particles:
    - Blaetter
    - Staub
    - Stoffbanner bewegt

  environment:
    - Baeume gebogen
    - Segel gespannt
    - Wellenkraeuseln

intensity:
  light: "leichte Bewegung"
  strong: "deutliche Verformung"
  storm: "extreme Bewegung"
```

## Tageszeiten (Time of Day)

### Morgendaemmerung (Dawn)
```yaml
time: "05:00 - 07:00"
color_shift:
  primary: "#ff8c00"  # Orange
  secondary: "#ffc0cb"  # Rosa
  intensity: 0.2

sky_gradient:
  top: "#4a90b5"
  horizon: "#ff8c00"

shadows: "lang, nach Westen"
mood: "Hoffnung, Neuanfang"
```

### Tag (Day)
```yaml
time: "07:00 - 17:00"
color_shift: null  # Neutral, keine Verschiebung
intensity: 1.0

sky: "#87ceeb"

shadows: "kurz bis mittel"
mood: "Aktivitaet, Geschaeftigkeit"
```

### Sonnenuntergang (Dusk)
```yaml
time: "17:00 - 19:00"
color_shift:
  primary: "#ff4500"  # Orange-Rot
  secondary: "#c9a227"  # Gold
  intensity: 0.3

sky_gradient:
  top: "#4a2c17"
  horizon: "#ff4500"

shadows: "lang, nach Osten"
mood: "Abschluss, Melancholie"
```

### Nacht (Night)
```yaml
time: "19:00 - 05:00"
color_shift:
  primary: "#1a3a5c"  # Blau
  secondary: "#4a2c17"  # Violett-Braun
  intensity: 0.5

sky: "#0a1628"

lighting:
  sources: ["Mond", "Sterne", "Fackeln", "Fenster"]
  contrast: "hoch"

stars:
  enabled: true
  density: "mässig"
  twinkle: "subtle animation"

mood: "Ruhe, Gefahr, Geheimnis"
```

## Spezifikationen

```yaml
overlay_resolution: "tileable, min 64x64"
particle_sprites: "8x8 oder 16x16"
palette: "from master palette"
format: "PNG mit Transparenz"
```

## Workflow

1. **Effekt-Typ identifizieren** (Wetter oder Tageszeit)
2. **Intensitaet/Variante** bestimmen
3. **Komponenten auflisten** (Partikel, Overlay, etc.)
4. **Prompt erstellen** fuer jeden Bestandteil
5. **Nano Banana Pro aufrufen** zur Generierung

## Prompt-Templates fuer Nano Banana Pro

### Wetter-Partikel
```
Generate a tileable [SIZE] pixel art weather particle sprite sheet.
Style: 16-bit pixel art, clean pixels

Weather type: [WETTER_TYP]
Particles needed:
- [PARTIKEL_BESCHREIBUNG]
- Variations: [ANZAHL] different sizes/shapes

Colors:
- Primary: [PARTIKEL_FARBE]
- Transparency: yes

Layout: Sprite sheet with [ANZAHL] variations
Background: Transparent

Technical requirements:
- Each particle clearly separated
- Tileable pattern possible
- No anti-aliasing
```

### Wetter-Overlay
```
Generate a tileable [SIZE] pixel art weather overlay.
Style: 16-bit, atmospheric

Overlay type: [OVERLAY_TYP - fog/rain streaks/etc]
Opacity target: [OPACITY]%

Visual requirements:
- [BESCHREIBUNG des Overlays]
- Must tile seamlessly
- Suitable for parallax scrolling

Colors:
- Base: [HAUPTFARBE]
- Variation: subtle [VARIATION]

Technical requirements:
- Seamlessly tileable
- Semi-transparent
- [SIZE] pixels exactly
```

### Tageszeit-Palette
```
Generate a color palette visualization for time of day.
Style: Reference chart, pixel art

Time: [TAGESZEIT]
Purpose: Color grading reference for [TAGESZEIT]

Show:
- Sky gradient (top to horizon)
- Shadow color
- Highlight color
- Ambient light color
- Key mood colors

Format: Horizontal color swatches with labels
Size: 256x64 pixels
```

## Beispiel-Generierung

**Anfrage**: "Erstelle Sturm-Overlay mit Blitz"

**Generierter Prompt (Overlay)**:

```
Generate a tileable 128x128 pixel art storm overlay.
Style: 16-bit, dramatic atmospheric

Overlay type: Heavy storm - rain streaks with dramatic lighting

Visual requirements:
- Diagonal rain streaks (40-50 degree angle)
- Multiple layers of rain (foreground/background)
- Dark, ominous atmosphere
- Lightning bolt element (can be separate layer)
- Stormy sea spray hints

Colors:
- Rain: #4a90b5 with transparency
- Sky darkness: #0a1628
- Lightning: #fff1a8 (bright flash)

Technical requirements:
- Seamlessly tileable (rain portion)
- Lightning as optional separate element
- 128x128 pixels for base tile
- Semi-transparent rain (40-60% opacity)
```

**Generierter Prompt (Blitz)**:

```
Generate a 64x128 pixel art lightning bolt sprite.
Style: 16-bit, dramatic

Lightning bolt:
- Jagged, branching pattern
- Main bolt with 2-3 smaller branches
- Bright core, fading edges

Colors:
- Core: #ffffff (pure white)
- Inner glow: #fff1a8
- Outer glow: #ffd700
- Background: transparent

Technical requirements:
- Transparent background
- Can be rotated/flipped for variety
- 64x128 pixels
```

## Datei-Organisation

```
assets/effects/
├── weather/
│   ├── rain/
│   │   ├── particles_light.png
│   │   ├── particles_heavy.png
│   │   ├── overlay_light.png
│   │   └── overlay_heavy.png
│   ├── snow/
│   │   ├── particles.png
│   │   ├── overlay.png
│   │   └── accumulation.png
│   ├── fog/
│   │   ├── layer_1.png
│   │   ├── layer_2.png
│   │   └── layer_3.png
│   ├── storm/
│   │   ├── rain_heavy.png
│   │   ├── lightning_bolt.png
│   │   └── overlay_dramatic.png
│   └── wind/
│       ├── leaves.png
│       └── dust.png
├── time_of_day/
│   ├── dawn_gradient.png
│   ├── dusk_gradient.png
│   └── night_overlay.png
└── particles/
    ├── stars.png
    ├── fireflies.png
    └── embers.png
```

## Animations-Hinweise

Fuer animierte Wetter-Effekte:

```yaml
rain_animation:
  method: "scroll overlay diagonally"
  speed: "60-120 pixels/second"
  layers: "2+ for parallax"

snow_animation:
  method: "particle system or sprite scroll"
  speed: "20-40 pixels/second"
  wobble: "slight horizontal drift"

fog_animation:
  method: "slow horizontal scroll"
  speed: "5-10 pixels/second"
  layers: "move at different speeds"

lightning:
  method: "flash overlay + bolt sprite"
  duration: "100-200ms flash"
  frequency: "random 5-15 seconds"
```
