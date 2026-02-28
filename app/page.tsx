"use client";

import { useEffect, useState } from "react";
import { HostDashboard } from "@/components/host/HostDashboard";
import { PlayerForm } from "@/components/player/PlayerForm";
import { WaitingRoom } from "@/components/player/WaitingRoom";
import { exportKahootXlsx } from "@/lib/exportKahoot";
import { generateKahootRows } from "@/lib/generation";
import {
  fetchGameState,
  fetchPlayers,
  subscribeGameState,
  subscribePlayers,
} from "@/lib/realtime";
import { getSupabaseClient } from "@/lib/supabase";
import { PlayerRow } from "@/types/game";

export default function HomePage() {
  const [isHost, setIsHost] = useState(false);
  const [isHostResolved, setIsHostResolved] = useState(false);
  const [playerJoinUrl, setPlayerJoinUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);
  const [hostStatus, setHostStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsHost(searchParams.get("host") === "true");
    setPlayerJoinUrl(`${window.location.origin}${window.location.pathname}`);
    setIsHostResolved(true);
  }, []);

  async function refreshPlayers() {
    const nextPlayers = await fetchPlayers();
    setPlayers(nextPlayers);
  }

  useEffect(() => {
    let mounted = true;
    let unsubscribePlayers = () => {};
    let unsubscribeState = () => {};

    async function bootstrap() {
      try {
        const [state] = await Promise.all([fetchGameState(), refreshPlayers()]);
        if (!mounted) {
          return;
        }

        setIsLocked(state?.is_locked ?? false);
        const submitted = window.sessionStorage.getItem("hasSubmitted") === "true";
        setHasSubmitted(submitted);
      } catch (error) {
        if (!mounted) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Unable to initialize the app.";
        if (isHost) {
          setHostError(message);
        } else {
          setPlayerError(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    try {
      unsubscribePlayers = subscribePlayers(() => {
        void refreshPlayers();
      });
      unsubscribeState = subscribeGameState((locked) => {
        setIsLocked(locked);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Realtime connection failed.";
      if (isHost) {
        setHostError(message);
      } else {
        setPlayerError(message);
      }
    }

    return () => {
      mounted = false;
      unsubscribePlayers();
      unsubscribeState();
    };
  }, [isHost]);

  async function handleSubmit(values: {
    name: string;
    trueFact1: string;
    trueFact2: string;
    falseFact1: string;
  }) {
    setPlayerError(null);
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("players").insert({
        name: values.name,
        true_fact_1: values.trueFact1,
        true_fact_2: values.trueFact2,
        false_fact_1: values.falseFact1,
      });

      if (error) {
        setPlayerError(error.message);
        return;
      }

      window.sessionStorage.setItem("hasSubmitted", "true");
      setHasSubmitted(true);
    } catch (error) {
      setPlayerError(
        error instanceof Error ? error.message : "Failed to submit your facts."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLockAndGenerate() {
    setHostError(null);
    setHostStatus(null);
    setIsGenerating(true);

    try {
      const supabase = getSupabaseClient();
      const currentPlayers = await fetchPlayers();
      if (currentPlayers.length < 4) {
        throw new Error("Not enough players! Need at least 4.");
      }

      const { error: lockError } = await supabase
        .from("game_state")
        .upsert({ id: 1, is_locked: true });

      if (lockError) {
        setHostError(lockError.message);
        return;
      }

      const generatedRows = generateKahootRows(currentPlayers);
      exportKahootXlsx(generatedRows);
      setHostStatus(`Generated ${generatedRows.length} questions and downloaded export.`);
    } catch (error) {
      setHostError(
        error instanceof Error
          ? error.message
          : "Failed to generate Kahoot export. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleResetGame() {
    setHostError(null);
    setHostStatus(null);
    try {
      const supabase = getSupabaseClient();
      const [{ error: clearPlayersError }, { error: unlockError }] = await Promise.all([
        supabase.from("players").delete().gte("created_at", "1970-01-01T00:00:00Z"),
        supabase.from("game_state").upsert({ id: 1, is_locked: false }),
      ]);

      if (clearPlayersError || unlockError) {
        setHostError(clearPlayersError?.message ?? unlockError?.message ?? "Reset failed.");
        return;
      }

      setHostStatus("Game reset. Room unlocked and roster cleared.");
    } catch (error) {
      setHostError(error instanceof Error ? error.message : "Reset failed.");
    }
  }

  if (isLoading || !isHostResolved) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-indigo-600 p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(253,224,71,0.3),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(129,140,248,0.35),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(45,212,191,0.25),transparent_32%)]" />
        <p className="z-10 rounded-2xl bg-white/90 px-6 py-4 text-xl font-black text-indigo-700 shadow-[0_10px_0_0_rgba(79,70,229,0.45)]">
          Loading game...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-indigo-600 p-6 text-indigo-950 sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(253,224,71,0.3),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(110,231,183,0.25),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(191,219,254,0.22),transparent_38%)]" />
      <div className="pointer-events-none absolute left-[-3rem] top-20 h-28 w-28 rounded-full bg-yellow-300/40 blur-2xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 right-[-2rem] h-36 w-36 rounded-full bg-cyan-300/30 blur-2xl animate-pulse" />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-4 border-white/35 bg-white/20 px-5 py-4 shadow-[0_10px_0_0_rgba(30,27,75,0.35)] backdrop-blur-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-100">
              Real-time party game
            </p>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              Kahoot Fact Generator
            </h1>
          </div>
          <span className="rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-indigo-900 shadow-[0_5px_0_0_rgba(202,138,4,1)]">
            {isHost ? "Host Mode" : "Player Mode"}
          </span>
        </header>

        {isHost ? (
          <HostDashboard
            players={players.map((player) => player.name)}
            playerJoinUrl={playerJoinUrl}
            isGenerating={isGenerating}
            statusMessage={hostStatus}
            errorMessage={hostError}
            onLockAndGenerate={handleLockAndGenerate}
            onResetGame={handleResetGame}
          />
        ) : hasSubmitted || isLocked ? (
          <WaitingRoom players={players.map((player) => player.name)} />
        ) : (
          <PlayerForm isSubmitting={isSubmitting} onSubmit={handleSubmit} error={playerError} />
        )}
      </div>
    </main>
  );
}
