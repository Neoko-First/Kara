# Story 5.3: Bookmarks (favoris) & partage natif

Status: review

## Story

As a utilisateur,
I want enregistrer les builds qui m'inspirent et les partager,
so that je peux constituer une collection personnelle et recommander des builds à mes proches.

## Acceptance Criteria

1. **Given** l'utilisateur voit un véhicule (feed `VehicleCard` ou page détail `vehicle/[id].tsx`), **When** il appuie sur le bouton 🔖, **Then** une entrée est créée dans la table `bookmarks` dédiée (`vehicle_id`, `user_id`) ; le bouton passe à l'état actif (`kara-primary` / couleur `#7C3AED`) ; un second tap supprime l'entrée et revient à l'état inactif.

2. **Given** l'utilisateur est sur l'onglet "Favoris" de son profil (`profile.tsx`), **When** l'écran est affiché, **Then** une grid 3 colonnes de vignettes (identique à l'onglet Véhicules) affiche les véhicules bookmarkés, chargés via `use-bookmarks.ts` (query key `['bookmarks', userId]`). Si aucun favori, un état vide s'affiche ("Aucun favori pour l'instant").

3. **Given** l'utilisateur appuie sur l'icône 📤 (Share2) dans `VehicleCard` ou `vehicle/[id].tsx`, **When** l'action est déclenchée, **Then** `Share.share()` de React Native est appelé avec le message : `"${brand} ${model} par @${ownerUsername} sur Kara 🔧"`

4. **Given** l'utilisateur n'est pas authentifié et appuie sur 🔖, **When** l'action est déclenchée, **Then** un Toast d'erreur en français s'affiche ("Tu dois être connecté pour sauvegarder un favori.") ; aucune insertion n'est effectuée.

## Tasks / Subtasks

- [x] Créer la migration SQL pour la table `bookmarks` (AC: 1, 2)
  - [x] Créer le fichier de migration dans `supabase/migrations/` (numéroter après la dernière existante)
  - [x] SQL : `create table bookmarks`, RLS policies (lecture propriétaire, insertion/suppression authentifié)
  - [ ] Vérifier en DB que la table est bien créée (SQL Editor Supabase Dashboard) — action manuelle requise
- [x] Créer `app/lib/hooks/use-bookmark.ts` — hook état bookmark d'un véhicule (AC: 1, 4)
  - [x] Query TanStack `['bookmark', currentUserId, vehicleId]` : vérifier si entry existe en `bookmarks`
  - [x] Mutation toggle : insert si absent, delete si présent
  - [x] Guard non-authentifié dans `mutationFn` → Toast erreur français
  - [x] `onSuccess` : mise à jour optimiste du cache + invalidation `['bookmarks', userId]`
  - [x] Gestion erreurs via `handleSupabaseError()` + Toast
- [x] Créer `app/lib/hooks/use-bookmarks.ts` — hook liste des favoris d'un utilisateur (AC: 2)
  - [x] Query TanStack `['bookmarks', userId]` : SELECT avec join `vehicles!inner(*, vehicle_photos(...))`
  - [x] Retourner les véhicules en ordre `created_at DESC`
  - [x] Type retour : `VehicleWithPhotos[]` (réutiliser le type de `use-profile.ts`)
- [x] Modifier `app/components/vehicle/VehicleCard.tsx` (AC: 1, 3)
  - [x] Remplacer le `.map([MessageCircle, Bookmark, Share2], ...)` générique par 3 Pressables distincts
  - [x] Bouton Bookmark : brancher `useBookmark({ vehicleId: vehicle.id })`, colorer en `#7C3AED` si `isBookmarked`
  - [x] Bouton Share2 : brancher `Share.share()` avec message formaté
  - [x] Bouton MessageCircle : laisser en place (logique commentaires non requise ici)
- [x] Modifier `app/app/vehicle/[id].tsx` (AC: 1, 3)
  - [x] Ajouter import `Bookmark` depuis `lucide-react-native` et `Share` depuis `react-native`
  - [x] Ajouter import `useBookmark` depuis `@/lib/hooks/use-bookmark`
  - [x] Wirer le bouton Share2 existant (top action bar) sur `handleShare()` avec `Share.share()`
  - [x] Ajouter un bouton Bookmark dans la top action bar (entre Share2 et MoreHorizontal, ou au niveau de la barre sticky bas)
  - [x] Brancher `useBookmark({ vehicleId: id })` sur le bouton Bookmark
- [x] Modifier `app/app/(tabs)/profile.tsx` (AC: 2)
  - [x] Ajouter import `useBookmarks` depuis `@/lib/hooks/use-bookmarks`
  - [x] Appeler `useBookmarks(userId ?? '')` dans le composant
  - [x] Remplacer le placeholder "Tes favoris apparaîtront ici" par la grid réelle (clone de l'onglet Véhicules mais depuis les bookmarks)
  - [x] Ajouter état vide si aucun bookmark
- [x] Lancer `npx tsc --noEmit` depuis `app/` — 0 erreur attendu

## Dev Notes

### Décision architecturale — Table `bookmarks` dédiée

**Choix retenu : table `bookmarks` dédiée** (ne pas étendre la table `likes`).

**Justification** : La table `likes` possède la contrainte `check (target_type in ('vehicle', 'comment'))`. Y ajouter un bookmark via un champ `is_saved = true` nécessiterait une migration complexe sur une contrainte existante et mélange deux concepts métier distincts (appréciation publique vs. collection privée). Une table dédiée est plus claire et conforme au principe de séparation des responsabilités.

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(vehicle_id, user_id)
);
alter table bookmarks enable row level security;

create policy "Lecture propre bookmarks"
  on bookmarks for select using (auth.uid() = user_id);
create policy "Insertion bookmark authentifié"
  on bookmarks for insert with check (auth.uid() = user_id);
create policy "Suppression bookmark propriétaire"
  on bookmarks for delete using (auth.uid() = user_id);
```

### ⚠️ Contrainte critique héritée : PAS DE REACT-NATIVE-REANIMATED

`react-native-reanimated` provoque un crash `NullPointerException` sur Android avec `newArchEnabled: true` (cf. `app.json`). **Ne jamais importer `react-native-reanimated`** dans les nouveaux fichiers. Si animation nécessaire : `Animated` natif RN uniquement (pattern déjà utilisé dans `VehicleCard.tsx` — cf. `heartScale`).

### Hook `use-bookmark.ts` — Structure cible complète

```ts
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export function useBookmark({ vehicleId }: { vehicleId: string }) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: isBookmarked = false } = useQuery({
    queryKey: ['bookmark', currentUserId, vehicleId],
    queryFn: async () => {
      const { count } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId!)
        .eq('vehicle_id', vehicleId);
      return (count ?? 0) > 0;
    },
    enabled: !!currentUserId && !!vehicleId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        Toast.show({ type: 'error', text1: 'Tu dois être connecté pour sauvegarder un favori.' });
        return;
      }
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('vehicle_id', vehicleId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: userId, vehicle_id: vehicleId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['bookmark', currentUserId, vehicleId],
        !isBookmarked,
      );
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', currentUserId] });
      }
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: 'Impossible de mettre à jour les favoris.' });
      }
    },
  });

  return {
    isBookmarked,
    toggle: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
```

### Hook `use-bookmarks.ts` — Structure cible complète

```ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { VehicleWithPhotos } from '@/lib/hooks/use-profile';

export function useBookmarks(userId: string) {
  return useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('vehicle_id, vehicles!inner(*, vehicle_photos(id, storage_path, position, is_cover))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((b) => b.vehicles) as VehicleWithPhotos[];
    },
    enabled: !!userId,
  });
}
```

**Important** : `VehicleWithPhotos` est déjà exporté depuis `app/lib/hooks/use-profile.ts` — réutiliser ce type sans le dupliquer.

### Modification `VehicleCard.tsx` — Refactor des boutons d'action (zone critique)

**Zone à modifier** : la colonne d'actions droite (TikTok-style). Le code actuel mappe bêtement 3 icônes avec des Pressables inertes :

```tsx
// ❌ CODE ACTUEL — à remplacer entièrement :
{[MessageCircle, Bookmark, Share2].map((Icon, k) => (
  <Pressable key={k} style={{ ... }}>
    <Icon size={20} color="#fff" />
  </Pressable>
))}
```

**Code cible** — 3 Pressables distincts et fonctionnels, à insérer après le bloc Heart/likeCount :

```tsx
// ✅ CODE CIBLE — Bookmark bouton
const { isBookmarked, toggle: toggleBookmark, isPending: isBookmarkPending } = useBookmark({
  vehicleId: vehicle.id,
});

const handleShare = async () => {
  await Share.share({
    message: `${displayName} par @${ownerUsername} sur Kara 🔧`,
  });
};

// Dans le JSX, remplacer le .map par :
<Pressable
  onPress={() => setCommentsOpen(true)}   // commentaires — sera branché Story future
  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
>
  <MessageCircle size={20} color="#fff" />
</Pressable>

<Pressable
  onPress={toggleBookmark}
  disabled={isBookmarkPending}
  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
>
  <Bookmark
    size={20}
    color={isBookmarked ? '#7C3AED' : '#fff'}
    fill={isBookmarked ? '#7C3AED' : 'transparent'}
  />
</Pressable>

<Pressable
  onPress={handleShare}
  style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
>
  <Share2 size={20} color="#fff" />
</Pressable>
```

**Nouveaux imports à ajouter dans `VehicleCard.tsx`** :
```ts
import { Share } from 'react-native';                           // déjà présent dans RN, pas de package supp.
import { useBookmark } from '@/lib/hooks/use-bookmark';
```

### Modification `vehicle/[id].tsx` — Zones précises

Le fichier est actuellement ~390 lignes (modifié en 5-1 et 5-2). **Ne pas casser les fonctionnalités commentaires et likes existantes.**

**Zone 1 — Imports** : ajouter `Bookmark` aux imports lucide et `Share` depuis `react-native` :
```ts
import { ChevronLeft, Heart, Share2, MoreHorizontal, Car, Bike, MessageCircle, Bookmark } from 'lucide-react-native';
import { ..., Share } from 'react-native';
```

**Zone 2 — Imports hooks** : ajouter :
```ts
import { useBookmark } from '@/lib/hooks/use-bookmark';
```

**Zone 3 — Hooks dans le composant** (après `useLike`, avant les useState) :
```ts
const { isBookmarked, toggle: toggleBookmark, isPending: isBookmarkPending } = useBookmark({ vehicleId: id });
```

**Zone 4 — handleShare** (après les hooks, avant le return) :
```ts
const handleShare = async () => {
  const ownerUsername = data?.profiles?.username ?? '';
  await Share.share({
    message: `${data?.brand} ${data?.model} par @${ownerUsername} sur Kara 🔧`,
  });
};
```

**Zone 5 — Top action bar** (droite du header, ligne ~185 environ) — wirer Share2 et ajouter Bookmark. Le code actuel de la top action bar droite est :
```tsx
<View style={{ flexDirection: 'row', gap: 8 }}>
  {/* Heart — DÉJÀ BRANCHÉ */}
  <Pressable onPress={toggleLike} disabled={isLikePending} ...>
    <Heart size={16} color={isLiked ? '#F97316' : '#fff'} fill={isLiked ? '#F97316' : 'transparent'} />
  </Pressable>
  {/* Share2 — ACTUELLEMENT INERTE, à wirer */}
  <Pressable style={{ ... }}>
    <Share2 size={16} color="#fff" />
  </Pressable>
  {/* MoreHorizontal */}
  <Pressable style={{ ... }}>
    <MoreHorizontal size={16} color="#fff" />
  </Pressable>
</View>
```

Ajouter `onPress={handleShare}` sur le bouton Share2 existant, et insérer un bouton Bookmark entre Share2 et MoreHorizontal :
```tsx
<Pressable onPress={handleShare} style={{ ... }}>
  <Share2 size={16} color="#fff" />
</Pressable>
<Pressable onPress={toggleBookmark} disabled={isBookmarkPending} style={{ ... }}>
  <Bookmark
    size={16}
    color={isBookmarked ? '#7C3AED' : '#fff'}
    fill={isBookmarked ? '#7C3AED' : 'transparent'}
  />
</Pressable>
```

### Modification `profile.tsx` — Onglet Favoris

Le fichier importe déjà `Bookmark` de lucide. L'onglet "favs" est déjà géré dans le state (`useState<"vehicles" | "favs">("vehicles")`).

**Imports à ajouter** :
```ts
import { useBookmarks } from '@/lib/hooks/use-bookmarks';
```

**Hook à ajouter** dans le composant (après `useProfile`) :
```ts
const { data: bookmarkedVehicles = [] } = useBookmarks(userId ?? '');
```

**Remplacer le placeholder** dans l'onglet "favs" :
```tsx
{/* ❌ ACTUEL */}
{tab === "favs" && (
  <View style={{ alignItems: "center", paddingTop: 40 }}>
    <Text style={{ color: "#9594B5", fontFamily: "Inter_400Regular", fontSize: 14 }}>
      Tes favoris apparaîtront ici
    </Text>
  </View>
)}

{/* ✅ CIBLE */}
{tab === "favs" && (
  <View style={{ paddingHorizontal: 20 }}>
    {bookmarkedVehicles.length === 0 ? (
      <View style={{ alignItems: "center", paddingTop: 40 }}>
        <Text style={{ color: "#9594B5", fontFamily: "Inter_400Regular", fontSize: 14 }}>
          Aucun favori pour l'instant
        </Text>
      </View>
    ) : (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
        {bookmarkedVehicles.map((v) => {
          const cover = v.vehicle_photos.find((p) => p.is_cover);
          const imgUrl = cover ? buildImageUrl(cover.storage_path, { width: 300, quality: 75 }) : undefined;
          return (
            <Pressable
              key={v.id}
              onPress={() => router.push(`/vehicle/${v.id}`)}
              style={{ width: "31.5%", aspectRatio: 1, borderRadius: 6, overflow: "hidden", position: "relative" }}
            >
              <KaraPhoto tone="violet-dusk" src={imgUrl} style={{ width: "100%", height: "100%" }} />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%" }}
              />
              <Text style={{ position: "absolute", bottom: 6, left: 8, color: "#fff", fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 }}>
                {`${v.brand} ${v.model}`.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    )}
  </View>
)}
```

### Query key structure — règle stricte

```ts
['bookmark', userId, vehicleId]   // état bookmark d'un véhicule pour un utilisateur donné
['bookmarks', userId]             // liste des véhicules bookmarkés par un utilisateur
```

### Contraintes architecturales à respecter

- **Pas d'import `supabase` direct dans les composants** — tout via `use-bookmark.ts` et `use-bookmarks.ts`
- **Sélecteur Zustand granulaire** : `useAuthStore((s) => s.user?.id)` dans les hooks React ; `useAuthStore.getState().user?.id` dans les `mutationFn`
- **Destructurer `{ data, error }`** : jamais `.throwOnError()`
- **Erreurs en français** via `handleSupabaseError()` + Toast
- **Pas de Reanimated** — `Animated` natif RN si animation nécessaire
- **`buildImageUrl()`** pour toutes les URLs d'images
- **Type `VehicleWithPhotos`** : importer depuis `use-profile.ts`, ne pas redéfinir

### `Share` — API React Native native

`Share` est importé directement depuis `'react-native'` — **aucun package supplémentaire requis**. Fonctionnel sur iOS et Android sans configuration. Ne pas confondre avec `expo-sharing` (différent).

```ts
import { Share } from 'react-native';
await Share.share({ message: '...' });
```

### Project Structure Notes

- Nouveaux hooks : `app/lib/hooks/use-bookmark.ts` et `app/lib/hooks/use-bookmarks.ts` (convention snake-case kebab existante)
- Migration : `supabase/migrations/XXXX_create_bookmarks.sql` (numéro à la suite de la dernière migration)
- Aucun nouveau composant à créer — la grid "Favoris" réutilise les composants `KaraPhoto`, `LinearGradient`, `Pressable` existants déjà dans `profile.tsx`

### References

- [Source: epics.md — Epic 5, Story 5.3]
- [Source: architecture.md — Schéma table `likes` (contrainte check — justification table dédiée)]
- [Source: architecture.md — Patterns TanStack Query, Supabase, Zustand, Frontières architecturales]
- [Source: app/lib/hooks/use-like.ts — Pattern hook de référence pour use-bookmark.ts]
- [Source: app/lib/hooks/use-profile.ts — Type `VehicleWithPhotos` à réutiliser]
- [Source: app/components/vehicle/VehicleCard.tsx — Zone à refactorer : map générique des 3 boutons]
- [Source: app/app/vehicle/[id].tsx — Bouton Share2 inerte à wirer, bouton Bookmark à ajouter]
- [Source: app/app/(tabs)/profile.tsx — Onglet "favs" placeholder à remplir]
- [Source: 5-2-commentaires-sur-les-vehicules.md — Contrainte Reanimated, patterns hook, patterns Modal]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

`npx tsc --noEmit` : 0 erreur. Correction nécessaire : cast `as unknown as VehicleWithPhotos` dans `use-bookmarks.ts` car la table `bookmarks` n'est pas encore dans les types Supabase générés (migration à exécuter manuellement).

### Completion Notes List

- Créé `supabase/migrations/006_bookmarks.sql` : table `bookmarks` avec RLS (lecture propre, insertion/suppression authentifiées).
- Créé `app/lib/hooks/use-bookmark.ts` : query état bookmark + mutation toggle avec guard non-authentifié, optimistic update et invalidation `['bookmarks', userId]`.
- Créé `app/lib/hooks/use-bookmarks.ts` : query liste favoris avec join `vehicles!inner` + `vehicle_photos`, type `VehicleWithPhotos` réutilisé depuis `use-profile.ts`.
- Modifié `app/components/vehicle/VehicleCard.tsx` : refactoring du `.map([MessageCircle, Bookmark, Share2])` générique en 3 Pressables distincts — Bookmark branché sur `useBookmark`, Share2 sur `Share.share()`.
- Modifié `app/app/vehicle/[id].tsx` : bouton Share2 wiré sur `handleShare()`, nouveau bouton Bookmark inséré dans la top action bar entre Share2 et MoreHorizontal.
- Modifié `app/app/(tabs)/profile.tsx` : onglet Favoris implémenté avec grid 3 colonnes identique à l'onglet Véhicules, état vide si aucun favori.
- **Action manuelle requise** : exécuter la migration `006_bookmarks.sql` dans le SQL Editor Supabase Dashboard puis régénérer les types (`supabase gen types typescript`).

### File List

- `supabase/migrations/006_bookmarks.sql` — CRÉÉ
- `app/lib/hooks/use-bookmark.ts` — CRÉÉ
- `app/lib/hooks/use-bookmarks.ts` — CRÉÉ
- `app/components/vehicle/VehicleCard.tsx` — MODIFIÉ
- `app/app/vehicle/[id].tsx` — MODIFIÉ
- `app/app/(tabs)/profile.tsx` — MODIFIÉ
