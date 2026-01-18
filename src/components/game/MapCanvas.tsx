"use client";

import { useGameStore } from "@/engine/state/game-store";
import { CITIES, getCityById, getConnectedCities } from "@/data/cities";
import { getShipById } from "@/data/ships";
import { getTravelInfo } from "@/engine/systems/travel";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";

interface MapCanvasProps {
  onTravelComplete?: (fromCityId: string, toCityId: string) => void;
}

export function MapCanvas({ onTravelComplete }: MapCanvasProps) {
  const run = useGameStore((state) => state.run);
  const travel = useGameStore((state) => state.travel);
  const canTravel = useGameStore((state) => state.canTravel);

  if (!run) return null;

  const currentCity = getCityById(run.player.currentCityId);
  const ship = getShipById(run.player.shipId);
  const connectedCities = currentCity ? getConnectedCities(currentCity.id) : [];

  const handleTravel = (toCityId: string) => {
    const fromCityId = run.player.currentCityId;
    if (travel(toCityId)) {
      onTravelComplete?.(fromCityId, toCityId);
    }
  };

  return (
    <Card variant="dark" className="mt-4">
      <CardHeader>
        <CardTitle>Seekarte</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Visual Map */}
        <div className="relative w-full h-64 bg-hanse-sea-light/30 border-2 border-hanse-sea-light mb-4 overflow-hidden">
          {/* Sea pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern id="waves" patternUnits="userSpaceOnUse" width="40" height="20">
                <path
                  d="M0 10 Q10 0 20 10 T40 10"
                  stroke="currentColor"
                  fill="none"
                  className="text-hanse-parchment"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#waves)" />
            </svg>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {CITIES.map((city) =>
              city.connections.map((connId) => {
                const connCity = getCityById(connId);
                if (!connCity || city.id > connId) return null;

                const isActive =
                  city.id === run.player.currentCityId ||
                  connId === run.player.currentCityId;

                return (
                  <line
                    key={`${city.id}-${connId}`}
                    x1={`${city.x}%`}
                    y1={`${city.y}%`}
                    x2={`${connCity.x}%`}
                    y2={`${connCity.y}%`}
                    stroke={isActive ? "#DAA520" : "#1E3A5F"}
                    strokeWidth={isActive ? 3 : 2}
                    strokeDasharray={isActive ? "none" : "5,5"}
                    opacity={0.7}
                  />
                );
              })
            )}
          </svg>

          {/* Cities */}
          {CITIES.map((city) => {
            const isCurrent = city.id === run.player.currentCityId;
            const isReachable = canTravel(city.id);

            return (
              <motion.div
                key={city.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                whileHover={{ scale: 1.1 }}
                onClick={() => isReachable && handleTravel(city.id)}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${
                      isCurrent
                        ? "bg-hanse-gold border-hanse-gold-dark"
                        : isReachable
                        ? "bg-hanse-parchment border-hanse-gold hover:bg-hanse-gold/50"
                        : "bg-hanse-parchment/50 border-hanse-sea"
                    }
                  `}
                >
                  {isCurrent && (
                    <div className="w-2 h-2 bg-hanse-ink rounded-full" />
                  )}
                </div>
                <div
                  className={`
                    absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                    font-pixel text-xs px-1
                    ${isCurrent ? "text-hanse-gold font-bold" : "text-hanse-parchment"}
                  `}
                >
                  {city.name}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Travel options */}
        <div className="space-y-2">
          <div className="font-pixel text-sm text-hanse-parchment mb-2">
            Reiseziele von {currentCity?.name}:
          </div>
          {connectedCities.length === 0 ? (
            <div className="text-hanse-parchment/70 font-pixel text-sm">
              Keine Routen verfügbar
            </div>
          ) : (
            connectedCities.map((city) => {
              const travelInfo =
                currentCity && ship
                  ? getTravelInfo(currentCity, city, ship.speed)
                  : null;

              return (
                <div
                  key={city.id}
                  className="flex items-center justify-between bg-hanse-sea/50 p-2 border border-hanse-sea-light"
                >
                  <div>
                    <div className="font-pixel text-hanse-parchment font-bold">
                      {city.name}
                    </div>
                    <div className="font-pixel text-xs text-hanse-parchment/70">
                      {travelInfo
                        ? `${travelInfo.days} Tage Reisezeit`
                        : "Unbekannt"}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleTravel(city.id)}>
                    Segeln
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
