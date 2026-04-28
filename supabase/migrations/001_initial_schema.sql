-- Migration 001: Schéma initial — profiles, vehicles, vehicle_photos
-- Trigger auto-création profil après inscription OAuth/email

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Table profiles ───────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username     text UNIQUE NOT NULL,
  display_name text,
  bio          text,
  avatar_url   text,
  city         text,
  tags         text[] DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ─── Table vehicles ───────────────────────────────────────────────────────────
CREATE TABLE vehicles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('car','moto','van','truck','bike','classic')),
  brand        text NOT NULL,
  model        text NOT NULL,
  year         integer,
  displacement text,
  power        integer,
  torque       integer,
  transmission text,
  weight       integer,
  description  text,
  tags         text[] DEFAULT '{}',
  city         text,
  lat          float,
  lng          float,
  country_code text,
  is_published boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- ─── Table vehicle_photos ─────────────────────────────────────────────────────
-- storage_path = chemin brut Supabase Storage (ex: "vehicles/uuid/photo.jpg")
-- NE JAMAIS stocker l'URL complète — buildImageUrl() côté app reconstruit l'URL
CREATE TABLE vehicle_photos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id   uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  position     integer NOT NULL,
  is_cover     boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;

-- ─── Trigger auto-création profil ─────────────────────────────────────────────
-- S'exécute après chaque INSERT dans auth.users (OAuth ou email)
-- SECURITY DEFINER = s'exécute avec les droits du créateur (superuser)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(SPLIT_PART(NEW.email, '@', 1), ''), 'user_' || LEFT(NEW.id::text, 8)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
