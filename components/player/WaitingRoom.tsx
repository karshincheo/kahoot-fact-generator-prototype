"use client";

type WaitingRoomProps = {
  players: string[];
};

export function WaitingRoom({ players }: WaitingRoomProps) {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-3xl border-4 border-emerald-100 bg-white p-8 shadow-[0_16px_0_0_rgba(22,101,52,1)] sm:p-10">
      <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-800">
        Waiting room
      </div>
      <h2 className="mt-4 text-3xl font-extrabold text-emerald-700">
        Facts locked! Waiting for the host to start the game.
      </h2>
      <p className="mt-2 text-emerald-900">
        Keep this tab open. Your host is generating questions from submitted facts.
      </p>
      <p className="mt-3 text-lg font-semibold text-emerald-900">
        Players in room: <span className="font-black">{players.length}</span>
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Live sync active
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {players.map((name, index) => (
          <li
            key={`${name}-${index}`}
            className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-bold text-emerald-900 shadow-[0_4px_0_0_rgba(16,185,129,0.25)]"
          >
            {name}
          </li>
        ))}
      </ul>
      {players.length === 0 ? (
        <p className="mt-5 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
          No players yet. Share the player link to start collecting facts.
        </p>
      ) : null}
    </section>
  );
}
