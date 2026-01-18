"use client";

import { useGameStore } from "@/engine/state/game-store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const startRun = useGameStore((state) => state.startRun);
  const run = useGameStore((state) => state.run);
  const router = useRouter();

  const handleStartNewRun = () => {
    startRun();
    router.push("/play");
  };

  const handleContinueRun = () => {
    router.push("/play");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-hanse-ink to-hanse-sea">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Card className="text-center">
          <CardContent className="py-12">
            {/* Logo/Title */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-4">⛵</div>
              <h1 className="font-pixel text-4xl font-bold text-hanse-ink mb-2">
                Hanse Nova
              </h1>
              <p className="font-pixel text-hanse-wood text-sm mb-8">
                Roguelike Handelssimulation
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-pixel text-hanse-ink/80 mb-8 leading-relaxed"
            >
              Anno 1370. Ihr seid ein junger Kaufmann in Lübeck.
              Euer Ziel: 2000 Gold in 30 Tagen.
              Handelt klug, segelt weise, und werdet zum Herren der Ostsee.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                className="w-full"
                onClick={handleStartNewRun}
              >
                Neuen Run starten
              </Button>

              {run && !run.isComplete && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={handleContinueRun}
                >
                  Fortsetzen ({run.player.gold} Gold)
                </Button>
              )}
            </motion.div>

            {/* Quick rules */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-hanse-wood/30"
            >
              <h3 className="font-pixel text-sm font-bold text-hanse-wood mb-3">
                So wird gespielt:
              </h3>
              <ul className="font-pixel text-xs text-hanse-ink/70 space-y-1 text-left">
                <li>• Kauft Waren günstig ein</li>
                <li>• Segelt zu anderen Städten</li>
                <li>• Verkauft teurer und macht Gewinn</li>
                <li>• Erreicht 2000 Gold vor Ablauf der Zeit</li>
              </ul>
            </motion.div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center font-pixel text-xs text-hanse-parchment/50 mt-4">
          Hanse Nova MVP • 2024
        </p>
      </motion.div>
    </main>
  );
}
