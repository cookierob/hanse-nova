"use client";

import { useGameStore } from "@/engine/state/game-store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function VictoryScreen() {
  const run = useGameStore((state) => state.run);
  const resetRun = useGameStore((state) => state.resetRun);

  if (!run) return null;

  const isVictory = run.isVictory;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <Card
        variant={isVictory ? "highlight" : "default"}
        className="max-w-md w-full text-center"
      >
        <CardContent className="py-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-6xl mb-4">
              {isVictory ? "⚓" : "💀"}
            </div>
            <h2 className="font-pixel text-2xl font-bold mb-4 text-hanse-ink">
              {isVictory ? "Sieg!" : "Niederlage"}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="font-pixel text-hanse-wood">
              {isVictory
                ? `Ihr habt ${run.player.gold} Gold angesammelt und Euer Ziel erreicht!`
                : `Die Zeit ist abgelaufen. Ihr habt nur ${run.player.gold} von ${run.targetGold} Gold erreicht.`}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-left bg-hanse-parchment-dark p-4 mt-6">
              <div>
                <div className="text-xs text-hanse-wood font-pixel">Endkapital</div>
                <div className="font-pixel font-bold text-hanse-gold-dark">
                  {run.player.gold} Gold
                </div>
              </div>
              <div>
                <div className="text-xs text-hanse-wood font-pixel">Tage vergangen</div>
                <div className="font-pixel font-bold text-hanse-ink">
                  {Math.floor(run.gameTime)} / {run.maxGameTime}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={resetRun}
            >
              Neuen Run starten
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
