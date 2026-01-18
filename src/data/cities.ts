import { City } from "@/engine/types/game";

export const CITIES: City[] = [
  {
    id: "luebeck",
    name: "Lübeck",
    description: "Die Königin der Hanse. Mächtiges Handelszentrum und Tor zum Osten.",
    x: 55,
    y: 35,
    connections: ["hamburg", "danzig"],
    image: "/assets/cities/luebeck/panorama_day.png",
    goods: [
      { goodId: "salt", priceModifier: 0.8, supply: "high", demand: "low" },
      { goodId: "grain", priceModifier: 1.1, supply: "low", demand: "high" },
      { goodId: "cloth", priceModifier: 1.0, supply: "medium", demand: "medium" },
      { goodId: "furs", priceModifier: 1.2, supply: "low", demand: "high" },
      { goodId: "fish", priceModifier: 1.0, supply: "medium", demand: "medium" },
    ],
  },
  {
    id: "hamburg",
    name: "Hamburg",
    description: "Große Hafenstadt an der Elbe. Bekannt für Bier und Tuche.",
    x: 45,
    y: 38,
    connections: ["luebeck"],
    goods: [
      { goodId: "salt", priceModifier: 1.2, supply: "low", demand: "high" },
      { goodId: "grain", priceModifier: 0.9, supply: "high", demand: "low" },
      { goodId: "cloth", priceModifier: 0.85, supply: "high", demand: "low" },
      { goodId: "furs", priceModifier: 1.1, supply: "low", demand: "medium" },
      { goodId: "fish", priceModifier: 1.15, supply: "low", demand: "high" },
    ],
  },
  {
    id: "danzig",
    name: "Danzig",
    description: "Bernsteinstadt an der Ostsee. Reich an Pelzen und Getreide aus dem Osten.",
    x: 75,
    y: 30,
    connections: ["luebeck"],
    goods: [
      { goodId: "salt", priceModifier: 1.3, supply: "low", demand: "high" },
      { goodId: "grain", priceModifier: 0.7, supply: "high", demand: "low" },
      { goodId: "cloth", priceModifier: 1.2, supply: "low", demand: "high" },
      { goodId: "furs", priceModifier: 0.75, supply: "high", demand: "low" },
      { goodId: "fish", priceModifier: 0.9, supply: "high", demand: "low" },
    ],
  },
];

export function getCityById(id: string): City | undefined {
  return CITIES.find((city) => city.id === id);
}

export function getConnectedCities(cityId: string): City[] {
  const city = getCityById(cityId);
  if (!city) return [];
  return city.connections
    .map((id) => getCityById(id))
    .filter((c): c is City => c !== undefined);
}
