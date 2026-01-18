import { Ship } from "@/engine/types/game";

export const SHIPS: Ship[] = [
  {
    id: "ewer",
    name: "Ewer",
    capacity: 50,
    speed: 1.5,
    cost: 0, // Starting ship
    description: "Kleines, wendiges Küstenschiff. Ideal für Einsteiger.",
  },
  {
    id: "kogge",
    name: "Kogge",
    capacity: 120,
    speed: 1.0,
    cost: 800,
    description: "Das Arbeitspferd der Hanse. Geräumig und seetüchtig.",
  },
];

export function getShipById(id: string): Ship | undefined {
  return SHIPS.find((ship) => ship.id === id);
}

export function calculateCargoWeight(
  cargo: { goodId: string; quantity: number }[],
  goods: { id: string; weight: number }[]
): number {
  return cargo.reduce((total, item) => {
    const good = goods.find((g) => g.id === item.goodId);
    return total + (good?.weight ?? 0) * item.quantity;
  }, 0);
}
