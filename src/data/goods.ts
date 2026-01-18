import { Good } from "@/engine/types/game";

export const GOODS: Good[] = [
  {
    id: "salt",
    name: "Salz",
    basePrice: 30,
    weight: 2,
    description: "Weißes Gold des Nordens. Unverzichtbar zur Konservierung.",
  },
  {
    id: "grain",
    name: "Getreide",
    basePrice: 20,
    weight: 3,
    description: "Grundnahrungsmittel. Wird aus den Ostländern importiert.",
  },
  {
    id: "cloth",
    name: "Tuch",
    basePrice: 50,
    weight: 1,
    description: "Feines flandrisches Tuch. Begehrt bei Adel und Bürgern.",
  },
  {
    id: "furs",
    name: "Pelze",
    basePrice: 80,
    weight: 1,
    description: "Wertvolle Pelze aus Russland und Skandinavien.",
  },
  {
    id: "fish",
    name: "Fisch",
    basePrice: 15,
    weight: 2,
    description: "Gesalzener Hering und Stockfisch. Stapelware der Hanse.",
  },
];

export function getGoodById(id: string): Good | undefined {
  return GOODS.find((good) => good.id === id);
}

export function calculatePrice(
  basePrice: number,
  priceModifier: number,
  variance: number = 0.1
): number {
  // Add some random variance to make prices dynamic
  const randomFactor = 1 + (Math.random() * 2 - 1) * variance;
  return Math.round(basePrice * priceModifier * randomFactor);
}
