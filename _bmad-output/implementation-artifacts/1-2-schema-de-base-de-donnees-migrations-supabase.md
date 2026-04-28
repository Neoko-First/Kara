# Story 1.2: Schéma de base de données & migrations Supabase

Status: review

## Story

As a développeur,
I want que le schéma de base de données complet soit créé via les migrations Supabase CLI,
so that toutes les features peuvent persister leurs données avec les politiques RLS appropriées.

## Acceptance Criteria

1. Le dossier `supabase/` est initialisé à la racine du repo (pas dans `app/`) via `supabase init`
2. Les 5 migrations s'appliquent dans l'ordre lors de `supabase db push` : `001_initial_schema.sql`, `002_follows.sql`, `003_messages.sql`, `004_comments_likes.sql`, `005_rls_policies.sql`
3. Le trigger `handle_new_user()` crée automatiquement un profil dans `profiles` à chaque insertion dans `auth.users` (username = partie locale de l'email, display_name + avatar_url depuis OAuth metadata)
4. RLS est activé (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) sur toutes les tables ; toutes les politiques sont définies dans `005_rls_policies.sql`
5. Un utilisateur non-authentifié ne peut pas lire ni écrire sur les tables protégées (vérifié manuellement avec Supabase Studio ou `psql`)
6. `app/types/database.ts` est généré via `supabase gen types typescript --local > app/types/database.ts` et reflète le schéma complet (aucune édition manuelle)
7. `npm run build` (ou `npx tsc --noEmit` depuis `app/`) passe sans erreur TypeScript sur les types générés

## Tasks / Subtasks

- [x] Initialiser Supabase CLI à la racine du repo (AC: 1)
  - [x] Vérifier que Docker Desktop est démarré (requis pour `supabase start`) — ⚠️ Docker installé mais non démarré → étape manuelle requise
  - [x] `supabase init` à la racine du repo (`C:/Users/Alexandre.XOTIS/Documents/lab/Kara/`) — ✅ exécuté via `npx supabase init`
  - [x] `supabase start` pour démarrer l'environnement local — ✅ exécuté manuellement par Alexandre

- [x] Créer `supabase/migrations/001_initial_schema.sql` (AC: 2, 3)
  - [x] Table `profiles` (id references auth.users, username unique, display_name, bio, avatar_url, city, tags text[], created_at)
  - [x] Table `vehicles` (id uuid, owner_id, type, brand, model, year, displacement, power, torque, transmission, weight, description, tags text[], city, lat, lng, country_code, is_published, created_at)
  - [x] Table `vehicle_photos` (id, vehicle_id FK cascade, storage_path text, position int, is_cover bool, created_at)
  - [x] Fonction `handle_new_user()` + trigger `on_auth_user_created` sur `auth.users`
  - [x] `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`, idem vehicles, vehicle_photos

- [x] Créer `supabase/migrations/002_follows.sql` (AC: 2, 4)
  - [x] Table `follows` (follower_id FK profiles, target_id uuid, target_type text CHECK ('vehicle','profile'), created_at, PK composite)
  - [x] `ALTER TABLE follows ENABLE ROW LEVEL SECURITY`

- [x] Créer `supabase/migrations/003_messages.sql` (AC: 2, 4)
  - [x] Table `conversations` (id uuid PK, created_at)
  - [x] Table `conversation_participants` (conversation_id FK, profile_id FK, PK composite)
  - [x] Table `messages` (id uuid PK, conversation_id FK, sender_id FK profiles, content text, image_url text, created_at)
  - [x] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` sur les 3 tables

- [x] Créer `supabase/migrations/004_comments_likes.sql` (AC: 2, 4)
  - [x] Table `comments` (id uuid PK, vehicle_id FK cascade, user_id FK profiles cascade, body text NOT NULL, created_at)
  - [x] Table `likes` (id uuid PK, target_id uuid, target_type text CHECK ('vehicle','comment'), user_id FK profiles cascade, created_at, UNIQUE(target_id, target_type, user_id))
  - [x] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` sur les 2 tables

- [x] Créer `supabase/migrations/005_rls_policies.sql` (AC: 4, 5)
  - [x] Politiques `profiles` : SELECT public, INSERT owner uniquement, UPDATE owner uniquement
  - [x] Politiques `vehicles` : SELECT public (is_published), INSERT authentifié + owner_id, UPDATE owner, DELETE owner
  - [x] Politiques `vehicle_photos` : SELECT public, INSERT via owner du véhicule, DELETE idem
  - [x] Politiques `follows` : SELECT public, INSERT follower_id = auth.uid(), DELETE idem
  - [x] Politiques `conversations` + `conversation_participants` + `messages` : basées sur la participation (helper SECURITY DEFINER pour éviter la récursion RLS)
  - [x] Politiques `comments` : SELECT public, INSERT authentifié, UPDATE/DELETE user_id = auth.uid()
  - [x] Politiques `likes` : SELECT public, INSERT user_id = auth.uid(), DELETE idem

- [x] Appliquer les migrations et générer les types (AC: 2, 6)
  - [x] `supabase db reset` (applique toutes les migrations from scratch en local) — ✅ exécuté manuellement par Alexandre
  - [x] `supabase gen types typescript --local > app/types/database.ts` — ✅ types régénérés par le CLI (avec graphql_public schema)
  - [x] Vérifier que `app/types/database.ts` contient toutes les tables attendues — ✅ fichier regénéré par CLI

- [x] Vérification finale (AC: 5, 7)
  - [x] Tester manuellement dans Supabase Studio (`localhost:54323`) qu'un utilisateur non-authentifié obtient une erreur 403/42501 sur SELECT de `vehicles` — ✅ vérifié par Alexandre
  - [x] `cd app && npx tsc --noEmit` passe sans erreur — ✅

## Dev Notes

### ⚠️ Pré-requis critiques avant de commencer

1. **Docker Desktop doit être démarré** — Supabase CLI local utilise Docker. Sans Docker, `supabase start` échoue.
2. **Supabase CLI installé** — vérifier avec `supabase --version`. Si absent : `npm install -g supabase` ou via les instructions officielles.
3. **Le dossier `supabase/` n'existe pas encore** — `supabase init` est la toute première commande.

### Structure de fichiers attendue après cette story

```
Kara/                                    ← racine du repo
├── supabase/                            ← NOUVEAU
│   ├── config.toml                      ← généré par supabase init
│   └── migrations/
│       ├── 001_initial_schema.sql       ← NOUVEAU
│       ├── 002_follows.sql              ← NOUVEAU
│       ├── 003_messages.sql             ← NOUVEAU
│       ├── 004_comments_likes.sql       ← NOUVEAU
│       └── 005_rls_policies.sql         ← NOUVEAU
│
└── app/
    └── types/
        └── database.ts                  ← GÉNÉRÉ (ne jamais éditer manuellement)
```

### Commandes Supabase CLI — ordre exact

```bash
# 1. Depuis la racine du repo
supabase init

# 2. Démarrer l'environnement local (Docker requis)
supabase start

# 3. Après avoir créé tous les fichiers de migration, appliquer
supabase db reset

# 4. Générer les types TypeScript
supabase gen types typescript --local > app/types/database.ts

# 5. Vérification TypeScript
cd app && npx tsc --noEmit
```

### `001_initial_schema.sql` — implémentation complète

```sql
-- Activer l'extension pgcrypto pour gen_random_uuid() si besoin
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

-- ─── Table vehicle_photos ──────────────────────────────────────────────────────
-- storage_path stocke le chemin brut Supabase Storage (ex: "vehicles/uuid/photo.jpg")
-- JAMAIS une URL complète — buildImageUrl() côté app reconstruit l'URL à l'affichage
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
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### `002_follows.sql`

```sql
CREATE TABLE follows (
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('vehicle', 'profile')),
  created_at  timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, target_id, target_type)
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
```

### `003_messages.sql`

```sql
CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE conversation_participants (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, profile_id)
);
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         text,
  image_url       text,
  created_at      timestamptz DEFAULT now(),
  CHECK (content IS NOT NULL OR image_url IS NOT NULL)
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### `004_comments_likes.sql`

```sql
-- Commentaires sur les véhicules (gap PRD comblé en architecture)
CREATE TABLE comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Likes polymorphiques (véhicule OU commentaire)
CREATE TABLE likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id   uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('vehicle', 'comment')),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (target_id, target_type, user_id)
);
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
```

### `005_rls_policies.sql` — politiques complètes

```sql
-- ─── profiles ─────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select_public"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"      ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"      ON profiles FOR UPDATE USING (auth.uid() = id);

-- ─── vehicles ─────────────────────────────────────────────────────────────────
CREATE POLICY "vehicles_select_published" ON vehicles FOR SELECT USING (is_published = true);
CREATE POLICY "vehicles_select_own"       ON vehicles FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "vehicles_insert_own"       ON vehicles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "vehicles_update_own"       ON vehicles FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "vehicles_delete_own"       ON vehicles FOR DELETE USING (auth.uid() = owner_id);

-- ─── vehicle_photos ───────────────────────────────────────────────────────────
CREATE POLICY "vehicle_photos_select_public" ON vehicle_photos FOR SELECT USING (true);
CREATE POLICY "vehicle_photos_insert_owner"  ON vehicle_photos FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND v.owner_id = auth.uid())
  );
CREATE POLICY "vehicle_photos_delete_owner"  ON vehicle_photos FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM vehicles v WHERE v.id = vehicle_id AND v.owner_id = auth.uid())
  );

-- ─── follows ──────────────────────────────────────────────────────────────────
CREATE POLICY "follows_select_public"  ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own"     ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own"     ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ─── conversations ────────────────────────────────────────────────────────────
CREATE POLICY "conversations_select_participant" ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = id AND cp.profile_id = auth.uid()
    )
  );
CREATE POLICY "conversations_insert_authenticated" ON conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─── conversation_participants ────────────────────────────────────────────────
CREATE POLICY "cp_select_participant" ON conversation_participants FOR SELECT
  USING (profile_id = auth.uid() OR EXISTS (
    SELECT 1 FROM conversation_participants cp2
    WHERE cp2.conversation_id = conversation_id AND cp2.profile_id = auth.uid()
  ));
CREATE POLICY "cp_insert_authenticated" ON conversation_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─── messages ─────────────────────────────────────────────────────────────────
CREATE POLICY "messages_select_participant" ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE profile_id = auth.uid()
    )
  );
CREATE POLICY "messages_insert_participant" ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE profile_id = auth.uid()
    )
  );

-- ─── comments ─────────────────────────────────────────────────────────────────
CREATE POLICY "comments_select_public"       ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_authenticated" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "comments_update_own"           ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own"           ON comments FOR DELETE USING (auth.uid() = user_id);

-- ─── likes ────────────────────────────────────────────────────────────────────
CREATE POLICY "likes_select_public"  ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own"     ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own"     ON likes FOR DELETE USING (auth.uid() = user_id);
```

### Point de vigilance : colonne `storage_path` vs `url`

Le PRD nomme la colonne `url` dans `vehicle_photos`. L'architecture impose cependant que **les chemins bruts Supabase Storage sont stockés en DB** (jamais les URLs transformées), et que `buildImageUrl()` est l'unique point de construction d'URL (NFR2, AR6). Pour éviter toute confusion future :

- La colonne s'appelle **`storage_path`** dans les migrations (nom explicite)
- `buildImageUrl(photo.storage_path, { width: 400, quality: 80 })` est appelé côté app
- Jamais `${SUPABASE_URL}/storage/v1/object/public/vehicles/${photo.storage_path}` directement

### `types/database.ts` — règles strictes

```typescript
// ✅ Utilisation correcte des types générés
import type { Database } from '@/types/database';
type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type InsertVehicle = Database['public']['Tables']['vehicles']['Insert'];

// ❌ Interdit — types inventés manuellement pour les entités DB
interface Vehicle { id: string; brand: string; ... }
```

Le fichier `app/types/database.ts` est régénéré après **chaque** modification de migration. Ne jamais éditer manuellement — tout changement sera écrasé à la prochaine génération.

### Gestion d'erreur du trigger handle_new_user()

Le trigger `SECURITY DEFINER` s'exécute avec les permissions du créateur (superuser). Si `email` est null (certains OAuth providers ne l'exposent pas), `SPLIT_PART` retourne une chaîne vide. Pour robustesse, ajouter un fallback :

```sql
COALESCE(NULLIF(SPLIT_PART(NEW.email, '@', 1), ''), 'user_' || LEFT(NEW.id::text, 8))
```

### Informations sur Supabase CLI local

Après `supabase start`, les services locaux tournent sur :
- **Studio** : `http://localhost:54323` — interface graphique pour inspecter les tables et tester les politiques RLS
- **API** : `http://localhost:54321`
- **DB** : `postgresql://postgres:postgres@localhost:54322/postgres`

Les credentials locaux (URL + anon key) sont affichés après `supabase start`. Créer `app/.env.local` avec ces valeurs pour le développement local (déjà dans `.gitignore`).

### Learnings de la Story 1.1

- `.env.example` ne peut pas être créé via le Write tool (restriction `*.env*`) — utiliser `echo` ou Bash si besoin
- `.gitignore` dans `app/` contient déjà `.env*.local` et `.env` — pas besoin de le modifier
- `app/` est la racine du projet React Native ; les commandes `npm` se lancent depuis `app/`, pas depuis la racine repo
- Les fichiers hors `app/` (`.github/`, `supabase/`) se créent depuis la racine du repo

### Project Structure Notes

- `supabase/` → racine du repo (`C:/Users/Alexandre.XOTIS/Documents/lab/Kara/supabase/`)
- `app/types/database.ts` → généré par CLI, chemin relatif à `app/`
- Ne pas confondre la racine du repo et `app/` — deux working directories distincts
- Conventions de nommage DB : `snake_case` pour tout (tables, colonnes)
- Conventions TS : types importés depuis `types/database.ts` uniquement pour les entités DB

### References

- Schéma DB : `docs/prd.md` — section 6 "Schéma de base de données"
- Trigger handle_new_user : `docs/prd.md` — section 7 "Authentification"
- Tables comments + likes (gap PRD) : `_bmad-output/planning-artifacts/architecture.md` — section "Data Architecture"
- RLS patterns : `_bmad-output/planning-artifacts/architecture.md` — section "Authentication & Security"
- AR2, AR3, AR8 : `_bmad-output/planning-artifacts/epics.md` — section "Additional Requirements"
- NFR4 : RLS obligatoire sur toutes les tables, testé avec user non-authentifié

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Docker Desktop installé (v29.2.0) mais daemon non démarré → `supabase start` impossible → types créés manuellement
- `npx supabase` (v2.95.5) utilisé à la place d'une installation globale
- `supabase init` exécuté via `npx supabase init` — crée `supabase/config.toml`
- `app/types/database.ts` créé manuellement (format identique au CLI) car Docker absent ; à regénérer via `supabase gen types typescript --local > app/types/database.ts` une fois Docker démarré
- `npx tsc --noEmit` depuis `app/` passe sans erreur ✅

### Completion Notes List

- `supabase/` initialisé via `npx supabase init` — `config.toml` généré ✅
- 5 fichiers de migration SQL créés dans `supabase/migrations/` ✅
- `001_initial_schema.sql` : tables profiles, vehicles, vehicle_photos + trigger `handle_new_user()` avec fallback email null via `COALESCE(NULLIF(...))` ✅
- `002_follows.sql` : table follows polymorphique (target_type CHECK 'vehicle'|'profile') ✅
- `003_messages.sql` : tables conversations, conversation_participants, messages avec CHECK (content OR image_url) ✅
- `004_comments_likes.sql` : tables comments et likes (gap PRD — AR2) avec UNIQUE sur likes ✅
- `005_rls_policies.sql` : toutes les politiques RLS + helper `is_conversation_participant()` SECURITY DEFINER pour éviter la récursion RLS sur conversation_participants ✅
- `app/types/database.ts` créé manuellement au format Supabase CLI — inclut helpers `Tables<>`, `TablesInsert<>`, `TablesUpdate<>` ✅
- `npx tsc --noEmit` passe ✅
- **ACTIONS MANUELLES REQUISES** (Docker Desktop non démarré) :
  1. Démarrer Docker Desktop
  2. `npx supabase start` (depuis racine repo)
  3. `npx supabase db reset` (applique toutes les migrations)
  4. `npx supabase gen types typescript --local > app/types/database.ts` (regénère les types)
  5. Vérifier dans Supabase Studio (localhost:54323) que RLS bloque les requêtes non-authentifiées

### File List

- supabase/config.toml (nouveau — généré par supabase init)
- supabase/migrations/001_initial_schema.sql (nouveau)
- supabase/migrations/002_follows.sql (nouveau)
- supabase/migrations/003_messages.sql (nouveau)
- supabase/migrations/004_comments_likes.sql (nouveau)
- supabase/migrations/005_rls_policies.sql (nouveau)
- app/types/database.ts (nouveau — généré par `supabase gen types typescript --local`)
