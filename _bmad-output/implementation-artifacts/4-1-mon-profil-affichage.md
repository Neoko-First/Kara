# Story 4.1: Mon profil (affichage)

Status: review

## Story

As a utilisateur,
I want voir mon profil avec mes véhicules, mes stats et ma bio,
so that je peux consulter et partager ma présence sur Kara.

## Acceptance Criteria

1. **Chargement du profil :** `lib/hooks/use-profile.ts` charge le profil via TanStack Query (query key `['profile', userId]`) en combinant profil, véhicules avec photos et compteurs follows
2. **Cover photo :** le cover (hauteur 230) affiche la photo de couverture (`is_cover = true`) du premier véhicule de l'utilisateur via `buildImageUrl()` ; si aucun véhicule n'existe, un gradient plein `kara-bg → kara-surface` est affiché à la place
3. **Avatar :** l'avatar circulaire (`KaraAvatar`) chevauche le cover en bas à gauche ; si `avatar_url` est défini dans le profil, la vraie image est affichée via `buildImageUrl()` ; sinon l'initiale du `display_name` est affichée en fallback
4. **Identité :** le nom display (`display_name`), @pseudo (`username`), ville (`city`) et bio sont affichés avec les valeurs réelles de la table `profiles`
5. **Tags :** les tags du profil (`tags[]`) s'affichent via `KaraTag` ; si le tableau est vide ou null, la ligne tags est masquée
6. **Compteurs :** `X VÉHICULES · X ABONNÉS · X ABONNEMENTS` affichent les vraies valeurs (count véhicules publiés, count follows reçus, count follows envoyés)
7. **Tabs :** les deux onglets "Véhicules" et "Favoris" permettent de switcher ; l'onglet Véhicules affiche la grid 3 colonnes des builds publiés de l'utilisateur ; l'onglet Favoris affiche un état vide (scope Story 5.3)
8. **Grid véhicules :** chaque cellule de la grid affiche la photo de couverture du véhicule via `buildImageUrl(storagePath, { width: 300, quality: 75 })` et le label `brand model` ; si aucun véhicule, un état vide s'affiche dans la grid
9. **Bouton Modifier :** le bouton "Modifier" (outlined) est visible et navigue vers l'écran de modification (scope Story 4.2) ; le bouton settings ⚙️ est présent en haut à droite de la cover
10. **Erreurs :** si le chargement du profil échoue, `handleSupabaseError()` est appelé et un toast en français s'affiche
11. **TypeScript :** `npx tsc --noEmit` depuis `app/` passe sans erreur

## Tasks / Subtasks

- [x] Étendre `KaraAvatar` pour accepter une vraie image URI (AC: 3)
  - [x] Ajouter prop optionnelle `uri?: string` à l'interface `Props`
  - [x] Si `uri` est fourni, passer `src={uri}` à `KaraPhoto` (qui gère déjà la prop `src` — pas besoin d'un `Image` séparé)
  - [x] Garder le fallback `KaraPhoto` + initiale si `uri` est absent
  - [x] Ne pas casser les usages existants (aucun appel actuel ne passe `uri`)

- [x] Créer `app/lib/hooks/use-profile.ts` (AC: 1, 2, 3, 6)
  - [x] Définir un type `ProfileWithStats` : `profil + vehicles (avec vehicle_photos) + followerCount + followingCount`
  - [x] Implémenter `useProfile(userId: string)` via `useQuery` (query key `['profile', userId]`)
  - [x] Requête 1 : `supabase.from('profiles').select('*').eq('id', userId).single()` → données profil
  - [x] Requête 2 : `supabase.from('vehicles').select('*, vehicle_photos(id, storage_path, position, is_cover)').eq('owner_id', userId).eq('is_published', true).order('created_at', { ascending: false })` → liste véhicules + photos
  - [x] Requête 3 : `supabase.from('follows').select('*', { count: 'exact', head: true }).eq('target_id', userId).eq('target_type', 'profile')` → followerCount
  - [x] Requête 4 : `supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId).eq('target_type', 'profile')` → followingCount
  - [x] Combiner les 4 via `Promise.all` dans la `queryFn` pour un seul cache entry
  - [x] Gérer les erreurs : si l'une des requêtes retourne une `error`, throw pour que TanStack Query passe en `isError`

- [x] Modifier `app/app/(tabs)/profile.tsx` (AC: 2, 3, 4, 5, 6, 7, 8, 9, 10)
  - [x] Supprimer les constantes `GRID` et `STATS` hardcodées
  - [x] Récupérer `userId` depuis `useAuthStore((s) => s.user?.id)`
  - [x] Appeler `useProfile(userId ?? '')` et destructurer `{ data, isLoading, isError, error }`
  - [x] Afficher un `ActivityIndicator` centré pendant `isLoading`
  - [x] Si `isError`, appeler `handleSupabaseError` et afficher un toast via `Toast.show()` dans un `useEffect`
  - [x] Cover photo : `KaraPhoto` avec `src={coverUrl}` (fallback `tone="cyan-tokyo"` si pas de véhicule)
  - [x] Avatar : `KaraAvatar` avec `uri={avatarUrl}` si `avatar_url` non null ; initial = première lettre de `display_name ?? username`
  - [x] Stats : valeurs dynamiques `vehicleCount`, `followerCount`, `followingCount`
  - [x] Tags : rendu conditionnel si `tags.length > 0`
  - [x] Grid Véhicules : grid 3 colonnes avec `KaraPhoto src={imgUrl}` ; état vide si aucun véhicule
  - [x] Grid Favoris : état vide fixe "Tes favoris apparaîtront ici" (scope Story 5.3)
  - [x] Bouton Modifier : visible, sans navigation (scope Story 4.2)

- [x] Vérification TypeScript (AC: 11)
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer / modifier

```
app/components/shared/KaraAvatar.tsx        ← MODIFIER (ajouter prop uri)
app/lib/hooks/use-profile.ts                ← CRÉER (nouveau hook)
app/app/(tabs)/profile.tsx                  ← MODIFIER (remplacer mocks par données réelles)
```

### Ne PAS modifier

- `lib/supabase.ts`, `types/database.ts`, `lib/supabase-error.ts` — hors scope
- `lib/stores/use-auth-store.ts` — complet, pas de changement nécessaire
- `lib/query-client.ts` — singleton déjà configuré
- `components/shared/KaraPhoto.tsx`, `KaraTag.tsx`, `KaraButton.tsx` — hors scope
- `lib/hooks/use-vehicles.ts` — hors scope (feed public, pas profil)

### Schéma DB — champs utilisés

**Table `profiles` :**
```ts
id: string
username: string              // @pseudo
display_name: string | null   // Nom affiché
bio: string | null
city: string | null
tags: string[] | null
avatar_url: string | null     // chemin Supabase Storage (pas une URL complète)
```

**Table `vehicles` (filtre `owner_id = userId AND is_published = true`) :**
```ts
id, brand, model, type, created_at, ...
vehicle_photos: { id, storage_path, position, is_cover }[]
```

**Table `follows` :**
```ts
// Followers : target_id = userId, target_type = 'profile'
// Following : follower_id = userId, target_type = 'profile'
```

### Type recommandé pour `use-profile.ts`

```ts
import { Database } from '@/types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];

export type VehicleWithPhotos = VehicleRow & {
  vehicle_photos: Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>[];
};

export interface ProfileWithStats {
  profile: ProfileRow;
  vehicles: VehicleWithPhotos[];
  followerCount: number;
  followingCount: number;
}
```

### Implémentation recommandée de `useProfile`

```ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useProfile(userId: string) {
  return useQuery<ProfileWithStats>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const [profileResult, vehiclesResult, followersResult, followingResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('vehicles')
          .select('*, vehicle_photos(id, storage_path, position, is_cover)')
          .eq('owner_id', userId)
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('target_id', userId)
          .eq('target_type', 'profile'),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId)
          .eq('target_type', 'profile'),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (vehiclesResult.error) throw vehiclesResult.error;
      if (followersResult.error) throw followersResult.error;
      if (followingResult.error) throw followingResult.error;

      return {
        profile: profileResult.data,
        vehicles: (vehiclesResult.data ?? []) as VehicleWithPhotos[],
        followerCount: followersResult.count ?? 0,
        followingCount: followingResult.count ?? 0,
      };
    },
    enabled: !!userId,
  });
}
```

### Extension de `KaraAvatar` — changement minimal

```tsx
// Ajouter à l'interface Props
interface Props {
  size?: number;
  tone?: PhotoTone;
  initial?: string;
  online?: boolean;
  uri?: string;   // ← NOUVEAU : vraie image URI si disponible
}

// Dans le rendu, remplacer KaraPhoto par Image si uri est fourni
{uri ? (
  <Image
    source={{ uri }}
    style={{ width: size, height: size, borderRadius: size / 2, ... }}
  />
) : (
  <KaraPhoto tone={tone} style={...}>
    <Text>{initial}</Text>
  </KaraPhoto>
)}
```

### Piège critique n°1 : `avatar_url` est un chemin Storage, pas une URL complète

Comme `vehicle_photos.storage_path`, la colonne `profiles.avatar_url` est un chemin Supabase Storage brut (ex: `avatars/abc123.jpg`), **pas** une URL complète. Toujours passer par `buildImageUrl()`.

Bucket avatar : `avatars` (différent du bucket `vehicles`). La fonction `buildImageUrl` construit le chemin avec le nom du bucket :
```
/storage/v1/render/image/public/avatars/abc123.jpg
```
Vérifier que le path passé à `buildImageUrl` inclut bien le nom de bucket si nécessaire, ou que le path stocké en DB est déjà préfixé du bon bucket. Le pattern de `use-create-vehicle.ts` sert de référence : le `storage_path` ne contient pas le nom du bucket, et `buildImageUrl` est appelé avec `path` directement. Si `avatar_url` suit la même convention, s'assurer que le chemin inclut le préfixe `avatars/`.

### Piège critique n°2 : `supabase.from(...).select('*', { count: 'exact', head: true })`

L'option `{ count: 'exact', head: true }` retourne uniquement le count (pas les lignes). Le résultat a `.count` mais `.data` est null. Ne pas déstructurer `data` sur ces requêtes — lire uniquement `.count`.

```ts
const { count, error } = await supabase
  .from('follows')
  .select('*', { count: 'exact', head: true })
  .eq('target_id', userId)
  .eq('target_type', 'profile');
// count = nombre d'abonnés, data = null (normal)
```

### Piège critique n°3 : `userId` peut être undefined au montage

`useAuthStore((s) => s.user?.id)` peut retourner `undefined` si `loading` est encore `true`. La query `useProfile` a `enabled: !!userId` pour ne pas se lancer sans userId.

Dans `profile.tsx`, ajouter un guard précoce :
```tsx
const userId = useAuthStore((s) => s.user?.id);
if (!userId) return null; // ou ActivityIndicator
const { data, isLoading, isError } = useProfile(userId);
```

### Piège critique n°4 : `handleSupabaseError` retourne une string, pas void

```ts
import { handleSupabaseError } from '@/lib/supabase-error';
import Toast from 'react-native-toast-message';

// ✅ Correct
const message = handleSupabaseError(error);
Toast.show({ type: 'error', text1: message });

// ❌ Ne pas utiliser handleSupabaseError() directement comme toast
```

### Piège critique n°5 : erreur TypeScript sur `isError` + `error`

TanStack Query type `error` comme `unknown` par défaut. Pour l'utiliser dans `handleSupabaseError` qui attend `PostgrestError`, caster :

```ts
import { PostgrestError } from '@supabase/supabase-js';

if (isError && error) {
  const msg = handleSupabaseError(error as PostgrestError);
  Toast.show({ type: 'error', text1: msg });
}
```

### Cover photo — requête dans le queryFn

La photo de couverture du profil = photo `is_cover = true` du premier véhicule publié. Elle est déjà incluse dans la requête `vehicles` (select avec `vehicle_photos`). Dans `profile.tsx` :

```tsx
const coverPhoto = data?.vehicles[0]?.vehicle_photos.find(p => p.is_cover);
const coverUrl = coverPhoto ? buildImageUrl(coverPhoto.storage_path, { width: 600, quality: 85 }) : null;
```

Si `coverUrl` est null → afficher le gradient `kara-bg → kara-surface` (pas besoin de conditionnel complexe, `LinearGradient` déjà utilisé dans la cover).

### État actuel de `profile.tsx` — ce qui change

Le fichier actuel (`app/app/(tabs)/profile.tsx`) est un composant 100% statique avec des données mockées :
- `GRID` : tableau de photos placeholder `KaraPhoto` avec `tone` et `label` → remplacer par les véhicules réels
- `STATS` : `['6', '2.4k', '312']` hardcodés → remplacer par compteurs dynamiques
- Avatar : `<KaraPhoto tone="track-magenta">` → `<KaraAvatar uri={...}>` avec vraie image
- Cover : `<KaraPhoto tone="cyan-tokyo">` → `<Image source={{ uri: coverUrl }}>` ou gradient fallback
- Données texte : "Aki — JDM Build", "@aki_drift", "Lyon, 69", bio hardcodée → données `profile`

La structure JSX (ScrollView, LinearGradient, tabs, grid) est conservée telle quelle.

### Pattern grid 3 colonnes pour les véhicules

Conserver la même structure visuelle que l'existant :
```tsx
<View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
  {data.vehicles.map((v) => {
    const cover = v.vehicle_photos.find(p => p.is_cover);
    const imgUrl = cover ? buildImageUrl(cover.storage_path, { width: 300, quality: 75 }) : null;
    return (
      <View key={v.id} style={{ width: '31.5%', aspectRatio: 1, borderRadius: 6, overflow: 'hidden' }}>
        {imgUrl ? (
          <Image source={{ uri: imgUrl }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#1E1E2E' }} />
        )}
        {/* Gradient + label */}
      </View>
    );
  })}
</View>
```

### Learnings des stories précédentes

- Sélecteurs Zustand granulaires : `useAuthStore((s) => s.user?.id)` — pas `useAuthStore().user` ✅
- `@/` path alias fonctionne partout sous `app/` ✅
- `Image` de `react-native` (pas `expo-image`) pour les images réseau ✅
- `npx tsc --noEmit` depuis `app/` (pas depuis la racine) ✅
- Les erreurs StorageError diffèrent de PostgrestError — pour ce hook, seules des `PostgrestError` sont possibles ✅
- Les `queryFn` async qui throw déclenchent automatiquement `isError` dans TanStack Query ✅
- `queryClient` est exporté depuis `@/lib/query-client` pour l'invalidation future (Story 4.2) ✅

### Scope de cette story vs stories adjacentes

| Feature | Story 4.1 | Story 4.2 | Story 4.3 |
|---------|-----------|-----------|-----------|
| Affichage profil propre (mon profil) | **✅** | — | — |
| `use-profile.ts` (hook) | **✅** | réutilisé | réutilisé |
| Bouton Modifier → navigation | — | **✅** | — |
| Formulaire modification profil | — | **✅** | — |
| Profil d'un autre utilisateur | — | — | **✅** |
| Bouton Suivre | — | — | **✅** |
| `use-follow.ts` | — | — | **✅** |
| Onglet Favoris peuplé | — | — | — (Story 5.3) |

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns]
- [Source: _bmad-output/implementation-artifacts/3-3-pipeline-upload-publication-du-vehicule.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `KaraPhoto` possède déjà une prop `src` — l'extension de `KaraAvatar` passe `src={uri}` directement à `KaraPhoto`, sans ajouter de composant `Image` séparé (plus simple et cohérent).
- `npx tsc --noEmit` — zéro erreur au premier passage.

### Completion Notes List

- Étendu `KaraAvatar` avec prop `uri?: string` — si fourni, `src` est passé à `KaraPhoto` et l'initiale est masquée ; aucun usage existant impacté.
- Créé `lib/hooks/use-profile.ts` : `useQuery` avec `Promise.all` de 4 requêtes Supabase (profil, véhicules+photos, followers count, following count) ; `enabled: !!userId`.
- Refonte de `profile.tsx` : suppression des mocks `GRID`/`STATS`, données réelles depuis `useProfile`, `ActivityIndicator` pendant le chargement, toast sur erreur via `useEffect`, cover via `KaraPhoto src`, avatar via `KaraAvatar uri`, tags conditionnels, grid dynamique avec état vide, onglet Favoris en état vide (scope 5.3).

### File List

- app/components/shared/KaraAvatar.tsx (MODIFIÉ)
- app/lib/hooks/use-profile.ts (CRÉÉ)
- app/app/(tabs)/profile.tsx (MODIFIÉ)

### Change Log

- 2026-05-01 : Story 4.1 implémentée — écran Mon Profil branché sur les données Supabase réelles (profil, véhicules, follows). Extension minimale de KaraAvatar pour les vrais avatars.
