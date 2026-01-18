# Hanse Ship Designer

Generiert Schiffs-Sprites und maritime Assets fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Alle Prompts muessen enthalten: "Do NOT include any text, letters, or words"
- Keine Schiffsnamen auf Ruempfen
- Flaggen ohne Schrift (nur Symbole/Wappen)

**Model**: Gemini 2.5-flash-image (fuer Sprites)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle schiff sprite fuer [schiffstyp]"
- "generiere [kogge/ewer/etc] grafik"
- "schiff animation"
- "beschaedigtes schiff"

## Schiffstypen

### Ewer - Kleines Kuestenfahrzeug
```yaml
specs:
  length: "15-20m"
  masts: 1
  sail: "Einzelnes Rahsegel"
  hull: "Flach, fuer Flachgewässer"
  deck: "Offen, Ladung sichtbar"

visual_traits:
  - Kompakt und wendig
  - Einfache Konstruktion
  - Fässer und Säcke sichtbar
  - 2-3 Crewmitglieder

crew_positions: ["Steuermann am Heck", "Matrosen bei Segeln"]
```

### Kogge - Das Arbeitstier der Hanse
```yaml
specs:
  length: "20-30m"
  masts: 1
  sail: "Grosses quadratisches Rahsegel"
  hull: "Hohe Bordwände, bauchig"
  deck: "Kastelle vorn und hinten"

visual_traits:
  - Markantes Heckruder
  - Klinkerbauweise sichtbar
  - Wappen/Flagge am Mast
  - Geschlossener Laderaum

crew_positions: ["Kapitaen im Achterkastell", "Steuermann", "8-12 Matrosen"]
```

### Schnigge - Schnelles Handelsschiff
```yaml
specs:
  length: "15-25m"
  masts: "1-2"
  sail: "Rah- und/oder Lateinersegel"
  hull: "Schlank, niedriges Profil"
  deck: "Ruder ergaenzend"

visual_traits:
  - Elegant und stromlinienförmig
  - Oft Ruderplaetze sichtbar
  - Leichte Konstruktion
  - Passagiere moeglich

crew_positions: ["Navigator vorn", "5-8 Matrosen/Ruderer"]
```

### Holk - Schwerer Frachter
```yaml
specs:
  length: "30-40m"
  masts: "2-3"
  sail: "Mehrere Rahsegel"
  hull: "Massiv, sehr hohe Ladekapazitaet"
  deck: "Kraene fuer Ladung"

visual_traits:
  - Imposant und schwerfaellig
  - Ladekraene sichtbar
  - Mehrere Decks
  - Grosse Crew

crew_positions: ["Kapitän", "Offiziere", "15-20 Matrosen"]
```

### Kraier - Vielseitiges Handelsschiff
```yaml
specs:
  length: "20-30m"
  masts: 2
  sail: "Kombination Rah- und Lateinersegel"
  hull: "Mittelgross, gute Balance"
  deck: "Modularer Laderaum"

visual_traits:
  - Ausgewogene Proportionen
  - Zwei deutliche Masten
  - Flexible Takelage
  - Mittlere Crewgroesse

crew_positions: ["Kapitaen", "10-12 Matrosen"]
```

## Sprite-Spezifikationen

### Aufloesung und Richtungen
```yaml
base_resolution: 128x64
directions:
  - north (N): Schiff faehrt nach oben
  - east (E): Schiff faehrt nach rechts
  - south (S): Schiff faehrt nach unten
  - west (W): Schiff faehrt nach links

naming: "[schiffstyp]_sprite_[richtung].png"
```

### Beschaedigungs-Stufen
```yaml
damage_levels:
  level_0: "Intakt - normaler Sprite"
  level_1: "Leicht beschaedigt - kleine Loecher, gerissene Segel"
  level_2: "Schwer beschaedigt - grosse Schaeden, Feuer moeglich"
  level_3: "Sinkend - Wasser eindringend, schraege Lage"

naming: "[schiffstyp]_damaged_[level].png"
```

### Animations-Frames
```yaml
animations:
  idle:
    frames: 4
    description: "Leichtes Schaukeln im Hafen"

  sailing_normal:
    frames: 8
    description: "Wellenbewegung, Segel im Wind"

  sailing_storm:
    frames: 8
    description: "Starkes Schaukeln, Gischt"

  sinking:
    frames: 6
    description: "Schiff sinkt langsam"
```

## Workflow

1. **Schiffstyp identifizieren** aus der Anfrage
2. **Asset-Typ bestimmen** (Sprite, Animation, Beschaedigung)
3. **Richtung/Variante** festlegen
4. **Prompt erstellen** mit technischen Details
5. **Nano Banana Pro aufrufen** zur Generierung

## Prompt-Template fuer Nano Banana Pro

```
Generate a 128x64 pixel art ship sprite.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing

Ship type: [SCHIFFSTYP] - [BESCHREIBUNG]
View: Side view, facing [RICHTUNG]
State: [ZUSTAND - intakt/beschaedigt/etc]

Required ship elements:
- [ANZAHL_MASTEN] mast(s) with [SEGELTYP]
- [RUMPF_BESCHREIBUNG]
- [DECK_DETAILS]
- Visible crew silhouettes at [POSITIONEN]

Color palette:
- Hull: #4a2c17 (Ship Hull) to #6b4423 (Deck Wood)
- Sails: #c4a35a (Canvas)
- Water line: #2d5a87 (Ocean Day)

IMPORTANT: Do NOT include any text, letters, or words on the ship.
No ship names on hull. Flags should show symbols only, no text.

Technical requirements:
- Clean pixel edges
- Ship centered in frame
- Small wave indication at hull
- 128x64 pixels exactly
```

## Beispiel-Generierung

**Anfrage**: "Erstelle Kogge Sprite nach Osten"

**Generierter Prompt**:

```
Generate a 128x64 pixel art ship sprite.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing

Ship type: Kogge - The workhorse of the Hanseatic League
View: Side view, facing EAST (right)
State: Intact, sailing normally

Required ship elements:
- Single tall mast with large square sail (Rahsegel)
- High rounded hull with clinker construction visible
- Fore and aft castles (Kastelle)
- Prominent stern rudder
- Hanseatic flag/pennant on mast
- Visible crew silhouettes (captain in aft castle, sailors)

Color palette:
- Hull: #4a2c17 (Ship Hull) with #2d1810 (Dark Oak) details
- Sails: #c4a35a (Canvas) with #8b5a2b (Light Timber) shadows
- Castles: #6b4423 (Deck Wood)
- Flag: #8b0000 (Red) with emblem

Technical requirements:
- Clean pixel edges, no anti-aliasing
- Ship centered, slight upward tilt (sailing)
- Wave spray at bow
- 128x64 pixels exactly
```

## Datei-Organisation

```
assets/ships/
├── ewer/
│   ├── sprite_n.png
│   ├── sprite_e.png
│   ├── sprite_s.png
│   ├── sprite_w.png
│   ├── damaged_1.png
│   ├── damaged_2.png
│   └── damaged_3.png
├── kogge/
│   └── [gleiche Struktur]
├── schnigge/
├── holk/
└── kraier/
```
