# Hanse City Artist

Generiert Stadt-Grafiken und Stadtansichten fuer Hanse Nova.

## WICHTIG: Text-Regel

**KEIN TEXT IN GENERIERTEN BILDERN!**
- Alle Prompts muessen enthalten: "Do NOT include any text, letters, words, or inscriptions"
- Keine Schilder, keine Inschriften auf Gebaeuden
- Texte werden programmatisch im Spiel hinzugefuegt

**Model**: Gemini 3-pro-image-preview (fuer detaillierte Stadtszenen)

## Trigger

Dieser Skill sollte verwendet werden bei:
- "erstelle stadtbild fuer [stadt]"
- "generiere [stadt] panorama"
- "hafen ansicht [stadt]"
- "marktplatz [stadt]"

## Stadt-Identitaeten

### Luebeck - Koenigin der Hanse
```yaml
key_elements:
  - Holstentor (markantes Doppeltor, IMMER sichtbar)
  - Backsteingotik (rote Ziegel)
  - Sieben Tuerme im Hintergrund
color_accent: "#8b4513"  # Brick Red
mood: "Maechtig, wohlhabend, ordentlich"
unique_props: ["Holstentor", "Marienkirche", "Salzspeicher"]
```

### Hamburg - Tor zur Welt
```yaml
key_elements:
  - Grosse Hafenanlage mit vielen Schiffen
  - Speicherhaeuser am Wasser
  - Alsterfleet, Kanaele
color_accent: "#4a2c17"  # Dark Timber
mood: "Geschaeftig, weltoffen, neblig"
unique_props: ["Nikolaikirche", "Speicherstadt", "Kraene"]
```

### Rostock - Perle der Ostsee
```yaml
key_elements:
  - Kroepeliner Tor
  - Universitaetsgebaeude
  - Warnowufer
color_accent: "#a0522d"  # Roof Tile
mood: "Akademisch, aufstrebend"
unique_props: ["Marienkirche", "Steintor", "Universitaet"]
```

### Danzig - Gold der Ostsee
```yaml
key_elements:
  - Krantor (grosser Hafenkran, IMMER sichtbar)
  - Langer Markt mit praechtigen Haeusern
  - Bernstein-Handel (goldene Akzente)
color_accent: "#c9a227"  # Coin Gold
mood: "Reich, praechtig, international"
unique_props: ["Krantor", "Artushof", "Neptunbrunnen"]
```

### Visby - Stadt der Ruinen und Rosen
```yaml
key_elements:
  - Massive Stadtmauer (2km)
  - Kirchenruinen
  - Rosenranken
color_accent: "#d2b48c"  # Sandstone
mood: "Nostalgisch, romantisch, windgepeitscht"
unique_props: ["Ringmauer", "St. Karin Ruine", "Rosenblueten"]
```

### Stockholm - Venedig des Nordens
```yaml
key_elements:
  - Insellage (Wasser ueberall)
  - Bunte Holzhaeuser
  - Felsige Kueste, Schaeren
color_accent: "#6b4423"  # Deck Wood
mood: "Malerisch, kalt, stolz"
unique_props: ["Gamla Stan", "Koenigspalast", "Schaeren"]
```

### Riga - Metropole des Ostens
```yaml
key_elements:
  - Schwarzhaeupterhaus (ornamentiert)
  - Duena-Fluss
  - Ordensburgen, wehrhaft
color_accent: "#5a5a5a"  # Castle Gray
mood: "Wehrhaft, mystisch, grenzland"
unique_props: ["Domberg", "Schwarzhaeuper", "Festung"]
```

### Nowgorod - Tor nach Russland
```yaml
key_elements:
  - Kreml (Festung)
  - Zwiebeltuerme (orthodox)
  - Birkenwald im Hintergrund
color_accent: "#1a3d1a"  # Dark Forest
mood: "Fremd, kalt, geheimnisvoll"
unique_props: ["Kreml", "Sophienkathedrale", "Handelskontor"]
```

## Workflow

1. **Stadt identifizieren** aus der Anfrage
2. **Ansichtstyp bestimmen** (Panorama, Hafen, Markt, Detail)
3. **Tageszeit/Wetter** beruecksichtigen (falls angegeben)
4. **Prompt erstellen** mit allen stadtspezifischen Elementen
5. **Nano Banana Pro aufrufen** zur Bildgenerierung

## Prompt-Template fuer Nano Banana Pro

```
Generate a [RESOLUTION] pixel art image.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing, ordered dithering

Scene: Medieval Hanseatic city of [STADT] - [ANSICHTSTYP]
Time: [TAGESZEIT], [WETTER] conditions

Required elements (MUST be visible):
- [EINZIGARTIGES_ELEMENT_1]
- [EINZIGARTIGES_ELEMENT_2]
- [ARCHITEKTUR_STIL]

Background elements:
- [HINTERGRUND_DETAILS]

Color emphasis: [FARBAKZENT] as dominant accent
Mood: [STIMMUNG]

Technical requirements:
- Clean pixel edges, no gradients
- Limited 32-color palette
- No anti-aliasing
- [RESOLUTION] pixels exactly
```

## Beispiel-Generierung

**Anfrage**: "Erstelle das Hafenpanorama fuer Danzig bei Sonnenuntergang"

**Generierter Prompt fuer Nano Banana Pro**:

```
Generate a 256x192 pixel art image.
Style: 16-bit pixel art, 32-color palette, no anti-aliasing, ordered dithering

Scene: Medieval Hanseatic city of Danzig - Harbor panorama view
Time: Sunset (dusk), clear weather

Required elements (MUST be visible):
- The Krantor (large medieval crane gate) as central focus
- Long Market with ornate merchant houses in background
- Amber traders with golden wares
- Multiple ships in harbor (Koggen, Ewer)

Background elements:
- Church spires
- Wealthy Gothic architecture
- Merchant activity on docks

Color emphasis: Coin Gold (#c9a227) as dominant accent, warm sunset tones
Mood: Rich, magnificent, international trading hub

Technical requirements:
- Clean pixel edges, no gradients
- Limited 32-color palette
- No anti-aliasing
- 256x192 pixels exactly
```

## Varianten

Fuer jede Stadt sollten folgende Varianten erstellt werden:
- `panorama_day.png` - Tagansicht
- `panorama_night.png` - Nachtansicht
- `panorama_storm.png` - Sturmansicht
- `harbor.png` - Hafendetail
- `market.png` - Marktplatz
