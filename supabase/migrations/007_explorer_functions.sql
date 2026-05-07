-- Migration 007: Fonctions SQL pour l'écran Explorer (Story 6.1)
-- get_vehicle_counts_by_type : comptage des véhicules publiés par type
-- get_trending_tags          : tags les plus fréquents dans la DB

-- ─── Comptage véhicules par type ─────────────────────────────────────────────
create or replace function get_vehicle_counts_by_type()
returns table(type text, count bigint)
language sql
security definer
as $$
  select v.type, count(*)::bigint
  from vehicles v
  where v.is_published = true
  group by v.type;
$$;

-- ─── Tags les plus fréquents ─────────────────────────────────────────────────
-- Unnest le tableau text[] `tags` de chaque véhicule publié, puis agrège par popularité.
create or replace function get_trending_tags(limit_count integer default 10)
returns text[]
language sql
security definer
as $$
  select array_agg(tag)
  from (
    select tag, count(*) as tag_count
    from vehicles, unnest(tags) as tag
    where is_published = true and tag <> ''
    group by tag
    order by tag_count desc
    limit limit_count
  ) sub;
$$;
