// Core game types for Hanse Nova

export interface Good {
  id: string;
  name: string;
  basePrice: number;
  weight: number; // Per unit weight
  description: string;
  icon?: string;
}

export interface CityGoodPrice {
  goodId: string;
  priceModifier: number; // 0.8 = 20% cheaper, 1.2 = 20% more expensive
  supply: "low" | "medium" | "high";
  demand: "low" | "medium" | "high";
}

export interface City {
  id: string;
  name: string;
  description: string;
  x: number; // Map position (0-100)
  y: number;
  goods: CityGoodPrice[];
  connections: string[]; // IDs of connected cities
  image?: string;
}

export interface Ship {
  id: string;
  name: string;
  capacity: number; // Max cargo weight
  speed: number; // Affects travel time
  cost: number;
  description: string;
}

export interface CargoItem {
  goodId: string;
  quantity: number;
  purchasePrice: number; // Price per unit when bought
}

export interface PlayerState {
  gold: number;
  cargo: CargoItem[];
  shipId: string;
  currentCityId: string;
}

export interface RunState {
  id: string;
  startedAt: number;
  gameTime: number; // In-game days passed
  maxGameTime: number; // Max days for the run
  targetGold: number;
  player: PlayerState;
  isComplete: boolean;
  isVictory: boolean;
}

export interface GameConfig {
  targetGold: number;
  maxDays: number;
  startingGold: number;
  startingCity: string;
  startingShip: string;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  targetGold: 2000,
  maxDays: 30,
  startingGold: 500,
  startingCity: "luebeck",
  startingShip: "ewer",
};
