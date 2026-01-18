import { getSupabaseClient } from "./client";
import { Run, RunInsert } from "./types";

export async function saveRun(run: RunInsert): Promise<Run | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("runs")
    .insert(run)
    .select()
    .single();

  if (error) {
    console.error("Error saving run:", error);
    return null;
  }

  return data;
}

export async function getLeaderboard(limit: number = 10): Promise<Run[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .eq("is_victory", true)
    .order("final_gold", { ascending: false })
    .order("days_used", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data ?? [];
}

export async function getRecentRuns(limit: number = 5): Promise<Run[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent runs:", error);
    return [];
  }

  return data ?? [];
}

export async function getRunStats(): Promise<{
  totalRuns: number;
  victories: number;
  avgGold: number;
} | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("runs")
    .select("is_victory, final_gold");

  if (error) {
    console.error("Error fetching stats:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return { totalRuns: 0, victories: 0, avgGold: 0 };
  }

  const totalRuns = data.length;
  const victories = data.filter((r) => r.is_victory).length;
  const avgGold = Math.round(
    data.reduce((sum, r) => sum + r.final_gold, 0) / totalRuns
  );

  return { totalRuns, victories, avgGold };
}
