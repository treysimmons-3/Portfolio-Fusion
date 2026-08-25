-- Run this once in the Supabase SQL editor.
create table if not exists public.arcade_scores (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 16),
  score integer not null check (score between 0 and 99999999),
  level integer not null check (level between 1 and 9999),
  created_at timestamptz not null default now()
);

alter table public.arcade_scores enable row level security;

drop policy if exists "Anyone can read arcade scores" on public.arcade_scores;
create policy "Anyone can read arcade scores"
  on public.arcade_scores for select
  to anon, authenticated
  using (true);

-- Scores are submitted through a constrained function instead of direct table
-- inserts, so the public anon role cannot bypass the field validation.
create or replace function public.submit_arcade_score(
  player_name text,
  player_score integer,
  player_level integer
)
returns setof public.arcade_scores
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(trim(player_name)) < 1 or char_length(trim(player_name)) > 16 then
    raise exception 'Invalid player name';
  end if;
  if player_score < 0 or player_score > 99999999 then
    raise exception 'Invalid score';
  end if;
  if player_level < 1 or player_level > 9999 then
    raise exception 'Invalid level';
  end if;

  return query
    insert into public.arcade_scores (name, score, level)
    values (upper(trim(player_name)), player_score, player_level)
    returning *;
end;
$$;

revoke insert, update, delete on public.arcade_scores from anon, authenticated;
grant select on public.arcade_scores to anon, authenticated;
grant execute on function public.submit_arcade_score(text, integer, integer) to anon, authenticated;