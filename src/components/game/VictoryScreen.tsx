"use client";

import { useEffect, useState, useRef } from "react";
import { useGameStore } from "@/engine/state/game-store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { saveRun, getLeaderboard } from "@/lib/supabase/runs";
import { Run } from "@/lib/supabase/types";

export function VictoryScreen() {
  const run = useGameStore((state) => state.run);
  const resetRun = useGameStore((state) => state.resetRun);
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Run[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    getLeaderboard(5).then(setLeaderboard);
  }, [saved]);

  const handleSaveRun = async () => {
    if (!run || hasSavedRef.current) return;

    setSaving(true);
    hasSavedRef.current = true;

    await saveRun({
      player_name: playerName || "Anonymer Händler",
      final_gold: run.player.gold,
      target_gold: run.targetGold,
      days_used: run.gameTime,
      max_days: run.maxGameTime,
      is_victory: run.isVictory,
      ship_id: run.player.shipId,
      starting_city: "luebeck",
      ending_city: run.player.currentCityId,
    });

    setSaving(false);
    setSaved(true);
    setShowLeaderboard(true);
  };

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

            {/* Save to leaderboard */}
            {!saved ? (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Euer Name für die Bestenliste"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 font-pixel text-sm bg-hanse-parchment-dark border-2 border-hanse-wood text-hanse-ink placeholder:text-hanse-wood/50"
                  maxLength={20}
                />
                <Button
                  size="md"
                  variant="secondary"
                  className="w-full"
                  onClick={handleSaveRun}
                  disabled={saving}
                >
                  {saving ? "Speichern..." : "In Bestenliste eintragen"}
                </Button>
              </div>
            ) : (
              <div className="mt-4 p-2 bg-green-100 border border-green-300 text-green-800 font-pixel text-sm">
                Ergebnis gespeichert!
              </div>
            )}

            {/* Leaderboard */}
            {showLeaderboard && leaderboard.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-hanse-parchment-dark p-4 border border-hanse-wood"
              >
                <h3 className="font-pixel font-bold text-hanse-ink mb-2">
                  Top 5 Händler
                </h3>
                <div className="space-y-1">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="flex justify-between font-pixel text-sm"
                    >
                      <span className="text-hanse-wood">
                        {i + 1}. {entry.player_name}
                      </span>
                      <span className="text-hanse-gold-dark font-bold">
                        {entry.final_gold}G
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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
