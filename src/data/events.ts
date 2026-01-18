import { GameEvent } from "@/engine/types/events";

export const EVENTS: GameEvent[] = [
  {
    id: "storm",
    type: "weather",
    title: "Sturm auf See",
    description: "Dunkle Wolken ziehen auf und der Wind heult über das Deck. Ein Sturm droht!",
    choices: [
      {
        id: "brave",
        text: "Durchsegeln und auf Glück hoffen",
        outcomes: [
          {
            probability: 0.6,
            description: "Ihr meistert den Sturm ohne größere Schäden.",
            effects: [],
          },
          {
            probability: 0.4,
            description: "Der Sturm kostet Euch wertvolle Zeit.",
            effects: [{ type: "time", operation: "add", value: 2 }],
          },
        ],
      },
      {
        id: "wait",
        text: "Im nächsten Hafen Schutz suchen",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr wartet den Sturm sicher ab, verliert aber Zeit.",
            effects: [{ type: "time", operation: "add", value: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "merchant",
    type: "trade",
    title: "Reisender Händler",
    description: "Ein kleines Handelsschiff nähert sich. Der Kapitän bietet Euch einen Handel an.",
    choices: [
      {
        id: "trade",
        text: "Handeln (50 Gold für wertvolle Informationen)",
        requirements: [{ type: "gold", value: 50, operator: "gte" }],
        outcomes: [
          {
            probability: 0.7,
            description: "Die Information ist wertvoll - Ihr verdient mit dem nächsten Handel mehr!",
            effects: [{ type: "gold", operation: "subtract", value: 50 }],
          },
          {
            probability: 0.3,
            description: "Die Information war nutzlos. 50 Gold verloren.",
            effects: [{ type: "gold", operation: "subtract", value: 50 }],
          },
        ],
      },
      {
        id: "ignore",
        text: "Weitersegeln",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr setzt Eure Reise fort.",
            effects: [],
          },
        ],
      },
    ],
  },
  {
    id: "pirates",
    type: "danger",
    title: "Piraten!",
    description: "Ein Schiff mit schwarzer Flagge nähert sich schnell. Piraten!",
    choices: [
      {
        id: "fight",
        text: "Zum Kampf bereit machen!",
        outcomes: [
          {
            probability: 0.5,
            description: "Ihr schlagt die Piraten in die Flucht!",
            effects: [{ type: "gold", operation: "add", value: 100 }],
          },
          {
            probability: 0.5,
            description: "Der Kampf war hart. Ihr verliert Waren und Zeit.",
            effects: [
              { type: "gold", operation: "subtract", value: 75 },
              { type: "time", operation: "add", value: 1 },
            ],
          },
        ],
      },
      {
        id: "flee",
        text: "Fliehen",
        outcomes: [
          {
            probability: 0.7,
            description: "Ihr entkommt, verliert aber Zeit.",
            effects: [{ type: "time", operation: "add", value: 1 }],
          },
          {
            probability: 0.3,
            description: "Sie holen Euch ein und rauben Euch aus!",
            effects: [{ type: "gold", operation: "subtract", value: 150 }],
          },
        ],
      },
      {
        id: "pay",
        text: "Wegzoll zahlen (100 Gold)",
        requirements: [{ type: "gold", value: 100, operator: "gte" }],
        outcomes: [
          {
            probability: 1.0,
            description: "Die Piraten lassen Euch passieren.",
            effects: [{ type: "gold", operation: "subtract", value: 100 }],
          },
        ],
      },
    ],
  },
  {
    id: "fair_wind",
    type: "weather",
    title: "Günstiger Wind",
    description: "Ein starker, beständiger Wind füllt Eure Segel!",
    choices: [
      {
        id: "use",
        text: "Den Wind nutzen",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr kommt schneller voran als erwartet!",
            effects: [{ type: "time", operation: "subtract", value: 0.5 }],
          },
        ],
      },
    ],
  },
  {
    id: "lighthouse",
    type: "city",
    title: "Der alte Leuchtturmwärter",
    description: "Ein alter Mann am Hafen winkt Euch heran. Er scheint etwas zu wissen...",
    choices: [
      {
        id: "listen",
        text: "Zuhören",
        outcomes: [
          {
            probability: 0.5,
            description: "Er erzählt von günstigen Handelswegen. Nützlich!",
            effects: [],
          },
          {
            probability: 0.5,
            description: "Nur alte Seemannsgeschichten. Verschwendete Zeit.",
            effects: [{ type: "time", operation: "add", value: 0.5 }],
          },
        ],
      },
      {
        id: "ignore",
        text: "Ignorieren",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr geht Euren Geschäften nach.",
            effects: [],
          },
        ],
      },
    ],
  },
  {
    id: "cargo_damage",
    type: "random",
    title: "Feuchtigkeit im Laderaum",
    description: "Ihr entdeckt Wasser im Laderaum. Einige Waren könnten beschädigt sein!",
    choices: [
      {
        id: "inspect",
        text: "Gründlich prüfen",
        outcomes: [
          {
            probability: 0.6,
            description: "Glück gehabt! Die Waren sind unbeschädigt.",
            effects: [],
          },
          {
            probability: 0.4,
            description: "Einige Waren sind verdorben. Verlust!",
            effects: [{ type: "gold", operation: "subtract", value: 30 }],
          },
        ],
      },
    ],
  },
  {
    id: "guild_offer",
    type: "trade",
    title: "Gildenbote",
    description: "Ein Bote der Kaufmannsgilde hat einen Auftrag für Euch.",
    choices: [
      {
        id: "accept",
        text: "Auftrag annehmen",
        outcomes: [
          {
            probability: 0.8,
            description: "Ein lukrativer Auftrag! Ihr erhaltet Gold.",
            effects: [{ type: "gold", operation: "add", value: 75 }],
          },
          {
            probability: 0.2,
            description: "Der Auftrag war schwieriger als gedacht. Zeitverlust.",
            effects: [
              { type: "gold", operation: "add", value: 40 },
              { type: "time", operation: "add", value: 1 },
            ],
          },
        ],
      },
      {
        id: "decline",
        text: "Ablehnen",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr lehnt höflich ab.",
            effects: [],
          },
        ],
      },
    ],
  },
  {
    id: "fog",
    type: "weather",
    title: "Dichter Nebel",
    description: "Ein undurchdringlicher Nebel legt sich über das Meer.",
    choices: [
      {
        id: "wait",
        text: "Warten bis er sich lichtet",
        outcomes: [
          {
            probability: 1.0,
            description: "Sicher, aber langsam.",
            effects: [{ type: "time", operation: "add", value: 0.5 }],
          },
        ],
      },
      {
        id: "continue",
        text: "Vorsichtig weitersegeln",
        outcomes: [
          {
            probability: 0.7,
            description: "Ihr findet Euren Weg durch den Nebel.",
            effects: [],
          },
          {
            probability: 0.3,
            description: "Ihr verfahrt Euch und verliert Zeit.",
            effects: [{ type: "time", operation: "add", value: 1 }],
          },
        ],
      },
    ],
  },
  {
    id: "tavern_rumor",
    type: "city",
    title: "Gerüchte in der Taverne",
    description: "In der Hafentaverne hört Ihr interessante Gespräche...",
    choices: [
      {
        id: "buy_drinks",
        text: "Runde ausgeben (15 Gold)",
        requirements: [{ type: "gold", value: 15, operator: "gte" }],
        outcomes: [
          {
            probability: 0.6,
            description: "Die Seeleute teilen wertvolle Marktinformationen!",
            effects: [{ type: "gold", operation: "subtract", value: 15 }],
          },
          {
            probability: 0.4,
            description: "Nur Seemannsgarn. 15 Gold für nichts.",
            effects: [{ type: "gold", operation: "subtract", value: 15 }],
          },
        ],
      },
      {
        id: "leave",
        text: "Die Taverne verlassen",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr geht wieder an Bord.",
            effects: [],
          },
        ],
      },
    ],
  },
  {
    id: "stowaway",
    type: "random",
    title: "Blinder Passagier",
    description: "Ihr entdeckt einen blinden Passagier in Eurem Laderaum!",
    choices: [
      {
        id: "hire",
        text: "Als Helfer anstellen",
        outcomes: [
          {
            probability: 0.7,
            description: "Ein fleißiger Arbeiter! Eure Reisen werden etwas schneller.",
            effects: [],
          },
          {
            probability: 0.3,
            description: "Er stiehlt Euch und flieht im nächsten Hafen!",
            effects: [{ type: "gold", operation: "subtract", value: 50 }],
          },
        ],
      },
      {
        id: "drop",
        text: "Im nächsten Hafen absetzen",
        outcomes: [
          {
            probability: 1.0,
            description: "Ihr setzt ihn ab und segelt weiter.",
            effects: [],
          },
        ],
      },
    ],
  },
];

export function getRandomEvent(): GameEvent {
  const index = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[index];
}

export function shouldTriggerEvent(travelDistance: number): boolean {
  // 30% base chance + more for longer routes
  const chance = 0.3 + travelDistance / 100;
  return Math.random() < chance;
}
