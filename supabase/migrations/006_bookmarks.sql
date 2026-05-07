-- Story 5.3 : Bookmarks (favoris)
-- Table dédiée pour les favoris utilisateurs (séparée de likes : concepts métier distincts)

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(vehicle_id, user_id)
);

alter table bookmarks enable row level security;

create policy "Lecture propre bookmarks"
  on bookmarks for select using (auth.uid() = user_id);

create policy "Insertion bookmark authentifié"
  on bookmarks for insert with check (auth.uid() = user_id);

create policy "Suppression bookmark propriétaire"
  on bookmarks for delete using (auth.uid() = user_id);
