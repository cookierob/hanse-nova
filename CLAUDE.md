# Hanse Nova - Claude Code Guidance

## Projektübersicht
Roguelike-Handelssimulation im Hansezeit-Setting (ca. 1370). Web-basiert mit Next.js 15 und Zustand für State Management.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **State**: Zustand mit Persist-Middleware
- **Styling**: Tailwind CSS mit Pixel-Art Theme
- **Animation**: Framer Motion
- **Backend**: Supabase (optional, für Persistenz)

## Projektstruktur
```
src/
├── app/                    # Next.js Pages
│   ├── page.tsx           # Landing/Start
│   └── play/page.tsx      # Hauptspiel
├── components/
│   ├── ui/                # Button, Card, Dialog, PixelText
│   └── game/              # CityView, MapCanvas, TradePanel, etc.
├── engine/
│   ├── state/             # Zustand Game Store
│   ├── systems/           # market, travel, time
│   └── types/             # TypeScript Definitionen
├── data/                  # cities, goods, ships, events
└── lib/                   # Utilities
```

## Wichtige Dateien
| Datei | Beschreibung |
|-------|--------------|
| `src/engine/state/game-store.ts` | Zentraler Spielzustand |
| `src/data/cities.ts` | 3 Hansestädte (Lübeck, Hamburg, Danzig) |
| `src/data/goods.ts` | 5 Handelswaren |
| `src/data/events.ts` | 10 Zufallsevents |
| `src/components/game/CityView.tsx` | Haupt-Spielansicht |

## Spielmechanik
- **Ziel**: 2000 Gold in 30 Tagen erreichen
- **Start**: 500 Gold, Ewer (kleines Schiff), Lübeck
- **Handel**: Waren günstig kaufen, teuer verkaufen
- **Reisen**: Zeit vergeht, Events können auftreten
- **Preise**: Variieren pro Stadt (Angebot/Nachfrage)

## Commands
```bash
npm run dev      # Development Server
npm run build    # Production Build
npm run lint     # ESLint
```

## Erweiterungen (geplant)
- Supabase-Integration für Highscores
- Weitere Städte und Waren
- Schiffskauf-System
- Mehr Events und Story-Elemente
