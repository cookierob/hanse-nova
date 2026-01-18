# HANSE NOVA – Game Design Document
## Teil 2: Zeit-System & Reisen

---

## Zeit-System Übersicht

### Grundprinzip

Die Zeit in HANSE NOVA läuft **kontinuierlich während Reisen** und **pausiert in Städten**.
Dies gibt dem Spieler Zeit zum Nachdenken bei Handelsentscheidungen, während Reisen
tatsächlich Zeit kosten.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ZEIT-MODELL                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  IN DER STADT                         AUF SEE                               │
│  ─────────────                        ───────                               │
│  • Zeit pausiert                      • Zeit läuft (beschleunigt)           │
│  • Spieler kann in Ruhe               • 1 Sekunde real = 10 Minuten Spielzeit│
│    Entscheidungen treffen             • Spieler kann beschleunigen (x2, x4) │
│  • Events werden angezeigt            • Reise-Events unterbrechen           │
│  • Handel ohne Zeitdruck              • Wetter beeinflusst Geschwindigkeit  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Zeit-Einheiten

```typescript
// Zeit-Konstanten
const TIME_UNITS = {
  HOUR: 1,
  DAY: 24,           // 24 Stunden
  WEEK: 168,         // 7 Tage
} as const;

// Echtzeit zu Spielzeit (während Reisen)
const REALTIME_TO_GAMETIME = {
  normal: 600,       // 1 Sekunde = 10 Minuten
  fast: 1200,        // 1 Sekunde = 20 Minuten (x2)
  fastest: 2400,     // 1 Sekunde = 40 Minuten (x4)
} as const;
```

---

## Reise-System

### Die Ostsee-Karte

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              OSTSEE-KARTE                                    │
│                                                                              │
│                                    NOWGOROD                                  │
│                                       ⬡                                      │
│                                      ╱                                       │
│                              REVAL  ╱                                        │
│                                ⬡───╯                                         │
│                               ╱                                              │
│                    STOCKHOLM ╱         RIGA                                  │
│                        ⬡────╯           ⬡                                    │
│                       ╱               ╱                                      │
│                      ╱        VISBY  ╱                                       │
│                     ╱           ⬡───╯                                        │
│                    ╱           ╱                                             │
│            LÜBECK ⬡───────────╯                                              │
│               ╱ ╲            ╲                                               │
│              ╱   ╲            ╲ DANZIG                                       │
│      HAMBURG     ROSTOCK       ⬡                                             │
│          ⬡         ⬡                                                         │
│                                                                              │
│  Legende:  ⬡ = Stadt   ─── = Handelsroute                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Städte-Koordinaten

```typescript
interface CityPosition {
  id: string;
  name: string;
  x: number;  // 0-1000 (normalisiert)
  y: number;  // 0-1000 (normalisiert)
}

const CITY_POSITIONS: CityPosition[] = [
  { id: 'luebeck',   name: 'Lübeck',    x: 280, y: 580 },
  { id: 'hamburg',   name: 'Hamburg',   x: 180, y: 650 },
  { id: 'rostock',   name: 'Rostock',   x: 380, y: 620 },
  { id: 'danzig',    name: 'Danzig',    x: 580, y: 560 },
  { id: 'visby',     name: 'Visby',     x: 420, y: 420 },
  { id: 'stockholm', name: 'Stockholm', x: 380, y: 280 },
  { id: 'riga',      name: 'Riga',      x: 620, y: 340 },
  { id: 'reval',     name: 'Reval',     x: 580, y: 220 },
  { id: 'novgorod',  name: 'Nowgorod',  x: 720, y: 120 },
];
```

### Distanz-Berechnung

```typescript
// Distanz zwischen zwei Städten in Seemeilen
function calculateDistance(from: CityPosition, to: CityPosition): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);

  // 1 Pixel = ~1.5 Seemeilen (Karte ist ~750 Seemeilen breit)
  return Math.round(pixelDistance * 1.5);
}

// Vordefinierte Distanzen (in Seemeilen) für Konsistenz
const DISTANCES: Record<string, Record<string, number>> = {
  luebeck: {
    hamburg: 65,
    rostock: 95,
    danzig: 320,
    visby: 280,
    stockholm: 420,
    riga: 480,
    reval: 540,
    novgorod: 720,
  },
  hamburg: {
    luebeck: 65,
    rostock: 160,
    danzig: 385,
    // ... etc
  },
  // ... weitere Städte
};
```

### Reisezeit-Berechnung

```typescript
interface TravelCalculation {
  distance: number;          // Seemeilen
  baseTime: number;          // Stunden
  weatherModifier: number;   // 0.5 - 2.0
  shipSpeedModifier: number; // 0.8 - 1.5
  finalTime: number;         // Stunden (gerundet)
  arrivalTime: Date;         // Spielzeit
}

// Basis-Geschwindigkeiten (Seemeilen pro Stunde)
const SHIP_SPEEDS = {
  ewer: 4.5,      // Klein, aber wendig
  kogge: 3.5,     // Standard-Handelsschiff
  schnigge: 5.5,  // Schnell, wenig Ladung
  holk: 2.5,      // Groß und langsam
  kraier: 3.0,    // Mittel, aber bewaffnet
} as const;

function calculateTravelTime(
  from: string,
  to: string,
  shipType: keyof typeof SHIP_SPEEDS,
  weather: WeatherCondition,
  shipCondition: number, // 0-100
  crewSkill: number      // 1-5
): TravelCalculation {
  const distance = DISTANCES[from][to];
  const baseSpeed = SHIP_SPEEDS[shipType];

  // Wetter-Modifikator
  const weatherMod = WEATHER_SPEED_MODIFIERS[weather];

  // Schiffszustand (unter 50% wird es langsamer)
  const conditionMod = shipCondition >= 50
    ? 1.0
    : 0.5 + (shipCondition / 100);

  // Crew-Skill Bonus (max +20%)
  const crewMod = 1 + (crewSkill - 1) * 0.05;

  // Finale Geschwindigkeit
  const finalSpeed = baseSpeed * weatherMod * conditionMod * crewMod;

  // Zeit in Stunden
  const hours = Math.round(distance / finalSpeed);

  return {
    distance,
    baseTime: Math.round(distance / baseSpeed),
    weatherModifier: weatherMod,
    shipSpeedModifier: conditionMod * crewMod,
    finalTime: hours,
    arrivalTime: addHours(getCurrentGameTime(), hours),
  };
}
```

### Beispiel-Reisezeiten

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REISEZEITEN (Kogge, gutes Wetter)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Route                    │ Distanz    │ Zeit        │ Risiko               │
│  ─────────────────────────┼────────────┼─────────────┼───────────────────── │
│  Hamburg ↔ Lübeck         │ 65 sm      │ ~19 Stunden │ ⭐ Sehr sicher       │
│  Lübeck ↔ Rostock         │ 95 sm      │ ~27 Stunden │ ⭐ Sehr sicher       │
│  Lübeck ↔ Visby           │ 280 sm     │ ~3,3 Tage   │ ⭐⭐ Sicher          │
│  Lübeck ↔ Danzig          │ 320 sm     │ ~3,8 Tage   │ ⭐⭐ Sicher          │
│  Lübeck ↔ Stockholm       │ 420 sm     │ ~5 Tage     │ ⭐⭐⭐ Mittel        │
│  Lübeck ↔ Riga            │ 480 sm     │ ~5,7 Tage   │ ⭐⭐⭐ Mittel        │
│  Lübeck ↔ Reval           │ 540 sm     │ ~6,4 Tage   │ ⭐⭐⭐⭐ Riskant     │
│  Lübeck ↔ Nowgorod        │ 720 sm     │ ~8,5 Tage   │ ⭐⭐⭐⭐⭐ Gefährlich│
│                                                                              │
│  sm = Seemeilen                                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Wetter-System

### Wetterzustände

```typescript
type WeatherCondition =
  | 'calm'          // Windstille - langsam aber sicher
  | 'fair'          // Gutes Wetter - optimal
  | 'windy'         // Windig - schneller, aber unruhig
  | 'rainy'         // Regen - leicht verlangsamt
  | 'stormy'        // Sturm - gefährlich!
  | 'foggy';        // Nebel - langsam, Unfallgefahr

const WEATHER_SPEED_MODIFIERS: Record<WeatherCondition, number> = {
  calm: 0.6,       // 40% langsamer (kein Wind für Segel)
  fair: 1.0,       // Normal
  windy: 1.3,      // 30% schneller
  rainy: 0.85,     // 15% langsamer
  stormy: 0.5,     // 50% langsamer + Schaden möglich
  foggy: 0.7,      // 30% langsamer + Kollisionsgefahr
};

const WEATHER_DANGER: Record<WeatherCondition, number> = {
  calm: 0.01,      // 1% Event-Chance pro Stunde
  fair: 0.02,      // 2%
  windy: 0.05,     // 5%
  rainy: 0.08,     // 8%
  stormy: 0.20,    // 20% - sehr gefährlich!
  foggy: 0.10,     // 10% - Kollisionen
};
```

### Wetter-Vorhersage

Der Spieler kann in Häfen eine Wettervorhersage für die nächsten 2 Tage sehen.

```typescript
interface WeatherForecast {
  current: WeatherCondition;
  next12h: WeatherCondition;
  next24h: WeatherCondition;
  next48h: WeatherCondition;  // Ungenauer
  reliability: number;         // 0.5 - 0.95 (Vorhersage-Genauigkeit)
}

// Beispiel UI-Darstellung:
// ┌─────────────────────────────────────┐
// │  WETTER-VORHERSAGE                  │
// │  ☀️ Jetzt: Sonnig                   │
// │  🌤️ +12h: Bewölkt                   │
// │  🌧️ +24h: Regen wahrscheinlich      │
// │  ❓ +48h: Unsicher (evtl. Sturm)    │
// │                                      │
// │  Empfehlung: Heute noch ablegen!    │
// └─────────────────────────────────────┘
```

### Wetter-Generierung

```typescript
// Wetter ändert sich alle 6-12 Spielstunden
function generateNextWeather(
  currentWeather: WeatherCondition,
  season: Season,
  region: 'west' | 'central' | 'east'
): WeatherCondition {
  const transitionMatrix = WEATHER_TRANSITIONS[season][region];
  const probabilities = transitionMatrix[currentWeather];

  return weightedRandom(probabilities);
}

// Übergangswahrscheinlichkeiten (Beispiel: Herbst, Zentralregion)
const AUTUMN_CENTRAL_TRANSITIONS = {
  calm: { calm: 0.2, fair: 0.4, windy: 0.2, rainy: 0.15, stormy: 0.03, foggy: 0.02 },
  fair: { calm: 0.15, fair: 0.35, windy: 0.25, rainy: 0.15, stormy: 0.05, foggy: 0.05 },
  windy: { calm: 0.05, fair: 0.25, windy: 0.3, rainy: 0.2, stormy: 0.15, foggy: 0.05 },
  rainy: { calm: 0.1, fair: 0.2, windy: 0.15, rainy: 0.3, stormy: 0.2, foggy: 0.05 },
  stormy: { calm: 0.05, fair: 0.15, windy: 0.25, rainy: 0.35, stormy: 0.15, foggy: 0.05 },
  foggy: { calm: 0.25, fair: 0.35, windy: 0.1, rainy: 0.2, stormy: 0.02, foggy: 0.08 },
};
```

---

## Jahreszeiten

Obwohl ein Run nicht ein ganzes Jahr dauert, beeinflusst die **Startjahreszeit**
(zufällig oder gewählt) das Spielerlebnis.

```typescript
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonEffects {
  weatherBias: Partial<Record<WeatherCondition, number>>;  // Wahrscheinlichkeits-Modifikator
  priceModifiers: Record<GoodCategory, number>;            // Saisonale Preise
  blockedRoutes: string[];                                 // Im Winter eingefroren
  eventPool: string[];                                     // Saisonale Events
  dayLength: number;                                       // Stunden Tageslicht
}

const SEASONS: Record<Season, SeasonEffects> = {
  spring: {
    weatherBias: { rainy: 1.3, stormy: 0.8 },
    priceModifiers: { grain: 1.2, fish: 0.9 }, // Nach Winter: Getreide teuer
    blockedRoutes: [],
    eventPool: ['spring_flood', 'easter_market', 'ship_launch'],
    dayLength: 14,
  },
  summer: {
    weatherBias: { fair: 1.4, calm: 1.2, stormy: 0.6 },
    priceModifiers: { fish: 0.8, salt: 1.1 },
    blockedRoutes: [],
    eventPool: ['midsummer_fest', 'pirate_season', 'trade_fair'],
    dayLength: 18,
  },
  autumn: {
    weatherBias: { stormy: 1.5, windy: 1.3 },
    priceModifiers: { grain: 0.7, fur: 0.9 }, // Ernte: Getreide billig
    blockedRoutes: [],
    eventPool: ['harvest_festival', 'autumn_storms', 'last_voyage'],
    dayLength: 11,
  },
  winter: {
    weatherBias: { stormy: 1.2, foggy: 1.4, fair: 0.5 },
    priceModifiers: { fur: 1.5, grain: 1.3, salt: 1.4 }, // Alles teurer
    blockedRoutes: ['novgorod', 'reval'], // Eingefroren!
    eventPool: ['ice_fishing', 'winter_market', 'frozen_harbor'],
    dayLength: 7,
  },
};
```

### Winter-Spezialregeln

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WINTER-WARNUNG                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ❄️ ACHTUNG: Im Winter sind folgende Häfen NICHT erreichbar:                │
│                                                                              │
│     • Nowgorod (November - März)                                            │
│     • Reval (Dezember - Februar)                                            │
│     • Riga (Januar - Februar, je nach Kälte)                                │
│                                                                              │
│  Schiffe, die sich bei Frosteinbruch in diesen Häfen befinden,             │
│  sind bis zum Frühjahr gefangen!                                            │
│                                                                              │
│  ⚠️ Aber: Winter-Pelzhandel in Nowgorod bringt 3x Gewinn!                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Reise-Visualisierung

### Karten-Animation

Während der Reise sieht der Spieler sein Schiff über die Karte fahren.

```typescript
interface TravelVisualization {
  // Schiffs-Position (interpoliert)
  currentPosition: { x: number; y: number };

  // Route als Pfad
  routePath: { x: number; y: number }[];

  // Fortschritt 0-1
  progress: number;

  // Visuelle Effekte
  wakeTrail: boolean;           // Kielwasser
  weatherParticles: boolean;    // Regen/Nebel
  shipRocking: 'none' | 'light' | 'heavy';  // Wellengang
}

// Animation: Schiff bewegt sich entlang der Route
function animateShipTravel(
  from: CityPosition,
  to: CityPosition,
  duration: number,  // Echtzeit-Sekunden
  onProgress: (progress: number) => void,
  onEvent: (event: TravelEvent) => void
): void {
  const startTime = Date.now();

  function tick() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);

    // Aktuelle Position berechnen (mit leichter Kurve für natürlichere Route)
    const position = interpolateWithCurve(from, to, progress);

    onProgress(progress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}
```

### Reise-UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AUF SEE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │                    [OSTSEE-KARTE MIT SCHIFF]                         │  │
│  │                                                                       │  │
│  │           LÜBECK ●━━━━━━━━━━━⛵━━━━━━━━━━━━○ DANZIG                  │  │
│  │                              ↑                                        │  │
│  │                         Dein Schiff                                   │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ REISE-STATUS ─────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  🚢 "Salzprinz" (Kogge)           │  ⏱️ Verstrichen: 1 Tag 4h      │    │
│  │  📍 Lübeck → Danzig               │  ⏳ Verbleibend: 2 Tage 8h     │    │
│  │  🌤️ Wetter: Bewölkt               │  📊 Fortschritt: 35%           │    │
│  │                                                                     │    │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ GESCHWINDIGKEIT ──────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │     [▶ Normal]    [▶▶ Schnell]    [▶▶▶▶ Sehr schnell]              │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Reise-Events

Während der Reise können **zufällige Events** auftreten. Die Wahrscheinlichkeit
hängt von Wetter, Route und Schiffstyp ab.

### Event-Trigger

```typescript
interface TravelEventTrigger {
  baseChance: number;           // Basis-Wahrscheinlichkeit pro Stunde
  weatherMultiplier: number;    // Wetter-Einfluss
  routeDanger: number;          // Routen-Gefährlichkeit
  timeOfDay: 'day' | 'night';   // Nacht = gefährlicher
}

function checkForTravelEvent(
  hoursElapsed: number,
  weather: WeatherCondition,
  route: Route,
  ship: Ship
): TravelEvent | null {
  const baseChance = 0.03; // 3% pro Stunde

  const finalChance = baseChance
    * WEATHER_DANGER[weather]
    * route.dangerLevel
    * (isNight() ? 1.5 : 1.0)
    * (ship.type === 'kraier' ? 0.7 : 1.0); // Bewaffnete Schiffe = sicherer

  if (Math.random() < finalChance) {
    return generateTravelEvent(weather, route, ship);
  }

  return null;
}
```

### Beispiel-Reise-Events

```typescript
const TRAVEL_EVENTS = {
  // POSITIVE EVENTS (20%)
  fair_wind: {
    title: "Günstiger Wind",
    description: "Ein kräftiger Rückenwind erfasst deine Segel!",
    effect: { travelTimeReduction: 0.15 }, // 15% schneller
    choices: null, // Automatisch
  },

  floating_cargo: {
    title: "Treibgut",
    description: "Deine Mannschaft entdeckt schwimmende Fässer. Strandgut?",
    choices: [
      {
        text: "Einsammeln",
        outcomes: [
          { weight: 60, effect: { addCargo: { good: 'random', amount: 5 } } },
          { weight: 30, effect: { addCargo: { good: 'random', amount: 10 } } },
          { weight: 10, effect: { reputation: { hanse: -5 }, note: "Gestohlen..." } },
        ]
      },
      { text: "Ignorieren", outcomes: [{ weight: 100, effect: null }] },
    ],
  },

  // NEUTRALE EVENTS (40%)
  other_ship: {
    title: "Begegnung auf See",
    description: "Ein Handelsschiff kreuzt euren Weg. Der Kapitän grüßt.",
    choices: [
      {
        text: "Anheuern zum Gespräch",
        effect: { travelTime: +2 }, // 2 Stunden Verzögerung
        outcomes: [
          { weight: 50, effect: { rumor: 'random_city_prices' } },
          { weight: 30, effect: { reputation: { hanse: +2 } } },
          { weight: 20, effect: null },
        ]
      },
      { text: "Weiterfahren", outcomes: [{ weight: 100, effect: null }] },
    ],
  },

  // NEGATIVE EVENTS (40%)
  storm_damage: {
    title: "Sturmschaden",
    description: "Eine Welle trifft das Schiff hart. Wasser dringt ein!",
    requirements: { weather: ['stormy', 'windy'] },
    choices: [
      {
        text: "Sofort reparieren",
        requirements: { gold: 50 },
        effect: { gold: -50, shipDamage: 5 },
      },
      {
        text: "Weitersegeln und hoffen",
        outcomes: [
          { weight: 60, effect: { shipDamage: 10 } },
          { weight: 30, effect: { shipDamage: 20, cargoDamage: 0.1 } },
          { weight: 10, effect: { shipDamage: 35, cargoDamage: 0.25 } },
        ]
      },
    ],
  },

  pirate_encounter: {
    title: "Piraten!",
    description: "Ein Schiff mit schwarzer Flagge nähert sich schnell!",
    requirements: { route: { minDanger: 0.3 } },
    choices: [
      {
        text: "Fliehen versuchen",
        requirements: { ship: { type: ['schnigge', 'ewer'] } },
        outcomes: [
          { weight: 70, effect: { travelTime: +4 } }, // Flucht gelingt
          { weight: 30, effect: { redirect: 'pirate_capture' } },
        ]
      },
      {
        text: "Kampf vorbereiten",
        requirements: { ship: { type: 'kraier' } },
        outcomes: [
          { weight: 60, effect: { reputation: { pirates: -10, hanse: +5 } } },
          { weight: 40, effect: { shipDamage: 15, crewLoss: 2 } },
        ]
      },
      {
        text: "Tribut zahlen (20% der Ladung)",
        effect: { cargoDamage: 0.2, reputation: { pirates: +5 } },
      },
      {
        text: "[Piraten-Ruf 30+] Wir sind Verbündete!",
        requirements: { reputation: { pirates: 30 } },
        effect: { reputation: { pirates: +3 } },
      },
    ],
  },
};
```

---

## Routen-Planung UI

Vor der Abreise plant der Spieler seine Route.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ROUTE PLANEN                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  VON: Lübeck                    NACH: [Dropdown: Städte]                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │                    [KARTE MIT ROUTE EINGEZEICHNET]                   │  │
│  │                                                                       │  │
│  │           LÜBECK ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━○ DANZIG               │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ ROUTE: Lübeck → Danzig ───────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  📏 Distanz:        320 Seemeilen                                  │    │
│  │  ⏱️ Geschätzte Zeit: 3 Tage, 19 Stunden                            │    │
│  │  🌤️ Wetter-Prognose: Gut (nächste 2 Tage)                          │    │
│  │  ⚠️ Risiko-Stufe:   ⭐⭐ (Sicher)                                   │    │
│  │                                                                     │    │
│  │  💡 Tipp: Danzig hat aktuell hohe Nachfrage nach Salz!            │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─ DEIN SCHIFF ──────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  🚢 "Salzprinz" (Kogge)                                            │    │
│  │  📦 Ladung: 32/50 (Salz x20, Tuch x8, Bier x4)                     │    │
│  │  🔧 Zustand: 85%                                                    │    │
│  │  👥 Mannschaft: 12 (Moral: Gut)                                     │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│           [❌ Abbrechen]                    [⚓ Ablegen]                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*Weiter zu Teil 3: Städte & Handel*
