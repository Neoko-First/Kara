-- Migration 004: Commentaires et likes
-- Tables absentes du PRD initial, ajoutées en architecture (AR2)

-- Commentaires sur les véhicules
CREATE TABLE comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Likes polymorphiques : un véhicule OU un commentaire
-- UNIQUE(target_id, target_type, user_id) empêche le double-like
CREATE TABLE likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id   uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('vehicle', 'comment')),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (target_id, target_type, user_id)
);
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
