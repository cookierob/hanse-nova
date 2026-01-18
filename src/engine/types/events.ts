// Event system types

export type EventType =
  | "random"      // Random encounter during travel
  | "city"        // City-specific event
  | "weather"     // Weather event
  | "trade"       // Trade opportunity
  | "danger";     // Pirates, storms, etc.

export interface EventChoice {
  id: string;
  text: string;
  outcomes: EventOutcome[];
  requirements?: EventRequirement[];
}

export interface EventRequirement {
  type: "gold" | "cargo" | "ship";
  value: string | number;
  operator: "gte" | "lte" | "eq" | "has";
}

export interface EventOutcome {
  probability: number; // 0-1
  description: string;
  effects: EventEffect[];
}

export interface EventEffect {
  type: "gold" | "cargo" | "time" | "damage";
  operation: "add" | "subtract" | "multiply";
  value: number;
  goodId?: string; // For cargo effects
}

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  image?: string;
  choices: EventChoice[];
  triggerConditions?: EventTriggerCondition[];
}

export interface EventTriggerCondition {
  type: "route" | "city" | "cargo" | "time" | "random";
  value: string | number;
}

export interface ActiveEvent {
  event: GameEvent;
  selectedChoiceId?: string;
  resolvedOutcome?: EventOutcome;
}
