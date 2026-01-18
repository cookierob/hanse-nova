# HANSE NOVA – Game Design Document
## Teil 4: Event-System

---

## Übersicht

Das Event-System ist das Herzstück von HANSE NOVA. Es unterscheidet das Spiel von
klassischen Handelssimulationen und schafft narrative Tiefe.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVENT-SYSTEM ÜBERSICHT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INSPIRIERT VON:                                                            │
│  • FTL: Faster Than Light (Zufalls-Events, Entscheidungen)                  │
│  • Slay the Spire (Verzweigungen, Risk/Reward)                              │
│  • Sunless Sea (Atmosphäre, Narrative)                                      │
│  • Crusader Kings (Konsequenzen, Charakter-Stories)                         │
│                                                                              │
│  GRUNDPRINZIPIEN:                                                           │
│  • Jede Entscheidung hat Konsequenzen                                       │
│  • Moralische Dilemmata ohne "richtige" Antwort                             │
│  • Charaktere kehren wieder (recurring NPCs)                                │
│  • Frühe Entscheidungen beeinflussen späte Events                           │
│  • Reputation öffnet/schließt Optionen                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Event-Kategorien

### Übersicht

```typescript
type EventCategory =
  | 'narrative'      // Charakter-Stories, moralische Dilemmata (40%)
  | 'trade'          // Handels-Gelegenheiten, Angebote (25%)
  | 'travel'         // Auf See, Wetter, Begegnungen (20%)
  | 'conflict'       // Piraten, Krieg, Überfälle (10%)
  | 'city'           // Stadt-spezifische Events (5%)
  ;

type EventTrigger =
  | 'city_arrival'   // Bei Ankunft in einer Stadt
  | 'city_stay'      // Während Aufenthalt in Stadt
  | 'travel'         // Während der Reise
  | 'time_based'     // Nach X Stunden/Tagen
  | 'threshold'      // Bei Erreichen von Gold/Rep-Schwellen
  | 'chain'          // Follow-up zu früherem Event
  ;
```

### Verteilung

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVENT-VERTEILUNG                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Pro Stadt-Besuch:    70% Chance auf mindestens 1 Event                    │
│  Pro Reisetag:        15% Chance auf Event (wetterabhängig)                 │
│                                                                              │
│  NARRATIVE    ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░  40%            │
│  TRADE        █████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%            │
│  TRAVEL       ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  20%            │
│  CONFLICT     █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  10%            │
│  CITY         ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   5%            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Event-Datenstruktur

```typescript
interface GameEvent {
  // Identifikation
  id: string;
  title: string;
  category: EventCategory;
  trigger: EventTrigger;

  // Bedingungen für Auslösung
  requirements?: EventRequirements;

  // Inhalt
  intro: string;                    // Einleitungstext
  image?: string;                   // Optional: Illustration
  mood?: 'neutral' | 'positive' | 'tense' | 'dangerous';

  // Entscheidungen
  choices: EventChoice[];

  // Meta
  weight: number;                   // Wahrscheinlichkeits-Gewicht (1-10)
  unique: boolean;                  // Nur einmal pro Run?
  chainId?: string;                 // Teil einer Event-Kette?
  chainPosition?: number;           // Position in Kette
}

interface EventRequirements {
  // Ort
  cities?: string[];                // Nur in diesen Städten
  notCities?: string[];             // Nicht in diesen Städten
  atSea?: boolean;                  // Nur auf See

  // Ressourcen
  minGold?: number;
  maxGold?: number;
  hasCargo?: string[];              // Bestimmte Waren geladen

  // Reputation
  reputation?: {
    faction: FactionId;
    min?: number;
    max?: number;
  };

  // Zeit
  season?: Season[];
  minRunTime?: number;              // Mindest-Spielzeit (Stunden)
  maxRunTime?: number;

  // Vorherige Events
  completedEvents?: string[];       // Diese Events müssen passiert sein
  notCompletedEvents?: string[];    // Diese Events dürfen nicht passiert sein

  // Traits
  traits?: string[];                // Spieler/Crew hat diesen Trait

  // Schiff
  shipType?: string[];
  minCrewMorale?: number;
  maxShipCondition?: number;
}

interface EventChoice {
  id: string;
  text: string;                     // Button-Text
  tooltip?: string;                 // Hover-Info

  // Bedingungen für diese Option
  requirements?: {
    gold?: number;
    reputation?: { faction: FactionId; min: number };
    trait?: string;
    item?: string;
    skill?: string;
  };

  // Kosten (werden sofort abgezogen)
  cost?: {
    gold?: number;
    time?: number;                  // Stunden
    cargo?: { goodId: string; amount: number };
    shipCondition?: number;
    crewMorale?: number;
  };

  // Mögliche Ergebnisse (gewichtet)
  outcomes: EventOutcome[];
}

interface EventOutcome {
  weight: number;                   // Wahrscheinlichkeit (1-100)
  text: string;                     // Ergebnis-Text

  effects: {
    // Ressourcen
    gold?: number;                  // +/- Gold
    cargo?: { goodId: string; amount: number; free?: boolean }[];

    // Reputation
    reputation?: { faction: FactionId; change: number }[];

    // Schiff & Crew
    shipCondition?: number;
    crewMorale?: number;
    crewMember?: CrewMember;        // Neues Crew-Mitglied

    // Spieler-Status
    trait?: string;                 // Trait hinzufügen
    removeTrait?: string;

    // Zeit
    travelTimeModifier?: number;    // Aktuelle Reise

    // Meta
    unlockEvent?: string;           // Zukünftiges Event freischalten
    blockEvent?: string;            // Zukünftiges Event blockieren
    setFlag?: string;               // Flag für spätere Checks
    triggerEvent?: string;          // Sofort anderes Event starten

    // NPCs
    npcRelation?: { npcId: string; change: number };
    unlockNpc?: string;
  };
}
```

---

## Event-UI

### Standard Event-Dialog

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │                     [PIXEL-ART ILLUSTRATION]                           │ │
│  │                                                                         │ │
│  │                    Ein verzweifelter Kapitän                           │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─ DER VERZWEIFELTE KAPITÄN ─────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  In der Hafentaverne spricht dich ein erschöpfter Mann an. Seine       │ │
│  │  Kleidung war einmal fein, jetzt ist sie zerrissen und salzverkrustet. │ │
│  │                                                                         │ │
│  │  "Ich bin Kapitän Eriksen. Piraten haben mein Schiff gekapert und      │ │
│  │  meine Mannschaft gefangen genommen. Ich brauche 500 Gold für das      │ │
│  │  Lösegeld. Ich schwöre bei meiner Ehre – ich zahle es zurück,          │ │
│  │  mit Zinsen!"                                                          │ │
│  │                                                                         │ │
│  │  Seine Augen sind rot vom Weinen oder vom Rum. Oder beidem.            │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─ DEINE ENTSCHEIDUNG ───────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  💰 "Hier, nimm die 500 Gold."                                  │   │ │
│  │  │  -500 Gold                                                       │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  🤝 "Ich gebe dir 300 Gold – aber du arbeitest es ab."         │   │ │
│  │  │  -300 Gold │ Benötigt: Reputation 10+                           │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  ❌ "Das ist nicht mein Problem."                               │   │ │
│  │  │  Keine Kosten                                                    │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  🏴 "Ich kenne die Piraten. Für 200 Gold verrate ich dich."    │   │ │
│  │  │  +200 Gold │ Benötigt: Piraten-Ruf 30+ │ ⚠️ Skrupellos         │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ergebnis-Anzeige

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─ ERGEBNIS ─────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │  Du gibst Eriksen die 500 Gold. Er nimmt das Geld mit zitternden      │ │
│  │  Händen und Tränen in den Augen.                                       │ │
│  │                                                                         │ │
│  │  "Ich werde das niemals vergessen. Wenn du je Hilfe brauchst –        │ │
│  │  frag nach Eriksen. Jeder Hafen kennt mich."                          │ │
│  │                                                                         │ │
│  │  Er verschwindet in der Nacht. Du hoffst, dass du ihn wiedersiehst... │ │
│  │                                                                         │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │                                                                         │ │
│  │  Auswirkungen:                                                         │ │
│  │  • 💰 -500 Gold                                                        │ │
│  │  • 📈 +5 Allgemeine Reputation                                         │ │
│  │  • 🔓 Eriksen wird sich erinnern... (Event freigeschaltet)            │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│                              [Weiter]                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Event-Beispiele: Narrative Events

### Event-Kette: Der verzweifelte Kapitän

```typescript
// Event 1: Die erste Begegnung
const DESPERATE_CAPTAIN_1: GameEvent = {
  id: 'desperate_captain_01',
  title: 'Der verzweifelte Kapitän',
  category: 'narrative',
  trigger: 'city_arrival',

  requirements: {
    minRunTime: 4,                  // Nicht ganz am Anfang
    cities: ['luebeck', 'hamburg', 'rostock', 'danzig'],
    notCompletedEvents: ['desperate_captain_01'],  // Nur einmal
  },

  intro: `In der Hafentaverne spricht dich ein erschöpfter Mann an. Seine
Kleidung war einmal fein, jetzt ist sie zerrissen und salzverkrustet.

"Ich bin Kapitän Eriksen. Piraten haben mein Schiff gekapert und meine
Mannschaft gefangen genommen. Ich brauche 500 Gold für das Lösegeld.
Ich schwöre bei meiner Ehre – ich zahle es zurück, mit Zinsen!"

Seine Augen sind rot vom Weinen oder vom Rum. Oder beidem.`,

  image: 'events/desperate_captain.png',
  mood: 'tense',
  weight: 6,
  unique: true,
  chainId: 'eriksen_saga',
  chainPosition: 1,

  choices: [
    {
      id: 'give_full',
      text: '💰 "Hier, nimm die 500 Gold."',
      cost: { gold: 500 },
      requirements: { gold: 500 },
      outcomes: [
        {
          weight: 70,
          text: `Eriksen nimmt das Gold mit zitternden Händen. "Ich werde das
niemals vergessen. Wenn du je Hilfe brauchst – frag nach Eriksen."

Er verschwindet in die Nacht. Du hoffst, ihn wiederzusehen...`,
          effects: {
            reputation: [{ faction: 'general', change: 5 }],
            unlockEvent: 'eriksen_returns_grateful',
            setFlag: 'eriksen_helped_fully',
            npcRelation: { npcId: 'eriksen', change: 50 },
          },
        },
        {
          weight: 30,
          text: `Eriksen nimmt das Gold... und du siehst ihn nie wieder.
Am nächsten Morgen hörst du Gerüchte: "Eriksen? Der alte Betrüger?"

Du wurdest reingelegt.`,
          effects: {
            reputation: [{ faction: 'general', change: -2 }],
            setFlag: 'eriksen_scammed',
            blockEvent: 'eriksen_*',  // Keine weiteren Eriksen-Events
          },
        },
      ],
    },
    {
      id: 'give_loan',
      text: '🤝 "Ich gebe dir 300 Gold – aber du arbeitest es ab."',
      cost: { gold: 300 },
      requirements: {
        gold: 300,
        reputation: { faction: 'general', min: 10 },
      },
      outcomes: [
        {
          weight: 90,
          text: `Eriksen zögert, dann nickt er. "Ich bin ein guter Navigator.
Ich kenne jede Strömung der Ostsee. Du wirst es nicht bereuen."

Er wird Teil deiner Mannschaft.`,
          effects: {
            crewMember: {
              id: 'eriksen',
              name: 'Eriksen',
              role: 'navigator',
              skill: 4,
              loyalty: 70,
              trait: 'grateful',
              specialAbility: 'navigation_+15%',
            },
            unlockEvent: 'eriksen_personal_quest',
            setFlag: 'eriksen_crew_member',
          },
        },
        {
          weight: 10,
          text: `Eriksen schüttelt den Kopf. "Ich bin kein Diener. Ich war
Kapitän!" Er stolpert davon, sein Stolz größer als seine Verzweiflung.`,
          effects: {
            unlockEvent: 'eriksen_returns_bitter',
          },
        },
      ],
    },
    {
      id: 'decline',
      text: '❌ "Das ist nicht mein Problem."',
      outcomes: [
        {
          weight: 100,
          text: `Du wendest dich ab. Eriksens Schultern sacken zusammen.
"Ich verstehe", flüstert er. "Niemand hilft einem Fremden."

Du vergisst ihn schnell. Aber vielleicht vergisst er dich nicht...`,
          effects: {
            reputation: [{ faction: 'general', change: -1 }],
            unlockEvent: 'eriksen_revenge',
          },
        },
      ],
    },
    {
      id: 'betray',
      text: '🏴 "Ich kenne die Piraten. Für 200 Gold verrate ich dich."',
      requirements: {
        reputation: { faction: 'pirates', min: 30 },
      },
      outcomes: [
        {
          weight: 100,
          text: `Eriksens Gesicht wird aschfahl. "Du... du würdest..."

Noch in derselben Nacht holen ihn die Piraten. Du zählst dein Geld
und versuchst, sein Schreien zu vergessen.`,
          effects: {
            gold: 200,
            reputation: [
              { faction: 'pirates', change: 10 },
              { faction: 'hanse', change: -5 },
              { faction: 'general', change: -10 },
            ],
            trait: 'ruthless',
            blockEvent: 'eriksen_*',
            setFlag: 'eriksen_betrayed',
          },
        },
      ],
    },
  ],
};

// Event 2: Eriksen kehrt zurück (dankbar)
const ERIKSEN_RETURNS_GRATEFUL: GameEvent = {
  id: 'eriksen_returns_grateful',
  title: 'Ein alter Freund',
  category: 'narrative',
  trigger: 'city_arrival',

  requirements: {
    completedEvents: ['desperate_captain_01'],
    minRunTime: 48,  // Mindestens 2 Tage später
    cities: ['visby', 'stockholm', 'riga'],  // Andere Städte
  },

  intro: `Ein bekanntes Gesicht taucht in der Menge auf – Kapitän Eriksen!
Er sieht völlig verändert aus: gut gekleidet, stolze Haltung, gesund.

"Mein Freund!" Er umarmt dich. "Meine Mannschaft ist frei, mein Schiff
repariert. Und ich habe nicht vergessen, was du für mich getan hast."

Er drückt dir einen schweren Beutel in die Hand.`,

  mood: 'positive',
  weight: 10,
  unique: true,
  chainId: 'eriksen_saga',
  chainPosition: 2,

  choices: [
    {
      id: 'accept',
      text: '😊 Das Gold annehmen',
      outcomes: [
        {
          weight: 100,
          text: `"750 Gold – 500 plus Zinsen, wie versprochen." Eriksen grinst.
"Aber das ist nicht alles. Ich habe etwas gehört, das dich interessieren
könnte..."

Er erzählt dir von einem geheimen Handelsabkommen in Nowgorod.`,
          effects: {
            gold: 750,
            unlockEvent: 'novgorod_secret_deal',
            npcRelation: { npcId: 'eriksen', change: 20 },
          },
        },
      ],
    },
    {
      id: 'decline_gift',
      text: '🤝 "Behalte es – ich brauche es nicht."',
      outcomes: [
        {
          weight: 100,
          text: `Eriksen starrt dich ungläubig an. "Du... bist ein besserer
Mensch als ich es je sein werde."

Er schwört dir ewige Freundschaft. Solche Verbündeten sind selten.`,
          effects: {
            reputation: [{ faction: 'general', change: 10 }],
            trait: 'generous',
            npcRelation: { npcId: 'eriksen', change: 50 },
            unlockEvent: 'eriksen_ultimate_favor',
          },
        },
      ],
    },
  ],
};

// Event 3: Eriksens Rache (wenn abgelehnt)
const ERIKSEN_REVENGE: GameEvent = {
  id: 'eriksen_revenge',
  title: 'Ein bitterer Feind',
  category: 'conflict',
  trigger: 'travel',

  requirements: {
    completedEvents: ['desperate_captain_01'],
    notCompletedEvents: ['eriksen_returns_grateful'],
    minRunTime: 72,
  },

  intro: `Ein Schiff nähert sich schnell – zu schnell für einen Händler.
Als es näher kommt, erkennst du die Flagge: keine Piraten, aber...

Auf dem Bug steht ein bekanntes Gesicht. Eriksen.

"Erinnerst du dich an mich?" Seine Stimme ist kalt wie Eis.
"Du hast mich sterben lassen. Jetzt stirbst du."`,

  mood: 'dangerous',
  weight: 8,
  unique: true,
  chainId: 'eriksen_saga',
  chainPosition: 2,

  choices: [
    {
      id: 'fight',
      text: '⚔️ Zum Kampf!',
      requirements: { shipType: ['kraier'] },
      outcomes: [
        {
          weight: 50,
          text: `Ein brutaler Kampf entbrennt. Am Ende sinkt Eriksens Schiff.
Du hast überlebt, aber der Preis war hoch.`,
          effects: {
            shipCondition: -25,
            crewMorale: -20,
            cargo: [{ goodId: 'random', amount: -10, free: false }],
          },
        },
        {
          weight: 50,
          text: `Der Kampf ist unentschieden. Beide Schiffe sind schwer
beschädigt. Eriksen bricht ab – aber er wird wiederkommen.`,
          effects: {
            shipCondition: -15,
            unlockEvent: 'eriksen_final_confrontation',
          },
        },
      ],
    },
    {
      id: 'flee',
      text: '🏃 Flucht versuchen!',
      requirements: { shipType: ['schnigge', 'ewer'] },
      outcomes: [
        {
          weight: 70,
          text: `Dein schnelles Schiff entkommt – gerade so. Eriksens
Flüche verhallen im Wind.`,
          effects: {
            travelTimeModifier: 1.3,
          },
        },
        {
          weight: 30,
          text: `Du entkommst nicht. Eriksen entert dein Schiff...`,
          effects: {
            gold: -500,
            cargo: [{ goodId: 'all', amount: -0.5, free: false }],
            shipCondition: -20,
          },
        },
      ],
    },
    {
      id: 'negotiate',
      text: '🗣️ "Warte! Lass uns reden!"',
      outcomes: [
        {
          weight: 40,
          text: `Du bietest Eriksen 300 Gold als Wiedergutmachung. Nach
langem Zögern nimmt er an. "Wir sind quitt. Aber geh mir aus dem Weg."`,
          effects: {
            gold: -300,
            blockEvent: 'eriksen_*',
          },
        },
        {
          weight: 60,
          text: `Eriksen lacht bitter. "Reden? JETZT willst du reden?"
Er gibt das Zeichen zum Angriff...`,
          effects: {
            triggerEvent: 'eriksen_attack_forced',
          },
        },
      ],
    },
  ],
};
```

---

## Event-Beispiele: Handels-Events

```typescript
const EXCLUSIVE_OFFER: GameEvent = {
  id: 'exclusive_amber_offer',
  title: 'Ein exklusives Angebot',
  category: 'trade',
  trigger: 'city_stay',

  requirements: {
    cities: ['danzig'],
    minGold: 200,
    notCompletedEvents: ['exclusive_amber_offer'],
  },

  intro: `Ein nervös wirkender Kaufmann zieht dich in eine ruhige Ecke.

"Ich habe... eine Gelegenheit", flüstert er. "50 Einheiten feinster
Bernstein. Direkt aus dem Meer. Keine Steuern, keine Fragen."

Er nennt einen Preis: 40 Gold pro Einheit – weit unter Marktpreis.
Aber irgendetwas stimmt hier nicht...`,

  mood: 'tense',
  weight: 5,

  choices: [
    {
      id: 'buy_all',
      text: '💰 Alles kaufen (2000 Gold)',
      cost: { gold: 2000 },
      requirements: { gold: 2000 },
      outcomes: [
        {
          weight: 60,
          text: `Der Handel geht glatt über die Bühne. Echter Bernstein,
keine Probleme. Du hast ein Vermögen gemacht!`,
          effects: {
            cargo: [{ goodId: 'amber', amount: 50, free: true }],
          },
        },
        {
          weight: 25,
          text: `Später stellst du fest: Die Hälfte ist Fälschung.
Bernsteinfarbenes Glas. Du wurdest übers Ohr gehauen.`,
          effects: {
            cargo: [{ goodId: 'amber', amount: 25, free: true }],
            trait: 'suspicious',
          },
        },
        {
          weight: 15,
          text: `Kaum hast du bezahlt, erscheinen Wachen. "Hehlerei!"
Der Bernstein war gestohlen. Du wirst festgenommen...`,
          effects: {
            gold: -500,
            travelTimeModifier: 24, // 24 Stunden Gefängnis
            reputation: [{ faction: 'hanse', change: -10 }],
          },
        },
      ],
    },
    {
      id: 'buy_some',
      text: '🤔 Nur 10 Einheiten kaufen (400 Gold)',
      cost: { gold: 400 },
      requirements: { gold: 400 },
      outcomes: [
        {
          weight: 80,
          text: `Du kaufst nur eine kleine Menge – sicherheitshalber.
Es erweist sich als echter Bernstein. Kluger Zug.`,
          effects: {
            cargo: [{ goodId: 'amber', amount: 10, free: true }],
          },
        },
        {
          weight: 20,
          text: `Selbst die kleine Menge enthält Fälschungen. Zwei von
zehn Stücken sind wertloses Glas.`,
          effects: {
            cargo: [{ goodId: 'amber', amount: 8, free: true }],
          },
        },
      ],
    },
    {
      id: 'decline',
      text: '❌ "Zu riskant. Nein danke."',
      outcomes: [
        {
          weight: 100,
          text: `Du lehnst ab. Der Kaufmann zuckt die Schultern und
verschwindet in der Menge. Vielleicht war es das Richtige...`,
          effects: {
            // Keine Effekte, aber sicher
          },
        },
      ],
    },
    {
      id: 'report',
      text: '📜 Der Hanse melden',
      requirements: {
        reputation: { faction: 'hanse', min: 20 },
      },
      outcomes: [
        {
          weight: 100,
          text: `Du meldest den verdächtigen Handel. Die Hanse ist dankbar –
der Mann war ein bekannter Hehler. Du bekommst eine Belohnung.`,
          effects: {
            gold: 100,
            reputation: [{ faction: 'hanse', change: 15 }],
          },
        },
      ],
    },
  ],
};
```

---

## Event-Beispiele: Reise-Events

```typescript
const STORM_AT_SEA: GameEvent = {
  id: 'storm_at_sea',
  title: 'Der Sturm',
  category: 'travel',
  trigger: 'travel',

  requirements: {
    atSea: true,
    // Wird durch Wetter-System getriggert
  },

  intro: `Der Himmel verdunkelt sich in Minuten. Wind peitscht das Wasser.
Dein erfahrener Steuermann wird blass.

"Das ist kein normaler Sturm, Kapitän. Das ist der Zorn Gottes."

Die ersten Wellen treffen das Schiff wie Fäuste.`,

  mood: 'dangerous',
  weight: 7,

  choices: [
    {
      id: 'fight_storm',
      text: '⚓ Gegen den Sturm ankämpfen',
      outcomes: [
        {
          weight: 40,
          text: `Stundenlang kämpft ihr gegen Wind und Wellen. Als der
Morgen graut, ist der Sturm vorbei. Ihr habt überlebt – gerade so.`,
          effects: {
            shipCondition: -20,
            crewMorale: -15,
            time: 8, // 8 Stunden verloren
          },
        },
        {
          weight: 35,
          text: `Eine Welle reißt Ladung über Bord. Der Mast knickt.
Aber ihr überlebt. Reparaturen werden nötig sein.`,
          effects: {
            shipCondition: -35,
            crewMorale: -25,
            cargo: [{ goodId: 'random', amount: -10, free: false }],
            time: 12,
          },
        },
        {
          weight: 25,
          text: `Der Sturm ist stärker. Viel stärker. Euer Schiff kentert...

[Wenn keine Rettung: RUN ENDE]`,
          effects: {
            triggerEvent: 'shipwreck_survival_check',
          },
        },
      ],
    },
    {
      id: 'seek_shelter',
      text: '🏝️ Nächste Küste ansteuern',
      outcomes: [
        {
          weight: 60,
          text: `Ihr findet eine geschützte Bucht. Der Sturm tobt über
euch hinweg, aber ihr seid sicher. Am nächsten Tag segelt ihr weiter.`,
          effects: {
            time: 16,
            shipCondition: -5,
          },
        },
        {
          weight: 30,
          text: `Die Küste ist gefährlich – Felsen unter der Oberfläche!
Ihr entkommt knapp, aber das Schiff ist beschädigt.`,
          effects: {
            shipCondition: -25,
            time: 20,
          },
        },
        {
          weight: 10,
          text: `In der Bucht wartet... ein Piratennest. Ihr seid vom
Regen in die Traufe gekommen.`,
          effects: {
            triggerEvent: 'pirate_nest_discovery',
          },
        },
      ],
    },
    {
      id: 'cargo_sacrifice',
      text: '📦 Ladung über Bord werfen (Schiff stabilisieren)',
      requirements: {
        hasCargo: ['any'],
      },
      cost: {
        cargo: { goodId: 'heaviest', amount: 20 },
      },
      outcomes: [
        {
          weight: 80,
          text: `Die schwere Ladung geht über Bord. Das Schiff wird
leichter, stabiler. Ihr übersteht den Sturm mit minimalen Schäden.`,
          effects: {
            shipCondition: -10,
            time: 6,
          },
        },
        {
          weight: 20,
          text: `Trotz des Opfers ist der Sturm zu stark. Weitere Ladung
geht verloren, aber ihr überlebt.`,
          effects: {
            shipCondition: -20,
            cargo: [{ goodId: 'random', amount: -10, free: false }],
            time: 10,
          },
        },
      ],
    },
    {
      id: 'pray',
      text: '🙏 Beten und auf Gott vertrauen',
      requirements: {
        reputation: { faction: 'church', min: 20 },
      },
      outcomes: [
        {
          weight: 50,
          text: `Du kniest auf Deck und betest. Deine Mannschaft folgt.
Ob durch Wunder oder Zufall – der Sturm lässt nach.`,
          effects: {
            reputation: [{ faction: 'church', change: 5 }],
            crewMorale: 10,
            time: 4,
          },
        },
        {
          weight: 50,
          text: `Die Gebete verhallen im Heulen des Windes. Der Sturm
interessiert sich nicht für Frömmigkeit. Ihr kämpft weiter...`,
          effects: {
            triggerEvent: 'storm_continues',
          },
        },
      ],
    },
  ],
};
```

---

## Event-Beispiele: Stadt-Events

```typescript
const PLAGUE_OUTBREAK: GameEvent = {
  id: 'plague_outbreak_luebeck',
  title: 'Die Pest in Lübeck',
  category: 'city',
  trigger: 'city_arrival',

  requirements: {
    cities: ['luebeck'],
    season: ['summer', 'autumn'],
    minRunTime: 24,
  },

  intro: `Schon vor dem Hafen riechst du es: Rauch und Tod. Lübeck brennt
nicht, aber Scheiterhaufen lodern am Stadtrand.

"Die Pest", flüstert ein Hafenarbeiter. "Sie kam mit einem Schiff aus
dem Süden. Hunderte sind schon tot."

Die Stadttore sind noch offen, aber bewacht. Wer hineingeht, kommt
vielleicht nicht wieder heraus...`,

  mood: 'dangerous',
  weight: 4,
  unique: true,

  choices: [
    {
      id: 'enter_anyway',
      text: '🏃 Trotzdem in die Stadt gehen',
      outcomes: [
        {
          weight: 50,
          text: `Du betrittst die Stadt mit angehaltenem Atem. Der Markt
ist fast leer, aber die Preise sind verrückt – niemand handelt mehr.

Du kaufst billig ein und verlässt die Stadt schnell wieder.`,
          effects: {
            // Alle Waren 50% billiger in diesem Trade
            setFlag: 'plague_trade_bonus',
          },
        },
        {
          weight: 30,
          text: `Du verbringst einen Tag in der Stadt. Als du zurückkehrst,
klagt deine Mannschaft über Kopfschmerzen...

Ein Matrose stirbt in der Nacht. Die anderen meiden dich.`,
          effects: {
            crewMorale: -30,
            crewMember: null, // Ein Crew-Mitglied stirbt
            time: 24,
          },
        },
        {
          weight: 20,
          text: `Du selbst erkrankst. Fieberträume, Schmerzen, Dunkelheit.

Als du erwachst, sind Tage vergangen. Aber du lebst.`,
          effects: {
            time: 72,
            gold: -100, // Behandlungskosten
            trait: 'plague_survivor', // Immun gegen zukünftige Pest-Events
          },
        },
      ],
    },
    {
      id: 'quarantine_stay',
      text: '⚓ Im Hafen bleiben (Quarantäne)',
      outcomes: [
        {
          weight: 100,
          text: `Du bleibst an Bord. Die Tage sind langweilig, aber sicher.
Händler rudern zu den Schiffen – die Preise sind hoch, aber du überlebst.`,
          effects: {
            time: 48,
            // Normaler Handel möglich, aber +30% Preise
            setFlag: 'quarantine_trade',
          },
        },
      ],
    },
    {
      id: 'leave',
      text: '🚢 Sofort ablegen',
      outcomes: [
        {
          weight: 100,
          text: `Du wendest dein Schiff und segelst davon. Manche nennen
es Feigheit, andere Vernunft. Du nennst es Überleben.`,
          effects: {
            // Keine negativen Effekte
          },
        },
      ],
    },
    {
      id: 'help_sick',
      text: '💚 Den Kranken helfen (Medizin spenden)',
      requirements: {
        hasCargo: ['medicine'],
        reputation: { faction: 'church', min: 10 },
      },
      cost: {
        cargo: { goodId: 'medicine', amount: 10 },
      },
      outcomes: [
        {
          weight: 100,
          text: `Du spendest deine Medizin-Vorräte den Mönchen, die die
Kranken pflegen. Ihr Segen begleitet dich.

Die Geschichte verbreitet sich. Man nennt dich "den Barmherzigen".`,
          effects: {
            reputation: [
              { faction: 'church', change: 25 },
              { faction: 'hanse', change: 10 },
              { faction: 'general', change: 15 },
            ],
            trait: 'merciful',
          },
        },
      ],
    },
  ],
};
```

---

## Wiederkehrende Charaktere (NPCs)

```typescript
interface RecurringNPC {
  id: string;
  name: string;
  title: string;
  description: string;

  // Beziehung zum Spieler
  relation: number;           // -100 bis +100
  status: 'unknown' | 'met' | 'ally' | 'enemy' | 'dead';

  // Events, die diesen NPC betreffen
  introEvent: string;
  followUpEvents: string[];
  deathEvents?: string[];

  // Persönlichkeit (beeinflusst Dialog-Optionen)
  traits: string[];
}

const RECURRING_NPCS: RecurringNPC[] = [
  {
    id: 'eriksen',
    name: 'Kapitän Eriksen',
    title: 'Der gebrochene Kapitän',
    description: 'Ein einst stolzer Schiffsführer, dem alles genommen wurde.',
    relation: 0,
    status: 'unknown',
    introEvent: 'desperate_captain_01',
    followUpEvents: [
      'eriksen_returns_grateful',
      'eriksen_returns_bitter',
      'eriksen_revenge',
      'eriksen_final_confrontation',
    ],
    traits: ['proud', 'vengeful', 'loyal_to_crew'],
  },
  {
    id: 'sister_agnes',
    name: 'Schwester Agnes',
    title: 'Die heilende Hand',
    description: 'Eine Nonne mit Verbindungen zur Hanse und der Kirche.',
    relation: 0,
    status: 'unknown',
    introEvent: 'monastery_visit',
    followUpEvents: [
      'agnes_secret_message',
      'agnes_healing',
      'agnes_church_conspiracy',
    ],
    traits: ['pious', 'secretive', 'healer'],
  },
  {
    id: 'black_erik',
    name: 'Schwarzer Erik',
    title: 'Der Piratenkönig',
    description: 'Gefürchtetster Pirat der Ostsee. Ehrenwerter als sein Ruf.',
    relation: -20, // Startet negativ
    status: 'unknown',
    introEvent: 'pirate_encounter_erik',
    followUpEvents: [
      'erik_proposal',
      'erik_shared_enemy',
      'erik_throne_war',
    ],
    traits: ['ruthless', 'honorable', 'intelligent'],
  },
  {
    id: 'merchant_volkov',
    name: 'Fjodor Volkov',
    title: 'Der Pelzhändler aus Nowgorod',
    description: 'Russischer Händler mit Verbindungen zum Bojaren-Adel.',
    relation: 0,
    status: 'unknown',
    introEvent: 'novgorod_arrival_first',
    followUpEvents: [
      'volkov_invitation',
      'volkov_conspiracy',
      'volkov_tartar_warning',
    ],
    traits: ['shrewd', 'hospitable', 'connected'],
  },
];
```

---

## Event-Flags & Konsequenzen

```typescript
// Flags speichern Spieler-Entscheidungen
interface EventFlags {
  // Eriksen-Storyline
  eriksen_helped_fully?: boolean;
  eriksen_scammed?: boolean;
  eriksen_crew_member?: boolean;
  eriksen_betrayed?: boolean;

  // Allgemeine Entscheidungen
  chose_violence_count?: number;
  chose_mercy_count?: number;
  pirates_trusted?: boolean;
  hanse_loyal?: boolean;

  // Story-Fortschritt
  discovered_church_conspiracy?: boolean;
  knows_tartar_threat?: boolean;

  // Besondere Erfolge
  survived_plague?: boolean;
  survived_shipwreck?: boolean;
  defeated_black_erik?: boolean;
}

// Beispiel: Flags beeinflussen Event-Optionen
function getAvailableChoices(
  event: GameEvent,
  player: PlayerState
): EventChoice[] {
  return event.choices.filter(choice => {
    // Trait-basierte Optionen
    if (choice.requirements?.trait === 'ruthless') {
      return player.flags.chose_violence_count >= 3 ||
             player.traits.includes('ruthless');
    }

    // Storyline-basierte Optionen
    if (choice.id === 'mention_eriksen' &&
        !player.flags.eriksen_crew_member) {
      return false;
    }

    // Normale Anforderungen prüfen
    return checkRequirements(choice.requirements, player);
  });
}
```

---

## Event-Statistiken (Pro Run)

```typescript
interface RunEventStats {
  totalEvents: number;
  eventsByCategory: Record<EventCategory, number>;

  // Entscheidungsmuster
  choicesTaken: {
    generous: number;
    selfish: number;
    violent: number;
    peaceful: number;
    risky: number;
    cautious: number;
  };

  // NPCs
  npcsHelped: string[];
  npcsBetraid: string[];
  npcsKilled: string[];

  // Besondere Momente
  narrowEscapes: number;
  luckyBreaks: number;
  terribleLosses: number;

  // Für Achievements
  uniqueEventsThisRun: string[];
}

// Wird am Ende des Runs angezeigt
function generateRunSummary(stats: RunEventStats): string {
  if (stats.choicesTaken.generous > stats.choicesTaken.selfish * 2) {
    return "Du warst als 'Der Barmherzige' bekannt.";
  }
  if (stats.npcsKilled.length >= 3) {
    return "Dein Ruf als Mörder eilt dir voraus.";
  }
  if (stats.narrowEscapes >= 5) {
    return "Wie ein Kater hast du neun Leben.";
  }
  // ... etc
}
```

---

*Weiter zu Teil 5: Fraktionen & Reputation*
