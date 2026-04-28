-- Migration 002: Système de follow (profil ou véhicule)
-- Table polymorphique : target_type distingue 'profile' vs 'vehicle'

CREATE TABLE follows (
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('vehicle', 'profile')),
  created_at  timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, target_id, target_type)
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
