# HANSE NOVA – Game Design Document
## Teil 5: Fraktionen & Reputation

---

## Übersicht

Das Fraktionssystem gibt dem Spieler langfristige strategische Entscheidungen.
Jede Fraktion bietet einzigartige Vorteile, aber Loyalität zu einer bedeutet
oft Feindschaft mit einer anderen.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DIE 4 FRAKTIONEN                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ⚖️ NEUTRAL                                      │
│                                  │                                           │
│              ┌───────────────────┼───────────────────┐                      │
│              │                   │                   │                      │
│              ▼                   ▼                   ▼                      │
│      ┌───────────┐       ┌───────────┐       ┌───────────┐                 │
│      │           │       │           │       │           │                 │
│      │  ⚓ HANSE │◄─────►│  ⛪ KIRCHE│◄─────►│  👑 ADEL  │                 │
│      │           │       │           │       │           │                 │
│      └─────┬─────┘       └───────────┘       └─────┬─────┘                 │
│            │                                        │                       │
│            │           ┌───────────┐               │                       │
│            │           │           │               │                       │
│            └──────────►│ 🏴 PIRATEN│◄──────────────┘                       │
│                        │           │                                        │
│                        └───────────┘                                        │
│                                                                              │
│  Legende:                                                                   │
│  ◄────► = Neutrale Beziehung                                                │
│  ════► = Feindschaft (Hanse ↔ Piraten)                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Reputations-System

### Grundprinzip

```typescript
interface PlayerReputation {
  hanse: number;      // -100 bis +100
  pirates: number;    // -100 bis +100
  church: number;     // -100 bis +100
  nobility: number;   // -100 bis +100
}

// Stufen der Reputation
type ReputationLevel =
  | 'hated'      // -100 bis -60
  | 'hostile'    // -59 bis -30
  | 'disliked'   // -29 bis -10
  | 'neutral'    // -9 bis +9
  | 'liked'      // +10 bis +29
  | 'friendly'   // +30 bis +59
  | 'revered'    // +60 bis +100
  ;

function getReputationLevel(value: number): ReputationLevel {
  if (value <= -60) return 'hated';
  if (value <= -30) return 'hostile';
  if (value <= -10) return 'disliked';
  if (value <= 9) return 'neutral';
  if (value <= 29) return 'liked';
  if (value <= 59) return 'friendly';
  return 'revered';
}
```

### Reputations-UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEIN RUF                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚓ DIE HANSE                                                               │
│  ░░░░░░░░░░░░░░░░░░░░░░░█████████████████████░░░░░░░░░░░░░░░░░░░░░░░        │
│  Verhasst        Feindlich      Neutral      Freundlich      Verehrt       │
│                                    ▲                                         │
│  Status: FREUNDLICH (+42)          │                                        │
│  • Zugang zu allen Hanse-Kontoren  │                                        │
│  • 10% Rabatt auf Waren            │                                        │
│  • Schutz vor Konkurrenz           │                                        │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  🏴 DIE VITALIENBRÜDER                                                      │
│  ░░░░░░░░░░░█████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  Verhasst        Feindlich      Neutral      Freundlich      Verehrt       │
│         ▲                                                                    │
│  Status: FEINDLICH (-35)                                                    │
│  ⚠️ Piraten greifen dich bei Sichtkontakt an!                              │
│  • Kein Zugang zu Schwarzmärkten                                            │
│  • Erhöhte Überfallgefahr (+50%)                                            │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  ⛪ DIE KIRCHE                                                              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  Status: GEMOCHT (+18)                                                      │
│  • Heilung in Klöstern möglich                                              │
│  • Zugang zu Reliquien-Handel                                               │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  👑 DER ADEL                                                                │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  Status: NEUTRAL (+5)                                                       │
│  • Grundlegender Marktzugang                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Die Fraktionen im Detail

### ⚓ Die Hanse (Kaufmannsgilde)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ⚓ DIE HANSE                                        │
│                    "Macht durch Handel"                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BESCHREIBUNG:                                                              │
│  Der mächtigste Handelsbund Nordeuropas. Die Hanse kontrolliert den        │
│  Ostseehandel und setzt ihre Interessen mit wirtschaftlichem Druck und     │
│  gelegentlich auch mit Waffen durch.                                        │
│                                                                              │
│  HAUPTSITZ: Lübeck                                                          │
│  EINFLUSS: Stark in allen Hansestädten, schwach in Nowgorod/Stockholm      │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  VORTEILE BEI HOHER REPUTATION:                                             │
│                                                                              │
│  +10 (Gemocht)                                                              │
│    • Zugang zu allen Hanse-Kontoren                                         │
│    • Handelslizenz für alle Hansestädte                                     │
│                                                                              │
│  +30 (Freundlich)                                                           │
│    • 10% Rabatt auf alle Waren in Hansestädten                             │
│    • Frühwarnung bei Preisänderungen (bessere Gerüchte)                    │
│    • Schutz vor unfairer Konkurrenz                                         │
│                                                                              │
│  +50 (Respektiert)                                                          │
│    • Eigenes Kontor eröffnen möglich                                        │
│    • 15% Rabatt auf Waren                                                   │
│    • Stimme im Hanserat (politische Events)                                 │
│                                                                              │
│  +75 (Verehrt)                                                              │
│    • Titel: "Ältermann der Hanse"                                           │
│    • 20% Rabatt auf alle Waren                                              │
│    • Militärischer Schutz der Hanse-Flotte                                  │
│    • Exklusive Großhandels-Events                                           │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  NACHTEILE BEI NIEDRIGER REPUTATION:                                        │
│                                                                              │
│  -10 (Unbeliebt)                                                            │
│    • 10% Aufschlag auf alle Waren                                           │
│    • Misstrauische Händler                                                  │
│                                                                              │
│  -30 (Feindlich)                                                            │
│    • Handelsverbot in Hanse-Kontoren                                        │
│    • Nur Schwarzmarkt-Handel möglich                                        │
│                                                                              │
│  -60 (Verhasst)                                                             │
│    • Kopfgeld auf deinen Kopf                                               │
│    • Hanse-Schiffe greifen dich an                                          │
│    • Einreiseverbot in Lübeck, Hamburg, Rostock                            │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-GEWINN:                                    │
│    • Legaler Handel in Hansestädten                                         │
│    • Piraten bekämpfen oder melden                                          │
│    • Hanse-Aufträge erfüllen                                                │
│    • Schmuggler verraten                                                    │
│    • Beim Hanserat abstimmen (pro Hanse)                                    │
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-VERLUST:                                   │
│    • Schmuggel betreiben                                                    │
│    • Mit Piraten handeln                                                    │
│    • Hanse-Händler betrügen                                                 │
│    • Preisabsprachen brechen                                                │
│    • Gegen Hanse-Interessen stimmen                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

```typescript
const HANSE_FACTION: Faction = {
  id: 'hanse',
  name: 'Die Hanse',
  icon: '⚓',
  color: '#1a5276',
  motto: 'Macht durch Handel',

  headquarters: 'luebeck',
  strongholdCities: ['luebeck', 'hamburg', 'rostock', 'danzig'],
  weakCities: ['novgorod', 'stockholm'],

  baseRelation: 0,  // Neutral zu Beginn

  // Beziehungen zu anderen Fraktionen
  factionRelations: {
    pirates: -50,   // Feinde
    church: 20,     // Verbündete
    nobility: 10,   // Neutral-positiv
  },

  benefits: {
    10: ['kontor_access', 'trade_license'],
    30: ['price_discount_10', 'better_rumors', 'competition_protection'],
    50: ['own_kontor', 'price_discount_15', 'council_vote'],
    75: ['title_alderman', 'price_discount_20', 'fleet_protection', 'exclusive_deals'],
  },

  penalties: {
    -10: ['price_increase_10', 'suspicious_merchants'],
    -30: ['trade_ban', 'black_market_only'],
    -60: ['bounty', 'attack_on_sight', 'city_ban'],
  },

  reputationGainActions: [
    { action: 'legal_trade', amount: 1, description: 'Pro erfolgreichem Handel in Hansestadt' },
    { action: 'report_pirate', amount: 15, description: 'Piraten an Hanse melden' },
    { action: 'complete_hanse_quest', amount: 10, description: 'Hanse-Auftrag erfüllen' },
    { action: 'defeat_pirate', amount: 20, description: 'Piraten im Kampf besiegen' },
  ],

  reputationLossActions: [
    { action: 'smuggling', amount: -5, description: 'Beim Schmuggeln erwischt' },
    { action: 'pirate_trade', amount: -10, description: 'Mit Piraten handeln' },
    { action: 'fraud', amount: -15, description: 'Hanse-Händler betrügen' },
    { action: 'break_agreement', amount: -20, description: 'Handelsabkommen brechen' },
  ],
};
```

---

### 🏴 Die Vitalienbrüder (Piraten)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       🏴 DIE VITALIENBRÜDER                                  │
│                    "Gottes Freunde, aller Welt Feinde"                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BESCHREIBUNG:                                                              │
│  Piraten, Freibeuter, Gesetzlose – aber auch Freiheitskämpfer. Die         │
│  Vitalienbrüder kontrollieren versteckte Häfen und bieten eine Alternative │
│  zum Hanse-Monopol. Ihr Kodex ist brutal, aber ehrenhaft.                   │
│                                                                              │
│  HAUPTSITZ: Versteckte Buchten (freischaltbar)                              │
│  EINFLUSS: Stark um Visby, schwach in Hanse-Kernstädten                    │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  VORTEILE BEI HOHER REPUTATION:                                             │
│                                                                              │
│  +10 (Geduldet)                                                             │
│    • Piraten greifen dich nicht an                                          │
│    • Zugang zu Schwarzmärkten                                               │
│                                                                              │
│  +30 (Respektiert)                                                          │
│    • Piratenhafen "Gotlandhöhle" freigeschaltet                            │
│    • Gestohlene Waren -30% Einkaufspreis                                    │
│    • Schmuggelrouten-Informationen                                          │
│                                                                              │
│  +50 (Bruder)                                                               │
│    • Freibeuter-Lizenz (legales Kapern von Feinden)                        │
│    • Piraten als Eskorte mietbar                                            │
│    • Zugang zu "Kapitän Störtebekers Schatz"-Event                         │
│                                                                              │
│  +75 (Kapitän)                                                              │
│    • Titel: "Kapitän der Vitalienbrüder"                                   │
│    • Eigene Piraten-Crew rekrutierbar                                       │
│    • Zugang zum geheimen Piratenrat                                         │
│    • Anteil an Piraten-Beute                                                │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  NACHTEILE BEI NIEDRIGER REPUTATION:                                        │
│                                                                              │
│  -10 (Verdächtig)                                                           │
│    • Erhöhte Überfallwahrscheinlichkeit                                     │
│                                                                              │
│  -30 (Feind)                                                                │
│    • Piraten greifen bei Sicht an                                           │
│    • Schwarzmärkte verweigern Handel                                        │
│                                                                              │
│  -60 (Gejagt)                                                               │
│    • Kopfgeld der Piraten auf dich                                          │
│    • Attentatsversuche in Häfen                                             │
│    • Keine sichere Passage durch Piratengewässer                            │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  ⚠️ ACHTUNG: Hohe Piraten-Reputation senkt automatisch Hanse-Reputation!   │
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-GEWINN:                                    │
│    • Mit Piraten handeln                                                    │
│    • Schmuggeln                                                             │
│    • Hanse-Schiffe überfallen (wenn Freibeuter)                            │
│    • Piraten-Quests erfüllen                                                │
│    • Gefangene Piraten befreien                                             │
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-VERLUST:                                   │
│    • Piraten an Hanse verraten                                              │
│    • Piraten im Kampf besiegen                                              │
│    • Mit Hanse-Flotte kooperieren                                           │
│    • Piratenschätze an Behörden übergeben                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

```typescript
const PIRATES_FACTION: Faction = {
  id: 'pirates',
  name: 'Die Vitalienbrüder',
  icon: '🏴',
  color: '#1c1c1c',
  motto: 'Gottes Freunde, aller Welt Feinde',

  headquarters: 'hidden_cove',  // Spezieller Ort
  strongholdCities: ['visby'],
  weakCities: ['luebeck', 'hamburg'],

  baseRelation: -10,  // Leicht negativ

  factionRelations: {
    hanse: -50,
    church: -30,
    nobility: -40,
  },

  benefits: {
    10: ['no_pirate_attacks', 'black_market_access'],
    30: ['pirate_haven_access', 'stolen_goods_discount', 'smuggle_routes'],
    50: ['privateer_license', 'pirate_escort', 'treasure_quest'],
    75: ['title_captain', 'pirate_crew', 'pirate_council', 'loot_share'],
  },

  penalties: {
    -10: ['increased_attack_chance'],
    -30: ['attack_on_sight', 'black_market_ban'],
    -60: ['pirate_bounty', 'assassination_attempts', 'no_safe_passage'],
  },

  // Besonderheit: Gegenseitige Ausschließung mit Hanse
  exclusiveWith: 'hanse',
  exclusionThreshold: 50,  // Wenn Piraten > 50, kann Hanse nicht > 20 sein
};
```

---

### ⛪ Die Kirche

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ⛪ DIE KIRCHE                                       │
│                    "Ora et Labora"                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BESCHREIBUNG:                                                              │
│  Klöster, Bistümer und der Deutsche Orden. Die Kirche kontrolliert nicht   │
│  nur Seelen, sondern auch Ländereien, Handel und Informationen. Ihre       │
│  Gunst öffnet Türen, die sonst verschlossen bleiben.                        │
│                                                                              │
│  HAUPTSITZ: Riga (Deutscher Orden), Klöster überall                        │
│  EINFLUSS: Stark in Riga, Reval; moderat überall                           │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  VORTEILE BEI HOHER REPUTATION:                                             │
│                                                                              │
│  +10 (Gläubig)                                                              │
│    • Heilung in Klöstern (Crew-Gesundheit)                                  │
│    • Gebete für sichere Reise (+5% Sturmresistenz)                         │
│                                                                              │
│  +30 (Gesegnet)                                                             │
│    • Handel mit Reliquien und Kirchengütern                                 │
│    • Zugang zu Kloster-Bibliotheken (Gerüchte, Wissen)                     │
│    • Kirchlicher Schutz (Verfolgung stoppen)                               │
│                                                                              │
│  +50 (Gottesfürchtig)                                                       │
│    • Exklusiver Reliquien-Handel (sehr profitabel)                         │
│    • Ablasshandel-Lizenz                                                    │
│    • Diplomatische Immunität in Kirchenländern                              │
│                                                                              │
│  +75 (Heilig)                                                               │
│    • Titel: "Defender Fidei" (Verteidiger des Glaubens)                    │
│    • Wunder-Events möglich (sehr selten, sehr mächtig)                     │
│    • Kirchen-Netzwerk für Spionage nutzbar                                 │
│    • Kreuzzugs-Aufträge (gefährlich, aber sehr lukrativ)                   │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  NACHTEILE BEI NIEDRIGER REPUTATION:                                        │
│                                                                              │
│  -10 (Sünder)                                                               │
│    • Keine Heilung in Klöstern                                              │
│    • Crew wird nervös (Aberglaube)                                          │
│                                                                              │
│  -30 (Ketzer)                                                               │
│    • Exkommunikation droht                                                  │
│    • Kirchen-Events werden feindlich                                        │
│                                                                              │
│  -60 (Verdammt)                                                             │
│    • Exkommuniziert (schwere gesellschaftliche Nachteile)                  │
│    • Inquisition sucht nach dir                                             │
│    • Crew-Mitglieder desertieren aus Angst                                 │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-GEWINN:                                    │
│    • Spenden an Klöster                                                     │
│    • Reliquien transportieren                                               │
│    • Pilger befördern                                                       │
│    • Heiden/Ketzer bekämpfen                                                │
│    • Kirchenaufträge erfüllen                                               │
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-VERLUST:                                   │
│    • Verbotene Schriften handeln                                            │
│    • Kirchengut stehlen/schmuggeln                                          │
│    • Wucher betreiben (laut Kirchenrecht)                                   │
│    • Heiden helfen                                                          │
│    • Blasphemie in Events                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 👑 Der Adel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          👑 DER ADEL                                        │
│                    "Blut und Ehre"                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BESCHREIBUNG:                                                              │
│  Könige, Herzöge, Fürsten – der Adel kontrolliert Länder und Armeen. Sie   │
│  sind launisch, stolz und gefährlich. Aber ihre Gunst bedeutet Macht,      │
│  Land und vielleicht sogar einen eigenen Titel.                             │
│                                                                              │
│  HAUPTSITZ: Stockholm (Schwedischer König), Diverse Höfe                    │
│  EINFLUSS: Stark in Stockholm, Reval; variabel anderswo                    │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  VORTEILE BEI HOHER REPUTATION:                                             │
│                                                                              │
│  +10 (Bekannt)                                                              │
│    • Zugang zu Königshöfen                                                  │
│    • Hoflieferanten-Aufträge verfügbar                                      │
│                                                                              │
│  +30 (Geschätzt)                                                            │
│    • Steuervergünstigungen (10% weniger Zölle)                             │
│    • Königliche Aufträge (lukrativ, prestigeträchtig)                      │
│    • Einladungen zu Festen (Events)                                         │
│                                                                              │
│  +50 (Geadelt)                                                              │
│    • Titel: "Ritter" oder "Edler"                                          │
│    • Land/Landgut möglich (passives Einkommen)                              │
│    • Militärischer Schutz bei Bedarf                                        │
│                                                                              │
│  +75 (Vertraut)                                                             │
│    • Titel: "Baron" oder höher                                              │
│    • Königlicher Berater (politischer Einfluss)                             │
│    • Heirat in Adelsfamilie möglich (mächtiger Verbündeter)                │
│    • Eigenes Wappen und Siegel                                              │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  NACHTEILE BEI NIEDRIGER REPUTATION:                                        │
│                                                                              │
│  -10 (Unbedeutend)                                                          │
│    • Kein Zugang zu Höfen                                                   │
│    • Höhere Zölle (+10%)                                                    │
│                                                                              │
│  -30 (Unerwünscht)                                                          │
│    • Aktive Behinderung durch Adel                                          │
│    • Einreiseverbote in bestimmte Gebiete                                   │
│                                                                              │
│  -60 (Geächtet)                                                             │
│    • Vogelfreiheit in Adelsländern                                          │
│    • Kopfgeld ausgesetzt                                                    │
│    • Militärische Verfolgung                                                │
│                                                                              │
│  ──────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-GEWINN:                                    │
│    • Königliche Aufträge erfüllen                                           │
│    • Luxuswaren an Höfe liefern                                             │
│    • Im Krieg die "richtige" Seite unterstützen                            │
│    • Großzügige Geschenke                                                   │
│    • Adelige in Events respektvoll behandeln                               │
│                                                                              │
│  TYPISCHE ACTIONS ZUM REPUTATION-VERLUST:                                   │
│    • Adelige beleidigen                                                     │
│    • Gegen königliche Interessen handeln                                    │
│    • Mit Feinden des Königs kooperieren                                     │
│    • Steuern hinterziehen                                                   │
│    • Aufstände unterstützen                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Fraktions-Interaktionen

### Automatische Reputations-Änderungen

```typescript
// Wenn Reputation bei einer Fraktion steigt/fällt,
// ändern sich auch andere Fraktionen automatisch

const FACTION_RIPPLE_EFFECTS: FactionRipple[] = [
  // Hanse ↔ Piraten sind Erzfeinde
  {
    trigger: { faction: 'hanse', change: 'positive' },
    effect: { faction: 'pirates', multiplier: -0.3 },
    // Wenn Hanse +10, dann Piraten -3
  },
  {
    trigger: { faction: 'pirates', change: 'positive' },
    effect: { faction: 'hanse', multiplier: -0.5 },
    // Wenn Piraten +10, dann Hanse -5
  },

  // Kirche und Hanse sind Verbündete
  {
    trigger: { faction: 'hanse', change: 'positive' },
    effect: { faction: 'church', multiplier: 0.1 },
  },
  {
    trigger: { faction: 'church', change: 'positive' },
    effect: { faction: 'hanse', multiplier: 0.1 },
  },

  // Piraten und Kirche sind Feinde
  {
    trigger: { faction: 'pirates', change: 'positive' },
    effect: { faction: 'church', multiplier: -0.2 },
  },
];

function applyReputationChange(
  player: PlayerState,
  faction: FactionId,
  amount: number
): void {
  // Primäre Änderung
  player.reputation[faction] = clamp(
    player.reputation[faction] + amount,
    -100,
    100
  );

  // Ripple Effects
  for (const ripple of FACTION_RIPPLE_EFFECTS) {
    if (ripple.trigger.faction === faction) {
      const isPositive = amount > 0;
      if (
        (isPositive && ripple.trigger.change === 'positive') ||
        (!isPositive && ripple.trigger.change === 'negative')
      ) {
        const rippleAmount = Math.round(amount * ripple.effect.multiplier);
        player.reputation[ripple.effect.faction] = clamp(
          player.reputation[ripple.effect.faction] + rippleAmount,
          -100,
          100
        );
      }
    }
  }
}
```

### Exklusive Fraktions-Pfade

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FRAKTIONS-PFADE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Du kannst nicht gleichzeitig bei allen Fraktionen beliebt sein!            │
│                                                                              │
│  PATH 1: DER EHRENHAFTE KAUFMANN                                            │
│  ─────────────────────────────────────────                                  │
│  Hanse ████████████████████ +60                                             │
│  Kirche ████████████░░░░░░░ +40                                             │
│  Adel █████████░░░░░░░░░░░ +30                                              │
│  Piraten ░░░░░░░░░░░░░░░░░ -50                                              │
│                                                                              │
│  + Sicherer, legaler Handel                                                 │
│  + Politischer Einfluss                                                     │
│  - Keine Schwarzmarkt-Optionen                                              │
│  - Muss Regeln befolgen                                                     │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  PATH 2: DER FREIBEUTER                                                     │
│  ─────────────────────────────────────────                                  │
│  Piraten ██████████████████ +50                                             │
│  Adel ███████░░░░░░░░░░░░░ +20 (bestimmte Adelige schätzen Freibeuter)     │
│  Hanse ░░░░░░░░░░░░░░░░░░░ -40                                              │
│  Kirche ░░░░░░░░░░░░░░░░░░ -30                                              │
│                                                                              │
│  + Schmuggel, Überfälle, Schwarzmarkt                                       │
│  + Freiheit von Regeln                                                      │
│  - Ständig gejagt                                                           │
│  - Kein Zugang zu Hansestädten                                              │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  PATH 3: DER KIRCHENMANN                                                    │
│  ─────────────────────────────────────────                                  │
│  Kirche ████████████████████ +70                                            │
│  Hanse █████████████░░░░░░░ +45                                             │
│  Adel █████████░░░░░░░░░░░ +30                                              │
│  Piraten ░░░░░░░░░░░░░░░░░ -60                                              │
│                                                                              │
│  + Heilung, Reliquien, Wunder                                               │
│  + Moralische Autorität                                                     │
│  - Strenge ethische Regeln                                                  │
│  - Wucher verboten                                                          │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  PATH 4: DER GRAUZONE-HÄNDLER                                               │
│  ─────────────────────────────────────────                                  │
│  Alle Fraktionen: ████████░░ +20 bis +30                                   │
│                                                                              │
│  + Flexibel, überall willkommen                                             │
│  + Keine extremen Feinde                                                    │
│  - Keine exklusiven Vorteile                                                │
│  - Muss ständig balancieren                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Fraktions-Events

Jede Fraktion hat einzigartige Event-Ketten.

```typescript
// Beispiel: Hanse-Event-Kette "Der Hanserat"
const HANSE_COUNCIL_CHAIN: EventChain = {
  id: 'hanse_council',
  name: 'Der Hanserat',
  faction: 'hanse',
  requiredReputation: 50,

  events: [
    {
      id: 'council_invitation',
      title: 'Einladung zum Hanserat',
      intro: `Ein versiegelter Brief erreicht dich: Du bist eingeladen,
als Beobachter am Hanserat in Lübeck teilzunehmen. Eine große Ehre...
oder eine Falle?`,
      // ...
    },
    {
      id: 'council_vote_trade_war',
      title: 'Abstimmung: Handelskrieg gegen Dänemark',
      intro: `Der Rat debattiert: Soll die Hanse Dänemark mit einem
Handelsboykott strafen? Deine Stimme könnte entscheidend sein.`,
      choices: [
        {
          text: 'Für den Boykott stimmen',
          effects: {
            reputation: [{ faction: 'hanse', change: 10 }],
            setFlag: 'supported_denmark_boycott',
            // Später: Dänische Häfen feindlich, aber Hanse-Bonus
          },
        },
        {
          text: 'Gegen den Boykott stimmen',
          effects: {
            reputation: [
              { faction: 'hanse', change: -5 },
              { faction: 'nobility', change: 10 },
            ],
            setFlag: 'opposed_denmark_boycott',
            // Später: Dänemark freundlich, aber Hanse misstrauisch
          },
        },
        {
          text: 'Enthaltung',
          effects: {
            // Keine direkten Konsequenzen, aber verpasste Chance
          },
        },
      ],
    },
    // ... weitere Events in der Kette
  ],
};
```

---

## Reputation & Handel

```typescript
// Reputation beeinflusst Handelspreise

function getPriceModifierFromReputation(
  cityId: string,
  faction: FactionId,
  reputation: number
): number {
  const city = getCityById(cityId);
  const factionInfluence = city.factionInfluence[faction] || 0;

  // Basis-Modifikator basierend auf Reputation
  let modifier = 1.0;

  if (reputation >= 75) {
    modifier = 0.80;  // 20% Rabatt
  } else if (reputation >= 50) {
    modifier = 0.85;  // 15% Rabatt
  } else if (reputation >= 30) {
    modifier = 0.90;  // 10% Rabatt
  } else if (reputation >= 10) {
    modifier = 0.95;  // 5% Rabatt
  } else if (reputation <= -30) {
    modifier = 1.20;  // 20% Aufschlag
  } else if (reputation <= -10) {
    modifier = 1.10;  // 10% Aufschlag
  }

  // Modifikator skaliert mit Fraktions-Einfluss in der Stadt
  // Lübeck (Hanse 100%) → voller Effekt
  // Novgorod (Hanse 30%) → 30% Effekt
  const scaledModifier = 1 + (modifier - 1) * factionInfluence;

  return scaledModifier;
}

// Beispiel:
// Spieler hat +50 Hanse-Reputation
// In Lübeck (100% Hanse-Einfluss): 15% Rabatt
// In Novgorod (30% Hanse-Einfluss): 4.5% Rabatt
```

---

*Weiter zu Teil 6: Schiffe & Crew*
