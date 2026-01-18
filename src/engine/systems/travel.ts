import { City } from "@/engine/types/game";

export interface TravelRoute {
  from: City;
  to: City;
  distance: number;
  baseDays: number;
}

export function calculateDistance(from: City, to: City): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateTravelTime(
  from: City,
  to: City,
  shipSpeed: number = 1
): number {
  const distance = calculateDistance(from, to);
  // Base: 10 distance units = 1 day
  const baseDays = distance / 10;
  // Apply ship speed modifier
  const adjustedDays = baseDays / shipSpeed;
  // Round to 1 decimal
  return Math.round(adjustedDays * 10) / 10;
}

export function getTravelInfo(
  from: City,
  to: City,
  shipSpeed: number
): {
  distance: number;
  days: number;
  canTravel: boolean;
} {
  const canTravel = from.connections.includes(to.id);
  const distance = calculateDistance(from, to);
  const days = calculateTravelTime(from, to, shipSpeed);

  return {
    distance: Math.round(distance),
    days,
    canTravel,
  };
}
