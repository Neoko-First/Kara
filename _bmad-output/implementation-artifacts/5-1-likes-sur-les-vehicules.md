# Story 5.1: Likes sur les véhicules

Status: review

## Story

As a utilisateur,
I want liker les builds qui me plaisent,
so that je peux exprimer mon appréciation et les retrouver facilement.

## Acceptance Criteria

1. **Given** l'utilisateur voit un véhicule (feed ou page détail), **When** il appuie sur le bouton ❤️, **Then** une ligne est insérée dans la table `likes` (`target_id = vehicleId`, `target_type = 'vehicle'`, `user_id = auth.uid()`)
2. Le bouton ❤️ passe à l'état actif : couleur `kara-primary` (#F97316), icône remplie (`fill`), avec une animation Reanimated (spring scale + changement de couleur)
3. Le compteur de likes s'incrémente immédiatement (optimistic update) sans attendre la réponse Supabase
4. Appuyer à nouveau supprime la ligne (`likes`) et revient à l'état inactif (icône vide, couleur blanche)
5. Au rechargement de la page, l'état like et le compteur sont récupérés depuis la DB et reflétés correctement
6. Les boutons ❤️ dans la colonne d'actions du feed (VehicleCard.tsx — Story 2.2) sont fonctionnels
7. Un utilisateur non authentifié ne peut pas liker (RLS + guard côté hook : si pas de `currentUserId`, no-op)

## Tasks / Subtasks

- [x] Créer `app/lib/hooks/use-like.ts` (AC: 1, 3, 4, 5, 7)
  - [x] Query TanStack pour vérifier si l'utilisateur a déjà liké (`isLiked`, `likeCount`)
  - [x] Mutation toggle : insert si non liké, delete si déjà liké
  - [x] Optimistic update sur `isLiked` et `likeCount` via `queryClient.setQueryData`
  - [x] Guard : si `!currentUserId`, mutation no-op (ne rien faire)
  - [x] Invalidation queries après succès : `['like', ...]`, `['vehicle', vehicleId]`
  - [x] Gestion erreurs : `handleSupabaseError()` + `Toast.show()` en français
- [x] Modifier `app/components/vehicle/VehicleCard.tsx` (AC: 2, 3, 6)
  - [x] Extraire le bouton Heart du `.map()` actuel (le séparer des 3 autres icônes)
  - [x] Brancher `useLike({ targetId: vehicle.id, targetType: 'vehicle' })`
  - [x] Implémenter animation Reanimated : `useSharedValue` + `useAnimatedStyle` + `withSpring` sur le scale
  - [x] Changer couleur de l'icône : `#fff` si inactif, `#F97316` si actif
  - [x] Remplacer le `<Text>0</Text>` hardcodé par `likeCount` dynamique
  - [x] `disabled={isPending}` pendant la mutation
- [x] Modifier `app/app/vehicle/[id].tsx` (AC: 1, 2, 3, 4, 5)
  - [x] Importer `useLike` et `Heart` (lucide-react-native)
  - [x] Ajouter bouton ❤️ dans la rangée de boutons en haut (aux côtés de Share2 et MoreHorizontal)
  - [x] Même logique : `useLike({ targetId: id, targetType: 'vehicle' })`, animation, couleur, compteur

## Dev Notes

### Hook `use-like.ts` — Patron exact à suivre

Copier/adapter `app/lib/hooks/use-follow.ts`. Voici la structure cible :

```ts
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface UseLikeParams {
  targetId: string;
  targetType: 'vehicle' | 'comment';
}

export function useLike({ targetId, targetType }: UseLikeParams) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  // Query état like (isLiked)
  const { data: isLiked = false } = useQuery({
    queryKey: ['like', currentUserId, targetId, targetType],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId!)
        .eq('target_id', targetId)
        .eq('target_type', targetType);
      return (count ?? 0) > 0;
    },
    enabled: !!currentUserId && !!targetId,
  });

  // Query compteur total
  const { data: likeCount = 0 } = useQuery({
    queryKey: ['like-count', targetId, targetType],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('target_id', targetId)
        .eq('target_type', targetType);
      return count ?? 0;
    },
    enabled: !!targetId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return; // Guard non-authentifié
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('target_id', targetId)
          .eq('target_type', targetType);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: userId, target_id: targetId, target_type: targetType });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Optimistic update direct sans attendre la DB
      queryClient.setQueryData(
        ['like', currentUserId, targetId, targetType],
        !isLiked,
      );
      queryClient.setQueryData(
        ['like-count', targetId, targetType],
        (prev: number) => (isLiked ? Math.max(0, prev - 1) : prev + 1),
      );
      queryClient.invalidateQueries({ queryKey: ['vehicle', targetId] });
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: 'Impossible de liker pour le moment.' });
      }
    },
  });

  return {
    isLiked,
    likeCount,
    toggle: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
```

### Modification VehicleCard.tsx — Démanteler le `.map()` du Heart

**État actuel (lignes 177-214) :** Les 4 icônes `[Heart, MessageCircle, Bookmark, Share2]` sont dans un `.map()` sans logique. Il faut **sortir le Heart** de ce `.map()` et le gérer séparément.

```tsx
// ✅ Structure cible dans VehicleCard
const { isLiked, likeCount, toggle, isPending } = useLike({
  targetId: vehicle.id,
  targetType: 'vehicle',
});

// Valeur Reanimated pour le scale du cœur
const heartScale = useSharedValue(1);
const animatedHeartStyle = useAnimatedStyle(() => ({
  transform: [{ scale: heartScale.value }],
}));

const handleLike = () => {
  heartScale.value = withSpring(1.3, { damping: 3 }, () => {
    heartScale.value = withSpring(1);
  });
  toggle();
};

// Dans le rendu — remplacer le .map() par :
<View style={{ /* même styles */ }}>
  {/* Bouton ❤️ avec logique */}
  <Pressable onPress={handleLike} disabled={isPending}>
    <Animated.View style={animatedHeartStyle}>
      <Heart
        size={20}
        color={isLiked ? '#F97316' : '#fff'}
        fill={isLiked ? '#F97316' : 'transparent'}
      />
    </Animated.View>
  </Pressable>
  {/* Compteur dynamique */}
  <Text style={{ /* styles existants */ }}>
    {likeCount > 0 ? likeCount.toString() : ''}
  </Text>
  {/* 3 autres icônes restantes (sans logique pour l'instant) */}
  {[MessageCircle, Bookmark, Share2].map((Icon, k) => (
    <Pressable key={k} style={{ /* styles existants */ }}>
      <Icon size={20} color="#fff" />
    </Pressable>
  ))}
</View>
```

**Imports à ajouter dans VehicleCard.tsx :**
```ts
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useLike } from '@/lib/hooks/use-like';
```

### Modification vehicle/[id].tsx — Ajouter Heart dans les boutons haut

**État actuel (lignes 134-152) :** La rangée contient `[Share2, MoreHorizontal]` dans un `.map()`.

```tsx
// ✅ Dans vehicle/[id].tsx
const { isLiked, likeCount, toggle, isPending } = useLike({
  targetId: id,
  targetType: 'vehicle',
});

// Remplacer le .map() existant par des boutons séparés :
<View style={{ flexDirection: 'row', gap: 8 }}>
  <Pressable onPress={toggle} disabled={isPending} style={{ /* styles existants */ }}>
    <Heart size={16} color={isLiked ? '#F97316' : '#fff'} fill={isLiked ? '#F97316' : 'transparent'} />
  </Pressable>
  <Pressable style={{ /* styles existants */ }}>
    <Share2 size={16} color="#fff" />
  </Pressable>
  <Pressable style={{ /* styles existants */ }}>
    <MoreHorizontal size={16} color="#fff" />
  </Pressable>
</View>
```

**Import Heart à ajouter dans vehicle/[id].tsx :**
```ts
import { Share2, MoreHorizontal, Heart } from 'lucide-react-native';
import { useLike } from '@/lib/hooks/use-like';
```

### Contraintes critiques

- **Jamais d'import `supabase` direct dans les composants** — passer uniquement par `use-like.ts`
- **Sélecteurs Zustand granulaires** : `useAuthStore((s) => s.user?.id)` (pas `useAuthStore()`)
- **Dans `mutationFn`** : utiliser `useAuthStore.getState().user?.id` (pas le hook)
- **Destructurer `{ error }` toujours** : jamais `.throwOnError()`
- **Reanimated gelée à v3.16.7** — ne pas mettre à jour
- **Erreurs en français** via `handleSupabaseError()` + Toast

### Schéma DB — Table `likes` (déjà migrée)

```sql
create table likes (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null,
  target_type text not null check (target_type in ('vehicle', 'comment')),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(target_id, target_type, user_id)  -- empêche le double-like
);
alter table likes enable row level security;
```

La contrainte `unique(target_id, target_type, user_id)` empêche nativement le double-like. Si un insert double se produit, Supabase retourne une erreur PGRST (code `23505`) — gérer via `handleSupabaseError()`.

### Types disponibles dans `app/types/database.ts`

```ts
// Déjà généré — utiliser directement :
type LikeRow = Database['public']['Tables']['likes']['Row'];
// { id, target_id, target_type, user_id, created_at }
```

### Project Structure Notes

- `app/lib/hooks/use-like.ts` — À CRÉER (copier use-follow.ts comme base)
- `app/components/vehicle/VehicleCard.tsx` — À MODIFIER (lignes 177-214 principalement)
- `app/app/vehicle/[id].tsx` — À MODIFIER (lignes 134-152 pour les boutons haut)
- Aucun autre fichier ne doit être touché

**Vérification TypeScript obligatoire depuis `app/` :**
```sh
cd app && npx tsc --noEmit
```

### References

- [Source: epics.md — Epic 5, Story 5.1, lignes 436-451]
- [Source: architecture.md — Schéma table `likes`, lignes 164-173]
- [Source: architecture.md — Patterns Supabase & TanStack Query, lignes 220-227, 383-394]
- [Source: architecture.md — Frontières architecturales, lignes 514-519]
- [Source: app/lib/hooks/use-follow.ts — Pattern hook à reproduire]
- [Source: app/components/vehicle/VehicleCard.tsx — Code boutons actuels, lignes 177-214]
- [Source: app/app/vehicle/[id].tsx — Boutons haut, lignes 134-152]
- [Source: 4-4-profil-vehicule-page-detail.md — Learnings Reanimated & patterns établis]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Aucune erreur rencontrée. `npx tsc --noEmit` depuis `app/` : 0 erreur.

### Completion Notes List

- Créé `app/lib/hooks/use-like.ts` : hook TanStack Query avec 2 queries (isLiked + likeCount) + mutation toggle + optimistic update + guard non-authentifié + gestion erreurs Toast.
- Modifié `app/components/vehicle/VehicleCard.tsx` : Heart extrait du `.map()`, branché sur `useLike`, animation Reanimated spring sur scale, couleur dynamique `#F97316` / `#fff`, compteur dynamique.
- Modifié `app/app/vehicle/[id].tsx` : Heart ajouté dans la rangée de boutons haut (à côté de Share2 et MoreHorizontal), branché sur `useLike`, couleur dynamique. `[Share2, MoreHorizontal].map()` remplacé par 3 Pressable individuels.
- Pattern `use-follow.ts` reproduit fidèlement (sélecteur Zustand granulaire, `getState()` dans mutationFn, destructurer `{ error }`, Toast en français).
- Callbacks Reanimated marqués `'worklet'` pour l'exécution sur l'UI thread.

### File List

- `app/lib/hooks/use-like.ts` — CRÉÉ
- `app/components/vehicle/VehicleCard.tsx` — MODIFIÉ
- `app/app/vehicle/[id].tsx` — MODIFIÉ
