# HANSE NOVA – Game Design Document
## Teil 3: Städte & Handel

---

## Die 8 Hansestädte

Jede Stadt hat einen einzigartigen Charakter, eigene Produktionen und Bedürfnisse.

### Städte-Übersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DIE HANSESTÄDTE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  🏛️ LÜBECK            "Königin der Hanse"                                   │
│  ─────────────────────────────────────────                                  │
│  Produktion: Salz, Tuch                                                     │
│  Nachfrage:  Pelze, Bernstein, Getreide, Wachs                             │
│  Besonderheit: Hanserat (politische Events), Start-Stadt                    │
│  Gefahr: ⭐ (Sehr sicher)                                                   │
│                                                                              │
│  ⚓ HAMBURG            "Tor zur Nordsee"                                     │
│  ─────────────────────────────────────────                                  │
│  Produktion: Bier, Tuch                                                     │
│  Nachfrage:  Fisch, Holz, Getreide                                         │
│  Besonderheit: Brauereien, Zugang zur Nordsee (zukünftige Expansion)       │
│  Gefahr: ⭐ (Sehr sicher)                                                   │
│                                                                              │
│  🐟 ROSTOCK            "Fischerstadt"                                       │
│  ─────────────────────────────────────────                                  │
│  Produktion: Fisch, Teer                                                    │
│  Nachfrage:  Salz, Bier, Tuch                                              │
│  Besonderheit: Schiffswerft (Reparatur billiger), Fischmarkt               │
│  Gefahr: ⭐ (Sehr sicher)                                                   │
│                                                                              │
│  🌾 DANZIG             "Kornkammer des Nordens"                             │
│  ─────────────────────────────────────────                                  │
│  Produktion: Getreide, Holz, Bernstein                                      │
│  Nachfrage:  Salz, Tuch, Wein                                              │
│  Besonderheit: Größter Getreidemarkt, Bernstein-Monopol                    │
│  Gefahr: ⭐⭐ (Sicher)                                                      │
│                                                                              │
│  🏝️ VISBY              "Die Inselstadt"                                     │
│  ─────────────────────────────────────────                                  │
│  Produktion: Kalk, Wolle                                                    │
│  Nachfrage:  Getreide, Fisch, Wein                                         │
│  Besonderheit: Neutraler Hafen (alle Fraktionen willkommen), Piraten-Treff │
│  Gefahr: ⭐⭐ (Sicher, aber Piraten in Nähe)                                │
│                                                                              │
│  ⚔️ STOCKHOLM          "Die Schwedische Krone"                              │
│  ─────────────────────────────────────────                                  │
│  Produktion: Eisen, Kupfer, Holz                                            │
│  Nachfrage:  Tuch, Salz, Wein, Gewürze                                     │
│  Besonderheit: Metallhandel, königliche Aufträge möglich                   │
│  Gefahr: ⭐⭐⭐ (Mittel - lange Route)                                      │
│                                                                              │
│  🌿 RIGA                "Tor zum Osten"                                     │
│  ─────────────────────────────────────────                                  │
│  Produktion: Flachs, Hanf, Honig                                            │
│  Nachfrage:  Salz, Tuch, Metallwaren                                       │
│  Besonderheit: Deutscher Orden (Kirchen-Fraktion stark)                    │
│  Gefahr: ⭐⭐⭐ (Mittel)                                                    │
│                                                                              │
│  🏰 REVAL               "Die Festung"                                       │
│  ─────────────────────────────────────────                                  │
│  Produktion: Felle (minderwertig), Getreide                                 │
│  Nachfrage:  Luxuswaren, Waffen, Tuch                                      │
│  Besonderheit: Militär-Stützpunkt, Waffenhandel legal                      │
│  Gefahr: ⭐⭐⭐⭐ (Riskant - weit, Winter-Blockade)                         │
│                                                                              │
│  ❄️ NOWGOROD           "Das Ende der Welt"                                  │
│  ─────────────────────────────────────────                                  │
│  Produktion: Pelze (Zobel, Hermelin), Wachs, Honig                         │
│  Nachfrage:  Tuch, Salz, Wein, Metallwaren, Silber                         │
│  Besonderheit: Exotische Luxuswaren, höchste Profite, Winter-Blockade      │
│  Gefahr: ⭐⭐⭐⭐⭐ (Gefährlich - Räuber, Eis, lange Route)                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stadt-Datenstruktur

```typescript
interface City {
  // Identifikation
  id: string;
  name: string;
  nickname: string;

  // Position auf der Karte
  position: { x: number; y: number };

  // Wirtschaft
  produces: GoodType[];           // Güter, die hier produziert werden (günstig)
  demands: GoodType[];            // Güter, die hier gebraucht werden (teuer)
  productionStrength: Record<GoodType, number>;  // 0.5 - 2.0 Produktions-Multiplikator

  // Charakter
  population: number;             // Einwohner (beeinflusst Handelsvolumen)
  wealth: 'poor' | 'average' | 'rich' | 'wealthy';
  dangerLevel: number;            // 0.0 - 1.0
  hanseInfluence: number;         // 0.0 - 1.0 (wie stark ist die Hanse hier?)

  // Besonderheiten
  specialFeatures: CityFeature[];
  blockedInWinter: boolean;       // Hafen friert zu
  blockedMonths?: [number, number]; // Von Monat X bis Y

  // Events
  uniqueEvents: string[];         // Events, die nur hier passieren
  eventFrequency: number;         // 0.0 - 1.0 (wie oft Events?)
}

type CityFeature =
  | 'shipyard'           // Schiffswerft (Reparatur -30%, Schiffe kaufen)
  | 'hanse_council'      // Hanserat (politische Events)
  | 'black_market'       // Schwarzmarkt (Schmuggelware)
  | 'monastery'          // Kloster (Kirchenfraktion, Heilung)
  | 'fortress'           // Festung (sicher, aber strenge Kontrollen)
  | 'pirate_haven'       // Piratentreff (Piraten-Events)
  | 'trade_fair'         // Regelmäßige Handelsmesse
  | 'university'         // Gelehrte (spezielle Events)
  | 'royal_court';       // Königshof (Adels-Fraktion stark)
```

### Komplette Stadt-Definitionen

```typescript
const CITIES: City[] = [
  {
    id: 'luebeck',
    name: 'Lübeck',
    nickname: 'Königin der Hanse',
    position: { x: 280, y: 580 },
    produces: ['salt', 'cloth'],
    demands: ['fur', 'amber', 'grain', 'wax'],
    productionStrength: { salt: 1.8, cloth: 1.4 },
    population: 25000,
    wealth: 'wealthy',
    dangerLevel: 0.05,
    hanseInfluence: 1.0,  // Hauptstadt der Hanse
    specialFeatures: ['hanse_council', 'shipyard', 'trade_fair'],
    blockedInWinter: false,
    uniqueEvents: [
      'hanse_council_meeting',
      'merchant_guild_initiation',
      'salt_monopoly_dispute',
      'lubeck_fire',
    ],
    eventFrequency: 0.7,
  },
  {
    id: 'hamburg',
    name: 'Hamburg',
    nickname: 'Tor zur Nordsee',
    position: { x: 180, y: 650 },
    produces: ['beer', 'cloth'],
    demands: ['fish', 'timber', 'grain'],
    productionStrength: { beer: 2.0, cloth: 1.2 },
    population: 15000,
    wealth: 'rich',
    dangerLevel: 0.05,
    hanseInfluence: 0.85,
    specialFeatures: ['shipyard', 'trade_fair'],
    blockedInWinter: false,
    uniqueEvents: [
      'brewery_competition',
      'elbe_flooding',
      'north_sea_traders',
    ],
    eventFrequency: 0.5,
  },
  {
    id: 'rostock',
    name: 'Rostock',
    nickname: 'Fischerstadt',
    position: { x: 380, y: 620 },
    produces: ['fish', 'tar'],
    demands: ['salt', 'beer', 'cloth'],
    productionStrength: { fish: 1.8, tar: 1.5 },
    population: 12000,
    wealth: 'average',
    dangerLevel: 0.08,
    hanseInfluence: 0.7,
    specialFeatures: ['shipyard'],  // Beste Werft
    blockedInWinter: false,
    uniqueEvents: [
      'fishing_competition',
      'ship_launch_ceremony',
      'university_founding',  // Historisch: 1419
    ],
    eventFrequency: 0.4,
  },
  {
    id: 'danzig',
    name: 'Danzig',
    nickname: 'Kornkammer des Nordens',
    position: { x: 580, y: 560 },
    produces: ['grain', 'timber', 'amber'],
    demands: ['salt', 'cloth', 'wine'],
    productionStrength: { grain: 2.0, timber: 1.6, amber: 1.5 },
    population: 20000,
    wealth: 'rich',
    dangerLevel: 0.12,
    hanseInfluence: 0.8,
    specialFeatures: ['trade_fair', 'hanse_council'],
    blockedInWinter: false,
    uniqueEvents: [
      'amber_discovery',
      'grain_shortage',
      'teutonic_knights_conflict',
      'polish_traders',
    ],
    eventFrequency: 0.6,
  },
  {
    id: 'visby',
    name: 'Visby',
    nickname: 'Die Inselstadt',
    position: { x: 420, y: 420 },
    produces: ['limestone', 'wool'],
    demands: ['grain', 'fish', 'wine'],
    productionStrength: { limestone: 1.4, wool: 1.2 },
    population: 8000,
    wealth: 'rich',
    dangerLevel: 0.15,
    hanseInfluence: 0.5,  // Neutral
    specialFeatures: ['pirate_haven', 'black_market'],
    blockedInWinter: false,
    uniqueEvents: [
      'pirate_auction',
      'gotland_festival',
      'smuggler_offer',
      'danish_raid',
    ],
    eventFrequency: 0.65,
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    nickname: 'Die Schwedische Krone',
    position: { x: 380, y: 280 },
    produces: ['iron', 'copper', 'timber'],
    demands: ['cloth', 'salt', 'wine', 'spices'],
    productionStrength: { iron: 2.0, copper: 1.8, timber: 1.3 },
    population: 10000,
    wealth: 'rich',
    dangerLevel: 0.2,
    hanseInfluence: 0.4,
    specialFeatures: ['royal_court', 'fortress'],
    blockedInWinter: false,
    uniqueEvents: [
      'royal_commission',
      'iron_mine_discovery',
      'swedish_danish_war',
      'court_intrigue',
    ],
    eventFrequency: 0.55,
  },
  {
    id: 'riga',
    name: 'Riga',
    nickname: 'Tor zum Osten',
    position: { x: 620, y: 340 },
    produces: ['flax', 'hemp', 'honey'],
    demands: ['salt', 'cloth', 'metal_goods'],
    productionStrength: { flax: 1.7, hemp: 1.5, honey: 1.4 },
    population: 8000,
    wealth: 'average',
    dangerLevel: 0.25,
    hanseInfluence: 0.6,
    specialFeatures: ['monastery', 'fortress'],
    blockedInWinter: false,
    blockedMonths: [1, 2],  // Januar-Februar evtl. Eis
    uniqueEvents: [
      'teutonic_order_request',
      'livonian_conflict',
      'eastern_caravan',
      'pagan_festival',
    ],
    eventFrequency: 0.5,
  },
  {
    id: 'reval',
    name: 'Reval',
    nickname: 'Die Festung',
    position: { x: 580, y: 220 },
    produces: ['fur_low', 'grain'],
    demands: ['luxury_goods', 'weapons', 'cloth'],
    productionStrength: { fur_low: 1.3, grain: 1.1 },
    population: 5000,
    wealth: 'average',
    dangerLevel: 0.35,
    hanseInfluence: 0.55,
    specialFeatures: ['fortress'],
    blockedInWinter: true,
    blockedMonths: [12, 1, 2],  // Dezember-Februar
    uniqueEvents: [
      'military_supplies_needed',
      'ice_breaking_ceremony',
      'estonian_uprising',
    ],
    eventFrequency: 0.45,
  },
  {
    id: 'novgorod',
    name: 'Nowgorod',
    nickname: 'Das Ende der Welt',
    position: { x: 720, y: 120 },
    produces: ['fur_sable', 'fur_ermine', 'wax', 'honey'],
    demands: ['cloth', 'salt', 'wine', 'metal_goods', 'silver'],
    productionStrength: { fur_sable: 2.0, fur_ermine: 2.0, wax: 1.8, honey: 1.6 },
    population: 30000,  // Historisch größte Stadt der Region
    wealth: 'wealthy',
    dangerLevel: 0.5,
    hanseInfluence: 0.3,  // Hanse hat nur ein Kontor
    specialFeatures: ['trade_fair', 'black_market'],
    blockedInWinter: true,
    blockedMonths: [11, 12, 1, 2, 3],  // November-März
    uniqueEvents: [
      'fur_auction',
      'tartar_threat',
      'orthodox_blessing',
      'boyar_feast',
      'novgorod_republic_politics',
      'frozen_river_crossing',
    ],
    eventFrequency: 0.8,  // Viele Events wegen Exotik
  },
];
```

---

## Waren-System

### Waren-Kategorien

```typescript
type GoodCategory =
  | 'bulk'          // Massenwaren (Getreide, Holz, Salz)
  | 'food'          // Nahrungsmittel (Fisch, Bier, Honig)
  | 'raw_material'  // Rohstoffe (Eisen, Flachs, Teer)
  | 'manufactured'  // Verarbeitete Waren (Tuch, Metallwaren)
  | 'luxury'        // Luxusgüter (Pelze, Bernstein, Gewürze)
  | 'contraband';   // Schmuggelware (Waffen, verbotene Bücher)

interface Good {
  id: string;
  name: string;
  category: GoodCategory;
  basePrice: number;           // Basispreis in Gold
  weight: number;              // Gewichtseinheiten pro Stück
  volatility: number;          // Preisschwankung (0.1 - 0.5)
  perishable: boolean;         // Verderblich?
  perishRate?: number;         // Verlust pro Tag (0.01 - 0.1)
  legal: boolean;              // Legal handelbar?
  rarity: 'common' | 'uncommon' | 'rare' | 'exotic';
}
```

### Komplette Waren-Liste

```typescript
const GOODS: Good[] = [
  // ═══════════════════════════════════════════════════════════════════
  // MASSENWAREN (Bulk) - Hohes Volumen, niedriger Gewinn pro Einheit
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'grain',
    name: 'Getreide',
    category: 'bulk',
    basePrice: 8,
    weight: 2,
    volatility: 0.3,      // Stark saisonabhängig
    perishable: true,
    perishRate: 0.02,     // 2% Verlust pro Tag bei schlechter Lagerung
    legal: true,
    rarity: 'common',
  },
  {
    id: 'salt',
    name: 'Salz',
    category: 'bulk',
    basePrice: 15,
    weight: 2,
    volatility: 0.15,     // Relativ stabil (Monopol)
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'timber',
    name: 'Holz',
    category: 'bulk',
    basePrice: 6,
    weight: 4,            // Schwer!
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'common',
  },

  // ═══════════════════════════════════════════════════════════════════
  // NAHRUNGSMITTEL (Food)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'fish',
    name: 'Fisch (gesalzen)',
    category: 'food',
    basePrice: 10,
    weight: 1.5,
    volatility: 0.25,
    perishable: true,
    perishRate: 0.03,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'beer',
    name: 'Bier',
    category: 'food',
    basePrice: 12,
    weight: 2,
    volatility: 0.2,
    perishable: true,
    perishRate: 0.01,     // Hält relativ lange
    legal: true,
    rarity: 'common',
  },
  {
    id: 'honey',
    name: 'Honig',
    category: 'food',
    basePrice: 25,
    weight: 1,
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'uncommon',
  },
  {
    id: 'wine',
    name: 'Wein',
    category: 'food',
    basePrice: 45,
    weight: 2,
    volatility: 0.25,
    perishable: true,
    perishRate: 0.005,    // Hält sehr lange
    legal: true,
    rarity: 'uncommon',
  },

  // ═══════════════════════════════════════════════════════════════════
  // ROHSTOFFE (Raw Materials)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'iron',
    name: 'Eisen',
    category: 'raw_material',
    basePrice: 20,
    weight: 3,
    volatility: 0.15,
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'copper',
    name: 'Kupfer',
    category: 'raw_material',
    basePrice: 28,
    weight: 3,
    volatility: 0.18,
    perishable: false,
    legal: true,
    rarity: 'uncommon',
  },
  {
    id: 'tar',
    name: 'Teer',
    category: 'raw_material',
    basePrice: 14,
    weight: 2,
    volatility: 0.15,
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'flax',
    name: 'Flachs',
    category: 'raw_material',
    basePrice: 16,
    weight: 1,
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'hemp',
    name: 'Hanf',
    category: 'raw_material',
    basePrice: 14,
    weight: 1,
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'wax',
    name: 'Wachs',
    category: 'raw_material',
    basePrice: 35,
    weight: 1,
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'uncommon',
  },
  {
    id: 'wool',
    name: 'Wolle',
    category: 'raw_material',
    basePrice: 18,
    weight: 1.5,
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'limestone',
    name: 'Kite',
    category: 'raw_material',
    basePrice: 5,
    weight: 5,            // Sehr schwer
    volatility: 0.1,
    perishable: false,
    legal: true,
    rarity: 'common',
  },

  // ═══════════════════════════════════════════════════════════════════
  // VERARBEITETE WAREN (Manufactured)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'cloth',
    name: 'Tuch',
    category: 'manufactured',
    basePrice: 35,
    weight: 0.5,
    volatility: 0.2,
    perishable: false,
    legal: true,
    rarity: 'common',
  },
  {
    id: 'metal_goods',
    name: 'Metallwaren',
    category: 'manufactured',
    basePrice: 50,
    weight: 2,
    volatility: 0.15,
    perishable: false,
    legal: true,
    rarity: 'uncommon',
  },

  // ═══════════════════════════════════════════════════════════════════
  // LUXUSWAREN (Luxury) - Hoher Wert, hoher Gewinn
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'fur_common',
    name: 'Pelze (einfach)',
    category: 'luxury',
    basePrice: 40,
    weight: 0.5,
    volatility: 0.3,
    perishable: false,
    legal: true,
    rarity: 'uncommon',
  },
  {
    id: 'fur_sable',
    name: 'Zobelpelz',
    category: 'luxury',
    basePrice: 120,
    weight: 0.3,
    volatility: 0.35,
    perishable: false,
    legal: true,
    rarity: 'rare',
  },
  {
    id: 'fur_ermine',
    name: 'Hermelin',
    category: 'luxury',
    basePrice: 180,
    weight: 0.2,
    volatility: 0.4,
    perishable: false,
    legal: true,
    rarity: 'exotic',
  },
  {
    id: 'amber',
    name: 'Bernstein',
    category: 'luxury',
    basePrice: 80,
    weight: 0.2,
    volatility: 0.25,
    perishable: false,
    legal: true,
    rarity: 'rare',
  },
  {
    id: 'spices',
    name: 'Gewürze',
    category: 'luxury',
    basePrice: 150,
    weight: 0.1,
    volatility: 0.35,
    perishable: false,
    legal: true,
    rarity: 'exotic',
  },
  {
    id: 'silver',
    name: 'Silber',
    category: 'luxury',
    basePrice: 200,
    weight: 0.5,
    volatility: 0.15,     // Stabil
    perishable: false,
    legal: true,
    rarity: 'rare',
  },

  // ═══════════════════════════════════════════════════════════════════
  // SCHMUGGELWARE (Contraband) - Illegal, sehr hoher Gewinn
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'weapons',
    name: 'Waffen',
    category: 'contraband',
    basePrice: 100,
    weight: 2,
    volatility: 0.4,
    perishable: false,
    legal: false,         // Nur in bestimmten Städten/Situationen legal
    rarity: 'rare',
  },
  {
    id: 'forbidden_books',
    name: 'Verbotene Schriften',
    category: 'contraband',
    basePrice: 60,
    weight: 0.3,
    volatility: 0.5,
    perishable: false,
    legal: false,
    rarity: 'rare',
  },
  {
    id: 'counterfeit',
    name: 'Falschgeld',
    category: 'contraband',
    basePrice: 80,
    weight: 0.5,
    volatility: 0.6,
    perishable: false,
    legal: false,
    rarity: 'exotic',
  },
];
```

---

## Preissystem

### Preis-Berechnung

```typescript
interface MarketState {
  cityId: string;
  goodId: string;

  // Aktueller Preis
  currentPrice: number;

  // Angebot & Nachfrage
  supply: number;           // 0-200 (100 = normal)
  demand: number;           // 0-200 (100 = normal)

  // Trend
  trend: 'rising' | 'stable' | 'falling';
  trendStrength: number;    // 0.0 - 1.0

  // Aktive Modifikatoren
  modifiers: PriceModifier[];

  // Letzte Aktualisierung
  lastUpdated: Date;
}

interface PriceModifier {
  id: string;
  source: string;           // "war", "plague", "festival", "player_action"
  multiplier: number;       // 0.3 - 3.0
  remainingDuration: number; // Stunden
  description: string;
}

function calculateCurrentPrice(
  good: Good,
  city: City,
  marketState: MarketState,
  season: Season
): number {
  let price = good.basePrice;

  // 1. Produktions-Bonus (Stadt produziert diese Ware)
  if (city.produces.includes(good.id)) {
    const strength = city.productionStrength[good.id] || 1.0;
    price *= (1 / strength);  // Produktionsstärke 2.0 = halber Preis
  }

  // 2. Nachfrage-Aufschlag (Stadt braucht diese Ware)
  if (city.demands.includes(good.id)) {
    price *= 1.4;  // +40% Aufschlag
  }

  // 3. Angebot/Nachfrage-Verhältnis
  const supplyDemandRatio = marketState.demand / Math.max(marketState.supply, 10);
  const sdMultiplier = Math.min(Math.max(supplyDemandRatio, 0.5), 2.5);
  price *= sdMultiplier;

  // 4. Saisonale Modifikatoren
  const seasonMod = SEASONS[season].priceModifiers[good.category] || 1.0;
  price *= seasonMod;

  // 5. Aktive Event-Modifikatoren
  for (const mod of marketState.modifiers) {
    price *= mod.multiplier;
  }

  // 6. Zufällige Tagesschwankung
  const dailyVariance = 1 + (Math.random() - 0.5) * good.volatility * 0.5;
  price *= dailyVariance;

  // 7. Stadt-Wohlstand
  const wealthMultiplier = {
    poor: 0.8,
    average: 1.0,
    rich: 1.15,
    wealthy: 1.3,
  };
  price *= wealthMultiplier[city.wealth];

  return Math.round(price);
}
```

### Preis-Beispiele

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BEISPIEL-PREISE (Sommer, normale Verhältnisse)            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Ware           │ Lübeck  │ Danzig  │ Nowgorod │ Anmerkung                  │
│  ───────────────┼─────────┼─────────┼──────────┼─────────────────────────── │
│  Salz           │ 8 💰    │ 22 💰   │ 35 💰    │ Lübeck produziert          │
│  Getreide       │ 12 💰   │ 5 💰    │ 18 💰    │ Danzig = Kornkammer        │
│  Tuch           │ 20 💰   │ 42 💰   │ 55 💰    │ Lübeck produziert          │
│  Zobelpelz      │ 160 💰  │ 140 💰  │ 60 💰    │ Nowgorod = Pelzparadies    │
│  Bernstein      │ 95 💰   │ 45 💰   │ 110 💰   │ Danzig = Bernstein-Monopol │
│                                                                              │
│  💡 Profit-Beispiel:                                                        │
│     Salz in Lübeck kaufen (8) → in Nowgorod verkaufen (35) = +337% Gewinn  │
│     Zobelpelz in Nowgorod (60) → in Lübeck (160) = +167% Gewinn            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Handels-Interface

### Markt-UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MARKTPLATZ LÜBECK                                        💰 2.450 Gold     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ KAUFEN ─────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  Ware           │ Preis │ Vorrat │ Trend  │ Aktion                   │  │
│  │  ───────────────┼───────┼────────┼────────┼───────────────────────── │  │
│  │  🧂 Salz        │ 8     │ ████   │ →      │ [+1] [+10] [+Max]       │  │
│  │  🧵 Tuch        │ 22    │ ███    │ ↗️      │ [+1] [+10] [+Max]       │  │
│  │  🍺 Bier        │ 14    │ █████  │ →      │ [+1] [+10] [+Max]       │  │
│  │  🐟 Fisch       │ 12    │ ██     │ ↘️      │ [+1] [+10] [+Max]       │  │
│  │                                                                       │  │
│  │  💡 Gerücht: "In Danzig zahlen sie das Doppelte für Salz!"          │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ VERKAUFEN ──────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  Deine Ladung (32/50 belegt):                                        │  │
│  │                                                                       │  │
│  │  Ware           │ Menge │ EK    │ VK hier │ Gewinn │ Aktion          │  │
│  │  ───────────────┼───────┼───────┼─────────┼────────┼──────────────── │  │
│  │  🧂 Salz        │ 20    │ 8     │ 8       │ ±0     │ (Heimatstadt)   │  │
│  │  🧵 Tuch        │ 8     │ 20    │ 22      │ +16    │ [-1] [-All]     │  │
│  │  🍺 Bier        │ 4     │ 12    │ 14      │ +8     │ [-1] [-All]     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ SCHNELLKAUF ────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  Salz x 10 = 80 Gold         [Kaufen]                                │  │
│  │  Verfügbar: 2.450 Gold │ Laderaum frei: 18 Einheiten                 │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│           [🏠 Zur Stadt]            [⚓ Zum Hafen]                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Handels-Logik

```typescript
interface TradeTransaction {
  type: 'buy' | 'sell';
  goodId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  cityId: string;
  timestamp: Date;
}

interface TradeValidation {
  valid: boolean;
  reason?: string;
  maxQuantity?: number;
}

function validateBuy(
  player: PlayerState,
  good: Good,
  quantity: number,
  pricePerUnit: number,
  marketState: MarketState
): TradeValidation {
  const totalCost = pricePerUnit * quantity;

  // Genug Gold?
  if (player.gold < totalCost) {
    const affordable = Math.floor(player.gold / pricePerUnit);
    return {
      valid: false,
      reason: `Nicht genug Gold. Du kannst dir ${affordable} leisten.`,
      maxQuantity: affordable,
    };
  }

  // Genug Laderaum?
  const weightNeeded = good.weight * quantity;
  const freeCapacity = player.ship.capacity - player.ship.currentLoad;
  if (weightNeeded > freeCapacity) {
    const maxByCapacity = Math.floor(freeCapacity / good.weight);
    return {
      valid: false,
      reason: `Nicht genug Laderaum. Platz für ${maxByCapacity} Einheiten.`,
      maxQuantity: maxByCapacity,
    };
  }

  // Genug Vorrat im Markt?
  const availableInMarket = Math.floor(marketState.supply / 10); // Vereinfacht
  if (quantity > availableInMarket) {
    return {
      valid: false,
      reason: `Nur ${availableInMarket} verfügbar.`,
      maxQuantity: availableInMarket,
    };
  }

  // Schmuggelware?
  if (!good.legal && !player.hasBlackMarketAccess) {
    return {
      valid: false,
      reason: 'Diese Ware ist illegal. Du brauchst Schwarzmarkt-Zugang.',
    };
  }

  return { valid: true };
}

function executeBuy(
  player: PlayerState,
  good: Good,
  quantity: number,
  pricePerUnit: number,
  cityId: string
): TradeTransaction {
  const totalPrice = pricePerUnit * quantity;

  // Gold abziehen
  player.gold -= totalPrice;

  // Zur Ladung hinzufügen
  const existingCargo = player.ship.cargo.find(c => c.goodId === good.id);
  if (existingCargo) {
    existingCargo.quantity += quantity;
    // Durchschnittlichen Einkaufspreis aktualisieren
    existingCargo.avgBuyPrice = (
      (existingCargo.avgBuyPrice * existingCargo.quantity + pricePerUnit * quantity)
      / (existingCargo.quantity + quantity)
    );
  } else {
    player.ship.cargo.push({
      goodId: good.id,
      quantity,
      avgBuyPrice: pricePerUnit,
      boughtAt: cityId,
      boughtTime: new Date(),
    });
  }

  // Schiffsladung aktualisieren
  player.ship.currentLoad += good.weight * quantity;

  // Markt aktualisieren (Angebot sinkt)
  updateMarketSupply(cityId, good.id, -quantity);

  // Statistik
  player.stats.totalPurchases++;
  player.stats.totalGoldSpent += totalPrice;

  return {
    type: 'buy',
    goodId: good.id,
    quantity,
    pricePerUnit,
    totalPrice,
    cityId,
    timestamp: new Date(),
  };
}
```

---

## Gerüchte-System

Spieler können in Tavernen und auf dem Markt Gerüchte über Preise hören.

```typescript
interface Rumor {
  id: string;
  text: string;
  targetCity: string;
  targetGood: string;
  priceHint: 'very_high' | 'high' | 'low' | 'very_low';
  accuracy: number;         // 0.0 - 1.0 (wie verlässlich?)
  expiresIn: number;        // Stunden
  source: 'tavern' | 'merchant' | 'sailor' | 'official';
}

const RUMOR_TEMPLATES = [
  {
    template: "In {city} zahlen sie ein Vermögen für {good}!",
    priceHint: 'very_high',
    accuracy: 0.7,
  },
  {
    template: "Ein Händler aus {city} beklagte sich über zu viel {good}...",
    priceHint: 'very_low',
    accuracy: 0.6,
  },
  {
    template: "Krieg im Osten! {good} wird knapp werden.",
    priceHint: 'high',
    accuracy: 0.5,  // Gerüchte über Zukunft sind unzuverlässiger
  },
  {
    template: "Die {city}er Kaufleute suchen dringend {good}.",
    priceHint: 'high',
    accuracy: 0.8,
  },
];

// UI Darstellung:
// ┌─────────────────────────────────────────────┐
// │  🍺 TAVERNE "Zum goldenen Anker"            │
// │                                              │
// │  Du hörst Gerüchte...                       │
// │                                              │
// │  🗣️ "In Danzig zahlen sie das Doppelte    │
// │      für Salz! Die Vorräte sind leer."      │
// │      (Quelle: Betrunkener Seemann)          │
// │                                              │
// │  🗣️ "Ein Schiff voller Tuch ist in        │
// │      Nowgorod gestrandet. Preise fallen."   │
// │      (Quelle: Russischer Händler)           │
// │                                              │
// └─────────────────────────────────────────────┘
```

---

## Markt-Dynamik

Der Markt verändert sich basierend auf Spieler-Aktionen und Events.

```typescript
// Wenn ein Spieler kauft, sinkt das Angebot
function updateMarketSupply(
  cityId: string,
  goodId: string,
  change: number  // negativ = Spieler hat gekauft
): void {
  const market = getMarketState(cityId, goodId);

  market.supply = Math.max(10, Math.min(200, market.supply + change * 2));

  // Trend aktualisieren
  if (change < -10) {
    market.trend = 'rising';       // Viel gekauft = Preise steigen
  } else if (change > 10) {
    market.trend = 'falling';      // Viel verkauft = Preise fallen
  }
}

// Märkte regenerieren sich über Zeit
function regenerateMarkets(): void {
  for (const city of CITIES) {
    for (const good of GOODS) {
      const market = getMarketState(city.id, good.id);

      // Produzierende Städte regenerieren schneller
      const regenRate = city.produces.includes(good.id) ? 5 : 2;

      // Zur Norm zurückkehren
      if (market.supply < 100) {
        market.supply = Math.min(100, market.supply + regenRate);
      } else if (market.supply > 100) {
        market.supply = Math.max(100, market.supply - regenRate);
      }
    }
  }
}
```

---

*Weiter zu Teil 4: Event-System*
