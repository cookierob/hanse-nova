"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/engine/state/game-store";
import { CityView } from "@/components/game/CityView";
import { Button } from "@/components/ui/Button";

export default function PlayPage() {
  const run = useGameStore((state) => state.run);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if no active run
    if (!run) {
      router.push("/");
    }
  }, [run, router]);

  if (!run) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-hanse-parchment">Laden...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-hanse-ink to-hanse-sea p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h1 className="font-pixel text-xl text-hanse-gold">⛵ Hanse Nova</h1>
          <Button
            size="sm"
            variant="ghost"
            className="text-hanse-parchment"
            onClick={() => router.push("/")}
          >
            Zurück zum Menü
          </Button>
        </header>

        {/* Game content */}
        <CityView />
      </div>
    </main>
  );
}
