# Story 2.1: Feed Discover — structure scroll-snap & données paginées

Status: review

## Story

As a utilisateur connecté,
I want parcourir un feed de véhicules en scrollant verticalement,
So that je découvre les builds de la communauté de manière fluide et immersive.

## Acceptance Criteria

1. `app/lib/hooks/use-vehicles.ts` est créé — `useInfiniteQuery` TanStack Query v5, query key `['vehicles']`, curseur sur `created_at` (`lt`), LIMIT 10, `is_published = true`, jointure `vehicle_photos` + `profiles`
2. `app/(tabs)/index.tsx` utilise le hook `useVehicles()` — tout `VEHICLE_DATA` mock retiré ; les items affichés viennent de `data?.pages.flatMap(p => p) ?? []`
3. La `FlatList` conserve `pagingEnabled`, `snapToAlignment="start"`, `decelerationRate="fast"`, `snapToInterval={containerHeight}`, `getItemLayout`, `keyExtractor` — **ET** ajoute `removeClippedSubviews={true}` (NFR1 : 60fps)
4. `onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}` + `onEndReachedThreshold={0.5}` déclenchent le chargement de la page suivante
5. Un skeleton de chargement (3 rectangles arrondis `#111118` plein-hauteur) s'affiche quand `isLoading === true` et qu'aucune donnée n'est encore disponible
6. Quand `isError === true`, un `Toast.show({ type: 'error', text1: handleSupabaseError(error) })` s'affiche (dans `useEffect([isError])`)
7. Le header flottant (KaraWordmark + Bell + SlidersHorizontal) est préservé exactement tel quel
8. Le `VehicleCard` inline (dans `index.tsx`) est adapté pour accepter `VehicleWithRelations` en prop — les champs dérivés (nom, specs, owner, pays) sont calculés dans le composant ; la photo de couverture est affichée via `<Image>` + `buildImageUrl()`
9. `npx tsc --noEmit` (depuis `app/`) passe sans erreur

## Tasks / Subtasks

- [x] Créer `app/lib/hooks/use-vehicles.ts` (AC: 1)
  - [x] Définir `VehicleWithRelations` (type DB Row + vehicle_photos + profiles) — exporter
  - [x] Implémenter `useVehicles()` avec `useInfiniteQuery` (v5 API : `initialPageParam`, `getNextPageParam`)
  - [x] Query Supabase : `vehicles` avec jointure `vehicle_photos(id, storage_path, position, is_cover)` + `profiles!vehicles_owner_id_fkey(id, username, display_name, avatar_url, city)`, filtre `is_published = true`, tri `created_at DESC`, `LIMIT 10`, cursor `lt('created_at', pageParam)`
  - [x] `getNextPageParam` : retourner `lastPage[lastPage.length - 1].created_at` si `lastPage.length === 10`, sinon `undefined`

- [x] Adapter `app/(tabs)/index.tsx` — données réelles (AC: 2, 3, 4, 5, 6, 7, 8)
  - [x] Remplacer `VEHICLE_DATA` et `type Vehicle` par `VehicleWithRelations` (import depuis `@/lib/hooks/use-vehicles`)
  - [x] Supprimer tous les imports et usages liés aux données mock (`tone`, `label`, `online`)
  - [x] Ajouter `useVehicles()`, `useEffect` error toast, dériver `items` depuis `data?.pages.flatMap(p => p) ?? []`
  - [x] Ajouter `removeClippedSubviews={true}`, `onEndReached`, `onEndReachedThreshold={0.5}` à la FlatList
  - [x] Adapter le composant `VehicleCard` inline : prop type `vehicle: VehicleWithRelations`, dériver `displayName`, `displaySpecs`, `coverUrl`, `ownerUsername`, `ownerCity`, `typeLabel`, `countryEmoji`, `photoCount`
  - [x] Afficher la photo de couverture : `<Image source={{ uri: coverUrl }} resizeMode="cover" />` via `buildImageUrl(coverPhoto.storage_path, ...)`; fallback `<KaraPhoto tone="crimson-rwd" />` si aucune photo
  - [x] Ajouter le rendu skeleton (AC: 5)

- [x] Vérification TypeScript (AC: 9)
  - [x] `cd app && npx tsc --noEmit` passe sans erreur

## Dev Notes

### Fichiers à créer (NEW)

```
app/lib/hooks/use-vehicles.ts     ← hook TanStack Query v5 avec cursor pagination
```

### Fichiers à modifier (UPDATE)

```
app/(tabs)/index.tsx              ← remplacer VEHICLE_DATA mock + adapter VehicleCard
```

### Fichiers à NE PAS MODIFIER

- `app/lib/supabase.ts` — `buildImageUrl()` et client déjà corrects ✅
- `app/lib/supabase-error.ts` — `handleSupabaseError(PostgrestError)` déjà implémenté ✅
- `app/lib/query-client.ts` — `queryClient` déjà configuré (staleTime 5min) ✅
- `app/components/shared/*` — composants partagés déjà prêts ✅

### État actuel de `app/(tabs)/index.tsx` (CONNU — lire avant de modifier)

Le fichier est **entièrement fonctionnel** avec des données mock. Il contient :
- Le header flottant `KaraWordmark` + icônes Bell + SlidersHorizontal → **à ne PAS toucher**
- Le composant `VehicleCard` inline avec type `Vehicle` (mock) → **à adapter uniquement** (pas extraction — c'est Story 2.2)
- La `FlatList` avec scroll-snap opérationnelle → **à enrichir** (removeClippedSubviews, onEndReached)
- La logique `containerHeight` via `onLayout` → **à conserver telle quelle**

### Implémentation complète de `use-vehicles.ts`

```ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { supabase } from '@/lib/supabase';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export type VehicleWithRelations = VehicleRow & {
  vehicle_photos: Pick<VehiclePhotoRow, 'id' | 'url' | 'position' | 'is_cover'>[];
  profiles: Pick<ProfileRow, 'id' | 'username' | 'display_name' | 'avatar_url' | 'city'>;
};

const FEED_PAGE_SIZE = 10;

export function useVehicles() {
  return useInfiniteQuery<VehicleWithRelations[], PostgrestError>({
    queryKey: ['vehicles'],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_photos(id, url, position, is_cover),
          profiles!vehicles_owner_id_fkey(id, username, display_name, avatar_url, city)
        `)
        .eq('is_published', true)
        .lt('created_at', pageParam as string)
        .order('created_at', { ascending: false })
        .limit(FEED_PAGE_SIZE);

      if (error) throw error;
      return (data ?? []) as VehicleWithRelations[];
    },
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (lastPage) => {
      if (lastPage.length < FEED_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].created_at ?? undefined;
    },
  });
}
```

### Adaptation de `VehicleCard` — mapping types DB → affichage

Le composant reste **inline dans `index.tsx`** (extraction en `components/vehicle/VehicleCard.tsx` = Story 2.2).

**Remplacement du type prop :**
```ts
// Avant (mock)
function VehicleCard({ vehicle, cardHeight }: { vehicle: Vehicle; cardHeight: number })

// Après (DB)
function VehicleCard({ vehicle, cardHeight }: { vehicle: VehicleWithRelations; cardHeight: number })
```

**Valeurs dérivées à calculer en haut du composant :**
```ts
const displayName = `${vehicle.brand} ${vehicle.model}`;
const specsArr = [
  vehicle.displacement,
  vehicle.power != null ? `${vehicle.power}ch` : null,
  vehicle.transmission,
].filter(Boolean);
const displaySpecs = specsArr.join(' · ');

const coverPhoto = vehicle.vehicle_photos.find((p) => p.is_cover) ?? vehicle.vehicle_photos[0];
const photoCount = vehicle.vehicle_photos.length;
const ownerUsername = vehicle.profiles?.username ?? '';
const ownerCity = vehicle.profiles?.city ?? vehicle.city ?? '';

// Emoji drapeau depuis country_code ISO 3166-1 alpha-2
const COUNTRY_EMOJI: Record<string, string> = {
  JP: '🇯🇵', FR: '🇫🇷', DE: '🇩🇪', IT: '🇮🇹', US: '🇺🇸',
  GB: '🇬🇧', ES: '🇪🇸', KR: '🇰🇷', SE: '🇸🇪', BE: '🇧🇪',
};
const countryEmoji = COUNTRY_EMOJI[vehicle.country_code ?? ''] ?? '';

// Libellé type
const TYPE_LABEL: Record<string, string> = {
  car: 'Voiture', moto: 'Moto', van: 'Van',
  truck: 'Camion', bike: 'Vélo', classic: 'Classic',
};
const typeLabel = TYPE_LABEL[vehicle.type] ?? vehicle.type;

// Icon type (lucide)
const TypeIcon = ['moto', 'bike'].includes(vehicle.type) ? Bike : Car;
```

**Photo de couverture :**
```tsx
{/* Fond photo — cover réel ou placeholder */}
{coverPhoto ? (
  <Image
    source={{ uri: buildImageUrl(coverPhoto.url, { width: 800, quality: 80 }) }}
    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    resizeMode="cover"
  />
) : (
  <KaraPhoto
    tone="crimson-rwd"
    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
  />
)}
```

**Compteur de likes** — non disponible en DB avant Story 5.1. Afficher `0` :
```tsx
<Text>0</Text>
```

**Badge type** — adapter pour utiliser `typeLabel` et `TypeIcon` :
```tsx
<KaraBadge
  tone="glass"
  icon={<TypeIcon size={12} color="#fff" strokeWidth={2} />}
  label={typeLabel}
/>
```

**Badge pays + photo index** — utiliser `countryEmoji` et `photoCount` :
```tsx
<Text style={{ fontSize: 13 }}>{countryEmoji}</Text>
<Text ...>· {photoIdx + 1}/{photoCount}</Text>
```

**Photo dots** — utiliser `photoCount` au lieu de `vehicle.photos` :
```tsx
{Array.from({ length: photoCount }).map((_, idx) => ( ... ))}
```

### Skeleton de chargement

```tsx
// Avant le return principal dans DiscoverScreen
if (isLoading) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0F', paddingTop: 14, paddingBottom: 4 }}>
      {/* Header identique */}
      <View style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, zIndex: 20, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} pointerEvents="box-none">
        <KaraWordmark size={22} color="#fff" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(17,17,24,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={18} color="#fff" />
          </View>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(17,17,24,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={18} color="#fff" strokeWidth={1.6} />
          </View>
        </View>
      </View>
      {/* Skeleton card */}
      <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 56 }}>
        <View style={{ flex: 1, borderRadius: 28, backgroundColor: '#111118' }} />
      </View>
    </View>
  );
}
```

### useEffect pour l'erreur

```tsx
// Dans DiscoverScreen, après le hook
useEffect(() => {
  if (isError && error) {
    Toast.show({ type: 'error', text1: handleSupabaseError(error) });
  }
}, [isError]);
```

**Import requis :** `import Toast from 'react-native-toast-message';`

### FlatList — changements à apporter

```tsx
<FlatList
  data={items}                            // ← était VEHICLE_DATA
  keyExtractor={(item) => item.id}
  pagingEnabled
  showsVerticalScrollIndicator={false}
  decelerationRate="fast"
  snapToAlignment="start"
  snapToInterval={containerHeight}
  removeClippedSubviews={true}            // ← NOUVEAU (NFR1)
  onEndReached={() => {                   // ← NOUVEAU (pagination)
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }}
  onEndReachedThreshold={0.5}             // ← NOUVEAU
  renderItem={({ item }) => (
    <VehicleCard vehicle={item} cardHeight={containerHeight} />
  )}
  getItemLayout={(_, index) => ({
    length: containerHeight,
    offset: containerHeight * index,
    index,
  })}
/>
```

### Pièges critiques

#### Piège n°1 : `useInfiniteQuery` v5 — `initialPageParam` obligatoire

TanStack Query v5 (`^5.100.5` installé) exige `initialPageParam`. Sans lui, TypeScript error. Ne pas utiliser l'API v4 (`defaultPageParam` n'existe pas).

```ts
// ✅ v5
useInfiniteQuery({
  initialPageParam: new Date().toISOString(),
  getNextPageParam: ...
})

// ❌ v4 (brisé)
useInfiniteQuery({
  queryFn: ({ pageParam = new Date().toISOString() }) => ...
})
```

#### Piège n°2 : FK Supabase — utiliser le nom exact

```ts
// ✅ Correct — nom FK généré par PostgreSQL
'profiles!vehicles_owner_id_fkey(id, username, display_name, avatar_url, city)'

// ❌ Incorrect — PostgREST ne saura pas quelle FK utiliser
'profiles(id, username, ...)'
```

Si l'erreur PostgREST "Could not embed because more than one relationship" apparaît : le FK name est peut-être différent. Vérifier avec `supabase inspect db relationships` ou dans Supabase Studio → Table Editor → Foreign Keys.

#### Piège n°3 : `handleSupabaseError` n'accepte que `PostgrestError`

```ts
// ✅ Correct — l'erreur throwée dans queryFn EST un PostgrestError
if (isError && error) {
  Toast.show({ type: 'error', text1: handleSupabaseError(error) });
}

// ❌ Incorrect
handleSupabaseError(error as Error); // type mismatch
```

Typer explicitement `useInfiniteQuery<VehicleWithRelations[], PostgrestError>` pour que `error` soit du bon type.

#### Piège n°4 : `profiles` peut être `null` si RLS bloque

Si la RLS bloque la lecture des profils (utilisateur non-auth), `profiles` sera `null`. Toujours utiliser `vehicle.profiles?.username ?? ''` (optional chaining).

#### Piège n°5 : `Image` de react-native, pas d'expo-image

`expo-image` n'est PAS dans les dépendances (`package.json` vérifié). Utiliser `import { Image } from 'react-native'`. Ne pas installer expo-image.

#### Piège n°6 : `coverPhoto.url` est un chemin Storage, pas une URL complète

```ts
// ✅ Correct — url stockée = chemin Storage brut (ex: "vehicles/abc123/photo.jpg")
buildImageUrl(coverPhoto.url, { width: 800, quality: 80 })

// ❌ Incorrect — ne pas concaténer manuellement
`${SUPABASE_URL}/storage/v1/object/public/${coverPhoto.url}`
```

#### Piège n°7 : ne pas extraire `VehicleCard` dans `components/vehicle/`

L'extraction en `components/vehicle/VehicleCard.tsx` est **Story 2.2**. Dans Story 2.1, `VehicleCard` reste inline dans `index.tsx`. Ne pas anticiper.

#### Piège n°8 : `photoIdx` = index 0-based en local state

Le mock avait `photoIdx: 1` (1-based). En Story 2.1, garder `const [photoIdx, setPhotoIdx] = useState(0)` et afficher `photoIdx + 1` dans le badge. Le carousel swipe (qui changera `photoIdx`) est Story 2.2.

### Learnings des stories précédentes

- **Path alias** : utiliser `@/lib/...` dans `index.tsx` (déjà configuré) ✅
- **Toast** : déjà monté dans `_layout.tsx` — appeler `Toast.show()` sans setup supplémentaire ✅
- **Imports `_layout.tsx`** utilisent `../lib/...` (relatif) — dans `(tabs)/index.tsx`, utiliser `@/lib/...` (alias)
- **`lucide-react-native`** installé — `Bell`, `SlidersHorizontal`, `Car`, `Bike` déjà importés dans `index.tsx` ✅
- **`useSafeAreaInsets`** déjà importé et utilisé dans `index.tsx` — conserver

### Imports à ajouter dans `index.tsx`

```tsx
import { Image } from 'react-native';
import { useEffect } from 'react';          // si pas déjà présent
import Toast from 'react-native-toast-message';
import { useVehicles, VehicleWithRelations } from '@/lib/hooks/use-vehicles';
import { buildImageUrl } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase-error';
```

### Imports à RETIRER de `index.tsx`

```tsx
// Retirer useRef (si seul useState/useRef était pour les mocks)
// Retirer l'import ScrollView si non utilisé ailleurs dans la page
// (vérifier — ScrollView est utilisé pour les tags scrollables → garder)
```

### Scope de cette story vs Story 2.2

| Feature | Story 2.1 | Story 2.2 |
|---------|-----------|-----------|
| Hook `use-vehicles.ts` | ✅ Créer | — |
| Données réelles en feed | ✅ | — |
| Pagination cursor | ✅ | — |
| Skeleton + error | ✅ | — |
| Photo couverture (Image simple) | ✅ | — |
| Carousel photos horizontal | — | ✅ |
| `VehicleCard` extrait en composant | — | ✅ |
| `VehiclePhotoCarousel` | — | ✅ |
| Compteur photos interactif | — | ✅ |
| Likes fonctionnels | — | Story 5.1 |

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Correction : colonne `vehicle_photos.url` n'existe pas dans le schéma généré — nom réel : `storage_path`. Pick type et select Supabase corrigés.

### Completion Notes List

- `app/lib/hooks/use-vehicles.ts` créé : `useInfiniteQuery` TanStack Query v5, cursor `created_at`, jointure `vehicle_photos` + `profiles!vehicles_owner_id_fkey`, type `VehicleWithRelations` exporté
- `app/(tabs)/index.tsx` : `VEHICLE_DATA` mock supprimé, `VehicleCard` adapté pour `VehicleWithRelations` (displayName, displaySpecs, coverUrl, countryEmoji, typeLabel), FlatList enrichie (`removeClippedSubviews`, `onEndReached`, `onEndReachedThreshold`), skeleton chargement + toast erreur ajoutés
- Photo couverture : `buildImageUrl(coverPhoto.storage_path, ...)` → `<Image>` RN ; fallback `<KaraPhoto>` si aucune photo
- `npx tsc --noEmit` : aucune erreur ✅

### File List

- `app/lib/hooks/use-vehicles.ts` (créé)
- `app/app/(tabs)/index.tsx` (modifié)

## Change Log

- 2026-04-29 : Story créée — Epic 2 story 2.1, Feed Discover données réelles + pagination
- 2026-04-29 : Implémentation complète — use-vehicles.ts + index.tsx adaptés, tsc OK
