# Hanse Character Artist

Generiert Charakter-Portraits und NPC-Grafiken fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Alle Prompts muessen enthalten: "Do NOT include any text or name labels"
- Charakter-Namen werden im UI-Layer hinzugefuegt

**Model**: Gemini 3-pro-image-preview (fuer detaillierte Portraits)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle portrait fuer [charakter]"
- "generiere npc grafik"
- "crew portrait"
- "charakter [name] expression [emotion]"

## Charakter-Archetypen

### Haendler (Merchants)
```yaml
base_traits:
  - Wohlgenaehrt, selbstbewusst
  - Teure Kleidung (Pelzkragen, Samthut)
  - Siegelring, Geldbeutel sichtbar
  - Gepflegter Bart (wenn maennlich)

variations:
  young_merchant:
    age: "25-35"
    expression: "Ehrgeizig, aufstrebend"
    clothing: "Modisch aber nicht uebertrieben"

  established_merchant:
    age: "40-55"
    expression: "Selbstsicher, erfahren"
    clothing: "Reich, mit Pelzbesatz"

  foreign_merchant:
    traits: "Exotische Kleidungselemente"
    origins: ["Italienisch", "Russisch", "Flandrisch"]
```

### Seeleute (Sailors)
```yaml
base_traits:
  - Wettergegerbt, muskuloes
  - Einfache Kleidung (Leinen, Wolle)
  - Narben, Taetowierungen moeglich
  - Sonnengebraeunte Haut

variations:
  deckhand:
    expression: "Muede aber zuverlaessig"
    clothing: "Abgenutzt, praktisch"

  helmsman:
    expression: "Konzentriert, erfahren"
    clothing: "Etwas besser, Navigationsinstrument"

  captain:
    expression: "Autoritaer, stolz"
    clothing: "Besser gekleidet, Kapitaensmuetze"
```

### Adelige (Nobles)
```yaml
base_traits:
  - Aufrechte Haltung
  - Prunkvolle Kleidung, Wappen
  - Arroganter oder herablassender Blick
  - Schmuck und Insignien

variations:
  knight:
    expression: "Stolz, kampfbereit"
    clothing: "Ruestungselemente, Wappen"

  count:
    expression: "Berechnend, politisch"
    clothing: "Hoefische Mode, Kette"

  duke:
    expression: "Maechtig, distanziert"
    clothing: "Praechtigste Kleidung, Krone"
```

### Geistliche (Clergy)
```yaml
base_traits:
  - Kutten oder Roben
  - Religioese Symbole (Kreuz, Rosenkranz)
  - Demuetiger oder maechtiger Ausdruck
  - Tonsur (bei Moenchen)

variations:
  monk:
    expression: "Demuetig, freundlich oder geheimnisvoll"
    clothing: "Einfache braune/graue Kutte"

  priest:
    expression: "Wuerdevoll, ernst"
    clothing: "Bessere Robe, Stola"

  bishop:
    expression: "Autoritaer, praechtig"
    clothing: "Ornate Gewänder, Mitra, Stab"
```

### Piraten (Pirates)
```yaml
base_traits:
  - Wild, gefaehrlich
  - Waffen sichtbar (Dolch, Saebel)
  - Beutestuecke, fremde Kleidungsmischung
  - Narben, Augenklappen, Hakenhaende

variations:
  pirate_crew:
    expression: "Brutal, gierig"
    clothing: "Zerlumpt aber mit Beute-Schmuck"

  pirate_captain:
    expression: "Charismatisch, gefaehrlich"
    clothing: "Besser, gestohlene Edelkleidung"
```

## Wiederkehrende NPCs

### Erik der Rote
```yaml
role: "Piratenkapitaen (kann Feind oder Verbuendeter sein)"
visual:
  - Roter buschiger Bart (namensgebend)
  - Augenklappe ueber linkem Auge
  - Norwegische Kleidung mit Pelz
  - Axt am Guertel
  - Kraeftige Statur

expressions:
  neutral: "Abschaetzend, pruefend"
  friendly: "Breites Grinsen, Augen funkeln"
  angry: "Zornesroete, gebleckte Zaehne"
  scheming: "Halblaecheln, verengtes Auge"
```

### Bruder Johannes
```yaml
role: "Wandernder Moench mit Geheimnissen"
visual:
  - Braune Franziskaner-Kutte mit Kapuze
  - Intelligente, durchdringende Augen
  - Schmales Gesicht, asketisch
  - Mysterioeser Beutel mit Artefakten
  - Strick-Guertel

expressions:
  friendly: "Sanftes Laecheln, offener Blick"
  knowing: "Wissendes Schmunzeln"
  worried: "Zusammengezogene Brauen"
  fearful: "Geweitete Augen, blasse Haut"
```

### Helena von Danzig
```yaml
role: "Einflussreiche Haendlerin"
visual:
  - Elegante Kleidung (Samt, Seide)
  - Spitzenschleier
  - Selbstbewusste Haltung
  - Kluge, berechnende Augen
  - Schmuck zeigt Reichtum

expressions:
  neutral: "Hoeflich distanziert"
  charming: "Gewinnendes Laecheln"
  cold: "Eisiger Blick, hochgezogene Braue"
  business: "Konzentriert, entschlossen"
```

### Der Graue Wolf
```yaml
role: "Mysterioeser Informant"
visual:
  - Grauer Umhang mit tiefer Kapuze
  - Nur Augen sichtbar (hell, durchdringend)
  - Schattenhaft, Konturen unklar
  - Vielleicht Narbe ueber Auge sichtbar

expressions:
  neutral: "Beobachtend aus dem Schatten"
  warning: "Intensiver warnender Blick"
  scheming: "Verengtes Auge, Andeutung eines Laechelns"
```

## Spezifikationen

```yaml
portrait_resolution: 64x64 pixels
crew_resolution: 48x48 pixels
style: "16-bit pixel art"
background: "transparent oder einfarbig passend"
```

## Workflow

1. **Charakter identifizieren** (Archetyp oder benannter NPC)
2. **Expression/Emotion** bestimmen
3. **Details laden** (Kleidung, Merkmale)
4. **Prompt erstellen** mit allen visuellen Anforderungen
5. **Nano Banana Pro aufrufen** zur Generierung

## Prompt-Template fuer Nano Banana Pro

```
Generate a [RESOLUTION] pixel art character portrait.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing

Character: [NAME/TYP] - [ROLLE]
Expression: [EMOTION/AUSDRUCK]

Physical appearance:
- [KOERPERLICHE_MERKMALE]
- [BESONDERE_KENNZEICHEN]

Clothing and accessories:
- [KLEIDUNG]
- [ACCESSOIRES]
- [WAFFEN_FALLS_RELEVANT]

Framing: Shoulders-up portrait, slight angle
Background: [HINTERGRUND - transparent/einfarbig]

Color emphasis:
- Skin: warm medieval tones
- Clothing: [HAUPTFARBE]
- Accents: [AKZENTFARBE]

Mood: [STIMMUNG_DES_PORTRAITS]

IMPORTANT: Do NOT include any text, name labels, or letters in the portrait.

Technical requirements:
- Clean pixel edges
- Clear facial features despite small size
- [RESOLUTION] pixels exactly
```

## Beispiel-Generierung

**Anfrage**: "Erstelle Portrait von Erik der Rote, wuetend"

**Generierter Prompt**:

```
Generate a 64x64 pixel art character portrait.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing

Character: Erik the Red - Pirate Captain
Expression: Angry - red-faced fury, bared teeth, intense glare

Physical appearance:
- Large bushy RED beard (his defining feature)
- Eye patch over left eye
- Strong, weathered face
- Muscular build visible at shoulders

Clothing and accessories:
- Norwegian-style clothing with fur trim
- Axe handle visible at shoulder
- Gold earring in visible ear
- Stolen noble's brooch

Framing: Shoulders-up portrait, slight three-quarter angle
Background: Dark gray (#2f2f2f) for contrast

Color emphasis:
- Beard: #8b0000 (deep red) to #ff4500 (bright red)
- Skin: flushed angry red undertones
- Fur: #6b4423 brown
- Gold accents: #c9a227

Mood: Threatening, about to attack, volcanic rage

Technical requirements:
- Clean pixel edges
- Rage clearly visible in face
- 64x64 pixels exactly
```

## Datei-Organisation

```
assets/characters/
├── npcs/
│   ├── erik_der_rote/
│   │   ├── neutral.png
│   │   ├── friendly.png
│   │   ├── angry.png
│   │   └── scheming.png
│   ├── bruder_johannes/
│   ├── helena_von_danzig/
│   └── der_graue_wolf/
├── archetypes/
│   ├── merchants/
│   ├── sailors/
│   ├── nobles/
│   ├── clergy/
│   └── pirates/
└── crew/
    ├── navigator.png
    ├── helmsman.png
    ├── cook.png
    └── deckhand.png
```
