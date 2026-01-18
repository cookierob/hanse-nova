# HANSE NOVA – Game Design Document
## Teil 6: Schiffe & Crew

---

## Schiffs-System Übersicht

Das Schiff ist dein wichtigstes Werkzeug. Es bestimmt, wie viel du laden kannst,
wie schnell du reist und wie sicher du bist.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SCHIFFS-ATTRIBUTE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚓ KAPAZITÄT          Wie viel Ladung passt ins Schiff?                    │
│  ─────────────         Mehr Kapazität = mehr Profit pro Fahrt              │
│                        Aber: Größere Schiffe sind langsamer                 │
│                                                                              │
│  💨 GESCHWINDIGKEIT    Wie schnell reist das Schiff?                        │
│  ─────────────────     Schneller = mehr Trades pro Zeiteinheit             │
│                        Aber: Schnelle Schiffe haben weniger Kapazität       │
│                                                                              │
│  🛡️ ROBUSTHEIT        Wie viel Schaden kann es nehmen?                      │
│  ─────────────        Höher = übersteht Stürme und Kämpfe besser           │
│                        Aber: Robuste Schiffe sind teurer                    │
│                                                                              │
│  ⚔️ KAMPFKRAFT         Wie gut ist es im Kampf?                             │
│  ──────────────        Höher = kann Piraten abwehren                        │
│                        Aber: Bewaffnete Schiffe sind verdächtig             │
│                                                                              │
│  🔧 ZUSTAND            Aktueller Zustand (0-100%)                           │
│  ──────────            Unter 50% = langsamere Fahrt                         │
│                        Unter 25% = Gefahr des Sinkens                       │
│                        0% = Schiff sinkt                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Schiffstypen

### Übersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DIE SCHIFFE DER HANSE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🚣 EWER                                                             │   │
│  │  "Der kleine Schnelle"                                               │   │
│  │                                                                      │   │
│  │  Kapazität:    ████░░░░░░░░░░░░░░░░  20 Einheiten                   │   │
│  │  Geschwindig.: ████████████████░░░░  4.5 Knoten                     │   │
│  │  Robustheit:   ████░░░░░░░░░░░░░░░░  30 HP                          │   │
│  │  Kampfkraft:   ██░░░░░░░░░░░░░░░░░░  Keine                          │   │
│  │                                                                      │   │
│  │  Preis: 200 Gold │ Crew: 4 │ Besonderheit: Flussfähig               │   │
│  │                                                                      │   │
│  │  Ideal für: Schnelle kurze Routen, Anfänger, Flüsse                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⛵ KOGGE                                                            │   │
│  │  "Das Arbeitstier der Hanse"                                         │   │
│  │                                                                      │   │
│  │  Kapazität:    ██████████░░░░░░░░░░  50 Einheiten                   │   │
│  │  Geschwindig.: ███████░░░░░░░░░░░░░  3.5 Knoten                     │   │
│  │  Robustheit:   ██████████░░░░░░░░░░  60 HP                          │   │
│  │  Kampfkraft:   ████░░░░░░░░░░░░░░░░  Basis-Verteidigung             │   │
│  │                                                                      │   │
│  │  Preis: 500 Gold │ Crew: 12 │ Besonderheit: Ausgewogen              │   │
│  │                                                                      │   │
│  │  Ideal für: Allround-Handel, Standard-Routen                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🏃 SCHNIGGE                                                         │   │
│  │  "Der Windschnelle"                                                  │   │
│  │                                                                      │   │
│  │  Kapazität:    ██████░░░░░░░░░░░░░░  30 Einheiten                   │   │
│  │  Geschwindig.: ████████████████████  5.5 Knoten                     │   │
│  │  Robustheit:   ██████░░░░░░░░░░░░░░  40 HP                          │   │
│  │  Kampfkraft:   ██░░░░░░░░░░░░░░░░░░  Minimal                        │   │
│  │                                                                      │   │
│  │  Preis: 400 Gold │ Crew: 8 │ Besonderheit: Kann Piraten entkommen  │   │
│  │                                                                      │   │
│  │  Ideal für: Eilige Lieferungen, Luxuswaren, Flucht                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🚢 HOLK                                                             │   │
│  │  "Der Ozeanriese"                                                    │   │
│  │                                                                      │   │
│  │  Kapazität:    ████████████████████  100 Einheiten                  │   │
│  │  Geschwindig.: █████░░░░░░░░░░░░░░░  2.5 Knoten                     │   │
│  │  Robustheit:   ████████████████░░░░  100 HP                         │   │
│  │  Kampfkraft:   ██████░░░░░░░░░░░░░░  Gut                            │   │
│  │                                                                      │   │
│  │  Preis: 1200 Gold │ Crew: 25 │ Besonderheit: Maximale Ladung       │   │
│  │                                                                      │   │
│  │  Ideal für: Massenwaren, lange Routen, erfahrene Spieler           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⚔️ KRAIER                                                           │   │
│  │  "Der Kriegskaufmann"                                                │   │
│  │                                                                      │   │
│  │  Kapazität:    ████████████░░░░░░░░  60 Einheiten                   │   │
│  │  Geschwindig.: ██████░░░░░░░░░░░░░░  3.0 Knoten                     │   │
│  │  Robustheit:   ████████████████░░░░  80 HP                          │   │
│  │  Kampfkraft:   ████████████████░░░░  Ausgezeichnet                  │   │
│  │                                                                      │   │
│  │  Preis: 800 Gold │ Crew: 20 │ Besonderheit: Bewaffnet              │   │
│  │                                                                      │   │
│  │  Ideal für: Gefährliche Routen, Piratenabwehr, Freibeuter          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Schiffs-Datenstruktur

```typescript
interface ShipType {
  id: string;
  name: string;
  nickname: string;
  description: string;

  // Basis-Statistiken
  capacity: number;           // Ladekapazität in Einheiten
  baseSpeed: number;          // Knoten (Seemeilen pro Stunde)
  maxHp: number;              // Robustheit / Lebenspunkte
  combatPower: number;        // 0-100 Kampfstärke

  // Kosten
  purchasePrice: number;      // Kaufpreis in Gold
  dailyMaintenance: number;   // Tägliche Unterhaltskosten
  repairCostPerHp: number;    // Kosten pro HP Reparatur

  // Crew
  minCrew: number;            // Mindest-Mannschaft
  maxCrew: number;            // Maximale Mannschaft
  optimalCrew: number;        // Optimale Mannschaft

  // Besonderheiten
  traits: ShipTrait[];

  // Freischaltung
  unlockCondition?: UnlockCondition;
}

type ShipTrait =
  | 'river_capable'     // Kann Flüsse befahren
  | 'fast_escape'       // +30% Fluchtchance vor Piraten
  | 'storm_resistant'   // -20% Sturmschaden
  | 'armed'             // Hat Kanonen
  | 'shallow_draft'     // Kann flache Gewässer befahren
  | 'luxurious'         // +10% Preis beim Verkauf von Luxuswaren
  | 'intimidating'      // Piraten greifen seltener an
  ;

const SHIP_TYPES: ShipType[] = [
  {
    id: 'ewer',
    name: 'Ewer',
    nickname: 'Der kleine Schnelle',
    description: 'Kleines, wendiges Küstenschiff. Ideal für kurze Strecken und Flüsse.',

    capacity: 20,
    baseSpeed: 4.5,
    maxHp: 30,
    combatPower: 5,

    purchasePrice: 200,
    dailyMaintenance: 5,
    repairCostPerHp: 2,

    minCrew: 2,
    maxCrew: 6,
    optimalCrew: 4,

    traits: ['river_capable', 'shallow_draft'],

    unlockCondition: null,  // Von Anfang an verfügbar
  },
  {
    id: 'kogge',
    name: 'Kogge',
    nickname: 'Das Arbeitstier der Hanse',
    description: 'Das Standard-Handelsschiff der Hanse. Ausgewogen in allen Bereichen.',

    capacity: 50,
    baseSpeed: 3.5,
    maxHp: 60,
    combatPower: 20,

    purchasePrice: 500,
    dailyMaintenance: 12,
    repairCostPerHp: 4,

    minCrew: 6,
    maxCrew: 18,
    optimalCrew: 12,

    traits: [],

    unlockCondition: null,  // Von Anfang an verfügbar
  },
  {
    id: 'schnigge',
    name: 'Schnigge',
    nickname: 'Der Windschnelle',
    description: 'Schnelles, schlankes Schiff. Perfekt für eilige Lieferungen und Flucht.',

    capacity: 30,
    baseSpeed: 5.5,
    maxHp: 40,
    combatPower: 10,

    purchasePrice: 400,
    dailyMaintenance: 10,
    repairCostPerHp: 5,

    minCrew: 4,
    maxCrew: 12,
    optimalCrew: 8,

    traits: ['fast_escape'],

    unlockCondition: { type: 'legacy', points: 3 },
  },
  {
    id: 'holk',
    name: 'Holk',
    nickname: 'Der Ozeanriese',
    description: 'Riesiges Handelsschiff für maximale Ladung. Langsam aber beeindruckend.',

    capacity: 100,
    baseSpeed: 2.5,
    maxHp: 100,
    combatPower: 35,

    purchasePrice: 1200,
    dailyMaintenance: 30,
    repairCostPerHp: 6,

    minCrew: 15,
    maxCrew: 35,
    optimalCrew: 25,

    traits: ['storm_resistant', 'intimidating'],

    unlockCondition: { type: 'legacy', points: 8 },
  },
  {
    id: 'kraier',
    name: 'Kraier',
    nickname: 'Der Kriegskaufmann',
    description: 'Bewaffnetes Handelsschiff. Kann sich gegen Piraten verteidigen.',

    capacity: 60,
    baseSpeed: 3.0,
    maxHp: 80,
    combatPower: 60,

    purchasePrice: 800,
    dailyMaintenance: 25,
    repairCostPerHp: 8,

    minCrew: 12,
    maxCrew: 30,
    optimalCrew: 20,

    traits: ['armed', 'intimidating'],

    unlockCondition: { type: 'legacy', points: 5 },
  },
];
```

---

## Schiffszustand & Reparatur

### Zustandssystem

```typescript
interface ShipCondition {
  currentHp: number;
  maxHp: number;
  percentage: number;  // currentHp / maxHp * 100

  // Zustandskategorien
  status: 'pristine' | 'good' | 'damaged' | 'critical' | 'sinking';

  // Aktive Schäden
  damages: ShipDamage[];
}

interface ShipDamage {
  id: string;
  type: DamageType;
  severity: 'minor' | 'moderate' | 'severe';
  effect: DamageEffect;
  repairCost: number;
}

type DamageType =
  | 'hull_breach'      // Leck im Rumpf
  | 'mast_damage'      // Mastschaden
  | 'sail_torn'        // Zerrissene Segel
  | 'rudder_damage'    // Ruderschaden
  | 'cargo_water'      // Wasser in der Ladung
  ;

const DAMAGE_EFFECTS: Record<DamageType, DamageEffect> = {
  hull_breach: {
    description: 'Wasser dringt ein. Geschwindigkeit -20%, weiterer Schaden möglich.',
    speedModifier: 0.8,
    continuousDamage: 1,  // 1 HP Verlust pro Stunde
  },
  mast_damage: {
    description: 'Gebrochener Mast. Geschwindigkeit -40%.',
    speedModifier: 0.6,
    continuousDamage: 0,
  },
  sail_torn: {
    description: 'Zerrissene Segel. Geschwindigkeit -15%.',
    speedModifier: 0.85,
    continuousDamage: 0,
  },
  rudder_damage: {
    description: 'Beschädigtes Ruder. Manövrierbarkeit stark eingeschränkt.',
    speedModifier: 0.9,
    fleeChanceModifier: 0.5,  // Flucht schwieriger
  },
  cargo_water: {
    description: 'Wasser in der Ladung. Verderbliche Waren verderben schneller.',
    cargoPerishModifier: 3.0,  // 3x schneller
  },
};

function getShipStatus(condition: ShipCondition): string {
  const pct = condition.percentage;

  if (pct >= 90) return 'pristine';   // Makellos
  if (pct >= 70) return 'good';       // Gut
  if (pct >= 50) return 'damaged';    // Beschädigt
  if (pct >= 25) return 'critical';   // Kritisch
  return 'sinking';                    // Sinkend
}
```

### Reparatur

```typescript
interface RepairOption {
  type: 'quick' | 'standard' | 'full';
  name: string;
  description: string;
  hpRestored: number | 'full';
  cost: number;
  time: number;  // Stunden
  availability: 'anywhere' | 'port' | 'shipyard';
}

const REPAIR_OPTIONS: RepairOption[] = [
  {
    type: 'quick',
    name: 'Notfall-Reparatur',
    description: 'Schnelle Flickarbeit. Hält nicht lange.',
    hpRestored: 10,
    cost: 20,
    time: 2,
    availability: 'anywhere',  // Auch auf See möglich
  },
  {
    type: 'standard',
    name: 'Standard-Reparatur',
    description: 'Solide Hafenreparatur.',
    hpRestored: 30,
    cost: 80,
    time: 8,
    availability: 'port',
  },
  {
    type: 'full',
    name: 'Werft-Überholung',
    description: 'Komplette Überholung in einer Werft. Wie neu!',
    hpRestored: 'full',
    cost: 200,
    time: 24,
    availability: 'shipyard',  // Nur in Städten mit Werft
  },
];

// Werft-Städte
const SHIPYARD_CITIES = ['rostock', 'luebeck', 'hamburg', 'danzig'];

// Reparatur-UI
// ┌─────────────────────────────────────────────────────────┐
// │  🔧 WERFT ROSTOCK                                       │
// │                                                          │
// │  "Salzprinz" - Kogge                                    │
// │  Zustand: ████████░░░░░░░░░░░░ 42%                      │
// │                                                          │
// │  Schäden:                                                │
// │  • Leck im Rumpf (Schwer) - 50 Gold                     │
// │  • Zerrissene Segel (Leicht) - 20 Gold                  │
// │                                                          │
// │  ┌─────────────────────────────────────────────────────┐│
// │  │ [Volle Reparatur]                                   ││
// │  │ 120 Gold │ 24 Stunden │ Zustand → 100%              ││
// │  └─────────────────────────────────────────────────────┘│
// │                                                          │
// │  ┌─────────────────────────────────────────────────────┐│
// │  │ [Nur kritische Schäden]                             ││
// │  │ 50 Gold │ 8 Stunden │ Leck reparieren               ││
// │  └─────────────────────────────────────────────────────┘│
// │                                                          │
// └─────────────────────────────────────────────────────────┘
```

---

## Schiffs-Namen

Der Spieler kann seinem Schiff einen Namen geben. Dies hat narrative Bedeutung
und erscheint in Events.

```typescript
// Vorgenerierte Namen zur Inspiration
const SHIP_NAME_SUGGESTIONS = [
  // Traditionell
  'Salzprinz', 'Sturmwind', 'Nordlicht', 'Möwenschwinge',
  'Hansestolz', 'Wellenbrecher', 'Seestern', 'Ostwind',

  // Religiös
  'Gottes Gnade', 'Heiliger Nikolaus', 'Mariensegen',

  // Heroisch
  'Unbezwingbar', 'Kühnheit', 'Eiserner Wille',

  // Humorvoll
  'Goldfisch', 'Seemannsbraut', 'Letzte Hoffnung',
];

// Schiffsnamen in Events
// "Der Kapitän der 'Salzprinz' wird in ganz Lübeck respektiert."
// "Die 'Unbezwingbar' hat schon manchen Sturm überstanden."
```

---

## Crew-System

### Übersicht

Dein Schiff braucht eine Mannschaft. Die Crew beeinflusst Effizienz, Moral und
ermöglicht spezielle Fähigkeiten.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CREW-SYSTEM                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CREW-GRÖSSE                                                                │
│  ───────────                                                                │
│  Unter Minimum:  Schiff nicht seetüchtig                                    │
│  Unter Optimal:  Geschwindigkeit reduziert, Moral sinkt                     │
│  Optimal:        Volle Effizienz                                            │
│  Über Optimal:   Höhere Unterhaltskosten, keine Vorteile                   │
│                                                                              │
│  MORAL (0-100)                                                              │
│  ────────────                                                               │
│  80-100:  Exzellent - Crew arbeitet härter (+10% Geschwindigkeit)          │
│  50-79:   Gut - Normale Effizienz                                          │
│  30-49:   Schlecht - Langsamere Arbeit (-10% Geschwindigkeit)              │
│  10-29:   Kritisch - Meuterei möglich!                                      │
│  0-9:     Meuterei! Crew übernimmt oder desertiert                         │
│                                                                              │
│  SPEZIALISTEN                                                               │
│  ────────────                                                               │
│  Normale Matrosen sind austauschbar. Aber Spezialisten haben               │
│  einzigartige Fähigkeiten und Persönlichkeiten.                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Crew-Struktur

```typescript
interface CrewState {
  // Gesamte Crew
  totalCrew: number;
  maxCrew: number;
  optimalCrew: number;

  // Moral
  morale: number;           // 0-100
  moraleStatus: 'excellent' | 'good' | 'poor' | 'critical' | 'mutiny';

  // Spezialisten
  specialists: CrewMember[];

  // Kosten
  dailyWages: number;       // Tägliche Löhne
}

interface CrewMember {
  id: string;
  name: string;
  role: CrewRole;

  // Fähigkeiten
  skill: number;            // 1-5 Sterne
  specialty: CrewSpecialty;

  // Persönlichkeit
  trait: CrewTrait;
  loyalty: number;          // 0-100

  // Geschichte
  origin: string;           // Herkunftsstadt
  backstory?: string;
  personalQuest?: string;   // Event-Kette für diesen Charakter

  // Kosten
  wage: number;             // Täglicher Lohn (höher als normale Crew)
}

type CrewRole =
  | 'navigator'     // Verbessert Reisegeschwindigkeit
  | 'merchant'      // Verbessert Handelspreise
  | 'boatswain'     // Verbessert Schiffsreparatur
  | 'cook'          // Verbessert Moral
  | 'surgeon'       // Kann Verletzungen heilen
  | 'guard'         // Verbessert Kampfkraft
  ;

type CrewSpecialty =
  | 'baltic_expert'     // Kennt die Ostsee wie seine Westentasche
  | 'storm_sailor'      // Erfahren mit Stürmen
  | 'haggler'           // Bessere Handelspreise
  | 'healer'            // Kann Krankheiten behandeln
  | 'multilingual'      // Spricht viele Sprachen (bessere Events)
  | 'former_pirate'     // Kennt Piraten-Gewohnheiten
  | 'noble_blood'       // Adelige Verbindungen
  | 'church_trained'    // Kirchliche Ausbildung
  ;

type CrewTrait =
  | 'loyal'            // Bleibt auch in Krisen
  | 'greedy'           // Will mehr Lohn, aber +Handelsbonus
  | 'superstitious'    // Verweigert bestimmte Routen/Aktionen
  | 'drunk'            // Probleme in Häfen, aber gute Gerüchte
  | 'pious'            // +Kirchen-Reputation, -Piraten-Events
  | 'scholar'          // Kann lesen (besondere Events)
  | 'criminal'         // +Piraten-Reputation, -Hanse-Reputation
  | 'pessimist'        // Senkt Moral, aber warnt vor Gefahren
  | 'optimist'         // Steigert Moral
  ;
```

### Crew-Rollen & Effekte

```typescript
const CREW_ROLE_EFFECTS: Record<CrewRole, CrewRoleEffect> = {
  navigator: {
    name: 'Navigator',
    description: 'Kennt die besten Routen und Strömungen.',
    effects: {
      travelSpeedBonus: (skill) => skill * 0.05,  // +5% pro Stern
      weatherPredictionBonus: (skill) => skill * 0.1,
    },
    wage: 8,
  },
  merchant: {
    name: 'Handelsmeister',
    description: 'Verhandelt bessere Preise.',
    effects: {
      buyPriceReduction: (skill) => skill * 0.02,   // -2% pro Stern
      sellPriceBonus: (skill) => skill * 0.02,      // +2% pro Stern
      rumorQuality: (skill) => skill * 0.1,
    },
    wage: 10,
  },
  boatswain: {
    name: 'Bootsmann',
    description: 'Hält das Schiff in Schuss.',
    effects: {
      repairCostReduction: (skill) => skill * 0.05,
      maintenanceReduction: (skill) => skill * 0.03,
      emergencyRepairBonus: (skill) => skill * 0.1,
    },
    wage: 6,
  },
  cook: {
    name: 'Schiffskoch',
    description: 'Gutes Essen = glückliche Mannschaft.',
    effects: {
      moraleBonusDaily: (skill) => skill * 1,       // +1 Moral pro Tag pro Stern
      foodConsumptionReduction: (skill) => skill * 0.05,
    },
    wage: 5,
  },
  surgeon: {
    name: 'Schiffschirurg',
    description: 'Behandelt Verletzungen und Krankheiten.',
    effects: {
      crewDeathPrevention: (skill) => skill * 0.15,  // -15% Todesrisiko pro Stern
      diseaseResistance: (skill) => skill * 0.1,
      healingSpeed: (skill) => skill * 0.2,
    },
    wage: 12,
  },
  guard: {
    name: 'Wachkommandant',
    description: 'Schützt das Schiff vor Angreifern.',
    effects: {
      combatBonus: (skill) => skill * 0.1,
      pirateDeterrence: (skill) => skill * 0.1,
      boardingDefense: (skill) => skill * 0.15,
    },
    wage: 8,
  },
};
```

### Crew-Beispiele

```typescript
const SAMPLE_CREW_MEMBERS: CrewMember[] = [
  {
    id: 'old_hansen',
    name: 'Alter Hansen',
    role: 'navigator',
    skill: 4,
    specialty: 'baltic_expert',
    trait: 'superstitious',
    loyalty: 70,
    origin: 'Rostock',
    backstory: 'Hat 40 Jahre die Ostsee befahren. Kennt jede Strömung.',
    wage: 10,
  },
  {
    id: 'one_eyed_karl',
    name: 'Einäugiger Karl',
    role: 'guard',
    skill: 5,
    specialty: 'former_pirate',
    trait: 'criminal',
    loyalty: 50,  // Unzuverlässig
    origin: 'Visby',
    backstory: 'Ehemaliger Vitalienbruder. Sucht Absolution... oder neue Beute.',
    personalQuest: 'karls_redemption',
    wage: 12,
  },
  {
    id: 'sister_helga',
    name: 'Schwester Helga',
    role: 'surgeon',
    skill: 4,
    specialty: 'church_trained',
    trait: 'pious',
    loyalty: 85,
    origin: 'Riga',
    backstory: 'Ehemalige Nonne. Verließ das Kloster, um der Welt zu helfen.',
    wage: 15,
  },
  {
    id: 'fat_magnus',
    name: 'Dicker Magnus',
    role: 'cook',
    skill: 3,
    specialty: 'multilingual',
    trait: 'optimist',
    loyalty: 90,
    origin: 'Stockholm',
    backstory: 'Kocht wie ein Gott. Spricht Schwedisch, Deutsch, Russisch und Latein.',
    wage: 6,
  },
];
```

---

## Moral-System

```typescript
interface MoraleFactors {
  base: 50;                  // Start-Moral

  // Positive Faktoren
  recentProfit: number;      // +1-10 basierend auf letztem Gewinn
  goodFood: number;          // +5 wenn Koch vorhanden
  fair_wages: number;        // +5 wenn überdurchschnittliche Löhne
  port_rest: number;         // +10 pro Tag im Hafen
  victory: number;           // +15 nach Kampfsieg
  captain_reputation: number; // +5-15 basierend auf Spieler-Ruf

  // Negative Faktoren
  long_voyage: number;       // -1 pro Tag auf See über 5 Tage
  low_wages: number;         // -10 wenn unterdurchschnittliche Löhne
  storm_survived: number;    // -5 pro überstandenem Sturm
  crew_death: number;        // -20 wenn Crew-Mitglied stirbt
  bad_food: number;          // -10 wenn kein Koch und >3 Tage auf See
  defeat: number;            // -25 nach Kampfniederlage
  overcrowded: number;       // -5 wenn über optimaler Crew
}

// Moral-Ereignisse
const MORALE_EVENTS = {
  mutiny_warning: {
    threshold: 25,
    message: "Die Mannschaft murrt. Du hörst Gerüchte über Meuterei...",
    options: [
      { text: "Bonus-Zahlung (50 Gold)", effect: { morale: 20, gold: -50 } },
      { text: "Disziplin durchsetzen", effect: { morale: -10, respect: -20 } },
      { text: "Ignorieren", effect: null },
    ],
  },
  mutiny: {
    threshold: 10,
    message: "Die Mannschaft meutert! Sie fordern deinen Rücktritt als Kapitän!",
    options: [
      { text: "Kapitulation (Run endet)", effect: { endRun: 'mutiny' } },
      { text: "Kämpfen", effect: { combatEvent: 'mutiny_fight' } },
      { text: "Verhandeln (100 Gold + Führungsprüfung)", effect: { /* */ } },
    ],
  },
};
```

---

## Schiffs-UI

### Schiffs-Status

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⛵ "SALZPRINZ" - Kogge                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ ZUSTAND ───────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  🔧 Zustand:   ████████████████░░░░░░░░░░░░░░░░░░░░  72%            │   │
│  │                [Beschädigt - Reparatur empfohlen]                   │   │
│  │                                                                      │   │
│  │  ⚠️ Schäden:  Zerrissene Segel (-15% Geschwindigkeit)              │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ LADUNG ────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  📦 Kapazität: 32/50 Einheiten                                      │   │
│  │                                                                      │   │
│  │  ████████████████████████████████░░░░░░░░░░░░░░░░░░ 64%             │   │
│  │                                                                      │   │
│  │  Inhalt:                                                            │   │
│  │  • 🧂 Salz ×20 (EK: 8 Gold)                                        │   │
│  │  • 🧵 Tuch ×8 (EK: 22 Gold)                                        │   │
│  │  • 🍺 Bier ×4 (EK: 12 Gold)                                        │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ MANNSCHAFT ────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  👥 Crew: 10/12 (Optimal: 12)                                       │   │
│  │  😊 Moral: ████████████████░░░░░░░░░░░░░░░░░░░░░░░░  68% [Gut]      │   │
│  │  💰 Tägliche Löhne: 15 Gold                                         │   │
│  │                                                                      │   │
│  │  Spezialisten:                                                      │   │
│  │  • 🧭 Alter Hansen (Navigator ⭐⭐⭐⭐) - +20% Reisegeschwindigkeit  │   │
│  │  • 🍳 Dicker Magnus (Koch ⭐⭐⭐) - +3 Moral pro Tag                 │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─ STATISTIKEN ───────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  💨 Geschwindigkeit: 3.8 Knoten (Basis 3.5 + Navigator-Bonus)      │   │
│  │  ⚔️ Kampfkraft: 25 (Basis 20 + Crew)                                │   │
│  │  🌊 Sturmresistenz: Standard                                        │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│       [🔧 Reparieren]    [👥 Crew verwalten]    [📦 Ladung verwalten]       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Schiff kaufen/verkaufen

```typescript
// Schiffskauf nur in Städten mit Werft
function canBuyShip(cityId: string): boolean {
  return SHIPYARD_CITIES.includes(cityId);
}

// Verkaufspreis = 60% des Neupreises, modifiziert durch Zustand
function getShipSellPrice(ship: Ship): number {
  const baseValue = SHIP_TYPES.find(t => t.id === ship.type)!.purchasePrice;
  const conditionMultiplier = ship.condition.percentage / 100;
  return Math.round(baseValue * 0.6 * conditionMultiplier);
}

// Schiffswechsel-UI
// ┌─────────────────────────────────────────────────────────┐
// │  🏗️ WERFT ROSTOCK                                       │
// │                                                          │
// │  Dein aktuelles Schiff:                                 │
// │  ⛵ "Salzprinz" (Kogge) - Zustand 72%                   │
// │  Verkaufswert: 216 Gold                                 │
// │                                                          │
// │  ────────────────────────────────────────────────────── │
// │                                                          │
// │  Verfügbare Schiffe:                                    │
// │                                                          │
// │  [🚣 Ewer]        200 Gold    [-16 Gold mit Tausch]     │
// │  [⛵ Kogge]       500 Gold    [+284 Gold mit Tausch]    │
// │  [🏃 Schnigge]   400 Gold    [+184 Gold mit Tausch] 🔒 │
// │  [🚢 Holk]       1200 Gold   [+984 Gold mit Tausch] 🔒 │
// │  [⚔️ Kraier]     800 Gold    [+584 Gold mit Tausch] 🔒 │
// │                                                          │
// │  🔒 = Benötigt Legacy-Freischaltung                     │
// │                                                          │
// └─────────────────────────────────────────────────────────┘
```

---

## Schiffserweiterungen (Optional)

```typescript
// Zukünftige Erweiterung: Schiffe können aufgerüstet werden

interface ShipUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  installTime: number;  // Stunden

  effect: UpgradeEffect;
  requirements?: UpgradeRequirement;
}

const SHIP_UPGRADES: ShipUpgrade[] = [
  {
    id: 'reinforced_hull',
    name: 'Verstärkter Rumpf',
    description: '+20 Max-HP',
    cost: 150,
    installTime: 12,
    effect: { maxHp: 20 },
  },
  {
    id: 'silk_sails',
    name: 'Seidensegel',
    description: '+10% Geschwindigkeit',
    cost: 200,
    installTime: 8,
    effect: { speedBonus: 0.1 },
  },
  {
    id: 'hidden_compartment',
    name: 'Geheimfach',
    description: '5 Einheiten Schmuggelware verstecken',
    cost: 100,
    installTime: 6,
    effect: { smuggleCapacity: 5 },
    requirements: { reputation: { pirates: 20 } },
  },
  {
    id: 'cannon_deck',
    name: 'Kanonendeck',
    description: '+30 Kampfkraft',
    cost: 400,
    installTime: 24,
    effect: { combatPower: 30 },
    requirements: { shipType: ['kogge', 'holk'] },
  },
];
```

---

*Weiter zu Teil 7: Run-System & Legacy*
