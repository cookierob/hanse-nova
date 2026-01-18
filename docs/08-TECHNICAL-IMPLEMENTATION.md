# HANSE NOVA – Game Design Document
## Teil 8: Technische Umsetzung

---

## Tech-Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TECH-STACK ÜBERSICHT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FRONTEND                                                                    │
│  ────────                                                                   │
│  • Next.js 15 (App Router)      - React Framework                           │
│  • React 19                     - UI Library                                │
│  • TypeScript 5                 - Type Safety                               │
│  • Tailwind CSS 4               - Styling                                   │
│  • Zustand                      - State Management                          │
│  • Framer Motion                - Animationen                               │
│  • Howler.js                    - Audio                                     │
│                                                                              │
│  BACKEND                                                                     │
│  ───────                                                                    │
│  • Supabase                     - Backend as a Service                      │
│    ├─ PostgreSQL                - Datenbank                                 │
│    ├─ Auth                      - Authentifizierung                         │
│    ├─ Realtime                  - Live-Updates (Leaderboard)                │
│    ├─ Edge Functions            - Server-seitige Logik                      │
│    └─ Storage                   - Asset-Hosting                             │
│                                                                              │
│  DEPLOYMENT                                                                  │
│  ──────────                                                                 │
│  • Vercel                       - Hosting & CI/CD                           │
│  • GitHub                       - Version Control                           │
│                                                                              │
│  ENTWICKLUNG                                                                 │
│  ───────────                                                                │
│  • ESLint + Prettier            - Code Quality                              │
│  • Vitest                       - Unit Tests                                │
│  • Playwright                   - E2E Tests                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Projektstruktur

```
hanse-nova/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth-Routen (Login, Register)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (game)/                   # Spiel-Routen (geschützt)
│   │   │   ├── play/                 # Haupt-Spielbildschirm
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │       ├── GameCanvas.tsx
│   │   │   │       ├── CityView.tsx
│   │   │   │       ├── TravelView.tsx
│   │   │   │       └── EventDialog.tsx
│   │   │   ├── trade/                # Handels-Interface
│   │   │   │   └── page.tsx
│   │   │   ├── ship/                 # Schiffs-Verwaltung
│   │   │   │   └── page.tsx
│   │   │   ├── map/                  # Vollbild-Karte
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (menu)/                   # Menü-Routen
│   │   │   ├── new-run/              # Neuen Run starten
│   │   │   │   └── page.tsx
│   │   │   ├── legacy/               # Legacy-Upgrades
│   │   │   │   └── page.tsx
│   │   │   ├── leaderboard/          # Ranglisten
│   │   │   │   └── page.tsx
│   │   │   ├── achievements/         # Achievements
│   │   │   │   └── page.tsx
│   │   │   ├── settings/             # Einstellungen
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                      # API Routes (falls nötig)
│   │   │   └── webhook/
│   │   │
│   │   ├── layout.tsx                # Root Layout
│   │   ├── page.tsx                  # Landing Page
│   │   └── globals.css
│   │
│   ├── components/                   # Shared Components
│   │   ├── ui/                       # Basis UI-Komponenten
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── PixelText.tsx
│   │   │
│   │   ├── game/                     # Spiel-Komponenten
│   │   │   ├── MapCanvas.tsx
│   │   │   ├── ShipSprite.tsx
│   │   │   ├── CityMarker.tsx
│   │   │   ├── WeatherOverlay.tsx
│   │   │   ├── TradePanel.tsx
│   │   │   ├── CargoList.tsx
│   │   │   ├── CrewPanel.tsx
│   │   │   ├── EventModal.tsx
│   │   │   ├── RunHeader.tsx
│   │   │   ├── TimeDisplay.tsx
│   │   │   └── GoalTracker.tsx
│   │   │
│   │   └── layout/                   # Layout-Komponenten
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Sidebar.tsx
│   │       └── GameLayout.tsx
│   │
│   ├── engine/                       # Game Engine (Pure TypeScript)
│   │   ├── state/
│   │   │   ├── game-store.ts         # Zustand Store
│   │   │   ├── player-store.ts
│   │   │   ├── run-store.ts
│   │   │   └── ui-store.ts
│   │   │
│   │   ├── systems/
│   │   │   ├── trade.ts              # Handelssystem
│   │   │   ├── travel.ts             # Reisesystem
│   │   │   ├── time.ts               # Zeitsystem
│   │   │   ├── weather.ts            # Wettersystem
│   │   │   ├── market.ts             # Preisberechnung
│   │   │   ├── events.ts             # Event-System
│   │   │   ├── reputation.ts         # Fraktionssystem
│   │   │   ├── ship.ts               # Schiffssystem
│   │   │   ├── crew.ts               # Crew-System
│   │   │   └── legacy.ts             # Legacy-System
│   │   │
│   │   ├── utils/
│   │   │   ├── random.ts             # Seeded Random
│   │   │   ├── pathfinding.ts        # Routen-Berechnung
│   │   │   ├── validation.ts         # Input-Validierung
│   │   │   └── formatting.ts         # Formatierung
│   │   │
│   │   └── types/
│   │       ├── game.ts               # Spiel-Typen
│   │       ├── events.ts             # Event-Typen
│   │       ├── ships.ts              # Schiffs-Typen
│   │       └── factions.ts           # Fraktions-Typen
│   │
│   ├── data/                         # Statische Spieldaten
│   │   ├── cities.ts                 # Stadt-Definitionen
│   │   ├── goods.ts                  # Waren-Definitionen
│   │   ├── ships.ts                  # Schiffs-Definitionen
│   │   ├── factions.ts               # Fraktions-Definitionen
│   │   ├── legacy-upgrades.ts        # Legacy-Upgrades
│   │   ├── achievements.ts           # Achievements
│   │   ├── events/                   # Event-Definitionen
│   │   │   ├── narrative/
│   │   │   │   ├── eriksen-chain.ts
│   │   │   │   ├── church-events.ts
│   │   │   │   └── ...
│   │   │   ├── trade/
│   │   │   ├── travel/
│   │   │   ├── conflict/
│   │   │   └── city/
│   │   └── daily-challenges.ts
│   │
│   ├── lib/                          # Externe Integrationen
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase Client
│   │   │   ├── auth.ts               # Auth Helpers
│   │   │   ├── database.ts           # DB Helpers
│   │   │   └── types.ts              # Generated Types
│   │   │
│   │   ├── audio/
│   │   │   ├── sound-manager.ts
│   │   │   └── sounds.ts
│   │   │
│   │   └── analytics/
│   │       └── tracker.ts
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useGame.ts
│   │   ├── useAuth.ts
│   │   ├── useSound.ts
│   │   ├── useKeyboard.ts
│   │   └── useLocalStorage.ts
│   │
│   └── styles/
│       ├── fonts.css
│       └── pixel-art.css
│
├── public/
│   ├── sprites/                      # Pixel-Art Sprites
│   │   ├── ships/
│   │   ├── cities/
│   │   ├── goods/
│   │   ├── characters/
│   │   ├── weather/
│   │   └── ui/
│   │
│   ├── audio/
│   │   ├── music/
│   │   ├── sfx/
│   │   └── ambient/
│   │
│   └── fonts/
│       └── PressStart2P.woff2
│
├── supabase/
│   ├── migrations/                   # DB Migrations
│   │   ├── 00001_create_users.sql
│   │   ├── 00002_create_runs.sql
│   │   ├── 00003_create_legacy.sql
│   │   └── 00004_create_leaderboard.sql
│   │
│   ├── functions/                    # Edge Functions
│   │   ├── daily-challenge/
│   │   ├── submit-run/
│   │   └── update-leaderboard/
│   │
│   └── config.toml
│
├── tests/
│   ├── unit/
│   │   ├── engine/
│   │   └── data/
│   └── e2e/
│
├── .env.local                        # Lokale Environment Variables
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Datenbank-Schema

### Supabase/PostgreSQL

```sql
-- ═══════════════════════════════════════════════════════════════════════════
-- USERS - Spieler-Accounts
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,

  -- Einstellungen
  settings JSONB DEFAULT '{
    "sound_enabled": true,
    "music_enabled": true,
    "animation_speed": "normal"
  }'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════════════
-- PLAYER_LEGACY - Permanenter Fortschritt
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.player_legacy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,

  -- Legacy-Punkte
  total_points_earned INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,

  -- Freischaltungen
  unlocked_upgrades TEXT[] DEFAULT '{}',
  unlocked_ships TEXT[] DEFAULT ARRAY['ewer', 'kogge'],
  unlocked_cosmetics TEXT[] DEFAULT '{}',

  -- Statistiken (gesamt)
  total_runs INTEGER DEFAULT 0,
  successful_runs INTEGER DEFAULT 0,
  failed_runs INTEGER DEFAULT 0,

  total_gold_earned BIGINT DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  total_distance_traveled INTEGER DEFAULT 0,

  cities_visited TEXT[] DEFAULT '{}',
  storms_survived INTEGER DEFAULT 0,
  pirates_defeated INTEGER DEFAULT 0,

  -- Bestzeiten (in Spielstunden)
  fastest_trader_run REAL,
  fastest_merchant_run REAL,
  fastest_patrician_run REAL,

  -- Achievements
  achievements TEXT[] DEFAULT '{}',

  -- Meta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- RUNS - Einzelne Spieldurchgänge
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Run-Konfiguration
  run_type TEXT NOT NULL,  -- 'trader', 'merchant', 'patrician', 'daily'
  goal_type TEXT NOT NULL, -- 'gold', 'delivery', 'custom'
  goal_params JSONB NOT NULL,
  start_config JSONB NOT NULL,
  modifiers TEXT[] DEFAULT '{}',

  -- Daily Challenge Info
  daily_date DATE,
  daily_seed TEXT,

  -- Aktueller/Finaler Stand
  status TEXT NOT NULL DEFAULT 'active',  -- 'active', 'completed', 'failed', 'abandoned'

  current_gold INTEGER,
  current_city TEXT,
  elapsed_time REAL,  -- Spielstunden

  -- Finales Ergebnis
  final_gold INTEGER,
  final_time REAL,
  end_reason TEXT,  -- 'goal_reached', 'bankrupt', 'ship_sunk', 'mutiny', 'abandoned'

  -- Statistiken
  stats JSONB DEFAULT '{}'::jsonb,

  -- Spielstand (für Fortsetzung)
  save_state JSONB,

  -- Meta
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,

  -- Für Leaderboard
  is_leaderboard_eligible BOOLEAN DEFAULT TRUE
);

-- Index für aktive Runs
CREATE INDEX idx_runs_user_active ON public.runs(user_id, status) WHERE status = 'active';

-- Index für Leaderboard
CREATE INDEX idx_runs_leaderboard ON public.runs(run_type, final_time)
  WHERE status = 'completed' AND is_leaderboard_eligible = TRUE;

-- ═══════════════════════════════════════════════════════════════════════════
-- LEADERBOARD - Aggregierte Ranglisten-Daten
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  run_id UUID REFERENCES public.runs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Ranglisten-Typ
  leaderboard_type TEXT NOT NULL,  -- 'trader', 'merchant', 'patrician'
  period TEXT NOT NULL,            -- 'all_time', 'weekly', 'daily'
  period_key TEXT,                 -- '2026-W03' für weekly, '2026-01-18' für daily

  -- Score-Daten
  completion_time REAL NOT NULL,
  final_gold INTEGER NOT NULL,

  -- Spieler-Info (denormalisiert für Performance)
  player_name TEXT NOT NULL,
  player_title TEXT,
  legacy_level INTEGER,

  -- Meta
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Eindeutigkeit pro Spieler pro Periode
  UNIQUE(user_id, leaderboard_type, period, period_key)
);

-- Index für schnelles Ranking
CREATE INDEX idx_leaderboard_ranking ON public.leaderboard(
  leaderboard_type, period, period_key, completion_time ASC
);

-- ═══════════════════════════════════════════════════════════════════════════
-- DAILY_CHALLENGES - Tägliche Herausforderungen
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  date DATE UNIQUE NOT NULL,
  seed TEXT NOT NULL,

  -- Challenge-Konfiguration
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  config JSONB NOT NULL,

  -- Statistiken
  participant_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,

  -- Beste Ergebnisse
  best_time REAL,
  best_time_user_id UUID REFERENCES public.users(id),
  best_time_player_name TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS Policies
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_legacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Users: Eigene Daten lesen/schreiben
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Legacy: Eigene Daten
CREATE POLICY "Users can view own legacy" ON public.player_legacy
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own legacy" ON public.player_legacy
  FOR UPDATE USING (auth.uid() = user_id);

-- Runs: Eigene Runs verwalten
CREATE POLICY "Users can view own runs" ON public.runs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own runs" ON public.runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own runs" ON public.runs
  FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard: Alle können lesen, nur eigene einfügen
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own entries" ON public.leaderboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Challenges: Alle können lesen
CREATE POLICY "Anyone can view daily challenges" ON public.daily_challenges
  FOR SELECT USING (true);
```

---

## State Management (Zustand)

```typescript
// src/engine/state/game-store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════
// GAME STATE - Aktueller Spielstand
// ═══════════════════════════════════════════════════════════════════════════

interface GameState {
  // Run-Status
  isRunActive: boolean;
  runId: string | null;
  runConfig: RunConfig | null;

  // Spieler-Ressourcen
  gold: number;
  currentCity: string;

  // Zeit
  gameTime: Date;           // Aktuelle Spielzeit
  elapsedHours: number;     // Vergangene Spielstunden
  isPaused: boolean;
  timeSpeed: 1 | 2 | 4;

  // Schiff
  ship: ShipState;

  // Crew
  crew: CrewState;

  // Ladung
  cargo: CargoItem[];

  // Reputation
  reputation: Record<FactionId, number>;

  // Flags & Events
  flags: Record<string, boolean | number>;
  completedEvents: string[];
  activeEventChains: string[];

  // Ziel-Tracking
  goalProgress: number;
  isGoalReached: boolean;

  // Statistiken
  stats: RunStats;
}

interface GameActions {
  // Run-Management
  startNewRun: (config: RunConfig) => void;
  endRun: (reason: RunEndReason) => void;
  abandonRun: () => void;
  loadRun: (saveState: GameState) => void;

  // Zeit
  advanceTime: (hours: number) => void;
  togglePause: () => void;
  setTimeSpeed: (speed: 1 | 2 | 4) => void;

  // Ressourcen
  modifyGold: (amount: number) => void;

  // Standort
  setCurrentCity: (cityId: string) => void;
  startTravel: (destination: string) => void;

  // Handel
  buyGoods: (goodId: string, amount: number, price: number) => void;
  sellGoods: (goodId: string, amount: number, price: number) => void;

  // Schiff
  repairShip: (amount: number, cost: number) => void;
  damageShip: (amount: number, reason: string) => void;

  // Crew
  hireCrewMember: (member: CrewMember) => void;
  fireCrewMember: (memberId: string) => void;
  modifyMorale: (amount: number) => void;

  // Reputation
  modifyReputation: (faction: FactionId, amount: number) => void;

  // Events
  completeEvent: (eventId: string) => void;
  setFlag: (flagId: string, value: boolean | number) => void;

  // Stats
  recordTrade: (trade: TradeTransaction) => void;
  recordEvent: (category: EventCategory) => void;
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // Initial State
      isRunActive: false,
      runId: null,
      runConfig: null,

      gold: 0,
      currentCity: '',

      gameTime: new Date(),
      elapsedHours: 0,
      isPaused: true,
      timeSpeed: 1,

      ship: createInitialShipState('kogge'),
      crew: createInitialCrewState(12),
      cargo: [],

      reputation: {
        hanse: 0,
        pirates: -10,
        church: 0,
        nobility: 0,
      },

      flags: {},
      completedEvents: [],
      activeEventChains: [],

      goalProgress: 0,
      isGoalReached: false,

      stats: createInitialStats(),

      // Actions
      startNewRun: (config) => {
        set({
          isRunActive: true,
          runId: generateRunId(),
          runConfig: config,
          gold: config.startConfig.gold,
          currentCity: config.startConfig.city,
          gameTime: new Date(), // Start-Datum
          elapsedHours: 0,
          isPaused: false,
          ship: createInitialShipState(config.startConfig.ship),
          crew: createInitialCrewState(12),
          cargo: [],
          reputation: applyLegacyReputation({
            hanse: 0,
            pirates: -10,
            church: 0,
            nobility: 0,
          }),
          flags: {},
          completedEvents: [],
          activeEventChains: [],
          goalProgress: 0,
          isGoalReached: false,
          stats: createInitialStats(),
        });
      },

      endRun: (reason) => {
        const state = get();
        set({
          isRunActive: false,
          isPaused: true,
        });
        // Speichere Run-Ergebnis in Supabase
        submitRunResult(state, reason);
      },

      advanceTime: (hours) => {
        set((state) => ({
          elapsedHours: state.elapsedHours + hours,
          gameTime: addHours(state.gameTime, hours),
        }));
      },

      modifyGold: (amount) => {
        set((state) => {
          const newGold = Math.max(0, state.gold + amount);
          // Check Ziel
          const goalProgress = calculateGoalProgress(state.runConfig, newGold);
          const isGoalReached = goalProgress >= 100;
          return { gold: newGold, goalProgress, isGoalReached };
        });
      },

      buyGoods: (goodId, amount, price) => {
        const state = get();
        const good = getGoodById(goodId);
        const totalCost = price * amount;
        const weight = good.weight * amount;

        if (state.gold < totalCost) return;
        if (state.ship.currentLoad + weight > state.ship.capacity) return;

        set((state) => {
          const existingItem = state.cargo.find((c) => c.goodId === goodId);

          let newCargo;
          if (existingItem) {
            newCargo = state.cargo.map((c) =>
              c.goodId === goodId
                ? {
                    ...c,
                    quantity: c.quantity + amount,
                    avgBuyPrice:
                      (c.avgBuyPrice * c.quantity + price * amount) /
                      (c.quantity + amount),
                  }
                : c
            );
          } else {
            newCargo = [
              ...state.cargo,
              {
                goodId,
                quantity: amount,
                avgBuyPrice: price,
                boughtAt: state.currentCity,
              },
            ];
          }

          return {
            gold: state.gold - totalCost,
            cargo: newCargo,
            ship: {
              ...state.ship,
              currentLoad: state.ship.currentLoad + weight,
            },
            stats: {
              ...state.stats,
              totalTradesCount: state.stats.totalTradesCount + 1,
            },
          };
        });
      },

      modifyReputation: (faction, amount) => {
        set((state) => {
          const newReputation = { ...state.reputation };
          newReputation[faction] = clamp(newReputation[faction] + amount, -100, 100);

          // Apply ripple effects
          applyReputationRipples(newReputation, faction, amount);

          return { reputation: newReputation };
        });
      },

      // ... weitere Actions
    }),
    {
      name: 'hanse-nova-game',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Nur persistieren was nötig ist
        isRunActive: state.isRunActive,
        runId: state.runId,
        runConfig: state.runConfig,
        gold: state.gold,
        currentCity: state.currentCity,
        gameTime: state.gameTime,
        elapsedHours: state.elapsedHours,
        ship: state.ship,
        crew: state.crew,
        cargo: state.cargo,
        reputation: state.reputation,
        flags: state.flags,
        completedEvents: state.completedEvents,
        stats: state.stats,
      }),
    }
  )
);
```

---

## Supabase Integration

```typescript
// src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ═══════════════════════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (!error && data.user) {
    // Erstelle User-Eintrag und Legacy
    await createUserProfile(data.user.id, email, username);
  }

  return { data, error };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export async function createUserProfile(
  userId: string,
  email: string,
  username: string
) {
  // User-Profil
  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    email,
    username,
    display_name: username,
  });

  if (userError) throw userError;

  // Legacy-Eintrag
  const { error: legacyError } = await supabase.from('player_legacy').insert({
    user_id: userId,
  });

  if (legacyError) throw legacyError;
}

export async function getPlayerLegacy(userId: string) {
  const { data, error } = await supabase
    .from('player_legacy')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
}

export async function updatePlayerLegacy(
  userId: string,
  updates: Partial<PlayerLegacy>
) {
  const { data, error } = await supabase
    .from('player_legacy')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export async function saveRun(runState: GameState) {
  const { data, error } = await supabase
    .from('runs')
    .upsert({
      id: runState.runId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      run_type: runState.runConfig?.goalType,
      goal_type: runState.runConfig?.goalType,
      goal_params: runState.runConfig?.goalParams,
      start_config: runState.runConfig?.startConfig,
      status: 'active',
      current_gold: runState.gold,
      current_city: runState.currentCity,
      elapsed_time: runState.elapsedHours,
      save_state: runState,
    })
    .select()
    .single();

  return { data, error };
}

export async function submitRunResult(
  runState: GameState,
  endReason: RunEndReason
) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return { error: 'Not authenticated' };

  const isSuccess = endReason === 'goal_reached';

  // 1. Update Run
  const { error: runError } = await supabase
    .from('runs')
    .update({
      status: isSuccess ? 'completed' : 'failed',
      final_gold: runState.gold,
      final_time: runState.elapsedHours,
      end_reason: endReason,
      stats: runState.stats,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runState.runId);

  if (runError) return { error: runError };

  // 2. Update Legacy
  const legacy = await getPlayerLegacy(userId);
  if (legacy.data) {
    const legacyPoints = calculateLegacyPoints(runState, endReason);
    await updatePlayerLegacy(userId, {
      total_points_earned: legacy.data.total_points_earned + legacyPoints,
      current_points: legacy.data.current_points + legacyPoints,
      total_runs: legacy.data.total_runs + 1,
      successful_runs: legacy.data.successful_runs + (isSuccess ? 1 : 0),
      failed_runs: legacy.data.failed_runs + (isSuccess ? 0 : 1),
      total_gold_earned: legacy.data.total_gold_earned + runState.stats.totalProfit,
      total_trades: legacy.data.total_trades + runState.stats.totalTradesCount,
    });
  }

  // 3. Submit to Leaderboard (if successful)
  if (isSuccess && runState.runConfig) {
    await submitToLeaderboard(userId, runState);
  }

  return { error: null };
}

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════════════════

export async function getLeaderboard(
  type: 'trader' | 'merchant' | 'patrician',
  period: 'all_time' | 'weekly' | 'daily',
  limit: number = 100
) {
  let periodKey = null;
  if (period === 'weekly') {
    periodKey = getWeekKey(new Date());
  } else if (period === 'daily') {
    periodKey = new Date().toISOString().split('T')[0];
  }

  let query = supabase
    .from('leaderboard')
    .select('*')
    .eq('leaderboard_type', type)
    .eq('period', period)
    .order('completion_time', { ascending: true })
    .limit(limit);

  if (periodKey) {
    query = query.eq('period_key', periodKey);
  }

  const { data, error } = await query;
  return { data, error };
}

// ═══════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGE
// ═══════════════════════════════════════════════════════════════════════════

export async function getTodaysDailyChallenge() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('date', today)
    .single();

  if (error && error.code === 'PGRST116') {
    // Nicht gefunden - generieren
    const challenge = generateDailyChallenge(today);
    const { data: newData, error: insertError } = await supabase
      .from('daily_challenges')
      .insert(challenge)
      .select()
      .single();

    return { data: newData, error: insertError };
  }

  return { data, error };
}
```

---

## Komponenten-Beispiele

### Spiel-Layout

```tsx
// src/components/layout/GameLayout.tsx

'use client';

import { useGameStore } from '@/engine/state/game-store';
import { RunHeader } from '@/components/game/RunHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { TimeDisplay } from '@/components/game/TimeDisplay';
import { GoalTracker } from '@/components/game/GoalTracker';

export function GameLayout({ children }: { children: React.ReactNode }) {
  const { isRunActive, isPaused, currentCity, gold, elapsedHours, goalProgress } =
    useGameStore();

  if (!isRunActive) {
    return <div>Kein aktiver Run. Starte einen neuen Run.</div>;
  }

  return (
    <div className="h-screen bg-[#1a1a2e] text-[#f5deb3] flex flex-col">
      {/* Header */}
      <RunHeader
        cityName={getCityName(currentCity)}
        gold={gold}
        elapsedHours={elapsedHours}
        goalProgress={goalProgress}
        isPaused={isPaused}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Game Area */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>

      {/* Footer / Quick Actions */}
      <div className="h-16 bg-[#0d0d1a] border-t-2 border-[#3d3d5c] flex items-center justify-around">
        <TimeDisplay />
        <GoalTracker />
      </div>
    </div>
  );
}
```

### Event-Dialog

```tsx
// src/components/game/EventDialog.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/engine/state/game-store';
import { Button } from '@/components/ui/Button';
import { PixelText } from '@/components/ui/PixelText';

interface EventDialogProps {
  event: GameEvent;
  onClose: () => void;
}

export function EventDialog({ event, onClose }: EventDialogProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const { gold, reputation, modifyGold, modifyReputation, completeEvent, setFlag } =
    useGameStore();

  const handleChoice = async (choice: EventChoice) => {
    setSelectedChoice(choice.id);
    setIsResolving(true);

    // Kosten abziehen
    if (choice.cost?.gold) {
      modifyGold(-choice.cost.gold);
    }

    // Outcome bestimmen (gewichtet zufällig)
    const selectedOutcome = selectWeightedOutcome(choice.outcomes);
    setOutcome(selectedOutcome);

    // Effekte anwenden
    await applyEffects(selectedOutcome.effects);

    setIsResolving(false);
  };

  const applyEffects = async (effects: EventOutcome['effects']) => {
    if (effects.gold) {
      modifyGold(effects.gold);
    }
    if (effects.reputation) {
      for (const rep of effects.reputation) {
        modifyReputation(rep.faction, rep.change);
      }
    }
    if (effects.setFlag) {
      setFlag(effects.setFlag, true);
    }
    // ... weitere Effekte
  };

  const handleContinue = () => {
    completeEvent(event.id);
    onClose();
  };

  const availableChoices = event.choices.filter((choice) =>
    checkChoiceRequirements(choice, { gold, reputation })
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#2c2c54] border-4 border-[#706fd3] rounded-lg max-w-2xl w-full mx-4 overflow-hidden"
        >
          {/* Event Image */}
          {event.image && (
            <div className="h-48 bg-[#1a1a2e] flex items-center justify-center">
              <img
                src={`/sprites/events/${event.image}`}
                alt={event.title}
                className="h-full object-contain pixelated"
              />
            </div>
          )}

          {/* Event Title */}
          <div className="p-4 border-b-2 border-[#706fd3]">
            <PixelText size="lg" className="text-[#f5deb3]">
              {event.title}
            </PixelText>
          </div>

          {/* Event Content */}
          <div className="p-6">
            {!outcome ? (
              <>
                {/* Intro Text */}
                <p className="text-[#b8b8d1] whitespace-pre-line mb-6">
                  {event.intro}
                </p>

                {/* Choices */}
                <div className="space-y-3">
                  {availableChoices.map((choice) => (
                    <ChoiceButton
                      key={choice.id}
                      choice={choice}
                      onClick={() => handleChoice(choice)}
                      disabled={isResolving}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Outcome Text */}
                <p className="text-[#b8b8d1] whitespace-pre-line mb-6">
                  {outcome.text}
                </p>

                {/* Effects Summary */}
                <div className="bg-[#1a1a2e] rounded-lg p-4 mb-6">
                  <PixelText size="sm" className="text-[#706fd3] mb-2">
                    Auswirkungen:
                  </PixelText>
                  <EffectsList effects={outcome.effects} />
                </div>

                <Button onClick={handleContinue} className="w-full">
                  Weiter
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ChoiceButton({
  choice,
  onClick,
  disabled,
}: {
  choice: EventChoice;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-lg border-2
        transition-all duration-200
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-[#474787] hover:border-[#f5deb3]'
        }
        bg-[#3d3d6b] border-[#706fd3]
      `}
    >
      <span className="text-[#f5deb3]">{choice.text}</span>
      {choice.cost && (
        <span className="block text-sm text-[#ff6b6b] mt-1">
          {choice.cost.gold && `${choice.cost.gold} Gold`}
          {choice.cost.time && ` | ${choice.cost.time}h`}
        </span>
      )}
    </button>
  );
}
```

---

## MVP Entwicklungs-Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MVP ROADMAP (8 Wochen)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WOCHE 1-2: FOUNDATION                                                      │
│  ─────────────────────                                                      │
│  □ Next.js 15 Projekt aufsetzen                                             │
│  □ Supabase Projekt & Auth konfigurieren                                    │
│  □ Datenbank-Schema implementieren                                          │
│  □ Basis-UI Komponenten (Pixel-Art Theme)                                   │
│  □ State Management mit Zustand                                             │
│  □ Login/Register Flow                                                      │
│                                                                              │
│  WOCHE 3-4: KERN-MECHANIKEN                                                 │
│  ─────────────────────────                                                  │
│  □ Städte-System (3 Städte: Lübeck, Hamburg, Danzig)                       │
│  □ Waren-System (5 Basis-Waren)                                             │
│  □ Handelssystem (Kaufen/Verkaufen)                                         │
│  □ Karten-Ansicht mit Städten                                               │
│  □ Reisesystem (Zeit, Route, Animation)                                     │
│  □ Preis-Berechnung (Angebot/Nachfrage)                                     │
│                                                                              │
│  WOCHE 5-6: RUN-SYSTEM & EVENTS                                             │
│  ──────────────────────────────                                             │
│  □ Run starten/beenden                                                      │
│  □ Ziel-basierte Runs (Händler, Kaufmann)                                  │
│  □ Zeit-System (Stunden/Tage)                                               │
│  □ 20 Basis-Events                                                          │
│  □ Event-Dialog UI                                                          │
│  □ Spielstand speichern/laden                                               │
│  □ Run-Ende Screen                                                          │
│                                                                              │
│  WOCHE 7: LEGACY & LEADERBOARD                                              │
│  ─────────────────────────────                                              │
│  □ Legacy-Punkte verdienen                                                  │
│  □ 5 Basis-Upgrades                                                         │
│  □ Legacy-UI                                                                │
│  □ Leaderboard (Zeit-basiert)                                               │
│  □ Daily Challenge System                                                   │
│                                                                              │
│  WOCHE 8: POLISH & LAUNCH                                                   │
│  ─────────────────────────                                                  │
│  □ 10 weitere Events                                                        │
│  □ Sound-Effekte                                                            │
│  □ Musik                                                                    │
│  □ Responsive Design Check                                                  │
│  □ Bug-Fixes                                                                │
│  □ Vercel Deployment                                                        │
│  □ Beta-Launch                                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Deployment

```bash
# Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production Deploy
vercel --prod
```

### Vercel Konfiguration

```json
// vercel.json
{
  "buildCommand": "next build",
  "framework": "nextjs",
  "regions": ["fra1"],  // Frankfurt für DE-Spieler
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

---

*Ende des Game Design Documents*

---

## Nächste Schritte

1. **Projekt erstellen:** `npx create-next-app@latest hanse-nova`
2. **Supabase aufsetzen:** Dashboard → New Project
3. **Datenbank migrieren:** SQL-Schema ausführen
4. **Erste Komponenten:** Login, Stadtansicht, Handel
5. **Iterieren:** Spielen, Feedback, Verbessern

---

*HANSE NOVA – Game Design Document v1.0*
*Januar 2026*
