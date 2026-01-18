"use client";

import { useGameStore } from "@/engine/state/game-store";
import { getCityById } from "@/data/cities";
import { formatGameDate, getDaysRemaining, formatDaysRemaining } from "@/engine/systems/time";
import { Card } from "@/components/ui/Card";

export function RunHeader() {
  const run = useGameStore((state) => state.run);
  const cargoWeight = useGameStore((state) => state.getCargoWeight());
  const maxCargoWeight = useGameStore((state) => state.getMaxCargoWeight());

  if (!run) return null;

  const currentCity = getCityById(run.player.currentCityId);
  const daysRemaining = getDaysRemaining(run.gameTime, run.maxGameTime);
  const goldProgress = Math.min(100, (run.player.gold / run.targetGold) * 100);

  return (
    <Card className="mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {/* Gold */}
        <div>
          <div className="text-sm text-hanse-wood font-pixel">Gold</div>
          <div className="text-xl font-bold text-hanse-gold-dark font-pixel">
            {run.player.gold} / {run.targetGold}
          </div>
          <div className="w-full bg-hanse-parchment-dark h-2 mt-1">
            <div
              className="bg-hanse-gold h-full transition-all"
              style={{ width: `${goldProgress}%` }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="text-sm text-hanse-wood font-pixel">Standort</div>
          <div className="text-lg font-bold text-hanse-ink font-pixel">
            {currentCity?.name ?? "Unbekannt"}
          </div>
        </div>

        {/* Time */}
        <div>
          <div className="text-sm text-hanse-wood font-pixel">Datum</div>
          <div className="text-lg font-bold text-hanse-ink font-pixel">
            {formatGameDate(run.gameTime)}
          </div>
          <div className="text-xs text-hanse-wood font-pixel">
            {formatDaysRemaining(daysRemaining)}
          </div>
        </div>

        {/* Cargo */}
        <div>
          <div className="text-sm text-hanse-wood font-pixel">Fracht</div>
          <div className="text-lg font-bold text-hanse-ink font-pixel">
            {cargoWeight} / {maxCargoWeight}
          </div>
          <div className="w-full bg-hanse-parchment-dark h-2 mt-1">
            <div
              className={`h-full transition-all ${
                cargoWeight >= maxCargoWeight ? "bg-red-500" : "bg-hanse-sea"
              }`}
              style={{ width: `${(cargoWeight / maxCargoWeight) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
