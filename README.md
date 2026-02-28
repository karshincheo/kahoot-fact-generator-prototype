# Kahoot Fact Generator

Real-time, single-page app for collecting two truths and one lie from players, then exporting a Kahoot-compatible `.xlsx` file.

## Tech stack

- Next.js App Router + React + Tailwind CSS
- Supabase (PostgreSQL + Realtime)
- SheetJS (`xlsx`) for export
- Vercel hosting target

## Environment setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase setup

1. Create a Supabase project.
2. Run SQL from `supabase/migrations/001_init.sql` in the SQL editor.
3. In Supabase Dashboard, enable Realtime for both tables:
   - `public.players`
   - `public.game_state`
4. Keep RLS disabled for this MVP (as implemented by migration).

### Schema overview

- `game_state`
  - `id int primary key default 1`
  - `is_locked boolean default false`
- `players`
  - `id uuid primary key default gen_random_uuid()`
  - `name text`
  - `true_fact_1 text`
  - `true_fact_2 text`
  - `false_fact_1 text`
  - `created_at timestamp default now()`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Routes

- Player view: `/`
- Host dashboard: `/?host=true`

## Behavior checklist (MVP QA)

- Player form:
  - name + 3 fact fields required
  - 60-char max for each field
  - real-time counters shown on each fact field
  - submit disabled when any required field is empty
- Submission:
  - saves row to `players`
  - sets `sessionStorage.hasSubmitted=true`
  - player transitions to waiting room
- Waiting room:
  - shows lock message
  - shows live roster as players submit
- Host:
  - live roster + total count
  - lock and generate export
  - reset game clears players and unlocks room
- Generation:
  - block with visible error when players `< 4`
  - row A/B creation per player
  - shuffled final rows
  - exact Kahoot headers
  - time limit hardcoded to `10`
  - output filename `kahoot_export.xlsx`

## Deploy on Vercel

1. Import project into Vercel.
2. Add env vars in Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy.
