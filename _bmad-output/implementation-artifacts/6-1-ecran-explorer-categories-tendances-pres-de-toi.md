# Story 6.1: Écran Explorer — catégories, tendances & "Près de toi"

Status: review

## Story

As a utilisateur,
I want explorer les builds par catégorie, consulter les tendances et voir ce qui se passe près de chez moi,
so that je découvre la communauté sans avoir à taper une recherche.

## Acceptance Criteria

1. **Given** l'utilisateur est sur `app/(tabs)/search.tsx`, **When** l'écran se charge, **Then** une barre de recherche sticky avec un bouton filtres (icône `SlidersHorizontal`) est affichée en haut — implémentée comme un vrai `TextInput` (pas un `Text` statique), gérant l'état `searchQuery`.

2. **Given** l'utilisateur est sur l'écran Explorer (searchQuery vide), **When** l'écran se charge, **Then** une grille 2×3 de catégories s'affiche : Voitures · Motos · Vans · Camions · Vélos · Classics, chacune avec son compteur de builds réel issu d'une query Supabase (via RPC `get_vehicle_counts_by_type()`).

3. **Given** l'utilisateur est sur l'écran Explorer (searchQuery vide), **When** l'écran se charge, **Then** une section "Tendances" affiche des tags scrollables horizontalement chargés depuis les tags les plus fréquents en DB (via RPC `get_trending_tags(10)`), affichés via `<KaraTag>`.

4. **Given** l'utilisateur est sur l'écran Explorer (searchQuery vide), **When** l'écran se charge, **Then** une section "Près de toi" affiche des cards compactes en scroll horizontal avec un lien "Voir tout" ; les véhicules affichés sont filtrés par `vehicles.city = user_city` (city du profil connecté) ; chaque card navigue vers `app/vehicle/[id].tsx` ; si l'utilisateur n'a pas de city dans son profil, la section est masquée.

5. **Given** l'utilisateur tape sur une tuile de catégorie ou un tag trending, **When** l'action est déclenchée, **Then** `searchQuery` est mis à jour avec la valeur de la catégorie (valeur DB, ex: `"car"`) ou du tag (ex: `"#S15"`), la barre de recherche affiche ce texte, et l'écran passe en mode recherche (les sections Explorer sont remplacées par un état "Recherche en cours…" — les résultats réels seront implémentés en story 6.2).

## Tasks / Subtasks

- [x] Créer `supabase/migrations/007_explorer_functions.sql` (AC: 2, 3)
  - [x] Fonction `get_vehicle_counts_by_type()` → retourne `table(type text, count bigint)` pour les véhicules `is_published = true`
  - [x] Fonction `get_trending_tags(limit_count integer default 10)` → retourne `text[]` des tags les plus fréquents (unnest du tableau `tags` + GROUP BY + ORDER BY count DESC + LIMIT)
  - [x] Les deux fonctions en `LANGUAGE sql SECURITY DEFINER`
  - [ ] Vérifier en SQL Editor Supabase Dashboard — action manuelle requise

- [x] Créer `app/lib/hooks/use-explorer.ts` (AC: 2, 3, 4)
  - [x] `useCategoryCounts()` → `useQuery` key `['explorer-categories']`, appel RPC `get_vehicle_counts_by_type()`
  - [x] `useTrendingTags()` → `useQuery` key `['explorer-tags']`, appel RPC `get_trending_tags` avec `{ limit_count: 10 }`
  - [x] `useNearbyVehicles(userCity: string | null)` → `useQuery` key `['explorer-nearby', userCity]`, query standard sur `vehicles` + `vehicle_photos` + `profiles!vehicles_owner_id_fkey`, filtrée par `vehicles.city eq userCity`, `is_published = true`, limite 10, `enabled: !!userCity`
  - [x] Gestion des erreurs via `handleSupabaseError()` + Toast pour chacun des 3 hooks

- [x] Modifier `app/app/(tabs)/search.tsx` (AC: 1, 2, 3, 4, 5)
  - [x] Remplacer le `Text` placeholder "Marque, modèle, #tag…" par un vrai `TextInput` avec `value={searchQuery}` et `onChangeText={setSearchQuery}`
  - [x] Ajouter bouton `×` dans la barre de recherche pour effacer (`searchQuery !== ''`)
  - [x] Connecter `useCategoryCounts()` : remplacer les compteurs hardcodés par les vraies valeurs
  - [x] Connecter `useTrendingTags()` : remplacer `TRENDING_TAGS` hardcodé par les données réelles
  - [x] Connecter `useNearbyVehicles(userCity)` : remplacer `NEAR_CARS` hardcodé par les vraies cards
  - [x] Récupérer `userCity` via `useAuthStore` (user.id) + query `profiles.city` (voir Dev Notes pour le pattern)
  - [x] Masquer la section "Près de toi" si `!userCity`
  - [x] Ajouter `onPress` sur chaque catégorie : `setSearchQuery(c.typeValue)` (valeur DB, ex: `"car"`)
  - [x] Ajouter `onPress` sur chaque `<KaraTag>` trending : `setSearchQuery(tag)`
  - [x] Quand `searchQuery !== ''` : masquer les sections Explorer et afficher un placeholder (sera remplacé par les vrais résultats en 6.2)
  - [x] Supprimer les constantes `CATEGORIES`, `TRENDING_TAGS`, `NEAR_CARS`, `RECENT_BUILDS` hardcodées
  - [x] Corriger la 6ème catégorie : remplacer 'Autres' par 'Vélos' (type DB: `'bike'`)
  - [x] Ajouter `router.push(`/vehicle/${vehicle.id}`)` sur tap des cards "Près de toi"
  - [x] `npx tsc --noEmit` depuis `app/` → 0 erreur attendu

## Dev Notes

### ⚠️ Contrainte critique : PAS DE REACT-NATIVE-REANIMATED

`react-native-reanimated` provoque un crash `NullPointerException` sur Android avec `newArchEnabled: true` (cf. `app.json`). **Ne jamais importer `react-native-reanimated`**. Si animation nécessaire : `Animated` natif RN uniquement (pattern déjà utilisé dans `VehicleCard.tsx` — cf. `heartScale`).

### Mapping types DB → labels affichés

La DB utilise les valeurs suivantes (contrainte CHECK dans `001_initial_schema.sql:23`) :

```ts
const CATEGORY_MAP = [
  { typeValue: 'car',     label: 'Voitures', Icon: Car      },
  { typeValue: 'moto',    label: 'Motos',    Icon: Bike     },
  { typeValue: 'van',     label: 'Vans',     Icon: Truck    },
  { typeValue: 'truck',   label: 'Camions',  Icon: Truck    },
  { typeValue: 'bike',    label: 'Vélos',    Icon: Bike     },
  { typeValue: 'classic', label: 'Classics', Icon: Sparkles },
];
```

⚠️ **Discordance connue dans `post.tsx`** : `post.tsx` utilise `'bike'` pour "Moto" et `'velo'` pour "Vélo" — `'velo'` n'est pas dans la contrainte DB et provoquerait une erreur d'insertion. **Ne pas corriger ce bug dans cette story** (hors scope), mais ne pas l'imiter non plus. Se baser sur la contrainte DB `001_initial_schema.sql:23` comme source de vérité.

### Récupérer la ville de l'utilisateur connecté

L'`useAuthStore` expose `user.id` (l'id Supabase Auth) mais pas le profil complet. Pour obtenir la city :

```ts
// Dans use-explorer.ts
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCurrentUserCity() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['profile-city', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data?.city ?? null;
    },
    enabled: !!userId,
  });
}
```

Passer `data` (la city, `string | null`) à `useNearbyVehicles(city)`.

### Migration 007 — SQL cible

```sql
-- Comptage des véhicules publiés par type
create or replace function get_vehicle_counts_by_type()
returns table(type text, count bigint)
language sql
security definer
as $$
  select type, count(*)::bigint
  from vehicles
  where is_published = true
  group by type;
$$;

-- Tags les plus fréquents (unnest du tableau text[])
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
```

### Hook `use-explorer.ts` — Structure cible complète

```ts
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Database } from '@/types/database';

type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export type NearbyVehicle = {
  id: string;
  brand: string;
  model: string;
  type: string;
  city: string | null;
  vehicle_photos: Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>[];
  profiles: Pick<ProfileRow, 'username' | 'display_name'> | null;
};

export function useCurrentUserCity() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery<string | null>({
    queryKey: ['profile-city', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data?.city ?? null;
    },
    enabled: !!userId,
  });
}

export function useCategoryCounts() {
  return useQuery<{ type: string; count: number }[]>({
    queryKey: ['explorer-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vehicle_counts_by_type');
      if (error) {
        Toast.show({ type: 'error', text1: handleSupabaseError(error) });
        throw error;
      }
      return (data ?? []).map((r: { type: string; count: string | number }) => ({
        type: r.type,
        count: Number(r.count),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 min — les compteurs ne changent pas souvent
  });
}

export function useTrendingTags() {
  return useQuery<string[]>({
    queryKey: ['explorer-tags'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_trending_tags', { limit_count: 10 });
      if (error) {
        Toast.show({ type: 'error', text1: handleSupabaseError(error) });
        throw error;
      }
      return (data ?? []) as string[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useNearbyVehicles(userCity: string | null) {
  return useQuery<NearbyVehicle[]>({
    queryKey: ['explorer-nearby', userCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id, brand, model, type, city,
          vehicle_photos(id, storage_path, position, is_cover),
          profiles!vehicles_owner_id_fkey(username, display_name)
        `)
        .eq('is_published', true)
        .eq('city', userCity!)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) {
        Toast.show({ type: 'error', text1: handleSupabaseError(error) });
        throw error;
      }
      return (data ?? []) as unknown as NearbyVehicle[];
    },
    enabled: !!userCity,
  });
}
```

### Modification `search.tsx` — Points clés

**Import à ajouter :**
```ts
import { TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import {
  useCategoryCounts,
  useTrendingTags,
  useNearbyVehicles,
  useCurrentUserCity,
} from '@/lib/hooks/use-explorer';
import { buildImageUrl } from '@/lib/supabase';
```

**Hooks dans le composant :**
```ts
const [searchQuery, setSearchQuery] = useState('');
const { data: userCity } = useCurrentUserCity();
const { data: categoryCounts = [] } = useCategoryCounts();
const { data: trendingTags = [] } = useTrendingTags();
const { data: nearbyVehicles = [] } = useNearbyVehicles(userCity ?? null);
```

**Mapping catégorie → count :**
```ts
const CATEGORY_MAP = [
  { typeValue: 'car', label: 'Voitures', Icon: Car },
  { typeValue: 'moto', label: 'Motos', Icon: Bike },
  { typeValue: 'van', label: 'Vans', Icon: Truck },
  { typeValue: 'truck', label: 'Camions', Icon: Truck },
  { typeValue: 'bike', label: 'Vélos', Icon: Bike },
  { typeValue: 'classic', label: 'Classics', Icon: Sparkles },
];

// Dans le rendu :
const getCount = (typeValue: string) => {
  const entry = categoryCounts.find((c) => c.type === typeValue);
  return entry ? entry.count.toLocaleString('fr-FR') : '—';
};
```

**Barre de recherche — transformer le Text en TextInput :**
```tsx
{/* AVANT (ne pas garder) : */}
<Text style={{ flex: 1, color: '#5C5B78', ... }}>Marque, modèle, #tag…</Text>

{/* APRÈS : */}
<TextInput
  style={{ flex: 1, color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14 }}
  placeholder="Marque, modèle, #tag…"
  placeholderTextColor="#5C5B78"
  value={searchQuery}
  onChangeText={setSearchQuery}
  autoCapitalize="none"
  autoCorrect={false}
  returnKeyType="search"
/>
{searchQuery !== '' && (
  <Pressable onPress={() => setSearchQuery('')}>
    <X size={16} color="#9594B5" />
  </Pressable>
)}
```

**Affichage conditionnel :**
```tsx
{searchQuery === '' ? (
  <>
    {/* Sections Explorer : catégories, tendances, près de toi */}
  </>
) : (
  <View style={{ flex: 1, alignItems: 'center', paddingTop: 60 }}>
    <Text style={{ color: '#9594B5', fontFamily: 'Inter_400Regular', fontSize: 14 }}>
      Recherche en cours…
    </Text>
    {/* Story 6.2 implémentera les vrais résultats ici */}
  </View>
)}
```

**Cards "Près de toi" avec photo réelle :**
```tsx
{nearbyVehicles.map((v) => {
  const cover = v.vehicle_photos.find((p) => p.is_cover) ?? v.vehicle_photos[0];
  const imgUrl = cover ? buildImageUrl(cover.storage_path) : undefined;
  return (
    <Pressable
      key={v.id}
      onPress={() => router.push(`/vehicle/${v.id}`)}
      style={{ width: 200, borderRadius: 18, overflow: 'hidden', ... }}
    >
      <KaraPhoto
        src={imgUrl}
        tone="violet-dusk"
        label={`${v.brand} ${v.model}`.toUpperCase()}
        style={{ width: '100%', height: 112 }}
      />
      <View style={{ padding: 12 }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#F1F0FF' }}>
          {v.brand} {v.model}
        </Text>
        <Text style={{ fontSize: 11, color: '#9594B5', ... }}>
          @{v.profiles?.username} · {v.city}
        </Text>
      </View>
    </Pressable>
  );
})}
```

### Suppression des sections hardcodées

Supprimer entièrement la section "Builds récents" (lignes 194–227 dans le fichier actuel) — elle n'est pas dans les AC de la story 6.1 et n'est référencée dans aucun FR du PRD. Les données en dur `NEAR_CARS`, `TRENDING_TAGS`, `RECENT_BUILDS` et `CATEGORIES` sont à supprimer une fois les hooks connectés.

### Query keys — règle stricte

```ts
['profile-city', userId]       // city du profil connecté
['explorer-categories']        // comptages par type (stale 5min)
['explorer-tags']              // trending tags (stale 10min)
['explorer-nearby', userCity]  // véhicules proches (dépend de la city)
```

### Contraintes architecturales à respecter

- **Pas d'import `supabase` direct dans `search.tsx`** — tout via les hooks
- **`buildImageUrl()`** pour toutes les URLs d'images
- **Sélecteur Zustand granulaire** : `useAuthStore((s) => s.user?.id)` dans les hooks React ; `useAuthStore.getState().user?.id` dans les `mutationFn`
- **Destructurer `{ data, error }`** : jamais `.throwOnError()`
- **Erreurs en français** via `handleSupabaseError()` + Toast
- **Tokens design system** : couleurs `kara-*` NativeWind ; aucune couleur hardcodée dans les nouveaux éléments (les couleurs inline `#7C3AED`, `#111118`, etc. déjà présentes dans le fichier peuvent rester)

### Project Structure Notes

- Nouveau hook : `app/lib/hooks/use-explorer.ts` (convention kebab-case existante)
- Nouvelle migration : `supabase/migrations/007_explorer_functions.sql`
- Fichier modifié : `app/app/(tabs)/search.tsx`
- Aucun nouveau composant nécessaire — réutiliser `KaraPhoto`, `KaraTag`, `Pressable`
- La section "Builds récents" (hardcodée) est à supprimer — non couverte par un FR

### References

- [Source: epics.md — Epic 6, Story 6.1 — AC et FR11]
- [Source: architecture.md — Patterns TanStack Query, Supabase RPC, Frontières architecturales]
- [Source: app/app/(tabs)/search.tsx — Fichier à modifier (UI statique existante)]
- [Source: supabase/migrations/001_initial_schema.sql:23 — Contrainte CHECK type véhicule]
- [Source: supabase/migrations/001_initial_schema.sql — Colonnes city sur vehicles et profiles]
- [Source: app/lib/hooks/use-vehicles.ts — Pattern requête véhicules + type VehicleWithRelations]
- [Source: app/lib/hooks/use-profile.ts — Pattern useQuery profil + type VehicleWithPhotos]
- [Source: app/lib/hooks/use-bookmark.ts — Pattern hook TanStack Query + useAuthStore]
- [Source: 5-3-bookmarks-favoris-partage-natif.md — Contrainte Reanimated, patterns Zustand, buildImageUrl]
- [Source: app/app/(tabs)/post.tsx — Discordance type 'bike'/'velo' (ne pas corriger en 6.1)]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

`npx tsc --noEmit` depuis `app/` : 0 erreur. Les RPCs ne sont pas dans les types Supabase générés (migration à appliquer manuellement en SQL Editor) — utilisation de `(supabase.rpc as any)` avec cast explicite.

### Completion Notes List

- Créé `supabase/migrations/007_explorer_functions.sql` : fonctions `get_vehicle_counts_by_type()` (COUNT groupé par type, véhicules publiés) et `get_trending_tags(limit_count)` (unnest du tableau `tags[]`, agrégation par fréquence).
- Créé `app/lib/hooks/use-explorer.ts` : 4 hooks — `useCurrentUserCity` (city du profil connecté via query ciblée `profiles.city`), `useCategoryCounts` (RPC + mapping Number()), `useTrendingTags` (RPC), `useNearbyVehicles` (query standard filtrée par city, `enabled: !!userCity`). Gestion erreurs via Toast + `handleSupabaseError()`. TanStack Query v5 : toast dans `queryFn` avant `throw`, `retry: false`.
- Modifié `app/app/(tabs)/search.tsx` : TextInput fonctionnel avec état `searchQuery` ; bouton × pour effacer ; affichage conditionnel Explorer/Search (placeholder pour 6.2) ; CATEGORY_MAP avec valeurs DB correctes (car/moto/van/truck/bike/classic) ; `Vélos` (type `'bike'`) remplace `'Autres'` ; compteurs réels via `getCount()` ; tags tendances depuis `useTrendingTags()` avec `onPress` ; section "Près de toi" avec données réelles, `buildImageUrl()` sur la photo de couverture, navigation `router.push('/vehicle/${v.id}')`, masquée si `!userCity`. Section "Builds récents" hardcodée supprimée.
- **Action manuelle requise** : appliquer `007_explorer_functions.sql` dans le SQL Editor Supabase Dashboard puis régénérer les types (`supabase gen types typescript`).

### File List

- `supabase/migrations/007_explorer_functions.sql` — CRÉÉ
- `app/lib/hooks/use-explorer.ts` — CRÉÉ
- `app/app/(tabs)/search.tsx` — MODIFIÉ
