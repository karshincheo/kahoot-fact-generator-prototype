"use client";

import { useState } from "react";

type HostDashboardProps = {
  players: string[];
  playerJoinUrl: string;
  isGenerating: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  onLockAndGenerate: () => Promise<void>;
  onResetGame: () => Promise<void>;
};

export function HostDashboard({
  players,
  playerJoinUrl,
  isGenerating,
  statusMessage,
  errorMessage,
  onLockAndGenerate,
  onResetGame,
}: HostDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function handleCopyLink() {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(playerJoinUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError("Could not copy automatically. Please copy the link manually.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border-4 border-purple-100 bg-white p-8 shadow-[0_16px_0_0_rgba(126,34,206,1)] sm:p-10">
      <div className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-purple-700">
        Host controls
      </div>
      <h2 className="mt-4 text-3xl font-extrabold text-purple-700">Host Dashboard</h2>
      <p className="mt-2 text-purple-900">
        Lock the room when everyone has submitted, then instantly download the Kahoot import file.
      </p>

      <div className="mt-6 rounded-2xl border-2 border-purple-200 bg-purple-50 p-5 shadow-[0_6px_0_0_rgba(168,85,247,0.22)]">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-purple-700">
          Total Players
        </p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <p className="text-5xl font-black text-purple-900">{players.length}</p>
          <p className="text-sm font-semibold text-purple-700">Minimum 4 needed to generate</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-indigo-700">
          Player Link
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="block w-full overflow-x-auto rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-800">
            {playerJoinUrl}
          </code>
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            className="rounded-xl bg-indigo-500 px-4 py-2 font-black text-white shadow-[0_6px_0_0_rgba(67,56,202,1)] transition-all hover:brightness-110 active:translate-y-[2px] active:shadow-[0_4px_0_0_rgba(67,56,202,1)]"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        {copyError ? (
          <p className="mt-2 text-sm font-semibold text-rose-700">{copyError}</p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => void onLockAndGenerate()}
          disabled={isGenerating}
          className="rounded-xl bg-yellow-400 px-6 py-4 text-lg font-black text-purple-950 shadow-[0_8px_0_0_rgba(202,138,4,1)] transition-all enabled:hover:brightness-105 enabled:active:translate-y-[2px] enabled:active:shadow-[0_6px_0_0_rgba(202,138,4,1)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? "Generating..." : "Lock Room & Generate Kahoot"}
        </button>

        <button
          type="button"
          onClick={() => void onResetGame()}
          disabled={isGenerating}
          className="rounded-xl bg-rose-500 px-6 py-4 text-lg font-black text-white shadow-[0_8px_0_0_rgba(159,18,57,1)] transition-all enabled:hover:brightness-110 enabled:active:translate-y-[2px] enabled:active:shadow-[0_6px_0_0_rgba(159,18,57,1)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reset Game
        </button>
      </div>

      {statusMessage ? (
        <p
          aria-live="polite"
          className="mt-5 rounded-xl border-2 border-cyan-200 bg-cyan-100 px-3 py-2 text-sm font-semibold text-cyan-800"
        >
          {statusMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p
          aria-live="assertive"
          className="mt-5 rounded-xl border-2 border-rose-200 bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8">
        <h3 className="text-xl font-black text-purple-800">Live Roster</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {players.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-3 font-bold text-purple-900 shadow-[0_4px_0_0_rgba(168,85,247,0.2)]"
            >
              {name}
            </li>
          ))}
        </ul>
        {players.length === 0 ? (
          <p className="mt-4 rounded-xl bg-purple-100 px-4 py-3 text-sm font-semibold text-purple-700">
            Waiting for players to submit facts.
          </p>
        ) : null}
      </div>
    </section>
  );
}
