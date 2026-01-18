# HANSE NOVA – Game Design Document
## Teil 7: Run-System & Legacy

---

## Run-System Übersicht

Ein "Run" ist ein einzelner Spieldurchgang mit klarem Ziel. Runs sind das
Herzstück des Roguelike-Aspekts von HANSE NOVA.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RUN-SYSTEM                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WAS IST EIN RUN?                                                           │
│  ────────────────                                                           │
│  • Ein abgeschlossener Spieldurchgang mit klarem Start und Ziel            │
│  • Dauert typischerweise 15-45 Minuten                                      │
│  • Endet mit Erfolg (Ziel erreicht) oder Scheitern (Bankrott/Untergang)    │
│  • Jeder Run ist einzigartig durch zufällige Events und Entscheidungen     │
│                                                                              │
│  WARUM RUNS?                                                                │
│  ───────────                                                                │
│  • Klarer Spannungsbogen (Anfang, Mitte, Ende)                             │
│  • Kurze, befriedigende Spielsessions                                       │
│  • "One more run" Suchtfaktor                                               │
│  • Permanente Progression durch Legacy-System                               │
│  • Vergleichbarkeit durch Leaderboards                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Run-Konfiguration

### Ziel-Stufen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEUEN RUN STARTEN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Wähle deine Herausforderung:                                               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⭐ HÄNDLER                                                          │   │
│  │  ─────────────                                                       │   │
│  │  Startkapital: 500 Gold                                              │   │
│  │  Ziel: 2.000 Gold erreichen                                          │   │
│  │                                                                      │   │
│  │  Empfohlen für: Anfänger, kurze Sessions                            │   │
│  │  Geschätzte Dauer: 10-20 Minuten                                     │   │
│  │  Legacy-Punkte: 1 bei Erfolg                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⭐⭐ KAUFMANN                                                       │   │
│  │  ──────────────                                                      │   │
│  │  Startkapital: 500 Gold                                              │   │
│  │  Ziel: 5.000 Gold erreichen                                          │   │
│  │                                                                      │   │
│  │  Empfohlen für: Erfahrene Spieler                                   │   │
│  │  Geschätzte Dauer: 20-35 Minuten                                     │   │
│  │  Legacy-Punkte: 2 bei Erfolg                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⭐⭐⭐ PATRIZIER                                                    │   │
│  │  ────────────────                                                    │   │
│  │  Startkapital: 500 Gold                                              │   │
│  │  Ziel: 15.000 Gold erreichen                                         │   │
│  │                                                                      │   │
│  │  Empfohlen für: Experten, Marathon-Sessions                         │   │
│  │  Geschätzte Dauer: 35-60 Minuten                                     │   │
│  │  Legacy-Punkte: 4 bei Erfolg                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🎯 DAILY CHALLENGE                                                  │   │
│  │  ─────────────────                                                   │   │
│  │  Täglich wechselnde Spezial-Herausforderung                         │   │
│  │  Alle Spieler haben identische Startbedingungen                     │   │
│  │                                                                      │   │
│  │  Heute: "Der Salzprinz"                                              │   │
│  │  Starte in Hamburg. Liefere 50 Salz nach Nowgorod.                  │   │
│  │  Modifikator: Stürme +30% häufiger                                  │   │
│  │                                                                      │   │
│  │  🏆 Schnellste Zeit heute: 3T 14h (HanseKönig)                      │   │
│  │  👥 Teilnehmer heute: 347                                           │   │
│  │                                                                      │   │
│  │  Legacy-Punkte: 2 + Bonus für Top 10%                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Run-Datenstruktur

```typescript
interface RunConfig {
  // Ziel-Typ
  goalType: 'gold' | 'delivery' | 'reputation' | 'custom';

  // Ziel-Parameter
  goalParams: {
    targetGold?: number;
    deliveryGoods?: { goodId: string; amount: number; destination: string };
    reputationGoal?: { faction: FactionId; target: number };
  };

  // Startbedingungen
  startConfig: {
    gold: number;
    city: string;
    ship: string;
    season: Season;
    crew: number;
  };

  // Modifikatoren
  modifiers: RunModifier[];

  // Meta
  difficulty: 'easy' | 'normal' | 'hard';
  legacyPointsReward: number;
  isDaily: boolean;
  dailySeed?: string;  // Für identische Daily Challenges
}

interface RunModifier {
  id: string;
  name: string;
  description: string;
  effect: ModifierEffect;
}

const RUN_MODIFIERS: RunModifier[] = [
  {
    id: 'stormy_seas',
    name: 'Stürmische See',
    description: 'Stürme +30% häufiger',
    effect: { weatherModifier: { stormy: 1.3 } },
  },
  {
    id: 'pirate_activity',
    name: 'Piratenplage',
    description: 'Piraten-Überfälle +50% wahrscheinlicher',
    effect: { pirateChanceModifier: 1.5 },
  },
  {
    id: 'trade_boom',
    name: 'Handelsboom',
    description: 'Alle Preisdifferenzen +20%',
    effect: { priceVolatilityModifier: 1.2 },
  },
  {
    id: 'plague_year',
    name: 'Pestjahr',
    description: 'Pest-Events möglich, Crew-Verluste wahrscheinlicher',
    effect: { plagueEnabled: true, crewDeathModifier: 1.5 },
  },
  {
    id: 'winter_start',
    name: 'Mitten im Winter',
    description: 'Start im Winter. Nowgorod/Reval blockiert.',
    effect: { forceSeason: 'winter' },
  },
];
```

---

## Run-Ablauf

### Run-Lifecycle

```typescript
type RunPhase =
  | 'setup'         // Konfiguration
  | 'active'        // Spielen
  | 'completed'     // Ziel erreicht
  | 'failed'        // Gescheitert
  | 'abandoned'     // Aufgegeben
  ;

interface RunState {
  // Identifikation
  id: string;
  startedAt: Date;
  phase: RunPhase;

  // Konfiguration
  config: RunConfig;

  // Aktueller Stand
  currentGold: number;
  currentCity: string;
  elapsedTime: number;  // Spielzeit in Stunden

  // Schiff & Crew
  ship: ShipState;
  crew: CrewState;

  // Fortschritt
  citiesVisited: string[];
  tradesCompleted: number;
  eventsEncountered: string[];

  // Statistiken (für End-Screen)
  stats: RunStats;

  // Ziel-Tracking
  goalProgress: number;  // 0-100%
  isGoalReached: boolean;
}

interface RunStats {
  // Handel
  totalProfit: number;
  totalLoss: number;
  bestSingleTrade: { profit: number; good: string; route: string };
  worstSingleTrade: { loss: number; good: string; route: string };
  totalTradesCount: number;

  // Reisen
  totalDistanceTraveled: number;
  citiesVisitedCount: number;
  uniqueCitiesVisited: string[];
  stormsEncountered: number;
  stormsSurvived: number;

  // Events
  eventsTotal: number;
  eventsByCategory: Record<EventCategory, number>;
  keyDecisions: KeyDecision[];

  // Fraktionen
  reputationChanges: Record<FactionId, number>;
  finalReputations: Record<FactionId, number>;

  // Schiff
  shipDamageTaken: number;
  repairCostsTotal: number;
  cargoLost: number;

  // Crew
  crewHired: number;
  crewLost: number;
  mutinyPrevented: boolean;

  // Zeit
  realTimePlayed: number;  // Echte Minuten
  gameTimePassed: number;  // Spielzeit in Stunden
}

interface KeyDecision {
  eventId: string;
  choiceId: string;
  description: string;
  timestamp: number;
}
```

### Run-Ende Bedingungen

```typescript
type RunEndReason =
  | 'goal_reached'      // Ziel erreicht (Erfolg)
  | 'bankrupt'          // 0 Gold, keine Waren (Scheitern)
  | 'ship_sunk'         // Schiff gesunken (Scheitern)
  | 'mutiny'            // Meuterei verloren (Scheitern)
  | 'abandoned'         // Manuell aufgegeben (Kein Ranking)
  ;

function checkRunEndConditions(state: RunState): RunEndReason | null {
  // Erfolg: Ziel erreicht
  if (state.isGoalReached) {
    return 'goal_reached';
  }

  // Scheitern: Bankrott
  if (state.currentGold <= 0) {
    const cargoValue = calculateCargoValue(state.ship.cargo);
    if (cargoValue <= 0) {
      return 'bankrupt';
    }
  }

  // Scheitern: Schiff gesunken
  if (state.ship.condition.currentHp <= 0) {
    return 'ship_sunk';
  }

  // Scheitern: Meuterei
  if (state.crew.moraleStatus === 'mutiny' && !state.flags.mutiny_prevented) {
    return 'mutiny';
  }

  return null;  // Run geht weiter
}
```

---

## Run-Ende Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                           🎉 RUN ABGESCHLOSSEN!                              │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │   ██████╗  █████╗ ████████╗██████╗ ██╗███████╗██╗███████╗██████╗      │ │
│  │   ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║╚══███╔╝██║██╔════╝██╔══██╗     │ │
│  │   ██████╔╝███████║   ██║   ██████╔╝██║  ███╔╝ ██║█████╗  ██████╔╝     │ │
│  │   ██╔═══╝ ██╔══██║   ██║   ██╔══██╗██║ ███╔╝  ██║██╔══╝  ██╔══██╗     │ │
│  │   ██║     ██║  ██║   ██║   ██║  ██║██║███████╗██║███████╗██║  ██║     │ │
│  │   ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚══════╝╚═╝╚══════╝╚═╝  ╚═╝     │ │
│  │                                                                         │ │
│  │                   Du hast das Ziel erreicht!                           │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─ ERGEBNIS ─────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  🎯 Ziel: 5.000 Gold erreichen                                         │ │
│  │  ✅ Erreicht: 5.247 Gold                                               │ │
│  │                                                                         │ │
│  │  ⏱️ Zeit: 4 Tage, 7 Stunden, 23 Minuten                                │ │
│  │  🏆 Rangliste: Platz 156 von 2.847 diese Woche                         │ │
│  │                                                                         │ │
│  │  ⭐ Legacy-Punkte verdient: +2                                         │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─ STATISTIKEN ──────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  HANDEL                           REISEN                               │ │
│  │  ──────                           ──────                               │ │
│  │  📈 Gewinn: 4.747 Gold           🗺️ Städte: 6 besucht                 │ │
│  │  📉 Verlust: 0 Gold              ⛵ Distanz: 1.840 Seemeilen           │ │
│  │  🔄 Trades: 23                   🌊 Stürme: 2 überstanden              │ │
│  │  💎 Bester Trade:                                                      │ │
│  │     Zobelpelz Nowgorod→Lübeck                                         │ │
│  │     +892 Gold                                                          │ │
│  │                                                                         │ │
│  │  EVENTS                           REPUTATION                           │ │
│  │  ──────                           ──────────                           │ │
│  │  📜 Events: 12                   ⚓ Hanse: +15                         │ │
│  │  🤝 NPCs getroffen: 3            ⛪ Kirche: +8                         │ │
│  │  ⚔️ Kämpfe: 1                    🏴 Piraten: -5                        │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─ SCHLÜSSELMOMENTE ─────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  🎭 "Du hast Kapitän Eriksen geholfen. Er wird sich erinnern."         │ │
│  │  ⚔️ "Du hast einen Piratenüberfall abgewehrt."                         │ │
│  │  💰 "Der Bernstein-Deal in Danzig war der Wendepunkt."                 │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│         [🏠 Hauptmenü]     [🔄 Neuer Run]     [📊 Rangliste]               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scheitern-Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                           💀 RUN GESCHEITERT                                 │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                        [PIXEL-ART: SINKENDES SCHIFF]                        │
│                                                                              │
│  ┌─ WAS IST PASSIERT? ────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  ⚓ Dein Schiff "Salzprinz" ist in einem Sturm gesunken.               │ │
│  │                                                                         │ │
│  │  Letzter Stand:                                                        │ │
│  │  • 💰 Gold: 1.247 (Ziel war 5.000)                                     │ │
│  │  • 📍 Position: Zwischen Visby und Stockholm                           │ │
│  │  • ⏱️ Zeit: 2 Tage, 14 Stunden                                         │ │
│  │                                                                         │ │
│  │  Was schief ging:                                                      │ │
│  │  • Schiff war nur 35% repariert                                        │ │
│  │  • Keine Notfall-Reparatur durchgeführt                                │ │
│  │  • Sturm-Warnung ignoriert                                             │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─ TROTZDEM GELERNT ─────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  Auch im Scheitern gibt es Fortschritt:                                │ │
│  │                                                                         │ │
│  │  🏆 Achievement freigeschaltet: "Auf See geblieben"                    │ │
│  │     (Erstes Schiff verloren)                                           │ │
│  │                                                                         │ │
│  │  📈 Statistik aktualisiert:                                            │ │
│  │     Total Schiffe verloren: 1                                          │ │
│  │     Stürme überlebt (gesamt): 7                                        │ │
│  │                                                                         │ │
│  │  💡 Tipp: Repariere dein Schiff, bevor du in gefährliche              │ │
│  │     Gewässer segelst. Und höre auf die Wettervorhersage!              │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│         [🏠 Hauptmenü]     [🔄 Neuer Run]     [📖 Tipps lesen]             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Daily Challenge System

```typescript
interface DailyChallenge {
  // Identifikation
  date: string;           // YYYY-MM-DD
  seed: string;           // Für deterministische Zufallszahlen

  // Konfiguration
  title: string;
  description: string;
  config: RunConfig;

  // Leaderboard
  leaderboard: DailyLeaderboardEntry[];
  participantCount: number;

  // Belohnungen
  rewards: {
    completion: number;   // LP für Abschluss
    top10Percent: number; // LP für Top 10%
    top3: number;         // LP für Top 3
    first: number;        // LP für Platz 1
  };
}

interface DailyLeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  completionTime: number;  // Spielzeit in Stunden
  finalGold: number;
  timestamp: Date;
}

// Beispiel Daily Challenges
const DAILY_CHALLENGE_TEMPLATES = [
  {
    id: 'salt_prince',
    title: 'Der Salzprinz',
    description: 'Liefere 50 Salz von Hamburg nach Nowgorod.',
    goalType: 'delivery',
    goalParams: {
      deliveryGoods: { goodId: 'salt', amount: 50, destination: 'novgorod' },
    },
    startConfig: {
      gold: 400,
      city: 'hamburg',
      ship: 'kogge',
      season: 'summer',
    },
    modifiers: ['stormy_seas'],
  },
  {
    id: 'fur_trader',
    title: 'Der Pelzhändler',
    description: 'Starte in Nowgorod. Erreiche 3.000 Gold nur mit Pelzhandel.',
    goalType: 'gold',
    goalParams: { targetGold: 3000 },
    startConfig: {
      gold: 200,
      city: 'novgorod',
      ship: 'schnigge',
      season: 'autumn',
    },
    modifiers: ['winter_start'],
    restrictions: ['only_fur_trade'],
  },
  {
    id: 'pirate_gauntlet',
    title: 'Durch die Piratenhölle',
    description: 'Reise von Lübeck nach Reval und zurück. Piraten +100%.',
    goalType: 'custom',
    goalParams: {
      customGoal: 'visit_reval_and_return',
    },
    startConfig: {
      gold: 600,
      city: 'luebeck',
      ship: 'kraier',
      season: 'summer',
    },
    modifiers: ['pirate_activity', 'pirate_activity'], // Doppelt!
  },
];

// Daily Challenge Generierung (Seed-basiert)
function generateDailyChallenge(date: string): DailyChallenge {
  const seed = `hanse-nova-daily-${date}`;
  const rng = createSeededRandom(seed);

  // Template auswählen
  const template = DAILY_CHALLENGE_TEMPLATES[
    Math.floor(rng() * DAILY_CHALLENGE_TEMPLATES.length)
  ];

  // Leichte Variationen basierend auf Seed
  const config = {
    ...template.startConfig,
    gold: template.startConfig.gold + Math.floor(rng() * 100 - 50),
  };

  return {
    date,
    seed,
    title: template.title,
    description: template.description,
    config: {
      goalType: template.goalType,
      goalParams: template.goalParams,
      startConfig: config,
      modifiers: template.modifiers.map(id =>
        RUN_MODIFIERS.find(m => m.id === id)!
      ),
      isDaily: true,
      dailySeed: seed,
      legacyPointsReward: 2,
    },
    leaderboard: [],
    participantCount: 0,
    rewards: {
      completion: 2,
      top10Percent: 1,
      top3: 2,
      first: 3,
    },
  };
}
```

---

## Legacy-System

Das Legacy-System bietet **permanenten Fortschritt** über alle Runs hinweg.
Es motiviert zum Weiterspielen und belohnt Erfahrung.

### Legacy-Punkte

```typescript
interface PlayerLegacy {
  // Punkte
  totalPointsEarned: number;
  currentPoints: number;  // Verfügbar zum Ausgeben

  // Freigeschaltete Upgrades
  unlockedUpgrades: string[];

  // Statistiken
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;

  // Bestzeiten
  fastestRuns: {
    trader: number | null;
    merchant: number | null;
    patrician: number | null;
  };

  // Achievements
  achievements: string[];
}

// LP-Verdienen
const LEGACY_POINT_REWARDS = {
  // Run-Abschluss
  complete_trader: 1,
  complete_merchant: 2,
  complete_patrician: 4,

  // Daily Challenge
  complete_daily: 2,
  daily_top_10_percent: 1,
  daily_top_3: 2,
  daily_first: 3,

  // Achievements
  first_successful_run: 1,
  ten_successful_runs: 2,
  defeat_pirate: 1,
  visit_all_cities: 2,
  // ... mehr
};
```

### Legacy-Upgrade-Baum

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LEGACY-UPGRADES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Verfügbare Legacy-Punkte: ⭐ 7                                             │
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  🚢 SCHIFFE                                                                 │
│  ────────────                                                               │
│                                                                              │
│  [✅] Schnigge freischalten                         3 LP                    │
│       Schnelles Schiff mit 30 Kapazität verfügbar                          │
│                                                                              │
│  [🔒] Holk freischalten                             8 LP                    │
│       Riesiges Handelsschiff mit 100 Kapazität                             │
│       ⚠️ Benötigt: 5 erfolgreiche Kaufmann-Runs                            │
│                                                                              │
│  [🔒] Kraier freischalten                           5 LP                    │
│       Bewaffnetes Handelsschiff                                             │
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  💰 WIRTSCHAFT                                                              │
│  ─────────────                                                              │
│                                                                              │
│  [🔓] Handelshaus Stufe 1                           2 LP                    │
│       +100 Startgold pro Run                                                │
│                                                                              │
│  [🔒] Handelshaus Stufe 2                           4 LP                    │
│       +250 Startgold pro Run                                                │
│       ⚠️ Benötigt: Handelshaus Stufe 1                                     │
│                                                                              │
│  [🔒] Handelshaus Stufe 3                           6 LP                    │
│       +500 Startgold pro Run                                                │
│       ⚠️ Benötigt: Handelshaus Stufe 2                                     │
│                                                                              │
│  [🔒] Handelsbeziehungen                            5 LP                    │
│       Alle Einkaufspreise -5%                                               │
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  🎭 EVENTS & WISSEN                                                         │
│  ──────────────────                                                         │
│                                                                              │
│  [🔓] Gerüchteküche                                 3 LP                    │
│       +1 Gerücht pro Stadt                                                  │
│                                                                              │
│  [🔒] Erfahrener Händler                            4 LP                    │
│       Seltene Events +20% wahrscheinlicher                                  │
│                                                                              │
│  [🔒] Diplomat                                      5 LP                    │
│       Starte jeden Run mit +10 Hanse-Reputation                            │
│                                                                              │
│  [🔒] Schwarzmarktkontakte                          6 LP                    │
│       Starte mit Schwarzmarkt-Zugang                                        │
│       ⚠️ Benötigt: 1 Run mit Piraten-Rep 30+                               │
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  ⚓ SEEFAHRT                                                                │
│  ──────────                                                                 │
│                                                                              │
│  [🔒] Seemannsgarn                                  3 LP                    │
│       Navigatoren +1 Stern effektiver                                       │
│                                                                              │
│  [🔒] Sturmgeboren                                  5 LP                    │
│       -20% Sturmschaden                                                     │
│       ⚠️ Benötigt: 10 Stürme überstanden                                   │
│                                                                              │
│  [🔒] Flottenchef                                   8 LP                    │
│       Kann 2 Schiffe gleichzeitig kontrollieren                            │
│       ⚠️ Benötigt: Patrizier-Run erfolgreich                               │
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  🎨 KOSMETISCH                                                              │
│  ─────────────                                                              │
│                                                                              │
│  [🔒] Wappen-Editor                                 2 LP                    │
│       Erstelle dein eigenes Händler-Wappen                                  │
│                                                                              │
│  [🔒] Schiffs-Skins: Königlich                      3 LP                    │
│       Goldverziertes Schiffs-Design                                         │
│                                                                              │
│  [🔒] Schiffs-Skins: Piratenumbau                   3 LP                    │
│       Schwarze Segel, dunkle Planken                                        │
│       ⚠️ Benötigt: Piraten-Rep 50+ erreicht                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Legacy-Upgrade Datenstruktur

```typescript
interface LegacyUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;  // Legacy-Punkte

  // Effekt
  effect: LegacyEffect;

  // Voraussetzungen
  requirements?: {
    upgrades?: string[];           // Vorherige Upgrades benötigt
    achievements?: string[];       // Achievements benötigt
    stats?: Partial<LegacyStats>;  // Statistik-Voraussetzungen
  };

  // Kategorie für UI
  category: 'ships' | 'economy' | 'events' | 'sailing' | 'cosmetic';
}

type LegacyEffect =
  | { type: 'unlock_ship'; shipId: string }
  | { type: 'start_gold_bonus'; amount: number }
  | { type: 'price_modifier'; buy?: number; sell?: number }
  | { type: 'start_reputation'; faction: FactionId; amount: number }
  | { type: 'event_chance_modifier'; category: EventCategory; modifier: number }
  | { type: 'storm_damage_modifier'; modifier: number }
  | { type: 'cosmetic'; cosmeticId: string }
  ;

const LEGACY_UPGRADES: LegacyUpgrade[] = [
  // Schiffe
  {
    id: 'unlock_schnigge',
    name: 'Schnigge freischalten',
    description: 'Schnelles Schiff mit 30 Kapazität verfügbar',
    cost: 3,
    effect: { type: 'unlock_ship', shipId: 'schnigge' },
    category: 'ships',
  },
  {
    id: 'unlock_holk',
    name: 'Holk freischalten',
    description: 'Riesiges Handelsschiff mit 100 Kapazität',
    cost: 8,
    effect: { type: 'unlock_ship', shipId: 'holk' },
    requirements: {
      stats: { successfulMerchantRuns: 5 },
    },
    category: 'ships',
  },
  {
    id: 'unlock_kraier',
    name: 'Kraier freischalten',
    description: 'Bewaffnetes Handelsschiff',
    cost: 5,
    effect: { type: 'unlock_ship', shipId: 'kraier' },
    category: 'ships',
  },

  // Wirtschaft
  {
    id: 'trading_house_1',
    name: 'Handelshaus Stufe 1',
    description: '+100 Startgold pro Run',
    cost: 2,
    effect: { type: 'start_gold_bonus', amount: 100 },
    category: 'economy',
  },
  {
    id: 'trading_house_2',
    name: 'Handelshaus Stufe 2',
    description: '+250 Startgold pro Run',
    cost: 4,
    effect: { type: 'start_gold_bonus', amount: 250 },
    requirements: { upgrades: ['trading_house_1'] },
    category: 'economy',
  },
  {
    id: 'trading_house_3',
    name: 'Handelshaus Stufe 3',
    description: '+500 Startgold pro Run',
    cost: 6,
    effect: { type: 'start_gold_bonus', amount: 500 },
    requirements: { upgrades: ['trading_house_2'] },
    category: 'economy',
  },
  {
    id: 'trade_connections',
    name: 'Handelsbeziehungen',
    description: 'Alle Einkaufspreise -5%',
    cost: 5,
    effect: { type: 'price_modifier', buy: 0.95 },
    category: 'economy',
  },

  // Events
  {
    id: 'rumor_mill',
    name: 'Gerüchteküche',
    description: '+1 Gerücht pro Stadt',
    cost: 3,
    effect: { type: 'event_chance_modifier', category: 'trade', modifier: 1.2 },
    category: 'events',
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Starte mit +10 Hanse-Reputation',
    cost: 5,
    effect: { type: 'start_reputation', faction: 'hanse', amount: 10 },
    category: 'events',
  },

  // Seefahrt
  {
    id: 'storm_born',
    name: 'Sturmgeboren',
    description: '-20% Sturmschaden',
    cost: 5,
    effect: { type: 'storm_damage_modifier', modifier: 0.8 },
    requirements: {
      stats: { stormsSurvived: 10 },
    },
    category: 'sailing',
  },
];
```

---

## Achievements

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;

  // Bedingung
  condition: AchievementCondition;

  // Belohnung
  reward: {
    legacyPoints: number;
    unlocks?: string[];  // Kosmetik, Titel, etc.
  };

  // Schwierigkeit
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  hidden: boolean;  // Verstecktes Achievement?
}

const ACHIEVEMENTS: Achievement[] = [
  // ═══════════════════════════════════════════════════════════════════
  // COMMON - Jeder kann sie bekommen
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'first_trade',
    name: 'Erster Handel',
    description: 'Schließe deinen ersten Handel ab.',
    icon: '🤝',
    condition: { type: 'trades_count', value: 1 },
    reward: { legacyPoints: 0 },
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'first_run',
    name: 'Die Reise beginnt',
    description: 'Schließe deinen ersten Run ab (Erfolg oder Scheitern).',
    icon: '⚓',
    condition: { type: 'runs_count', value: 1 },
    reward: { legacyPoints: 1 },
    rarity: 'common',
    hidden: false,
  },
  {
    id: 'first_success',
    name: 'Erfolgreicher Händler',
    description: 'Schließe einen Run erfolgreich ab.',
    icon: '🎉',
    condition: { type: 'successful_runs', value: 1 },
    reward: { legacyPoints: 1 },
    rarity: 'common',
    hidden: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // UNCOMMON - Etwas Aufwand nötig
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'novgorod_trader',
    name: 'Russlandfahrer',
    description: 'Erreiche Nowgorod.',
    icon: '❄️',
    condition: { type: 'visit_city', city: 'novgorod' },
    reward: { legacyPoints: 1 },
    rarity: 'uncommon',
    hidden: false,
  },
  {
    id: 'all_cities',
    name: 'Weltenbummler',
    description: 'Besuche alle 8 Hansestädte in einem Run.',
    icon: '🗺️',
    condition: { type: 'visit_all_cities_single_run' },
    reward: { legacyPoints: 2 },
    rarity: 'uncommon',
    hidden: false,
  },
  {
    id: 'storm_survivor',
    name: 'Sturmreiter',
    description: 'Überlebe 10 Stürme (gesamt).',
    icon: '🌊',
    condition: { type: 'storms_survived', value: 10 },
    reward: { legacyPoints: 1 },
    rarity: 'uncommon',
    hidden: false,
  },
  {
    id: 'ten_runs',
    name: 'Erfahrener Kapitän',
    description: 'Schließe 10 erfolgreiche Runs ab.',
    icon: '⭐',
    condition: { type: 'successful_runs', value: 10 },
    reward: { legacyPoints: 2 },
    rarity: 'uncommon',
    hidden: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // RARE - Herausfordernd
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'patrician_victor',
    name: 'Patrizier',
    description: 'Schließe einen Patrizier-Run erfolgreich ab.',
    icon: '🏛️',
    condition: { type: 'complete_run_type', runType: 'patrician' },
    reward: { legacyPoints: 3, unlocks: ['title_patrician'] },
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'pirate_slayer',
    name: 'Piratenjäger',
    description: 'Besiege 5 Piratenschiffe im Kampf.',
    icon: '⚔️',
    condition: { type: 'pirates_defeated', value: 5 },
    reward: { legacyPoints: 2, unlocks: ['title_pirate_hunter'] },
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'perfect_run',
    name: 'Makellos',
    description: 'Beende einen Kaufmann-Run ohne Schiffsschaden.',
    icon: '✨',
    condition: { type: 'run_without_damage', runType: 'merchant' },
    reward: { legacyPoints: 3 },
    rarity: 'rare',
    hidden: false,
  },
  {
    id: 'speed_demon',
    name: 'Blitzschnell',
    description: 'Schließe einen Händler-Run in unter 1 Tag Spielzeit ab.',
    icon: '⚡',
    condition: { type: 'run_time_under', runType: 'trader', hours: 24 },
    reward: { legacyPoints: 2 },
    rarity: 'rare',
    hidden: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGENDARY - Nur für die Besten
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hanse_master',
    name: 'Meister der Hanse',
    description: 'Erreiche maximale Hanse-Reputation (+100).',
    icon: '👑',
    condition: { type: 'max_reputation', faction: 'hanse' },
    reward: { legacyPoints: 5, unlocks: ['title_hansemaster', 'skin_royal'] },
    rarity: 'legendary',
    hidden: false,
  },
  {
    id: 'pirate_king',
    name: 'König der Piraten',
    description: 'Erreiche maximale Piraten-Reputation (+100).',
    icon: '🏴‍☠️',
    condition: { type: 'max_reputation', faction: 'pirates' },
    reward: { legacyPoints: 5, unlocks: ['title_pirateking', 'skin_pirate'] },
    rarity: 'legendary',
    hidden: false,
  },
  {
    id: 'daily_champion',
    name: 'Tages-Champion',
    description: 'Gewinne eine Daily Challenge.',
    icon: '🏆',
    condition: { type: 'daily_first_place' },
    reward: { legacyPoints: 5, unlocks: ['title_champion'] },
    rarity: 'legendary',
    hidden: false,
  },
  {
    id: 'hundred_runs',
    name: 'Legende',
    description: 'Schließe 100 erfolgreiche Runs ab.',
    icon: '🌟',
    condition: { type: 'successful_runs', value: 100 },
    reward: { legacyPoints: 10, unlocks: ['title_legend'] },
    rarity: 'legendary',
    hidden: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // HIDDEN - Überraschungen
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'eriksen_friend',
    name: '???',
    description: 'Verstecktes Achievement',
    icon: '❓',
    condition: { type: 'event_outcome', eventId: 'eriksen_returns_grateful' },
    reward: { legacyPoints: 2 },
    rarity: 'rare',
    hidden: true,
    // Revealed: "Alter Freund" - Hilf Kapitän Eriksen und triff ihn wieder.
  },
  {
    id: 'bankrupt_comeback',
    name: '???',
    description: 'Verstecktes Achievement',
    icon: '❓',
    condition: { type: 'bankrupt_then_success_same_run' },
    reward: { legacyPoints: 3 },
    rarity: 'legendary',
    hidden: true,
    // Revealed: "Phönix" - Komm von 0 Gold zurück und gewinne den Run.
  },
];
```

---

## Leaderboard-System

```typescript
interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  playerTitle?: string;  // Freigeschalteter Titel
  playerBadge?: string;  // Beste Achievement-Rarität

  // Run-Daten
  completionTime: number;  // Spielzeit in Stunden
  finalGold: number;
  runType: RunGoalType;

  // Meta
  timestamp: Date;
  legacyLevel: number;  // Total LP verdient
}

interface Leaderboards {
  // Globale Bestenlisten (All-Time)
  allTime: {
    trader: LeaderboardEntry[];
    merchant: LeaderboardEntry[];
    patrician: LeaderboardEntry[];
  };

  // Wöchentliche Bestenlisten
  weekly: {
    trader: LeaderboardEntry[];
    merchant: LeaderboardEntry[];
    patrician: LeaderboardEntry[];
  };

  // Daily Challenge
  daily: {
    date: string;
    entries: LeaderboardEntry[];
  };
}

// Leaderboard UI
// ┌─────────────────────────────────────────────────────────────────┐
// │  🏆 RANGLISTE - KAUFMANN (Diese Woche)                          │
// ├─────────────────────────────────────────────────────────────────┤
// │                                                                  │
// │  #    Spieler              Zeit          Gold    Legacy         │
// │  ─────────────────────────────────────────────────────────────  │
// │  🥇   HanseMeister [👑]    2T 04h 12m    5.892   ⭐32          │
// │  🥈   Salzprinz            2T 11h 45m    5.234   ⭐28          │
// │  🥉   OstseeWolf           2T 14h 02m    5.102   ⭐15          │
// │  4    Koggenkapitän        2T 18h 33m    5.089   ⭐12          │
// │  5    Bernsteinhändler     2T 22h 11m    5.044   ⭐9           │
// │  ...                                                            │
// │  156  Du                   4T 07h 23m    5.247   ⭐7           │
// │                                                                  │
// │  Dein Rang: 156 von 2.847 │ Top 5.5%                           │
// │                                                                  │
// │  [📅 Diese Woche] [📊 All-Time] [🎯 Daily Challenge]           │
// │                                                                  │
// └─────────────────────────────────────────────────────────────────┘
```

---

*Weiter zu Teil 8: Technische Umsetzung*
