-- Migration 005: Politiques Row Level Security (RLS)
-- Toutes les politiques sont regroupées ici pour faciliter l'audit
-- NFR4 : RLS activé sur toutes les tables, aucune table sans politique explicite

-- ─── Helper : évite la récursion RLS sur conversation_participants ─────────────
-- SECURITY DEFINER = bypass RLS pour ce check interne uniquement
CREATE OR REPLACE FUNCTION is_conversation_participant(conv_id uuid, user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id AND profile_id = user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── profiles ─────────────────────────────────────────────────────────────────
-- Lecture publique (profils visibles par tous)
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);

-- Insertion : uniquement pour son propre profil (normalement via trigger)
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Modification : uniquement son propre profil
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ─── vehicles ─────────────────────────────────────────────────────────────────
-- Lecture des véhicules publiés (feed public)
CREATE POLICY "vehicles_select_published" ON vehicles
  FOR SELECT USING (is_published = true);

-- Lecture de ses propres véhicules (drafts inclus)
CREATE POLICY "vehicles_select_own" ON vehicles
  FOR SELECT USING (auth.uid() = owner_id);

-- Création : owner_id doit correspondre à l'utilisateur connecté
CREATE POLICY "vehicles_insert_own" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Modification : uniquement ses propres véhicules
CREATE POLICY "vehicles_update_own" ON vehicles
  FOR UPDATE USING (auth.uid() = owner_id);

-- Suppression : uniquement ses propres véhicules
CREATE POLICY "vehicles_delete_own" ON vehicles
  FOR DELETE USING (auth.uid() = owner_id);

-- ─── vehicle_photos ───────────────────────────────────────────────────────────
-- Photos publiques (accessibles sans auth pour le feed)
CREATE POLICY "vehicle_photos_select_public" ON vehicle_photos
  FOR SELECT USING (true);

-- Upload : uniquement le propriétaire du véhicule associé
CREATE POLICY "vehicle_photos_insert_owner" ON vehicle_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id AND v.owner_id = auth.uid()
    )
  );

-- Suppression : uniquement le propriétaire du véhicule associé
CREATE POLICY "vehicle_photos_delete_owner" ON vehicle_photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_id AND v.owner_id = auth.uid()
    )
  );

-- ─── follows ──────────────────────────────────────────────────────────────────
-- Follows publics (stats visibles)
CREATE POLICY "follows_select_public" ON follows
  FOR SELECT USING (true);

-- Follow : uniquement en tant que follower (follower_id = soi-même)
CREATE POLICY "follows_insert_own" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- Unfollow : uniquement ses propres follows
CREATE POLICY "follows_delete_own" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- ─── conversations ────────────────────────────────────────────────────────────
-- Visible uniquement si l'utilisateur est participant (via helper SECURITY DEFINER)
CREATE POLICY "conversations_select_participant" ON conversations
  FOR SELECT USING (is_conversation_participant(id, auth.uid()));

-- Création : tout utilisateur authentifié peut créer une conversation
CREATE POLICY "conversations_insert_authenticated" ON conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── conversation_participants ────────────────────────────────────────────────
-- Chaque utilisateur voit uniquement ses propres lignes de participation
CREATE POLICY "cp_select_own" ON conversation_participants
  FOR SELECT USING (profile_id = auth.uid());

-- Ajout de participant : tout utilisateur authentifié
CREATE POLICY "cp_insert_authenticated" ON conversation_participants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── messages ─────────────────────────────────────────────────────────────────
-- Lecture : uniquement les participants de la conversation
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (is_conversation_participant(conversation_id, auth.uid()));

-- Envoi : sender_id = soi-même ET être participant
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    is_conversation_participant(conversation_id, auth.uid())
  );

-- ─── comments ─────────────────────────────────────────────────────────────────
-- Commentaires publics
CREATE POLICY "comments_select_public" ON comments
  FOR SELECT USING (true);

-- Poster un commentaire : tout utilisateur authentifié
CREATE POLICY "comments_insert_authenticated" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Modifier son commentaire uniquement
CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Supprimer son commentaire uniquement
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ─── likes ────────────────────────────────────────────────────────────────────
-- Likes publics (compteurs visibles)
CREATE POLICY "likes_select_public" ON likes
  FOR SELECT USING (true);

-- Liker : user_id = soi-même (UNIQUE constraint empêche le double-like)
CREATE POLICY "likes_insert_own" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Unliker : uniquement ses propres likes
CREATE POLICY "likes_delete_own" ON likes
  FOR DELETE USING (auth.uid() = user_id);
