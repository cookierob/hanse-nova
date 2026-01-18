import { City, CityGoodPrice } from "@/engine/types/game";
import { getGoodById, GOODS } from "@/data/goods";

export interface MarketPrice {
  goodId: string;
  goodName: string;
  buyPrice: number;
  sellPrice: number;
  supply: "low" | "medium" | "high";
  demand: "low" | "medium" | "high";
}

export function getMarketPrices(city: City): MarketPrice[] {
  return city.goods.map((cityGood) => {
    const good = getGoodById(cityGood.goodId);
    if (!good) {
      throw new Error(`Good not found: ${cityGood.goodId}`);
    }

    const basePrice = calculateMarketPrice(good.basePrice, cityGood);

    return {
      goodId: cityGood.goodId,
      goodName: good.name,
      buyPrice: Math.round(basePrice * 1.1),
      sellPrice: Math.round(basePrice * 0.9),
      supply: cityGood.supply,
      demand: cityGood.demand,
    };
  });
}

export function calculateMarketPrice(
  basePrice: number,
  cityGood: CityGoodPrice
): number {
  let price = basePrice * cityGood.priceModifier;

  // Supply affects price
  switch (cityGood.supply) {
    case "low":
      price *= 1.15;
      break;
    case "high":
      price *= 0.85;
      break;
  }

  // Demand affects price
  switch (cityGood.demand) {
    case "high":
      price *= 1.1;
      break;
    case "low":
      price *= 0.9;
      break;
  }

  return Math.round(price);
}

export function findBestTrade(
  fromCity: City,
  toCity: City
): { goodId: string; profit: number; goodName: string } | null {
  let bestTrade: { goodId: string; profit: number; goodName: string } | null = null;

  for (const good of GOODS) {
    const fromCityGood = fromCity.goods.find((g) => g.goodId === good.id);
    const toCityGood = toCity.goods.find((g) => g.goodId === good.id);

    if (!fromCityGood || !toCityGood) continue;

    const buyPrice = calculateMarketPrice(good.basePrice, fromCityGood) * 1.1;
    const sellPrice = calculateMarketPrice(good.basePrice, toCityGood) * 0.9;
    const profit = sellPrice - buyPrice;

    if (!bestTrade || profit > bestTrade.profit) {
      bestTrade = { goodId: good.id, profit: Math.round(profit), goodName: good.name };
    }
  }

  return bestTrade;
}
