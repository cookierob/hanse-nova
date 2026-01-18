"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { getLeaderboard } from "@/lib/supabase/runs";
import { Run } from "@/lib/supabase/types";

export function Leaderboard() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(10)
      .then(setRuns)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-4 text-center">
          <span className="font-pixel text-hanse-wood">Laden...</span>
        </CardContent>
      </Card>
    );
  }

  if (runs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bestenliste</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-pixel text-sm text-hanse-wood text-center">
            Noch keine Einträge. Seid der Erste!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Händler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {runs.map((run, i) => (
            <div
              key={run.id}
              className={`flex items-center justify-between p-2 ${
                i < 3 ? "bg-hanse-gold/10" : "bg-hanse-parchment-dark"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-pixel text-lg w-6 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <span className="font-pixel text-sm text-hanse-ink">
                  {run.player_name}
                </span>
              </div>
              <div className="text-right">
                <div className="font-pixel font-bold text-hanse-gold-dark">
                  {run.final_gold}G
                </div>
                <div className="font-pixel text-xs text-hanse-wood">
                  {run.days_used.toFixed(1)} Tage
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
