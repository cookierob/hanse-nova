export interface Run {
  id: string;
  player_name: string;
  final_gold: number;
  target_gold: number;
  days_used: number;
  max_days: number;
  is_victory: boolean;
  ship_id: string;
  starting_city: string;
  ending_city: string;
  trades_count: number;
  events_encountered: number;
  created_at: string;
}

export interface RunInsert {
  player_name?: string;
  final_gold: number;
  target_gold?: number;
  days_used: number;
  max_days?: number;
  is_victory: boolean;
  ship_id?: string;
  starting_city?: string;
  ending_city: string;
  trades_count?: number;
  events_encountered?: number;
}
