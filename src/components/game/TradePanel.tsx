"use client";

import { useState } from "react";
import { useGameStore } from "@/engine/state/game-store";
import { getCityById } from "@/data/cities";
import { getGoodById } from "@/data/goods";
import { getMarketPrices } from "@/engine/systems/market";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function TradePanel() {
  const run = useGameStore((state) => state.run);
  const buyGoods = useGameStore((state) => state.buyGoods);
  const sellGoods = useGameStore((state) => state.sellGoods);
  const getGoodPrice = useGameStore((state) => state.getGoodPrice);
  const cargoWeight = useGameStore((state) => state.getCargoWeight());
  const maxCargoWeight = useGameStore((state) => state.getMaxCargoWeight());

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!run) return null;

  const city = getCityById(run.player.currentCityId);
  if (!city) return null;

  const marketPrices = getMarketPrices(city);

  const getQuantity = (goodId: string) => quantities[goodId] || 1;
  const setQuantity = (goodId: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [goodId]: Math.max(1, value) }));
  };

  const getPlayerCargoQuantity = (goodId: string): number => {
    return run.player.cargo.find((c) => c.goodId === goodId)?.quantity || 0;
  };

  const canBuy = (goodId: string, quantity: number): boolean => {
    const prices = getGoodPrice(goodId);
    if (!prices) return false;
    const good = getGoodById(goodId);
    if (!good) return false;

    const cost = prices.buy * quantity;
    const additionalWeight = good.weight * quantity;

    return (
      run.player.gold >= cost &&
      cargoWeight + additionalWeight <= maxCargoWeight
    );
  };

  const handleBuy = (goodId: string) => {
    const quantity = getQuantity(goodId);
    if (buyGoods(goodId, quantity)) {
      setQuantity(goodId, 1);
    }
  };

  const handleSell = (goodId: string) => {
    const quantity = Math.min(getQuantity(goodId), getPlayerCargoQuantity(goodId));
    if (quantity > 0) {
      sellGoods(goodId, quantity);
      setQuantity(goodId, 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markt in {city.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketPrices.map((item) => {
            const playerQuantity = getPlayerCargoQuantity(item.goodId);
            const good = getGoodById(item.goodId);
            const quantity = getQuantity(item.goodId);

            return (
              <div
                key={item.goodId}
                className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-hanse-parchment-dark border border-hanse-wood"
              >
                {/* Good info */}
                <div className="flex-1">
                  <div className="font-pixel font-bold text-hanse-ink">
                    {item.goodName}
                  </div>
                  <div className="text-xs text-hanse-wood font-pixel">
                    Gewicht: {good?.weight}/Einheit | Im Lager: {playerQuantity}
                  </div>
                </div>

                {/* Prices */}
                <div className="flex gap-4 text-sm font-pixel">
                  <div>
                    <span className="text-hanse-wood">Kauf: </span>
                    <span className="text-red-700 font-bold">{item.buyPrice}G</span>
                  </div>
                  <div>
                    <span className="text-hanse-wood">Verkauf: </span>
                    <span className="text-green-700 font-bold">{item.sellPrice}G</span>
                  </div>
                </div>

                {/* Quantity control */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(item.goodId, quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-pixel">{quantity}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(item.goodId, quantity + 1)}
                  >
                    +
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBuy(item.goodId)}
                    disabled={!canBuy(item.goodId, quantity)}
                  >
                    Kaufen
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSell(item.goodId)}
                    disabled={playerQuantity === 0}
                  >
                    Verkaufen
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
