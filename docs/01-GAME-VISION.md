# HANSE NOVA – Game Design Document
## Teil 1: Vision & Kernkonzept

---

## Elevator Pitch

> **"FTL meets Patrizier"** – Ein Roguelike-Handelsspiel im mittelalterlichen
> Ostseeraum mit narrativen Events, ziel-basierten Runs und permanentem Fortschritt.

---

## Was macht HANSE NOVA einzigartig?

### Das Problem mit klassischen Hanse-Spielen

| Klassische Hanse-Spiele | Problem |
|------------------------|---------|
| Endlos-Sandbox ohne Ziel | Kein Spannungsbogen, wird schnell langweilig |
| Komplexe Wirtschaftssimulation | Hohe Einstiegshürde, überfordert Casual-Spieler |
| Statische Welt | Keine Überraschungen, repetitiv |
| Keine Meta-Progression | Jeder Neustart fühlt sich gleich an |
| Lange Sessions nötig | Passt nicht in moderne Spielgewohnheiten |

### Die HANSE NOVA Lösung

| HANSE NOVA | Vorteil |
|------------|---------|
| Ziel-basierte Runs | Klarer Spannungsbogen, Erfolgserlebnis |
| Zugängliche Mechaniken | Schnell verstanden, schwer zu meistern |
| 200+ narrative Events | Jeder Run erzählt eine andere Geschichte |
| Legacy-System | Permanente Upgrades motivieren zum Weiterspielen |
| 15-30 Minuten pro Run | Perfekt für zwischendurch |

---

## Die 4 Säulen des Spiels

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DIE 4 SÄULEN                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. ZIEL-BASIERTE RUNS     2. NARRATIVE EVENTS                              │
│  ─────────────────────     ──────────────────                               │
│  • Klares Ziel pro Run     • 200+ einzigartige Events                       │
│  • Zeit läuft (Ranking)    • Verzweigte Entscheidungen                      │
│  • Verschiedene Ziel-Stufen• Konsequenzen über den Run hinweg              │
│  • Daily Challenges        • Wiederkehrende Charaktere                      │
│  • Permadeath möglich      • Moralische Dilemmata                           │
│                                                                              │
│  3. FRAKTIONEN & RUF       4. LEGACY-SYSTEM                                 │
│  ─────────────────────     ───────────────────                              │
│  • 4 Fraktionen mit        • Permanente Upgrades                            │
│    eigenen Vorteilen       • Freischaltbare Schiffe                         │
│  • Reputation beeinflusst  • Neue Startbedingungen                          │
│    Events & Preise         • Achievements                                   │
│  • Exklusive Inhalte       • Kosmetische Belohnungen                        │
│    je nach Zugehörigkeit                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Zielgruppe

### Primäre Zielgruppe

**"Der strategische Gelegenheitsspieler"**

- Alter: 25-45 Jahre
- Spielt gerne in kurzen Sessions (Mittagspause, Pendeln, Abends)
- Mag Strategie, aber keine 4X-Komplexität
- Nostalgisch für Patrizier/Anno, aber keine Zeit mehr dafür
- Schätzt Pixel-Art-Ästhetik
- Vergleichbare Spiele: FTL, Slay the Spire, Loop Hero, Merchant of the Skies

### Sekundäre Zielgruppe

**"Der Roguelike-Enthusiast"**

- Sucht nach neuem Roguelike-Twist
- Liebt Daily Challenges und Leaderboards
- Will "one more run" Suchtfaktor

---

## Spielgefühl (Player Fantasy)

> Du bist ein aufstrebender Händler im 14. Jahrhundert. Mit einem kleinen
> Schiff und wenig Gold startest du in Lübeck. Dein Ziel: Reich werden.
>
> Aber der Weg dorthin ist voller Entscheidungen. Hilfst du dem gestrandeten
> Kapitän oder segelst du weiter? Schmuggelst du Waffen für die Piraten oder
> bleibst du der Hanse treu? Jede Wahl hat Konsequenzen.
>
> Manche Runs enden im Triumph, manche im Sturm. Aber mit jedem Run lernst
> du dazu – und schaltest neue Möglichkeiten frei.

---

## Core Gameplay Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORE GAMEPLAY LOOP                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │  RUN STARTEN │
                              │  Ziel wählen │
                              └──────┬───────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │          IN EINER STADT        │
                    │  • Waren kaufen/verkaufen      │
                    │  • Schiff reparieren           │
                    │  • Events erleben              │
                    │  • Gerüchte hören (Preise)     │
                    └────────────────┬───────────────┘
                                     │
                         ┌───────────┴───────────┐
                         ▼                       ▼
              ┌──────────────────┐    ┌──────────────────┐
              │  ZIEL WÄHLEN     │    │  MEHR HANDELN    │
              │  Route planen    │    │  (gleiche Stadt) │
              └────────┬─────────┘    └──────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  REISE           │
              │  • Zeit vergeht  │
              │  • Events möglich│
              │  • Wetter-Effekte│
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  ANKUNFT         │
              │  • Stadt-Event?  │
              │  • Markt prüfen  │
              └────────┬─────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ ZIEL        │         │ WEITERSPIELEN│
    │ ERREICHT?   │────────▶│ (Loop)       │
    │             │   Nein  │              │
    └──────┬──────┘         └──────────────┘
           │ Ja
           ▼
    ┌─────────────┐
    │ RUN ENDE    │
    │ • Zeit-Score│
    │ • Legacy-LP │
    │ • Statistik │
    └─────────────┘
```

---

## Session-Struktur

### Typischer Run (15-30 Minuten)

```
Zeit        Aktion
─────────────────────────────────────────────────────────
0:00        Run starten, Ziel: 5.000 Gold (Start: 500)
0:02        In Lübeck: Salz kaufen (300 Gold → 30 Einheiten)
0:03        Route nach Danzig planen (2,5 Tage Reise)
0:04        REISE-EVENT: Fischer bietet frischen Fang an
0:05        Entscheidung: Kaufen für 50 Gold
0:06        Ankunft Danzig, Salz verkaufen (+180 Gold Profit)
0:08        STADT-EVENT: Händler sucht Partner für Bernstein-Deal
0:09        Entscheidung: Einsteigen (200 Gold investieren)
0:10        Bernstein kaufen, Route nach Hamburg planen
0:12        REISE-EVENT: Sturm! Schiff beschädigt (-15% Zustand)
0:14        Ankunft Hamburg, Reparatur (80 Gold)
0:15        Bernstein verkaufen (+340 Gold)
0:17        Aktueller Stand: 1.190 Gold
...         [Weitere Trades]
0:28        ZIEL ERREICHT: 5.000 Gold!
0:29        Ergebnis: Zeit 4 Tage 12h, Platz 156, +2 Legacy-Punkte
```

---

## Monetarisierung (Optional für später)

### Free-to-Play mit fairer Monetarisierung

| Element | Kostenlos | Premium (einmalig $4.99) |
|---------|-----------|--------------------------|
| Alle Runs | ✅ | ✅ |
| Daily Challenges | ✅ | ✅ |
| Legacy-System | ✅ | ✅ |
| 3 Speicherslots | ✅ | ✅ |
| Werbung | Alle 3 Runs | Keine |
| Exklusive Schiffs-Skins | ❌ | ✅ |
| Statistik-Dashboard | Basis | Erweitert |
| Soundtrack Download | ❌ | ✅ |

**Kein Pay-to-Win. Keine Lootboxen. Keine Energie-Systeme.**

---

## Plattform-Strategie

### Phase 1: Web (MVP)

- Browser-basiert (funktioniert überall)
- Responsive Design (Desktop + Mobile Browser)
- PWA für "App-like" Experience
- Schnellste Entwicklung, einfachstes Testing

### Phase 2: Mobile (nach erfolgreichem Web-Launch)

- React Native / Expo
- Shared Game Logic
- Native Performance
- Push-Notifications für Daily Challenges

### Phase 3: Steam (optional)

- Electron Wrapper oder native Build
- Steam Achievements
- Trading Cards
- Workshop Support (Community Events?)

---

## Erfolgskriterien

### MVP Launch (8 Wochen)

- [ ] 3 Ziel-Stufen spielbar (Händler, Kaufmann, Patrizier)
- [ ] 8 Städte mit einzigartigen Waren
- [ ] 50+ Events implementiert
- [ ] Legacy-System mit 10 Upgrades
- [ ] Daily Challenge System
- [ ] Leaderboard funktional

### 3 Monate nach Launch

- [ ] 1.000+ registrierte Spieler
- [ ] 100+ täglich aktive Spieler
- [ ] Durchschnittliche Session: 15+ Minuten
- [ ] 30% Retention nach 7 Tagen

### 6 Monate nach Launch

- [ ] 150+ Events
- [ ] Community-Event-Wettbewerb
- [ ] Mobile App veröffentlicht
- [ ] Positive Reviews (>80%)

---

*Weiter zu Teil 2: Zeit-System & Reisen*
