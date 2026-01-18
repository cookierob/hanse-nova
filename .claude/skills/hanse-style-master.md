# Hanse Style Master

Zentrale Konsistenz-Kontrolle und Style-Guide-Verwaltung fuer alle Hanse Nova Assets.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**

Gemini kann keine lesbaren Texte generieren. Alle Prompts muessen enthalten:
- "Do NOT include any text, letters, words, or inscriptions"
- Texte werden programmatisch im Spiel hinzugefuegt (UI-Layer)

Model-Empfehlung:
- **Gemini 2.5-flash-image**: Schnell, guenstig, fuer einfache Assets
- **Gemini 3-pro-image-preview**: Detaillierter, fuer komplexe Szenen

## Trigger

Dieser Skill sollte verwendet werden bei:
- Style-Entscheidungen fuer neue Asset-Typen
- Konsistenz-Checks ueber mehrere Assets
- Batch-Koordination zusammengehoeriger Grafiken
- Fragen zur visuellen Identitaet

## Globaler Style Guide

### Pixel Art Spezifikationen

```yaml
style:
  type: "16-bit pixel art"
  anti_aliasing: false
  dithering: "ordered (2x2 Bayer)"

resolutions:
  icons: 32x32
  characters: 64x64
  ships: 128x64
  cities: 256x192
  events: 320x180
```

### Master-Farbpalette (32 Farben)

```
WASSER/HIMMEL:
#0a1628  Deep Sea Night
#1a3a5c  Baltic Blue
#2d5a87  Ocean Day
#4a90b5  Coastal Light
#87ceeb  Sky Blue

HOLZ/SCHIFFE:
#2d1810  Dark Oak
#4a2c17  Ship Hull
#6b4423  Deck Wood
#8b5a2b  Light Timber
#c4a35a  Rope/Canvas

HANDEL/GOLD:
#8b6914  Old Gold
#c9a227  Coin Gold
#e8c547  Bright Gold
#fff1a8  Gold Highlight

STEIN/ZIEGEL:
#3d3d3d  Dark Stone
#5a5a5a  Castle Gray
#8b4513  Brick Red
#a0522d  Roof Tile
#d2b48c  Sandstone

NATUR:
#1a3d1a  Dark Forest
#2d5a2d  Pine Green
#4a8b4a  Grass
#7ab87a  Light Foliage

AKZENT/UI:
#8b0000  Danger Red
#006400  Success Green
#ffd700  Warning Gold
#e6e6fa  Ice/Snow
#2f2f2f  UI Dark
#f5f5dc  UI Light
```

## Workflow

### Bei Style-Entscheidungen

1. **Analysiere** den Kontext (welches Asset, welche Stadt, welche Stimmung)
2. **Referenziere** existierende Assets fuer Konsistenz
3. **Definiere** spezifische Constraints fuer den Prompt
4. **Delegiere** an den spezialisierten Skill (city-artist, ship-designer, etc.)

### Bei Konsistenz-Checks

1. **Vergleiche** das neue Asset mit existierenden
2. **Pruefe** Farbpalette, Aufloesung, Stil
3. **Identifiziere** Abweichungen
4. **Empfehle** Anpassungen oder Regeneration

## Delegation an Nano Banana Pro

Wenn ein Asset generiert werden soll:

1. Erstelle einen optimierten Prompt basierend auf dem Style Guide
2. Rufe den **nano-banana-pro** Skill auf mit:
   - Dem vorbereiteten Prompt
   - Der korrekten Aufloesung
   - Optionalen Style-Referenzen

```
Beispiel-Delegation:
"Nutze nano-banana-pro um folgendes zu generieren:
- Aufloesung: 256x192
- Prompt: [optimierter Prompt]
- Style: 16-bit pixel art, 32 colors, no anti-aliasing"
```

## Konsistenz-Regeln

1. **Gleiche Stadt** = Gleiche Farbakzente und Architektur-Elemente
2. **Gleicher Schiffstyp** = Identische Proportionen und Details
3. **Gleicher NPC** = Konsistente Gesichtszuege und Kleidung
4. **Gleiche Ware** = Einheitliche Icon-Darstellung
