---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - docs/prd.md
workflowType: 'architecture'
project_name: 'Kara'
user_name: 'Alexandre'
date: '2026-04-27'
lastStep: 8
status: 'complete'
completedAt: '2026-04-27'
---

# Architecture Decision Document — Kara

_Ce document se construit de manière collaborative, étape par étape. Les sections sont ajoutées au fil des décisions architecturales._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (8 domaines) :**
- Auth & Onboarding : OAuth Apple/Google/email, trigger DB auto-création profil
- Feed Discover : scroll-snap vertical, FlatList paginée cursor-based, cards multi-photos
- Création véhicule : stepper 4 étapes, upload photos avec compression
- Search/Explorer : recherche full-text, catégories, géolocalisation
- Chat : messagerie directe temps réel (Supabase Realtime + RLS)
- Profils utilisateur & véhicule : cover, stats, grid, carousel
- Follow : abonnement profils + véhicules (table follows polymorphique)
- Likes & Commentaires : à formaliser (gaps dans le schéma)

**Non-Functional Requirements :**
- Performance : feed 60fps, images transformées < 500KB, pas de raw URL en affichage
- Sécurité : RLS sur toutes les tables, tokens via expo-secure-store, jamais AsyncStorage
- Compliance : Apple OAuth obligatoire pour App Store
- Mobile only : iOS + Android, portrait uniquement
- TypeScript strict : zéro `any` non documenté

**Scale & Complexity :**
- Domaine primaire : mobile fullstack
- Complexité : Medium-High
- Composants architecturaux estimés : ~12

### Technical Constraints & Dependencies

- Windows + Node 22 : chemins et metro.config.js sensibles
- Reanimated v3.16.7 : ne pas upgrader
- Tailwind v3.4.17 : incompatible avec NativeWind v4 si Tailwind v4
- Expo SDK 54 : contrainte de version sur tous les modules natifs
- Supabase Free tier : 1GB storage, 500MB DB, 2GB bandwidth

### Cross-Cutting Concerns Identified

1. **Auth context** — Routage conditionnel global, gestion session, token refresh
2. **Supabase client** — Instance singleton partagée, gestion des erreurs RLS
3. **Realtime subscriptions** — Lifecycle management strict (subscribe/unsubscribe)
4. **Image pipeline** — Compression → Upload → Transform URL (cross-feature)
5. **Types générés** — `types/database.ts` comme source de vérité unique
6. **Offline/Error states** — Stratégie réseau (non définie dans PRD)
7. **Deeplinks** — Scheme `kara://` pour OAuth redirect (non décrit dans PRD)

### Gaps à combler en architecture

- Table `comments` manquante dans le schéma DB
- Table `likes` manquante dans le schéma DB
- State management non défini (Zustand recommandé)
- Stratégie de pagination du feed (cursor vs offset)
- Deeplinks et scheme OAuth à documenter

## Starter Template Evaluation

### Primary Technology Domain

Mobile Application — React Native + Expo, basé sur l'analyse du projet existant.

### Starter Options Considered

Le projet étant déjà initialisé, l'évaluation porte sur le template de base effectivement utilisé.

| Option | Statut |
|---|---|
| `create-expo-app --template tabs` | ✅ Utilisé — groupe `(tabs)` + Expo Router |
| Ignite CLI | ❌ Écarté — opinionné sur la structure de state et trop de boilerplate |
| Expo + bare workflow | ❌ Écarté — perd les mises à jour OTA Expo Go |

### Selected Starter: create-expo-app (tabs template)

**Rationale :** Expo managed workflow + Expo Router donne le meilleur ratio productivité/contrôle pour un produit mobile BaaS-first. Le managed workflow maintient la compatibilité OTA et simplifie la CI.

**Initialization Command:**

```bash
npx create-expo-app@latest app --template tabs
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript strict — `expo/tsconfig.base` + `strict: true`, path alias `@/*` ajouté manuellement.

**Styling Solution:**
NativeWind v4 (`tailwindcss@3.4.17`) — Tailwind syntax en React Native. Contrainte de version critique : ne pas passer à Tailwind v4 (incompatible NativeWind v4).

**Build Tooling:**
Metro bundler (inclus Expo) + EAS Build pour les builds de production. Pas de Webpack.

**Testing Framework:**
Jest configuré par défaut via Expo. Tests à ajouter selon besoin (non prioritaires Phase 1).

**Code Organization:**
```
app/
  (auth)/       — écrans non-authentifiés (onboarding, login)
  (tabs)/       — navigation principale (index, search, post, chat, profile)
  vehicle/      — routes dynamiques ([id].tsx)
components/
  shared/       — KaraPhoto, KaraButton, KaraTag, KaraBadge, KaraAvatar, KaraWordmark
lib/            — supabase client, hooks, utils (à créer)
types/          — database.ts généré Supabase (à créer)
```

**Development Experience:**
Expo Go pour le développement local, hot reload natif, SafeAreaContext pour les insets iOS/Android.

**Note:** Le projet est déjà initialisé — la première story d'implémentation sera le wiring Supabase Auth, pas l'init du projet.

## Core Architectural Decisions

### Decision Priority Analysis

**Décisions critiques (bloquent l'implémentation) :**
- State management (server + client)
- Auth routing guard pattern
- Schéma DB complet (ajout comments + likes)

**Décisions importantes (structurent l'architecture) :**
- Image pipeline
- Feed pagination strategy
- OAuth deep link scheme

**Décisions différées (post-MVP) :**
- Support offline
- CI/CD EAS Submit (stores)
- Monitoring / analytics

### Data Architecture

**BaaS :** Supabase (PostgreSQL + PostgREST + Storage + Realtime)

**Schéma DB — tables supplémentaires à ajouter :**

```sql
-- Table manquante dans le PRD
create table comments (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);
alter table comments enable row level security;
-- RLS : lecture publique, écriture authentifiée, suppression propriétaire

create table likes (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null,
  target_type text not null check (target_type in ('vehicle', 'comment')),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(target_id, target_type, user_id)
);
alter table likes enable row level security;
```

**Pagination feed :** Cursor-based (keyset pagination) — obligatoire pour un feed avec insertions fréquentes. L'offset dérive dès qu'un post est ajouté entre deux pages.

```sql
SELECT * FROM vehicles
WHERE created_at < :cursor
ORDER BY created_at DESC
LIMIT 10
```

**Types générés :** `types/database.ts` via `supabase gen types typescript` — source de vérité unique, régénérer après chaque migration.

### Authentication & Security

**Provider :** Supabase Auth (OAuth Apple + Google + email/password)

**Token storage :** `expo-secure-store` — obligatoire, jamais `AsyncStorage`.

**Auth routing guard** — pattern Expo Router dans `app/_layout.tsx` :

```tsx
const { session, loading } = useAuthStore();
const segments = useSegments();

useEffect(() => {
  if (loading) return;
  const inAuth = segments[0] === '(auth)';
  if (!session && !inAuth) router.replace('/(auth)/onboarding');
  if (session && inAuth) router.replace('/(tabs)');
}, [session, loading]);
```

**Deep link OAuth** : scheme `kara://` configuré dans `app.json` → `{ "expo": { "scheme": "kara" } }`. URL de redirect Supabase : `kara://auth/callback`.

**RLS :** activé sur toutes les tables — aucune requête sans politique explicite.

### API & Communication Patterns

**Supabase PostgREST** pour toutes les requêtes CRUD — pas d'API custom Phase 1.

**Realtime** (chat) : Supabase Realtime Channels avec subscribe/unsubscribe strict dans les hooks React (cleanup dans useEffect return).

**Error handling :** Erreurs Supabase typées via `PostgrestError` — wrapper helper `lib/supabase-error.ts` qui mappe les codes PGRST vers des messages utilisateur français.

### Frontend Architecture

**Server state : TanStack Query** (`@tanstack/react-query`)
- Cache, retry, pagination, loading/error automatiques
- Invalidation ciblée après mutations (ex. : follow → invalider le profil)
- QueryClient singleton dans `lib/query-client.ts`

**Client/UI state : Zustand**
- Store `useAuthStore` : session, user, loading, setSession, signOut
- Store `usePostStore` : état du stepper création véhicule (step, données formulaire)
- Pas de store global pour le feed (TanStack Query suffit)

**Image pipeline :**
```
expo-image-picker
  → expo-image-manipulator (resize 1200px max, qualité 0.8, format JPEG)
  → supabase.storage.from('vehicles').upload()
  → getPublicUrl() + query params Supabase transform (?width=400&quality=80)
```

**Component architecture :** composants `shared/` réutilisables (déjà créés), écrans dans `app/`, hooks métier dans `lib/hooks/`.

### Infrastructure & Deployment

**Environnements :**
- Dev : Supabase CLI local + Expo Go
- Staging/Prod : Supabase cloud project

**Variables d'environnement :**
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```
`.env.local` ignoré git, `.env.example` documenté, secrets injectés via EAS Secrets pour les builds CI.

**Build :** EAS Build (`eas build --platform all`) pour les builds de distribution.

**CI :** GitHub Actions → lint + tsc + eas build preview sur PR. EAS Submit (stores) différé Phase 2.

### Decision Impact Analysis

**Séquence d'implémentation :**
1. Supabase Auth + routing guard (débloque tout le reste)
2. Types générés + client singleton
3. TanStack Query + Zustand stores
4. Feed (query cursor + FlatList)
5. Création véhicule (image pipeline + stepper)
6. Chat (Realtime)
7. Search (full-text PostgREST)

**Dépendances croisées :**
- Auth → toutes les requêtes RLS
- Types DB → TanStack Query hooks
- Image pipeline → Création véhicule + Photos profil
- Realtime → Chat uniquement (Phase 1)

## Implementation Patterns & Consistency Rules

### Naming Patterns

| Contexte | Convention | Exemple |
|---|---|---|
| Tables DB | `snake_case` | `vehicle_photos`, `conversation_participants` |
| Colonnes DB | `snake_case` | `user_id`, `created_at`, `is_deleted` |
| Variables TS | `camelCase` | `vehicleId`, `currentUser` |
| Fonctions TS | `camelCase` | `buildImageUrl()`, `handleSignOut()` |
| Types/Interfaces | `PascalCase` | `Vehicle`, `AuthStore`, `PhotoTone` |
| Composants | `PascalCase.tsx` | `KaraButton.tsx`, `VehicleCard.tsx` |
| Hooks/utils/stores | `kebab-case.ts` | `use-auth-store.ts`, `supabase-error.ts` |
| Constantes | `SCREAMING_SNAKE` | `MAX_PHOTO_SIZE`, `FEED_PAGE_SIZE` |
| TanStack Query keys | Tableau structuré | `['vehicles', { cursor }]`, `['vehicle', id]` |

**TanStack Query key structure — règle stricte :**
```ts
// ✅ Correct
['vehicles', { cursor: null, userId: undefined }]
['vehicle', vehicleId]
['profile', userId]
['comments', vehicleId]
['messages', conversationId]

// ❌ Interdit
['getVehicles']
['vehicle_detail']
```

### Structure Patterns

```
app/                          — routes Expo Router (écrans uniquement, zéro logique métier)
  (auth)/
    onboarding.tsx
    login.tsx
  (tabs)/
    index.tsx                 — Feed Discover
    search.tsx
    post.tsx
    chat.tsx
    profile.tsx
  vehicle/
    [id].tsx
components/
  shared/                     — composants réutilisables cross-features
  vehicle/                    — composants spécifiques aux véhicules
  chat/                       — composants spécifiques au chat
lib/
  supabase.ts                 — client singleton + buildImageUrl()
  query-client.ts             — QueryClient singleton
  supabase-error.ts           — mapper PostgrestError → message français
  stores/
    use-auth-store.ts
    use-post-store.ts
  hooks/
    use-vehicles.ts
    use-vehicle.ts
    use-profile.ts
    use-comments.ts
    use-messages.ts
types/
  database.ts                 — GÉNÉRÉ par supabase CLI, jamais édité manuellement
```

### Format Patterns

**Requêtes Supabase — toujours destructurer `{ data, error }`, ne jamais throw :**
```ts
// ✅ Correct
const { data, error } = await supabase.from('vehicles').select('*');
if (error) return handleSupabaseError(error);

// ❌ Interdit
const data = await supabase.from('vehicles').select('*').throwOnError();
```

**URLs d'images — toujours passer par `buildImageUrl()` :**
```ts
// ✅ Correct
const url = buildImageUrl(photo.path, { width: 400, quality: 80 });

// ❌ Interdit
const url = `${SUPABASE_URL}/storage/v1/object/public/vehicles/${photo.path}`;
```

**Dates :** ISO 8601 string depuis Supabase, formatage uniquement côté affichage. Ne jamais stocker un timestamp formaté.

### Communication Patterns

**Zustand — sélecteurs granulaires, jamais le store entier :**
```ts
// ✅ Correct
const session = useAuthStore((s) => s.session);
const signOut = useAuthStore((s) => s.signOut);

// ❌ Interdit — re-render sur tout changement de store
const store = useAuthStore();
```

**Realtime Supabase — cleanup obligatoire dans useEffect :**
```ts
useEffect(() => {
  const channel = supabase.channel('messages').on(...).subscribe();
  return () => { supabase.removeChannel(channel); };
}, []);
```

**TanStack Query — invalider après mutation :**
```ts
queryClient.invalidateQueries({ queryKey: ['profile', userId] });
queryClient.invalidateQueries({ queryKey: ['vehicles', { cursor: null }] });
```

### Process Patterns

**Gestion des erreurs :**
- Erreurs Supabase → toujours via `handleSupabaseError(error)` → message français → Toast
- Ne jamais exposer les messages d'erreur PGRST bruts à l'utilisateur
- Erreurs réseau → message générique "Problème de connexion, réessaie plus tard"

**États de chargement :**
- Données serveur → états TanStack Query (`isLoading`, `isFetching`, `isError`)
- UI local uniquement → `useState` (ex: animation bouton, focus input)
- Jamais de `isLoading` useState pour des requêtes Supabase

**Validation :**
- Client : zod ou validation manuelle pour l'UX immédiate
- Serveur : contraintes DB (NOT NULL, CHECK, UNIQUE) + RLS — source de vérité

### Enforcement Guidelines

**Tous les agents DOIVENT :**
- Utiliser `buildImageUrl()` pour toute URL de photo — jamais de concaténation brute
- Destructurer `{ data, error }` sur toutes les requêtes Supabase
- Passer par `handleSupabaseError()` avant tout affichage d'erreur
- Utiliser les types de `types/database.ts` pour toutes les entités DB
- Implémenter le cleanup Realtime dans le return du useEffect
- Suivre la structure de clé TanStack Query définie

**Anti-patterns à proscrire :**
- `AsyncStorage` pour les tokens (→ `expo-secure-store`)
- URLs Supabase Storage construites manuellement
- Store Zustand consommé sans sélecteur
- `throwOnError()` sur les requêtes Supabase
- Types `any` non documentés

## Project Structure & Boundaries

### Complete Project Directory Structure

```
Kara/
├── app/                              ← projet React Native/Expo
│   ├── .env.example
│   ├── app.json                      ← scheme: "kara" pour OAuth deep links
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── babel.config.js
│   ├── metro.config.js
│   │
│   ├── app/                          ← routes Expo Router
│   │   ├── _layout.tsx               ← root layout : QueryClientProvider + auth guard
│   │   ├── index.tsx                 ← Redirect → /(auth)/onboarding
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── onboarding.tsx
│   │   │   └── login.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx           ← tab bar config
│   │   │   ├── index.tsx             ← Feed Discover (FlatList cursor)
│   │   │   ├── search.tsx
│   │   │   ├── post.tsx              ← Stepper création véhicule
│   │   │   ├── chat.tsx              ← Liste conversations + ConversationScreen
│   │   │   └── profile.tsx
│   │   └── vehicle/
│   │       └── [id].tsx              ← Détail véhicule
│   │
│   ├── components/
│   │   ├── shared/                   ← cross-features, déjà créés
│   │   │   ├── KaraPhoto.tsx
│   │   │   ├── KaraButton.tsx
│   │   │   ├── KaraTag.tsx
│   │   │   ├── KaraBadge.tsx
│   │   │   ├── KaraAvatar.tsx
│   │   │   └── KaraWordmark.tsx
│   │   ├── vehicle/
│   │   │   ├── VehicleCard.tsx       ← card feed (extrait depuis index.tsx)
│   │   │   ├── VehicleSpecGrid.tsx
│   │   │   └── VehiclePhotoCarousel.tsx
│   │   ├── chat/
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ConversationItem.tsx
│   │   └── profile/
│   │       ├── ProfileGrid.tsx
│   │       └── OwnerCard.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts               ← client singleton + buildImageUrl()
│   │   ├── query-client.ts           ← QueryClient singleton
│   │   ├── supabase-error.ts         ← mapper PostgrestError → FR
│   │   ├── stores/
│   │   │   ├── use-auth-store.ts     ← session, user, setSession, signOut
│   │   │   └── use-post-store.ts     ← état stepper création véhicule
│   │   └── hooks/
│   │       ├── use-vehicles.ts       ← feed paginé cursor-based
│   │       ├── use-vehicle.ts        ← détail + mutation follow
│   │       ├── use-profile.ts        ← profil + stats + grid
│   │       ├── use-comments.ts       ← liste + mutation add comment
│   │       ├── use-messages.ts       ← messages Realtime (subscribe/unsubscribe)
│   │       ├── use-conversations.ts  ← liste conversations
│   │       ├── use-follow.ts         ← follow/unfollow profil ou véhicule
│   │       ├── use-search.ts         ← full-text PostgREST
│   │       └── use-create-vehicle.ts ← mutation stepper + image pipeline
│   │
│   └── types/
│       └── database.ts               ← GÉNÉRÉ — supabase gen types typescript
│
├── supabase/                         ← projet Supabase local (CLI)
│   ├── config.toml
│   └── migrations/
│       ├── 001_initial_schema.sql    ← profiles, vehicles, vehicle_photos…
│       ├── 002_follows.sql
│       ├── 003_messages.sql
│       ├── 004_comments_likes.sql    ← tables ajoutées (gap PRD)
│       └── 005_rls_policies.sql
│
├── .github/
│   └── workflows/
│       └── ci.yml                    ← lint + tsc + eas build preview
│
└── docs/
    └── prd.md
```

### Architectural Boundaries

**Frontière Auth** — `app/_layout.tsx` uniquement. Aucun écran ne vérifie `session` directement.

**Frontière Data** — Les écrans (`app/`) n'importent jamais `supabase` directement. Toujours via `lib/hooks/*`. Seuls les hooks connaissent TanStack Query et Supabase.

**Frontière Storage** — `buildImageUrl()` dans `lib/supabase.ts` est le seul endroit qui construit des URLs de photos. Aucun autre fichier ne concatène manuellement des chemins Supabase Storage.

**Frontière Realtime** — `lib/hooks/use-messages.ts` est le seul hook qui crée des channels Supabase Realtime. Il gère l'abonnement et le cleanup.

**Frontière Types** — `types/database.ts` est la source de vérité pour toutes les entités DB. Les composants et hooks n'inventent pas de types locaux pour les entités existantes.

### Requirements to Structure Mapping

| Domaine | Écran | Hook(s) | Store |
|---|---|---|---|
| Auth | `(auth)/login.tsx` | — | `use-auth-store.ts` |
| Feed | `(tabs)/index.tsx` | `use-vehicles.ts` | — |
| Création véhicule | `(tabs)/post.tsx` | `use-create-vehicle.ts` | `use-post-store.ts` |
| Search | `(tabs)/search.tsx` | `use-search.ts` | — |
| Chat | `(tabs)/chat.tsx` | `use-messages.ts`, `use-conversations.ts` | — |
| Profil | `(tabs)/profile.tsx` | `use-profile.ts`, `use-follow.ts` | — |
| Détail véhicule | `vehicle/[id].tsx` | `use-vehicle.ts`, `use-comments.ts` | — |

### Data Flow

```
Écran → hook TanStack Query → lib/supabase.ts → Supabase API (PostgREST / Realtime)
Écran → store Zustand → lib/supabase.ts (pour les mutations auth)
Image pipeline → expo-image-picker → expo-image-manipulator → supabase.storage → buildImageUrl()
```

### External Integrations

- **Supabase Auth** : OAuth Apple + Google via `supabase.auth.signInWithOAuth()`, redirect `kara://auth/callback`
- **Supabase Storage** : bucket `vehicles` (photos véhicules), bucket `avatars` (photos profil)
- **Supabase Realtime** : channel `messages:{conversationId}` pour le chat temps réel
- **EAS Build** : CI GitHub Actions → preview builds sur PR

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité des décisions :**
Toutes les décisions technologiques sont compatibles. Les contraintes de version critiques sont documentées (NativeWind v4 + Tailwind v3.4.17, Reanimated v3.16.7 gelé). Zustand et TanStack Query ont des rôles distincts et complémentaires sans chevauchement.

**Consistance des patterns :**
Naming conventions cohérentes sur les trois couches (DB snake_case / TS camelCase / composants PascalCase). Les quatre frontières architecturales (Auth, Data, Storage, Realtime) sont clairement définies et ne se chevauchent pas.

**Alignement structure :**
La structure `lib/hooks/*` enforce la frontière data. `lib/supabase.ts` centralise la frontière Storage. `app/_layout.tsx` est l'unique gardien de la frontière Auth. `types/database.ts` est la source de vérité types.

### Requirements Coverage Validation ✅

**Couverture fonctionnelle :**

| Domaine | Statut |
|---|---|
| Auth & Onboarding | ✅ `(auth)/` + `use-auth-store.ts` + scheme `kara://` |
| Feed Discover | ✅ `use-vehicles.ts` cursor-based + FlatList |
| Création véhicule | ✅ `use-create-vehicle.ts` + image pipeline |
| Search | ✅ `use-search.ts` PostgREST full-text |
| Chat temps réel | ✅ `use-messages.ts` Realtime + cleanup |
| Profils | ✅ `use-profile.ts` + `use-follow.ts` |
| Follow | ✅ table `follows` polymorphique + hook |
| Likes & Commentaires | ✅ tables `comments` + `likes` ajoutées (gap PRD résolu) |

**Couverture NFR :**
- Performance 60fps → image transform `buildImageUrl()`, FlatList optimisée ✅
- Sécurité → RLS + expo-secure-store + tokens jamais loggés ✅
- Apple OAuth obligatoire → scheme `kara://` + `app.json` ✅
- TypeScript strict → `tsconfig.json` ✅

### Gap Analysis Results

**Gaps critiques : aucun**

**Gaps importants (à traiter en début d'implémentation) :**

| Gap | Impact | Résolution |
|---|---|---|
| Toast library non définie | Moyen | Choisir `react-native-toast-message` en Story Auth |
| `app.json` scheme `kara://` non encore configuré | Moyen | Ajouter avant la Story Auth |
| Deep link callback handler dans `_layout.tsx` | Moyen | Prévoir dans la Story Auth |

**Gaps nice-to-have (post-MVP) :**
- Pagination des commentaires (scroll infini)
- Compteur follows côté DB (trigger vs COUNT)
- Stratégie push notifications

### Architecture Completeness Checklist

- [x] Contexte projet analysé, scale et complexité évalués
- [x] Contraintes techniques identifiées et documentées
- [x] Concerns cross-cutting mappés
- [x] Starter template évalué et décisions documentées
- [x] Décisions critiques documentées avec versions
- [x] Stack technologique complet spécifié
- [x] Patterns d'implémentation définis avec exemples
- [x] Conventions de nommage établies
- [x] Structure de projet complète et spécifique
- [x] Frontières des composants établies
- [x] Points d'intégration mappés
- [x] Mapping requirements → structure complet
- [x] Gaps identifiés et priorisés

### Architecture Readiness Assessment

**Statut global : PRÊT POUR L'IMPLÉMENTATION**

**Niveau de confiance : Élevé**

**Points forts :**
- Frontières architecturales claires prévenant les conflits entre agents
- Patterns enforçables avec exemples concrets et anti-patterns documentés
- Gaps du PRD (tables `comments`, `likes`) résolus avant implémentation
- Séquence d'implémentation logique et sans dépendance cyclique

**Premier step d'implémentation :**
Supabase Auth wiring + routing guard dans `app/_layout.tsx`
