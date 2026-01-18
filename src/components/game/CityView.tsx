"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/engine/state/game-store";
import { getCityById } from "@/data/cities";
import { RunHeader } from "./RunHeader";
import { TradePanel } from "./TradePanel";
import { MapCanvas } from "./MapCanvas";
import { VictoryScreen } from "./VictoryScreen";
import { EventDialog } from "./EventDialog";
import { Card, CardContent } from "@/components/ui/Card";
import { GameEvent } from "@/engine/types/events";
import { getRandomEvent, shouldTriggerEvent } from "@/data/events";
import { calculateDistance } from "@/engine/systems/travel";

export function CityView() {
  const run = useGameStore((state) => state.run);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  const handleTravelComplete = useCallback((fromCityId: string, toCityId: string) => {
    const fromCity = getCityById(fromCityId);
    const toCity = getCityById(toCityId);

    if (fromCity && toCity) {
      const distance = calculateDistance(fromCity, toCity);
      if (shouldTriggerEvent(distance)) {
        setCurrentEvent(getRandomEvent());
      }
    }
  }, []);

  if (!run) return null;

  // Show victory/defeat screen if game is complete
  if (run.isComplete) {
    return <VictoryScreen />;
  }

  const city = getCityById(run.player.currentCityId);
  if (!city) return null;

  return (
    <div className="space-y-4">
      <RunHeader />

      {/* City Banner */}
      <Card className="bg-gradient-to-r from-hanse-wood to-hanse-wood-light text-hanse-parchment">
        <CardContent className="py-6 text-center">
          <h2 className="font-pixel text-2xl font-bold mb-2">{city.name}</h2>
          <p className="font-pixel text-sm opacity-90">{city.description}</p>
        </CardContent>
      </Card>

      {/* Main game panels */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <TradePanel />
        </div>
        <div>
          <MapCanvas onTravelComplete={handleTravelComplete} />
        </div>
      </div>

      {/* Event Dialog */}
      <EventDialog
        event={currentEvent}
        onClose={() => setCurrentEvent(null)}
      />
    </div>
  );
}
