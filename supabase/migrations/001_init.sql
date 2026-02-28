create extension if not exists pgcrypto;

create table if not exists public.game_state (
  id int primary key default 1,
  is_locked boolean not null default false
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  true_fact_1 text not null,
  true_fact_2 text not null,
  false_fact_1 text not null,
  created_at timestamp with time zone not null default now()
);

alter table public.game_state replica identity full;
alter table public.players replica identity full;

alter table public.game_state disable row level security;
alter table public.players disable row level security;

insert into public.game_state (id, is_locked)
values (1, false)
on conflict (id) do nothing;
