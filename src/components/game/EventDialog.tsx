"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { GameEvent, EventChoice, EventOutcome } from "@/engine/types/events";
import { useGameStore } from "@/engine/state/game-store";
import { motion, AnimatePresence } from "framer-motion";

interface EventDialogProps {
  event: GameEvent | null;
  onClose: () => void;
}

export function EventDialog({ event, onClose }: EventDialogProps) {
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const run = useGameStore((state) => state.run);

  if (!event || !run) return null;

  const meetsRequirements = (choice: EventChoice): boolean => {
    if (!choice.requirements) return true;

    for (const req of choice.requirements) {
      if (req.type === "gold") {
        const value = req.value as number;
        if (req.operator === "gte" && run.player.gold < value) return false;
        if (req.operator === "lte" && run.player.gold > value) return false;
      }
    }
    return true;
  };

  const handleChoiceSelect = (choice: EventChoice) => {
    if (!meetsRequirements(choice)) return;

    setSelectedChoice(choice);

    // Determine outcome based on probabilities
    const rand = Math.random();
    let cumulative = 0;
    let selectedOutcome = choice.outcomes[0];

    for (const out of choice.outcomes) {
      cumulative += out.probability;
      if (rand <= cumulative) {
        selectedOutcome = out;
        break;
      }
    }

    setOutcome(selectedOutcome);

    // Apply effects after a short delay
    setTimeout(() => {
      applyEffects(selectedOutcome);
    }, 100);
  };

  const applyEffects = (outcome: EventOutcome) => {
    // Effects are applied through the game store
    // For MVP, we handle gold and time directly
    const store = useGameStore.getState();

    for (const effect of outcome.effects) {
      if (effect.type === "gold") {
        const currentGold = store.run?.player.gold ?? 0;
        let newGold = currentGold;

        if (effect.operation === "add") {
          newGold = currentGold + effect.value;
        } else if (effect.operation === "subtract") {
          newGold = Math.max(0, currentGold - effect.value);
        }

        // Update gold directly
        useGameStore.setState((state) => {
          if (!state.run) return state;
          return {
            run: {
              ...state.run,
              player: {
                ...state.run.player,
                gold: newGold,
              },
            },
          };
        });
      }

      if (effect.type === "time") {
        useGameStore.setState((state) => {
          if (!state.run) return state;
          let newTime = state.run.gameTime;

          if (effect.operation === "add") {
            newTime += effect.value;
          } else if (effect.operation === "subtract") {
            newTime = Math.max(0, newTime - effect.value);
          }

          return {
            run: {
              ...state.run,
              gameTime: newTime,
            },
          };
        });
      }
    }
  };

  const handleClose = () => {
    setSelectedChoice(null);
    setOutcome(null);
    onClose();
  };

  const getEventIcon = () => {
    switch (event.type) {
      case "weather":
        return "🌊";
      case "trade":
        return "💰";
      case "danger":
        return "⚔️";
      case "city":
        return "🏰";
      default:
        return "❓";
    }
  };

  return (
    <Dialog open={!!event} onClose={handleClose} title={event.title}>
      <div className="space-y-4">
        {/* Event header */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getEventIcon()}</span>
          <p className="font-pixel text-hanse-ink leading-relaxed">
            {event.description}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedChoice ? (
            // Choices
            <motion.div
              key="choices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2 pt-4"
            >
              {event.choices.map((choice) => {
                const canChoose = meetsRequirements(choice);
                return (
                  <Button
                    key={choice.id}
                    variant={canChoose ? "secondary" : "ghost"}
                    className="w-full text-left justify-start"
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={!canChoose}
                  >
                    <span className="font-pixel text-sm">{choice.text}</span>
                  </Button>
                );
              })}
            </motion.div>
          ) : (
            // Outcome
            <motion.div
              key="outcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 space-y-4"
            >
              <div className="bg-hanse-parchment-dark p-4 border-2 border-hanse-wood">
                <p className="font-pixel text-hanse-ink">
                  {outcome?.description}
                </p>

                {/* Show effects */}
                {outcome && outcome.effects.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {outcome.effects.map((effect, i) => (
                      <div
                        key={i}
                        className={`font-pixel text-sm ${
                          effect.operation === "add"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {effect.type === "gold" && (
                          <>
                            {effect.operation === "add" ? "+" : "-"}
                            {effect.value} Gold
                          </>
                        )}
                        {effect.type === "time" && (
                          <>
                            {effect.operation === "add" ? "+" : "-"}
                            {effect.value} Tag{effect.value !== 1 ? "e" : ""}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={handleClose}>
                Weiter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
}
