"use client";

import { getSupabaseClient } from "@/lib/supabase";
import { GameStateRow } from "@/types/game";

export async function fetchGameState(): Promise<GameStateRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("game_state")
    .select("id, is_locked")
    .eq("id", 1)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchPlayers() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, true_fact_1, true_fact_2, false_fact_1, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export function subscribePlayers(onChange: () => void) {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel("players-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players" },
      () => onChange()
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export function subscribeGameState(onLockChange: (isLocked: boolean) => void) {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel("game-state-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_state", filter: "id=eq.1" },
      (payload) => {
        const next = payload.new as GameStateRow;
        if (typeof next?.is_locked === "boolean") {
          onLockChange(next.is_locked);
        }
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
