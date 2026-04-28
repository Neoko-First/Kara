---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - docs/prd.md
  - _bmad-output/planning-artifacts/architecture.md
project_name: Kara
status: complete
completedAt: '2026-04-28'
---

# Kara - Epic Breakdown

## Overview

Ce document fournit la décomposition complète en epics et stories pour Kara, décomposant les exigences du PRD et de l'Architecture en stories implémentables.

## Requirements Inventory

### Functional Requirements

FR1: L'utilisateur peut créer un compte via Google OAuth, Apple OAuth ou email/password
FR2: Un profil est automatiquement créé dans la table `profiles` après authentification via trigger PostgreSQL (username provisoire = partie locale de l'email, display_name et avatar depuis OAuth metadata)
FR3: L'utilisateur voit 3 slides d'onboarding avec navigation par dots + bouton flèche, bouton "Passer" en haut à droite sur chaque slide, bouton "Commencer" sur la dernière slide
FR4: L'écran de login affiche : logo Kara centré, bouton "Continuer avec Apple" (filled blanc), bouton "Continuer avec Google" (outlined), lien "Continuer avec email", footer CGU + confidentialité
FR5: L'utilisateur peut créer un véhicule via un stepper 4 étapes : Étape 1 Photos (1–10 photos, drag & drop pour réordonner), Étape 2 Type & Caractéristiques (type grid 2×3, marque/modèle/année/cylindrée/puissance), Étape 3 Description & Tags (300 chars max, suggestions tags), Étape 4 Localisation (carte, ville, toggle position précise, aperçu final)
FR6: L'utilisateur peut uploader de 1 à 10 photos par véhicule ; la première est la photo de couverture ; drag & drop pour réordonner ; compteur visible
FR7: Le système compresse les images côté client avant upload (cible < 500KB, JPEG qualité 0.8, resize 1200px max) via expo-image-manipulator
FR8: Le feed Discover affiche les véhicules en scroll vertical scroll-snap (une card par snap, style TikTok)
FR9: Chaque card véhicule dans le feed affiche : photo plein fond + carousel photos interne, indicateur photos (badge pays + numéro), badge type véhicule, actions à droite (like · commentaire · save · share + compteur abonnés), gradient bas avec overlay infos (avatar, @pseudo, localisation, nom véhicule bold, specs caps, tags scrollables), boutons "Suivre" et message
FR10: L'utilisateur peut suivre un profil ou un véhicule ; le bouton "Suivre" devient "Suivi" après action
FR11: L'écran Search affiche : barre de recherche sticky avec bouton filtres, grille catégories 2×3 (Voitures, Motos, Vans, Camions, Vélos, Classics avec compteurs), section Tendances (tags horizontaux scrollables), section "Près de toi" (cards compactes scroll horizontal)
FR12: L'utilisateur peut rechercher par marque, modèle ou #tag ; les résultats s'affichent en liste de cards compactes (photo + specs + pseudo + localisation)
FR13: L'utilisateur peut envoyer et recevoir des messages texte et images en temps réel via Supabase Realtime
FR14: La liste des conversations affiche : avatar véhicule (photo de la voiture), @pseudo, modèle véhicule, extrait dernier message, timestamp, badge non-lu violet
FR15: L'écran de conversation affiche : bulles envoyées (violet, droite) / reçues (surface, gauche), timestamp sous chaque bulle, indicateur "typing" (trois points animés), input avec icône image + champ texte + bouton envoi
FR16: Le profil utilisateur (le mien) affiche : cover = meilleure photo véhicule, avatar circulaire, bouton "Modifier", nom/pseudo/localisation/bio/tags, compteurs (VÉHICULES · ABONNÉS · ABONNEMENTS), tabs Véhicules/Favoris, grid 3 colonnes, bouton settings
FR17: L'utilisateur peut modifier son profil (avatar, display name, bio, tags, localisation)
FR18: Le profil d'un autre utilisateur affiche la même structure mais avec bouton "Suivre" à la place de "Modifier" et menu ··· (signaler, bloquer)
FR19: Le profil véhicule (détail) affiche : carousel photos (hauteur ~50% écran), badge type + badge pays, nom véhicule bold, specs caps, tags scrollables, description, grille specs détaillées (Année/Cylindrée/Puissance/Couple/Transmission/Poids), mini-card propriétaire, bouton "Suivre ce véhicule" sticky
FR20: L'utilisateur peut liker un véhicule ou un commentaire (table `likes` polymorphique)
FR21: L'utilisateur peut commenter un véhicule (table `comments`)
FR22: L'utilisateur peut enregistrer (bookmark/save) un véhicule dans ses favoris
FR23: L'utilisateur peut partager un véhicule (share native)

### NonFunctional Requirements

NFR1: Performance — le feed doit s'afficher à 60fps sur iOS et Android ; FlatList optimisée avec `getItemLayout` et `keyExtractor`
NFR2: Images — jamais afficher l'URL originale Supabase Storage dans le feed ; toujours passer par `buildImageUrl()` avec paramètres de transformation (width, quality)
NFR3: Sécurité tokens — les tokens d'authentification sont stockés via `expo-secure-store`, jamais `AsyncStorage`
NFR4: Base de données — RLS activé sur toutes les tables ; aucune table sans politique explicite ; les politiques sont testées avec un utilisateur non-authentifié
NFR5: Compatibilité — iOS + Android, portrait uniquement, Expo SDK 54
NFR6: TypeScript — mode strict, zéro `any` non documenté, types issus de `types/database.ts` générés
NFR7: Conformité App Store — Apple OAuth obligatoire pour la soumission iOS
NFR8: Secrets — `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` uniquement via variables d'environnement ; jamais hardcodés ; `.env` ignoré par git
NFR9: Erreurs — toutes les erreurs Supabase (`PostgrestError`) passent par `handleSupabaseError()` avant affichage ; jamais de message PGRST brut à l'utilisateur

### Additional Requirements

- AR1: Configurer le scheme OAuth deep link `kara://` dans `app.json` (`expo.scheme`) et le handler callback dans `app/_layout.tsx` avant toute implémentation Auth
- AR2: Créer la migration `004_comments_likes.sql` avec les tables `comments` et `likes` (absentes du schéma PRD, gap comblé en architecture) avec RLS complet
- AR3: Créer les 5 migrations SQL dans l'ordre : `001_initial_schema.sql`, `002_follows.sql`, `003_messages.sql`, `004_comments_likes.sql`, `005_rls_policies.sql`
- AR4: Implémenter TanStack Query (`@tanstack/react-query`) comme couche server state : `QueryClient` singleton dans `lib/query-client.ts`, `QueryClientProvider` dans `app/_layout.tsx`
- AR5: Implémenter Zustand pour le client state : `useAuthStore` (session, user, setSession, signOut) et `usePostStore` (état stepper création véhicule)
- AR6: `buildImageUrl()` dans `lib/supabase.ts` est l'unique point de construction d'URL photos ; aucun autre fichier ne concatène manuellement des chemins Supabase Storage
- AR7: Créer `lib/supabase-error.ts` qui mappe les codes `PostgrestError` vers des messages utilisateur en français
- AR8: Générer `types/database.ts` via `supabase gen types typescript` après chaque migration ; ne jamais éditer ce fichier manuellement
- AR9: L'auth routing guard réside uniquement dans `app/_layout.tsx` ; aucun écran ne vérifie `session` directement
- AR10: Pagination cursor-based pour le feed (keyset pagination sur `created_at`) ; query key : `['vehicles', { cursor }]`
- AR11: Choisir et installer `react-native-toast-message` pour les notifications utilisateur (feedback mutations, erreurs)
- AR12: Configurer GitHub Actions CI : lint + tsc + `eas build --platform all --profile preview` sur PR
- AR13: Contraintes de versions à ne jamais changer : Reanimated v3.16.7, Tailwind v3.4.17, Expo SDK 54 ; `.npmrc` avec `legacy-peer-deps=true` obligatoire
- AR14: Image pipeline : `expo-image-picker` → `expo-image-manipulator` (resize 1200px, qualité 0.8, JPEG) → `supabase.storage.from('vehicles').upload()` → `getPublicUrl()` + query params transform

### UX Design Requirements

Aucun document UX Design séparé — les spécifications visuelles et d'interaction sont intégrées dans le PRD (section 4 Design System + section 5 Écrans & Fonctionnalités). Les exigences UX pertinentes sont :

- UX-DR1: Design System tokens NativeWind obligatoires (`kara-primary`, `kara-accent`, `kara-bg`, `kara-surface`, `kara-border`, `kara-danger`, `kara-textDark`, `kara-muted`) — aucune couleur hardcodée dans les composants
- UX-DR2: Typographie — `font-display` (SpaceGrotesk 700 Bold) pour les titres véhicules, `font-body` (Inter 400) pour le corps, `font-bodyMedium` (Inter 500) pour labels/boutons, `font-bodySemiBold` (Inter 600) pour tags caps
- UX-DR3: Border radius standard Kara : `rounded-2xl` (24px) pour les cards véhicules ; `rounded-lg` (16px) pour les modals/inputs
- UX-DR4: Effets visuels — glassmorphism sur les overlays (backdrop-blur + bg opacity), gradient noir transparent → opaque sur les cards, shadow colorée `shadow-purple-500/30` sur éléments actifs
- UX-DR5: Feed card — carousel photos horizontal interne à la card (swipe), badge pays+numéro `JP · 1/6`, badge type en haut à gauche, actions TikTok-style à droite, overlay infos avec gradient bas
- UX-DR6: Composants shared existants déjà créés (`KaraPhoto`, `KaraButton`, `KaraTag`, `KaraBadge`, `KaraAvatar`, `KaraWordmark`) — les réutiliser systématiquement
- UX-DR7: Chat — avatar de la conversation = photo principale du véhicule de l'interlocuteur (pas l'avatar user)
- UX-DR8: Onboarding — Slide 1 fond violet-dusk, Slide 2 fond track-magenta, Slide 3 fond amber (teaser Events & Marketplace)

### FR Coverage Map

FR1: Epic 1 — OAuth Apple/Google/email
FR2: Epic 1 — Trigger création profil automatique
FR3: Epic 1 — Slides onboarding
FR4: Epic 1 — Écran login
FR5: Epic 3 — Stepper 4 étapes création véhicule
FR6: Epic 3 — Upload 1–10 photos drag & drop
FR7: Epic 3 — Compression images < 500KB
FR8: Epic 2 — Feed scroll-snap vertical
FR9: Epic 2 — Card véhicule carousel + overlay + actions
FR10: Epic 4 — Système follow profil/véhicule
FR11: Epic 6 — Catégories, trending, "près de toi"
FR12: Epic 6 — Recherche marque/modèle/tag
FR13: Epic 7 — Messagerie temps réel Supabase Realtime
FR14: Epic 7 — Liste conversations avec avatar véhicule
FR15: Epic 7 — Conversation : bulles, typing, input
FR16: Epic 4 — Mon profil (affichage)
FR17: Epic 4 — Modification profil
FR18: Epic 4 — Profil d'un autre utilisateur
FR19: Epic 4 — Profil véhicule (détail)
FR20: Epic 5 — Likes véhicule/commentaire
FR21: Epic 5 — Commentaires sur véhicule
FR22: Epic 5 — Bookmarks/favoris
FR23: Epic 5 — Partage natif

## Epic List

### Epic 1: Foundation & Authentification
L'utilisateur peut s'inscrire et se connecter (Apple OAuth, Google OAuth, email). Son profil est créé automatiquement. L'infrastructure complète (BDD, types, state management, CI) est opérationnelle.
**FRs couverts :** FR1, FR2, FR3, FR4
**ARs couverts :** AR1, AR2, AR3, AR4, AR5, AR6, AR7, AR8, AR9, AR12, AR13

### Epic 2: Feed Discover
L'utilisateur connecté peut parcourir les builds des passionnés via le feed scroll-snap vertical, voir les détails de chaque véhicule (carousel, specs, tags) et interagir avec les boutons d'action.
**FRs couverts :** FR8, FR9
**ARs couverts :** AR10

### Epic 3: Création de véhicule
L'utilisateur peut publier son propre build via le stepper 4 étapes (photos, specs, tags, localisation) avec compression automatique des images avant upload.
**FRs couverts :** FR5, FR6, FR7
**ARs couverts :** AR14

### Epic 4: Profils & Follow
L'utilisateur peut consulter son profil et celui des autres, modifier ses informations, voir la page détail d'un véhicule, et suivre des profils ou des véhicules.
**FRs couverts :** FR10, FR16, FR17, FR18, FR19

### Epic 5: Interactions sociales
L'utilisateur peut interagir avec les builds (liker, commenter, enregistrer en favoris, partager).
**FRs couverts :** FR20, FR21, FR22, FR23
**ARs couverts :** AR2

### Epic 6: Search & Explorer
L'utilisateur peut rechercher et découvrir des builds par marque, modèle, tag, catégorie ou proximité géographique.
**FRs couverts :** FR11, FR12

### Epic 7: Chat & Messagerie
L'utilisateur peut contacter directement d'autres passionnés par messagerie temps réel avec images.
**FRs couverts :** FR13, FR14, FR15

---

## Epic 1: Foundation & Authentification

L'utilisateur peut s'inscrire et se connecter (Apple OAuth, Google OAuth, email). Son profil est créé automatiquement. L'infrastructure complète (BDD, types, state management, CI) est opérationnelle.

### Story 1.1: Setup infrastructure & configuration de base

As a développeur,
I want que l'infrastructure technique de base soit configurée (Supabase client, state management, error handling, CI),
So that toutes les features suivantes peuvent s'appuyer sur des fondations solides et cohérentes.

**Acceptance Criteria:**

**Given** le projet Expo existant
**When** la story est implémentée
**Then** `app.json` contient `expo.scheme = "kara"` pour les deep links OAuth
**And** `.env.example` documente `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` ; `.env.local` est dans `.gitignore`
**And** `lib/supabase.ts` exporte le client singleton Supabase et la fonction `buildImageUrl(path, opts)` qui construit les URLs de transformation
**And** `lib/supabase-error.ts` exporte `handleSupabaseError(error: PostgrestError): string` qui retourne un message utilisateur en français
**And** `lib/query-client.ts` exporte un `QueryClient` singleton ; `QueryClientProvider` est configuré dans `app/_layout.tsx`
**And** `react-native-toast-message` est installé et le `<Toast />` est rendu dans le layout racine
**And** `lib/stores/use-auth-store.ts` (Zustand) exporte `useAuthStore` avec `{ session, user, loading, setSession, signOut }`
**And** `lib/stores/use-post-store.ts` (Zustand) exporte `usePostStore` avec la structure initiale des 4 étapes du stepper (données vides)
**And** le workflow GitHub Actions `.github/workflows/ci.yml` lance `npm run lint`, `tsc --noEmit` et `eas build --platform all --profile preview` sur chaque PR
**And** `npm run build` passe sans erreur TypeScript

### Story 1.2: Schéma de base de données & migrations Supabase

As a développeur,
I want que le schéma de base de données complet soit créé via les migrations Supabase CLI,
So that toutes les features peuvent persister leurs données avec les politiques RLS appropriées.

**Acceptance Criteria:**

**Given** le projet Supabase CLI initialisé (`supabase/config.toml`)
**When** `supabase db push` est exécuté
**Then** les 5 migrations s'appliquent dans l'ordre : `001_initial_schema.sql` (profiles, vehicles, vehicle_photos), `002_follows.sql`, `003_messages.sql` (conversations, conversation_participants, messages), `004_comments_likes.sql` (comments, likes), `005_rls_policies.sql`
**And** le trigger `handle_new_user()` crée automatiquement un profil dans `profiles` à chaque insertion dans `auth.users`
**And** RLS est activé sur toutes les tables ; les politiques sont définies dans `005_rls_policies.sql`
**And** `types/database.ts` est généré via `supabase gen types typescript --local` et reflète le schéma complet
**And** un utilisateur non-authentifié ne peut pas lire ni écrire sur les tables protégées (testé manuellement avec Supabase Studio)
**And** `npm run build` passe sans erreur TypeScript sur les types générés

### Story 1.3: Écran Onboarding (3 slides)

As a nouvel utilisateur,
I want voir 3 slides d'introduction à Kara avant de m'inscrire,
So that je comprends la valeur du produit avant de créer mon compte.

**Acceptance Criteria:**

**Given** l'utilisateur n'est pas connecté et ouvre l'app pour la première fois
**When** l'app démarre
**Then** `app/(auth)/onboarding.tsx` s'affiche avec les 3 slides en scroll horizontal paginé
**And** Slide 1 "Trouve ta communauté" a un fond violet-dusk, Slide 2 "Échange avec les passionnés" a un fond track-magenta, Slide 3 "Events & Marketplace" a un fond amber
**And** des dots indicateurs en bas reflètent la slide active
**And** un bouton flèche → permet de passer à la slide suivante
**And** un bouton "Passer" (texte, haut droite) est présent sur les slides 1 et 2
**And** la slide 3 affiche un bouton "Commencer" qui navigue vers `/(auth)/login`
**And** "Passer" sur n'importe quelle slide navigue directement vers `/(auth)/login`
**And** les composants `KaraButton`, `KaraWordmark` issus de `components/shared/` sont utilisés

### Story 1.4: Authentification OAuth & routing guard

As a utilisateur,
I want me connecter avec Apple, Google ou mon email,
So that j'accède à mon espace personnel sur Kara.

**Acceptance Criteria:**

**Given** l'écran de login `app/(auth)/login.tsx`
**When** l'écran s'affiche
**Then** le logo Kara (`KaraWordmark`) est centré, suivi du bouton "Continuer avec Apple" (fond blanc), du bouton "Continuer avec Google" (outlined), du lien "Continuer avec email", et du footer CGU + confidentialité

**Given** l'utilisateur appuie sur "Continuer avec Apple" ou "Continuer avec Google"
**When** le flux OAuth Supabase se lance
**Then** `supabase.auth.signInWithOAuth()` est appelé avec `redirectTo: "kara://auth/callback"`
**And** le token de session est stocké via `expo-secure-store` (jamais `AsyncStorage`)
**And** après succès, `useAuthStore.setSession()` met à jour le store et le guard redirige vers `/(tabs)`

**Given** l'app se charge avec un utilisateur déjà connecté
**When** le routing guard dans `app/_layout.tsx` s'exécute
**Then** si `session` est null et l'utilisateur n'est pas dans `(auth)`, il est redirigé vers `/(auth)/onboarding`
**And** si `session` est défini et l'utilisateur est dans `(auth)`, il est redirigé vers `/(tabs)`
**And** aucun écran autre que `_layout.tsx` ne lit `session` directement

**Given** l'authentification échoue (réseau, OAuth annulé)
**When** l'erreur est capturée
**Then** `handleSupabaseError()` est appelé et un toast d'erreur en français s'affiche

---

## Epic 2: Feed Discover

L'utilisateur connecté peut parcourir les builds des passionnés via le feed scroll-snap vertical, voir les détails de chaque véhicule (carousel, specs, tags) et interagir avec les boutons d'action.

### Story 2.1: Feed Discover — structure scroll-snap & données paginées

As a utilisateur connecté,
I want parcourir un feed de véhicules en scrollant verticalement,
So that je découvre les builds de la communauté de manière fluide et immersive.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté et arrive sur l'onglet Discover `app/(tabs)/index.tsx`
**When** le feed se charge
**Then** `lib/hooks/use-vehicles.ts` utilise TanStack Query avec la query key `['vehicles', { cursor }]` pour charger les véhicules (cursor-based, `created_at < :cursor`, LIMIT 10)
**And** une `FlatList` avec `pagingEnabled`, `snapToAlignment="start"` et `decelerationRate="fast"` affiche une card par snap (hauteur = hauteur écran)
**And** les props `getItemLayout`, `keyExtractor`, `removeClippedSubviews` sont définies pour les performances (NFR1 : 60fps)
**And** en fin de liste, `onEndReached` déclenche le chargement de la page suivante avec le cursor mis à jour
**And** un skeleton de chargement s'affiche pendant le fetch initial
**And** si la requête échoue, `handleSupabaseError()` est appelé et un toast d'erreur s'affiche
**And** le header affiche le logo Kara (`KaraWordmark`) à gauche et les icônes cloche + filtres à droite

### Story 2.2: VehicleCard — visuel complet avec carousel interne

As a utilisateur,
I want voir les détails visuels complets d'un véhicule dans le feed,
So that je peux d'un coup d'œil apprécier le build et ses specs.

**Acceptance Criteria:**

**Given** une card véhicule dans le feed
**When** elle s'affiche
**Then** le composant `components/vehicle/VehicleCard.tsx` est rendu avec une hauteur `~75%` de l'écran
**And** `components/vehicle/VehiclePhotoCarousel.tsx` gère le carousel horizontal interne (swipe pour photos suivantes) via `FlatList` horizontal ; les URLs de photos passent toutes par `buildImageUrl()` (jamais l'URL originale — NFR2)
**And** un badge `[🚗 Voiture]` (ou autre type) s'affiche en haut à gauche via `KaraBadge`
**And** l'indicateur de photo `JP · 1/6` (badge pays + numéro) est visible
**And** un gradient noir transparent → opaque couvre le bas de la card (UX-DR4)
**And** l'overlay bas affiche : avatar (`KaraAvatar`) + @pseudo + localisation, nom du véhicule (`font-display`, bold), specs en caps `SR20DET · 280CH · RWD`, tags scrollables (`KaraTag`)
**And** la colonne d'actions droite (style TikTok) contient les icônes ❤️ · 💬 · 🔖 · 📤 avec compteurs et les boutons "Suivre" + message — tous visuels uniquement, sans logique métier dans cet epic
**And** toutes les couleurs utilisent les tokens `kara-*` NativeWind, aucune couleur hardcodée (UX-DR1)

---

## Epic 3: Création de véhicule

L'utilisateur peut publier son propre build via le stepper 4 étapes (photos, specs, tags, localisation) avec compression automatique des images avant upload.

### Story 3.1: Stepper création véhicule — Étape 1 Photos

As a utilisateur,
I want uploader et ordonner les photos de mon véhicule,
So that mon build est présenté avec les meilleures photos dans le bon ordre.

**Acceptance Criteria:**

**Given** l'utilisateur est sur `app/(tabs)/post.tsx`, Étape 1
**When** l'écran s'affiche
**Then** la barre de progression du stepper (4 étapes) est visible en haut
**And** une zone de sélection plein écran permet d'ouvrir `expo-image-picker`
**And** la sélection est limitée à 10 photos maximum ; un compteur `4/10 PHOTOS` est visible
**And** la première photo sélectionnée reçoit un badge "Photo principale"
**And** les photos sont réordonnables par drag & drop (`react-native-draggable-flatlist` ou équivalent)
**And** le bouton "Brouillon" est disponible à tout moment et sauvegarde l'état dans `usePostStore`
**And** le bouton "Suivant →" est désactivé si aucune photo n'est sélectionnée ; actif dès qu'une photo est présente

### Story 3.2: Stepper création véhicule — Étapes 2, 3 & 4

As a utilisateur,
I want saisir les caractéristiques, la description, les tags et la localisation de mon véhicule,
So that les autres passionnés trouvent et comprennent facilement mon build.

**Acceptance Criteria:**

**Given** l'utilisateur est à l'Étape 2
**When** l'écran s'affiche
**Then** une grille 2×3 avec icônes permet de choisir le type (Voiture, Moto, Van, Camion, Vélo, Classic)
**And** les champs Marque, Modèle, Année, Cylindrée, Puissance sont présents et stockés dans `usePostStore`
**And** des suggestions de tags basées sur le type et les caractéristiques s'affichent

**Given** l'utilisateur est à l'Étape 3
**When** l'écran s'affiche
**Then** un textarea limité à 300 caractères avec compteur visible permet la description libre
**And** les tags actifs s'affichent avec un bouton × pour les supprimer
**And** des suggestions de tags issues de l'Étape 2 sont proposées
**And** l'état est persisté dans `usePostStore`

**Given** l'utilisateur est à l'Étape 4
**When** l'écran s'affiche
**Then** une carte interactive et un champ "Ville de rattachement" permettent de définir la localisation
**And** un toggle "Position précise — Visible à 200m près sur la map" est présent
**And** un aperçu de la card finale (style feed) est affiché
**And** le bouton "Publier le build" est visible et actif

### Story 3.3: Pipeline upload & publication du véhicule

As a utilisateur,
I want que mon build soit publié avec les photos compressées et optimisées,
So that le feed reste performant pour tous les utilisateurs.

**Acceptance Criteria:**

**Given** l'utilisateur appuie sur "Publier le build" à l'Étape 4
**When** `useCreateVehicle` (hook TanStack Query mutation) est invoqué
**Then** chaque photo est traitée par le pipeline : `expo-image-manipulator` (resize 1200px max, qualité 0.8, format JPEG) → `supabase.storage.from('vehicles').upload()` → `getPublicUrl()` stockée dans `vehicle_photos`
**And** l'enregistrement `vehicles` est créé avec toutes les données des étapes 2–4 et `is_published = true`
**And** les URLs stockées en DB sont les chemins Supabase Storage bruts (jamais les URLs transformées)
**And** pendant l'upload, un indicateur de progression est affiché (ex: "3/5 photos uploadées")
**And** après succès, l'utilisateur est redirigé vers le feed `/(tabs)` et un toast de confirmation s'affiche
**And** si l'upload d'une photo échoue, l'erreur est catchée via `handleSupabaseError()` et un toast en français s'affiche sans planter l'app
**And** `usePostStore` est réinitialisé après publication réussie

---

## Epic 4: Profils & Follow

L'utilisateur peut consulter son profil et celui des autres, modifier ses informations, voir la page détail d'un véhicule, et suivre des profils ou des véhicules.

### Story 4.1: Mon profil (affichage)

As a utilisateur,
I want voir mon profil avec mes véhicules, mes stats et ma bio,
So that je peux consulter et partager ma présence sur Kara.

**Acceptance Criteria:**

**Given** l'utilisateur est sur `app/(tabs)/profile.tsx`
**When** l'écran se charge
**Then** `lib/hooks/use-profile.ts` charge le profil via TanStack Query (query key `['profile', userId]`)
**And** le cover affiche la photo principale du premier véhicule de l'utilisateur via `buildImageUrl()` (plein largeur)
**And** l'avatar circulaire (`KaraAvatar`) chevauche le cover en bas à gauche
**And** le nom display, @pseudo, localisation, bio et tags (#JDM #Drift) s'affichent
**And** les compteurs `X VÉHICULES · X ABONNÉS · X ABONNEMENTS` sont affichés
**And** deux tabs "Véhicules" et "Favoris" permettent de switcher ; l'onglet Véhicules affiche une grid 3 colonnes des builds de l'utilisateur
**And** un bouton "Modifier" (outlined) et un bouton settings ⚙️ sont visibles
**And** si le profil n'a pas encore de véhicule, un état vide s'affiche dans la grid

### Story 4.2: Modification du profil

As a utilisateur,
I want mettre à jour mon avatar, ma bio, mes tags et ma localisation,
So that mon profil reflète fidèlement qui je suis dans la communauté.

**Acceptance Criteria:**

**Given** l'utilisateur appuie sur "Modifier" depuis son profil
**When** l'écran de modification s'ouvre (modal ou écran dédié)
**Then** les champs display name, @pseudo, bio (300 chars max), ville et tags sont préremplis avec les valeurs actuelles
**And** l'avatar est modifiable via `expo-image-picker` ; la photo est compressée et uploadée dans le bucket `avatars` via `buildImageUrl()`
**And** la sauvegarde appelle `supabase.from('profiles').update()` puis invalide la query `['profile', userId]`
**And** après succès, l'utilisateur revient à son profil et les nouvelles informations sont affichées
**And** si la mise à jour échoue, `handleSupabaseError()` retourne un toast en français

### Story 4.3: Profil d'un autre utilisateur & système de follow

As a utilisateur,
I want consulter le profil d'un autre passionné et le suivre,
So that je peux m'abonner aux builds qui m'inspirent.

**Acceptance Criteria:**

**Given** l'utilisateur tape sur l'avatar ou le pseudo d'un autre utilisateur (depuis le feed)
**When** `app/user/[id].tsx` se charge
**Then** la même structure que "Mon profil" s'affiche, avec un bouton "Suivre" à la place de "Modifier" et un menu ··· (Signaler, Bloquer) en haut à droite
**And** `lib/hooks/use-follow.ts` gère le follow/unfollow : insert/delete dans la table `follows` (`target_type = 'profile'`)
**And** appuyer sur "Suivre" insère une ligne dans `follows` et le bouton devient "Suivi" (fond `kara-primary`)
**And** appuyer sur "Suivi" supprime la ligne et le bouton revient à "Suivre" (outlined)
**And** les compteurs ABONNÉS et ABONNEMENTS du profil sont mis à jour par invalidation de la query `['profile', id]`
**And** le bouton "Suivre" dans la colonne d'actions du feed (Story 2.2) devient fonctionnel dans cette story

### Story 4.4: Profil véhicule (page détail)

As a utilisateur,
I want voir la fiche complète d'un véhicule avec toutes ses specs et photos,
So that je peux explorer en détail le build d'un passionné.

**Acceptance Criteria:**

**Given** l'utilisateur tape sur une card ou un thumbnail de véhicule
**When** `app/vehicle/[id].tsx` se charge
**Then** `lib/hooks/use-vehicle.ts` charge le véhicule (query key `['vehicle', id]`) avec ses photos
**And** `VehiclePhotoCarousel` affiche les photos en plein largeur (hauteur ~50% écran) avec indicateurs de pagination
**And** le badge type et le badge pays sont affichés
**And** le nom du véhicule s'affiche en `font-display` bold
**And** les specs sont en caps : `2001 · 2.0L TURBO · 280CH · RWD`
**And** les tags scrollables et la description sont présents
**And** la grille specs détaillées affiche : Année / Cylindrée / Puissance / Couple / Transmission / Poids via `VehicleSpecGrid`
**And** `components/profile/OwnerCard.tsx` affiche l'avatar et le pseudo du propriétaire ; un tap navigue vers `app/user/[id].tsx`
**And** un bouton "Suivre ce véhicule" sticky en bas insère dans `follows` (`target_type = 'vehicle'`) via `use-follow.ts`
**And** les boutons Partage et menu ··· sont présents en haut

---

## Epic 5: Interactions sociales

L'utilisateur peut interagir avec les builds (liker, commenter, enregistrer en favoris, partager).

### Story 5.1: Likes sur les véhicules

As a utilisateur,
I want liker les builds qui me plaisent,
So that je peux exprimer mon appréciation et les retrouver facilement.

**Acceptance Criteria:**

**Given** l'utilisateur voit un véhicule (dans le feed ou sur la page détail)
**When** il appuie sur le bouton ❤️
**Then** `lib/hooks/use-like.ts` (TanStack Query mutation) insère une ligne dans `likes` (`target_id = vehicleId`, `target_type = 'vehicle'`, `user_id = auth.uid()`)
**And** le bouton ❤️ passe à l'état actif (couleur `kara-primary`, rempli) avec une animation Reanimated
**And** le compteur de likes s'incrémente localement (optimistic update)
**And** appuyer à nouveau supprime la ligne et revient à l'état inactif
**And** au rechargement, l'état like est récupéré depuis la DB et reflété correctement
**And** les boutons ❤️ dans la colonne d'actions du feed (Story 2.2) deviennent fonctionnels

### Story 5.2: Commentaires sur les véhicules

As a utilisateur,
I want laisser un commentaire sur un build,
So that je peux échanger avec le propriétaire et la communauté sur le véhicule.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la page détail d'un véhicule `app/vehicle/[id].tsx`
**When** il appuie sur l'icône 💬
**Then** un modal ou une section de commentaires s'ouvre
**And** `lib/hooks/use-comments.ts` charge les commentaires (query key `['comments', vehicleId]`) depuis la table `comments`
**And** chaque commentaire affiche : avatar de l'auteur, @pseudo, corps du message et timestamp formaté
**And** un champ de saisie en bas permet de soumettre un nouveau commentaire
**And** la soumission insère dans `comments` (`vehicle_id`, `user_id = auth.uid()`, `body`) puis invalide la query `['comments', vehicleId]`
**And** si le corps est vide, le bouton d'envoi est désactivé
**And** un commentaire peut être liké (insert dans `likes` avec `target_type = 'comment'`) via le même `use-like.ts`

### Story 5.3: Bookmarks (favoris) & partage natif

As a utilisateur,
I want enregistrer les builds qui m'inspirent et les partager,
So that je peux constituer une collection personnelle et recommander des builds à mes proches.

**Acceptance Criteria:**

**Given** l'utilisateur voit un véhicule (feed ou page détail)
**When** il appuie sur le bouton 🔖
**Then** une entrée est créée dans `likes` (`target_type = 'vehicle'`, avec un champ `is_saved = true`) ou une table `bookmarks` dédiée — la décision d'implémentation est laissée au dev agent avec justification dans le commit
**And** le bouton 🔖 passe à l'état actif (`kara-primary`) ; un second tap le retire des favoris
**And** l'onglet "Favoris" du profil (Story 4.1) affiche la grid des véhicules bookmarkés, chargée via `use-profile.ts`

**Given** l'utilisateur appuie sur l'icône 📤 (partage)
**When** l'action est déclenchée
**Then** `Share.share()` de React Native est appelé avec un message formaté incluant le nom du véhicule et le @pseudo du propriétaire
**And** le partage fonctionne sur iOS et Android sans configuration supplémentaire

---

## Epic 6: Search & Explorer

L'utilisateur peut rechercher et découvrir des builds par marque, modèle, tag, catégorie ou proximité géographique.

### Story 6.1: Écran Explorer — catégories, tendances & "Près de toi"

As a utilisateur,
I want explorer les builds par catégorie, consulter les tendances et voir ce qui se passe près de chez moi,
So that je découvre la communauté sans avoir à taper une recherche.

**Acceptance Criteria:**

**Given** l'utilisateur est sur `app/(tabs)/search.tsx`
**When** l'écran se charge
**Then** une barre de recherche sticky avec un bouton filtres (icône sliders) est affichée en haut
**And** une grille 2×3 de catégories s'affiche : Voitures · Motos · Vans · Camions · Vélos · Classics, chacune avec son compteur de builds (issu d'une query `COUNT` groupée par `type`)
**And** une section "Tendances" affiche des tags horizontaux scrollables (#S15 #AE86 #R34 #Ducati #Stance) chargés depuis les tags les plus fréquents en DB
**And** une section "Près de toi" affiche des cards compactes en scroll horizontal avec un lien "Voir tout" (filtre géographique basé sur la `city` du profil connecté)
**And** taper sur une catégorie ou un tag trending pré-remplit la barre de recherche et déclenche une recherche

### Story 6.2: Recherche plein texte par marque, modèle ou tag

As a utilisateur,
I want rechercher un véhicule par marque, modèle ou tag,
So that je trouve rapidement les builds qui m'intéressent.

**Acceptance Criteria:**

**Given** l'utilisateur saisit du texte dans la barre de recherche
**When** la saisie dépasse 2 caractères (debounce 300ms)
**Then** `lib/hooks/use-search.ts` (TanStack Query, query key `['search', query]`) interroge Supabase PostgREST avec `ilike` sur les colonnes `brand`, `model` et `tags`
**And** les résultats s'affichent en liste de cards compactes : photo principale (via `buildImageUrl()`), nom véhicule, specs caps, @pseudo, localisation
**And** si la requête ne retourne aucun résultat, un état vide s'affiche ("Aucun build trouvé pour '…'")
**And** taper sur un résultat navigue vers `app/vehicle/[id].tsx`
**And** effacer la barre de recherche revient à l'écran Explorer (catégories + tendances)
**And** si la requête échoue, `handleSupabaseError()` affiche un toast en français

---

## Epic 7: Chat & Messagerie

L'utilisateur peut contacter directement d'autres passionnés par messagerie temps réel avec images.

### Story 7.1: Liste des conversations

As a utilisateur,
I want voir la liste de mes conversations avec les autres passionnés,
So that je peux accéder rapidement à mes échanges en cours.

**Acceptance Criteria:**

**Given** l'utilisateur est sur `app/(tabs)/chat.tsx`
**When** l'écran se charge
**Then** `lib/hooks/use-conversations.ts` charge les conversations de l'utilisateur (query key `['conversations', userId]`) via une jointure sur `conversation_participants`
**And** chaque ligne affiche : avatar véhicule principal de l'interlocuteur (via `buildImageUrl()`), @pseudo, modèle du véhicule en label, extrait du dernier message, timestamp formaté, badge non-lu violet (`kara-primary`) si des messages non lus existent
**And** un header "Messages" avec un bouton icône "Nouveau message" est affiché
**And** une barre de filtre permet de filtrer les conversations par pseudo
**And** taper sur une conversation navigue vers l'écran de conversation (Story 7.2)
**And** si aucune conversation n'existe, un état vide s'affiche ("Commence une conversation avec un passionné !")

### Story 7.2: Écran de conversation & messagerie temps réel

As a utilisateur,
I want envoyer et recevoir des messages en temps réel avec un autre passionné,
So that je peux échanger directement sur nos builds respectifs.

**Acceptance Criteria:**

**Given** l'utilisateur ouvre une conversation
**When** l'écran de conversation s'affiche
**Then** le header affiche l'avatar véhicule de l'interlocuteur, son @pseudo et le modèle de son véhicule en label caps, ainsi qu'un bouton "Voir profil" qui navigue vers `app/user/[id].tsx`
**And** `lib/hooks/use-messages.ts` charge l'historique des messages (query key `['messages', conversationId]`) et s'abonne au channel Supabase Realtime `messages:{conversationId}`
**And** les nouveaux messages reçus via Realtime sont ajoutés à la liste sans rechargement complet
**And** les messages envoyés s'affichent à droite (bulle `kara-primary`), les messages reçus à gauche (bulle `kara-surface`) ; un timestamp s'affiche sous chaque bulle
**And** un indicateur "typing" (trois points animés via Reanimated) s'affiche quand l'interlocuteur est en train de taper
**And** l'input bas contient : une icône image (ouvre `expo-image-picker` pour envoyer une photo), un champ texte et un bouton envoi violet
**And** l'envoi d'un message insère dans la table `messages` (`conversation_id`, `sender_id = auth.uid()`, `content` ou `image_url`)
**And** le cleanup Realtime est implémenté dans le `return` du `useEffect` : `supabase.removeChannel(channel)`
**And** si l'envoi échoue, `handleSupabaseError()` affiche un toast en français
