# Kara — Project Brief
> Version 1.0 · Avril 2026 · Document destiné aux agents BMAD

---

## 1. Vision du produit

**Kara** est un réseau social communautaire dédié aux passionnés de véhicules motorisés et non motorisés. L'application permet à chaque propriétaire de créer un profil pour son véhicule, de découvrir les builds d'autres passionnés via un feed vertical scroll-snap, d'échanger par messagerie directe, et à terme de participer à des événements et d'acheter/vendre via une marketplace intégrée.

**Tagline** : *"Le réseau social des passionnés d'auto."*

**Public cible** : 20–35 ans, culture JDM, stance, custom, drift, tuning. Passionnés engagés, pas le grand public généraliste.

**Ambiance visuelle** : Magazine auto underground × réseau social moderne. Énergique, contrasté, streetwear. Référence : Hypebeast + culture Instagram JDM.

---

## 2. Stack technique

### Frontend (Mobile)
| Brique | Technologie | Version |
|---|---|---|
| Framework | React Native via **Expo** | SDK 54 |
| Navigation | **Expo Router** (file-based, App Router-like) | ~6.0.23 |
| Styling | **NativeWind** (Tailwind syntax pour RN) | ^4.2.3 |
| Composants UI | **React Native Reusables** (shadcn-like pour RN) | latest |
| Animations | **React Native Reanimated** | 3.16.7 |
| Icônes | **Lucide React Native** | latest |
| Polices | Space Grotesk (display) + Inter (body) via Expo Google Fonts | — |

### Backend
| Brique | Technologie | Notes |
|---|---|---|
| BaaS | **Supabase** | PostgreSQL + Auth + Storage + Realtime |
| Auth | Supabase Auth | Google OAuth, Apple OAuth, email |
| Stockage images | Supabase Storage | Transformations via URL (resize, WebP) |
| Temps réel | Supabase Realtime | Pour le chat (triggers PostgreSQL) |
| Sécurité | Row Level Security (RLS) | Politiques au niveau DB |

### Outils & Config
- **TypeScript** strict partout
- **Expo SecureStore** pour le stockage du token auth (jamais AsyncStorage)
- `.npmrc` avec `legacy-peer-deps=true` (nécessaire pour résoudre les conflits Expo/npm v7+)

---

## 3. Structure du projet

```
kara/
├── app/                          # Expo Router — toutes les routes
│   ├── _layout.tsx               # Layout racine (fonts, providers, StatusBar)
│   ├── (auth)/                   # Groupe routes auth (pas de tab bar)
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx        # 3 slides d'intro
│   │   └── login.tsx             # Écran auth (OAuth + email)
│   ├── (tabs)/                   # Groupe routes principales (avec tab bar)
│   │   ├── _layout.tsx           # Tab bar custom
│   │   ├── index.tsx             # Discover — feed principal
│   │   ├── search.tsx            # Explorer — search + catégories
│   │   ├── post.tsx              # Créer un véhicule (stepper 4 étapes)
│   │   ├── chat.tsx              # Liste des conversations
│   │   └── profile.tsx           # Mon profil
│   ├── vehicle/
│   │   └── [id].tsx              # Profil véhicule (route dynamique)
│   └── user/
│       └── [id].tsx              # Profil utilisateur (route dynamique)
├── components/
│   ├── ui/                       # Composants RNR (copiés, modifiables)
│   ├── feed/                     # VehicleCard, FeedActions...
│   ├── vehicle/                  # VehicleCarousel, SpecsGrid...
│   └── shared/                   # Header, TabBar custom...
├── lib/
│   ├── supabase.ts               # Client Supabase configuré
│   └── utils.ts                  # Helpers
├── types/
│   └── database.ts               # Types générés depuis Supabase
├── global.css                    # Directives Tailwind (@tailwind base/components/utilities)
├── tailwind.config.js            # Config Tailwind + palette Kara + fonts
├── babel.config.js               # babel-preset-expo + jsxImportSource nativewind + reanimated
├── metro.config.js               # getDefaultConfig + withNativeWind
└── .npmrc                        # legacy-peer-deps=true
```

---

## 4. Design System

### Palette de couleurs
```
kara-primary   #7C3AED   Violet électrique — CTA, boutons actifs, tab active
kara-accent    #A78BFA   Violet clair — labels, highlights, tags actifs
kara-bg        #0A0A0F   Fond quasi-noir — background global
kara-surface   #111118   Surface — cards, modals, inputs
kara-border    #1E1E2E   Bordures — séparateurs, dividers
kara-danger    #EF4444   Danger — désabonner, erreurs
kara-textDark  #F1F0FF   Texte principal dark mode
kara-muted     #9594B5   Texte secondaire, metadata, timestamps
```

### Typographie
```
font-display      SpaceGrotesk_700Bold    Titres, nom véhicule, Display
font-body         Inter_400Regular        Corps de texte
font-bodyMedium   Inter_500Medium         Labels, boutons
font-bodySemiBold Inter_600SemiBold       Caps labels, tags
```

### Border Radius
```
rounded-sm   8px
rounded-md   12px
rounded-lg   16px
rounded-2xl  24px  ← standard Kara pour les cards
```

### Effets visuels
- Glassmorphism léger sur les overlays (backdrop-blur + bg opacity)
- Gradient bas → haut (noir transparent → opaque) sur les cards véhicule
- Shadow colorée sur éléments actifs : `shadow-purple-500/30`
- Pas d'illustrations — les photos des véhicules font le décor

---

## 5. Écrans & Fonctionnalités MVP

### 5.1 Onboarding (3 slides)
- Slide 1 : "Trouve ta communauté" — fond violet-dusk
- Slide 2 : "Échange avec les passionnés" — fond track-magenta
- Slide 3 : "Events & Marketplace" (teaser) — fond amber
- Navigation : dots indicateurs + bouton flèche → dernier slide : bouton "Commencer"
- Bouton "Passer" en haut à droite sur toutes les slides

### 5.2 Auth
- Logo Kara centré (icône ⊕ + wordmark)
- Bouton "Continuer avec Apple" (filled blanc)
- Bouton "Continuer avec Google" (outlined)
- Lien discret "Continuer avec email"
- CGU + politique confidentialité en footer

### 5.3 Discover (Feed principal) ← Cœur de l'app
- **Scroll vertical scroll-snap** : une card par snap (style TikTok)
- **Chaque card véhicule** (hauteur ~75% écran) :
  - Photo plein fond + carousel horizontal interne (swipe pour photos suivantes)
  - Indicateur photos : `JP · 1/6` (badge pays + numéro)
  - Badge type véhicule en haut à gauche : `🚗 Voiture`
  - Actions à droite (style TikTok) : ❤️ like · 💬 commentaire · 🔖 save · 📤 share + compteur abonnés
  - Gradient bas : infos overlay
  - Avatar + @pseudo + localisation (ex: Lyon, 69)
  - Nom véhicule en Display bold : "Nissan Silvia S15"
  - Specs en label caps : `SR20DET · 280ch · RWD`
  - Tags scrollables : #JDM #Turbo #Stance #Drift
  - Bouton "Suivre" large violet + bouton message icône
- Header : logo Kara à gauche · cloche notif + icône filtres à droite
- Tab bar visible en bas

### 5.4 Search (Explorer)
- Barre de recherche sticky : "Marque, modèle, #tag..."
- Bouton filtres dans la barre (icône sliders)
- Section Catégories : grid 2×3
  - Voitures (12.4k builds) · Motos (8.1k) · Vans (1.2k) · Camions (643) · Vélos (2.8k) · Classics (3.5k)
- Section Tendances : tags horizontaux scrollables (#S15 #AE86 #R34 #Ducati #Stance)
- Section "Près de toi" : cards compactes scroll horizontal + lien "Voir tout"
- Résultats de recherche : liste cards compactes (photo + specs + pseudo + localisation)

### 5.5 Post — Créer un véhicule (Stepper 4 étapes)
Stepper linéaire visible en haut (barre de progression). Bouton "Brouillon" à tout moment.

**Étape 1 — Photos**
- Zone upload plein écran
- Min 1 photo, max 10
- Grid : photo principale grande + thumbnails en dessous
- Badge "Photo principale" sur la première
- Drag & drop pour réordonner
- Compteur : "4/10 PHOTOS · GLISSE POUR RÉORDONNER"

**Étape 2 — Type & Caractéristiques**
- Selector type (grid 2×3 avec icônes) : Voiture · Moto · Van · Camion · Vélo · Classic
- Champs : Marque / Modèle / Année / Cylindrée / Puissance
- Suggestion de tags basée sur les caractéristiques

**Étape 3 — Description & Tags**
- Textarea libre 300 caractères max (compteur visible)
- Tags actifs avec × pour supprimer
- Suggestions de tags basées sur étape 2

**Étape 4 — Localisation**
- Carte interactive (point centré)
- Champ "Ville de rattachement"
- Toggle "Position précise — Visible à 200m près sur la map"
- Aperçu de la card finale
- Bouton "Publier le build"

### 5.6 Chat
**Liste conversations** :
- Header "Messages" + icône nouveau message
- Barre de filtre
- Chaque ligne : avatar véhicule (photo de sa voiture, pas l'avatar user) + @pseudo + modèle véhicule en label + extrait dernier message + timestamp + badge non-lu violet

**Conversation** :
- Header : avatar véhicule + @pseudo + "NISSAN SILVIA S15" en label + bouton "Voir profil"
- Bulles messages : envoyés (violet, droite) · reçus (surface, gauche)
- Timestamp sous chaque bulle
- Indicateur "typing" (trois points animés)
- Input bas : icône image + champ texte + bouton envoi violet

### 5.7 Profil utilisateur
**Mon profil** :
- Cover = sa plus belle photo véhicule (plein largeur)
- Avatar circulaire chevauchant la cover (bas gauche)
- Bouton "Modifier" (outlined)
- Nom display + @pseudo + localisation
- Bio courte + tags (#JDM #Drift #Lyon69)
- Compteurs : X VÉHICULES · X ABONNÉS · X ABONNEMENTS
- Tabs : Véhicules / Favoris
- Grid 3 colonnes véhicules (style Instagram)
- Bouton settings en haut à droite (⚙️)

**Profil d'un autre** :
- Même structure mais bouton "Suivre" à la place de "Modifier"
- Menu ··· en haut à droite (signaler, bloquer)

### 5.8 Profil Véhicule (détail)
- Carousel photos plein largeur (hauteur ~50% écran) + indicateurs
- Badge type + badge pays
- Nom véhicule en Display bold
- Specs en label caps : `2001 · 2.0L TURBO · 280CH · RWD`
- Tags scrollables
- Description
- Grid specs détaillées : Année / Cylindrée / Puissance / Couple / Transmission / Poids
- Mini card propriétaire (avatar + pseudo) → tap → profil user
- Bouton "Suivre ce véhicule" sticky en bas
- Bouton partage + menu ··· en haut

---

## 6. Schéma de base de données (Supabase / PostgreSQL)

### Tables principales

```sql
-- Utilisateurs (extension de auth.users de Supabase)
profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users,
  username    text UNIQUE NOT NULL,
  display_name text,
  bio         text,
  avatar_url  text,
  city        text,
  tags        text[],
  created_at  timestamptz DEFAULT now()
)

-- Véhicules
vehicles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES profiles NOT NULL,
  type        text NOT NULL, -- 'car' | 'moto' | 'van' | 'truck' | 'bike' | 'classic'
  brand       text NOT NULL,
  model       text NOT NULL,
  year        integer,
  displacement text,
  power       integer,        -- en chevaux
  torque      integer,        -- en Nm
  transmission text,
  weight      integer,        -- en kg
  description text,
  tags        text[],
  city        text,
  lat         float,
  lng         float,
  country_code text,          -- 'JP', 'FR', etc.
  is_published boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
)

-- Photos véhicules
vehicle_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  uuid REFERENCES vehicles ON DELETE CASCADE,
  url         text NOT NULL,
  position    integer NOT NULL,  -- ordre d'affichage
  is_cover    boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
)

-- Abonnements (follow véhicule ou profil)
follows (
  follower_id uuid REFERENCES profiles NOT NULL,
  target_id   uuid NOT NULL,           -- vehicle_id ou profile_id
  target_type text NOT NULL,           -- 'vehicle' | 'profile'
  created_at  timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, target_id, target_type)
)

-- Messages
messages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations NOT NULL,
  sender_id     uuid REFERENCES profiles NOT NULL,
  content       text,
  image_url     text,
  created_at    timestamptz DEFAULT now()
)

-- Conversations
conversations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz DEFAULT now()
)

-- Participants aux conversations
conversation_participants (
  conversation_id uuid REFERENCES conversations,
  profile_id      uuid REFERENCES profiles,
  PRIMARY KEY (conversation_id, profile_id)
)
```

### RLS Policies (exemples clés)
```sql
-- Un user ne voit que ses propres messages + ceux de ses conversations
CREATE POLICY "users_see_own_messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE profile_id = auth.uid()
    )
  );

-- Un user ne peut modifier que ses propres véhicules
CREATE POLICY "owner_can_update_vehicle" ON vehicles
  FOR UPDATE USING (owner_id = auth.uid());
```

---

## 7. Authentification

Supabase Auth avec les providers suivants :
- **Google OAuth**
- **Apple OAuth** (obligatoire pour l'App Store)
- **Email/password** (fallback)

Après auth, création automatique du profil dans la table `profiles` via un trigger PostgreSQL :

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),  -- username provisoire
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

---

## 8. Gestion des images

### Stratégie
- Upload dans **Supabase Storage** bucket `vehicles`
- Compression côté client avant upload (cible : < 500KB par photo)
- Transformations via URL Supabase (resize + WebP automatique)

### Buckets
```
vehicles/     Photos des véhicules (public)
avatars/      Photos de profil (public)
```

### Limites MVP (contrôle des coûts)
- Max 10 photos par véhicule
- Free tier Supabase : 1 GB storage
- Compression systématique avant upload

---

## 9. Roadmap produit

### MVP (Phase 1) — En cours
- [x] Setup projet (Expo + NativeWind + Supabase)
- [ ] Auth (onboarding + login OAuth)
- [ ] Profil utilisateur (création + édition)
- [ ] Création véhicule (stepper 4 étapes + upload photos)
- [ ] Feed Discover (scroll-snap + cards)
- [ ] Profil véhicule (détail)
- [ ] Système de follow (profil + véhicule)
- [ ] Chat (messagerie directe temps réel)

### Phase 2
- [ ] Events (listing + détail + participation)
- [ ] Notifications push
- [ ] Filtres avancés sur le feed
- [ ] Recherche full-text véhicules

### Phase 3 — Monétisation
- [ ] Marketplace (annonces véhicules + pièces)
- [ ] Comptes premium (plus de photos, mise en avant)
- [ ] Annonces événements sponsorisées
- [ ] Commission marketplace (3–5%)

---

## 10. Conventions de code

### Nommage
```
Composants     PascalCase          VehicleCard.tsx
Hooks          camelCase + use     useVehicleFeed.ts
Utils          camelCase           formatDistance.ts
Types          PascalCase + I/T    IVehicle, TVehicleType
Constants      UPPER_SNAKE_CASE    MAX_PHOTOS_PER_VEHICLE
```

### Structure d'un composant
```tsx
// 1. Imports React/RN
// 2. Imports libs tierces
// 3. Imports locaux (composants, hooks, utils, types)
// 4. Types/interfaces du composant
// 5. Composant avec JSDoc si complexe
// 6. Styles (si StyleSheet, sinon className NativeWind inline)
```

### Tailwind / NativeWind
- Toujours utiliser les tokens `kara-*` définis dans `tailwind.config.js`
- Pas de couleurs hardcodées dans les composants
- Breakpoints non utilisés (mobile only)

---

## 11. Fichier lib/supabase.ts

```typescript
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

---

## 12. Points de vigilance pour les agents

1. **Windows + Node 22** : le projet tourne sur Windows. Attention aux chemins (`path.resolve(__dirname)` dans metro.config.js). Le `.npmrc` avec `legacy-peer-deps=true` est obligatoire.

2. **Reanimated v3.16.7** : la v4 casse à cause de `react-native-worklets` manquant. Rester sur 3.16.7.

3. **Tailwind v3.4.17** : NativeWind v4 est incompatible avec Tailwind v4. Rester sur 3.x.

4. **Expo Router groupes** : `(auth)` et `(tabs)` sont des groupes sans impact URL. La tab bar ne s'affiche que dans `(tabs)`.

5. **Scroll-snap du feed** : l'interaction principale de Discover. Sur web (dev), le comportement diffère du natif. Tester sur device pour valider.

6. **Supabase Realtime pour le chat** : s'abonner aux changements de la table `messages` filtrés par `conversation_id`. Désabonnement obligatoire dans le cleanup du useEffect.

7. **Images** : toujours passer par l'URL de transformation Supabase pour servir les images redimensionnées. Ne jamais afficher l'URL originale directement dans le feed (trop lourd).

8. **RLS** : toutes les tables ont RLS activé. Tester les policies avec un utilisateur non-authentifié pour valider la sécurité.