# Story 4.3: Profil d'un autre utilisateur & système de follow

Status: ready-for-dev

## Story

As a utilisateur,
I want consulter le profil d'un autre passionné et le suivre,
So that je peux m'abonner aux builds qui m'inspirent.

## Acceptance Criteria

1. **Navigation depuis le feed :** taper sur l'avatar ou le pseudo du propriétaire dans `VehicleCard` navigue vers `app/user/[id].tsx` (où `id` = `vehicle.profiles?.id ?? vehicle.owner_id`)
2. **Structure du profil public :** `app/user/[id].tsx` affiche la même structure visuelle que `profile.tsx` (cover, avatar, identité, stats, tabs Véhicules/Favoris) avec les données du profil ciblé
3. **Bouton Suivre :** un bouton "Suivre" (variant `outline`) remplace le bouton "Modifier" ; il affiche "Suivi" (variant `primary`) si l'utilisateur connecté suit déjà ce profil
4. **Follow :** appuyer sur "Suivre" insère une ligne dans `follows` (`follower_id = currentUserId`, `target_id = targetId`, `target_type = 'profile'`) et le bouton passe à "Suivi"
5. **Unfollow :** appuyer sur "Suivi" supprime la ligne dans `follows` et le bouton revient à "Suivre"
6. **Compteurs mis à jour :** après toggle, la query `['profile', targetId]` est invalidée pour rafraîchir les compteurs ABONNÉS/ABONNEMENTS
7. **Menu ··· :** un bouton `MoreHorizontal` remplace le bouton ⚙️ ; il ouvre une `Alert` avec les options "Signaler" et "Bloquer" (sans logique serveur à ce stade)
8. **Bouton Suivre dans le feed :** le bouton "Suivre" de `VehicleCard.tsx` est branché sur `use-follow.ts` ; l'état "Suivi" est persisté dans le cache TanStack Query
9. **Cas bord — profil propre :** si `id === currentUserId`, ne pas afficher le bouton "Suivre" (ou rediriger vers `profile.tsx`) ; ne pas bloquer l'app
10. **TypeScript :** `npx tsc --noEmit` depuis `app/` passe sans erreur

## Tasks / Subtasks

- [ ] Modifier `app/lib/hooks/use-profile.ts` — ajouter option `autoCreate` (AC: 9)
  - [ ] Ajouter paramètre optionnel `{ autoCreate?: boolean }` (default `true`) à `useProfile`
  - [ ] Si `autoCreate: false` et profil absent : `throw new Error('Profil introuvable')` au lieu d'insérer
  - [ ] Aucun changement de comportement pour `autoCreate: true` (comportement existant préservé)

- [ ] Créer `app/lib/hooks/use-follow.ts` (AC: 3, 4, 5, 6, 8)
  - [ ] Définir interface `UseFollowParams` : `{ targetId: string; targetType: 'profile' | 'vehicle' }`
  - [ ] Implémenter `useFollow({ targetId, targetType })` qui retourne `{ isFollowing: boolean; toggle: () => void; isPending: boolean }`
  - [ ] Query de statut : `useQuery` avec key `['follow', currentUserId, targetId, targetType]` → `SELECT count` dans `follows` où `follower_id = currentUserId AND target_id = targetId AND target_type = targetType` ; retourne `(count ?? 0) > 0`
  - [ ] Mutation : si `isFollowing` → DELETE ; sinon → INSERT `{ follower_id: currentUserId, target_id: targetId, target_type: targetType }`
  - [ ] `onSuccess` : `queryClient.setQueryData(['follow', currentUserId, targetId, targetType], !isFollowing)` + si `targetType === 'profile'` → `queryClient.invalidateQueries({ queryKey: ['profile', targetId] })`
  - [ ] `onError` : toast via `handleSupabaseError` ou message générique
  - [ ] `enabled: !!currentUserId && !!targetId`

- [ ] Créer `app/app/user/[id].tsx` (AC: 1, 2, 3, 4, 5, 6, 7, 9)
  - [ ] Récupérer `id` via `useLocalSearchParams<{ id: string }>()`
  - [ ] Récupérer `currentUserId` via `useAuthStore((s) => s.user?.id)`
  - [ ] Appeler `useProfile(id, { autoCreate: false })`
  - [ ] Appeler `useFollow({ targetId: id, targetType: 'profile' })` (désactivé si `id === currentUserId`)
  - [ ] Loading state : `ActivityIndicator` centré
  - [ ] Error state : message d'erreur si le profil n'existe pas
  - [ ] Afficher couverture, avatar, identité, stats, tabs — même structure que `profile.tsx`
  - [ ] Bouton "Suivre"/"Suivi" à la place de "Modifier" (masqué si `id === currentUserId`)
  - [ ] Bouton `MoreHorizontal` (en haut à droite de la cover) → `Alert` avec "Signaler" et "Bloquer"
  - [ ] Bouton back (`ChevronLeft`) en haut à gauche de la cover
  - [ ] Onglet Favoris : état vide statique "Les favoris de @{username} apparaîtront ici"

- [ ] Modifier `app/components/vehicle/VehicleCard.tsx` (AC: 1, 8)
  - [ ] Entourer avatar + pseudo + localisation d'un `Pressable` → `router.push('/user/' + (vehicle.profiles?.id ?? vehicle.owner_id))`
  - [ ] Remplacer `useState(false)` + `setFollowing` par `useFollow({ targetId: vehicle.profiles?.id ?? vehicle.owner_id, targetType: 'profile' })`
  - [ ] Le bouton "Suivre" utilise `isFollowing` pour le variant (`primary` si suivi, `secondary` si abonné) et appelle `toggle` en `onPress`
  - [ ] Si `vehicle.profiles?.id === currentUserId` : masquer le bouton "Suivre" (on ne peut pas se suivre soi-même)
  - [ ] Pendant `isPending` : désactiver le bouton "Suivre"

- [ ] Vérification TypeScript (AC: 10)
  - [ ] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer / modifier

```
app/lib/hooks/use-profile.ts               ← MODIFIER (option autoCreate)
app/lib/hooks/use-follow.ts                ← CRÉER (hook follow/unfollow)
app/app/user/[id].tsx                      ← CRÉER (profil public)
app/components/vehicle/VehicleCard.tsx     ← MODIFIER (navigation + follow réel)
```

### Ne PAS modifier

- `app/(tabs)/profile.tsx` — hors scope (profil propre, déjà complet)
- `app/profile/edit.tsx` — hors scope
- `use-vehicles.ts`, `use-update-profile.ts` — hors scope
- `KaraButton`, `KaraAvatar`, `KaraPhoto`, `KaraTag` — hors scope

### Schéma `follows` — table polymorphique

```ts
// Migration 002_follows.sql
{
  follower_id: uuid  // FK → profiles.id
  target_id:   uuid  // profil OU véhicule selon target_type
  target_type: 'profile' | 'vehicle'
  created_at:  timestamptz
  // PRIMARY KEY (follower_id, target_id, target_type) — empêche les doublons
}
```

**Double-insert** : si l'utilisateur tape deux fois rapidement, la contrainte PK retourne `{ code: '23505' }` — `handleSupabaseError` mappe ce code vers "Cette entrée existe déjà." et affiche un toast. Pas de crash.

### Implémentation recommandée de `use-follow.ts`

```ts
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface UseFollowParams {
  targetId: string;
  targetType: 'profile' | 'vehicle';
}

export function useFollow({ targetId, targetType }: UseFollowParams) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: isFollowing = false } = useQuery({
    queryKey: ['follow', currentUserId, targetId, targetType],
    queryFn: async () => {
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', currentUserId!)
        .eq('target_id', targetId)
        .eq('target_type', targetType);
      return (count ?? 0) > 0;
    },
    enabled: !!currentUserId && !!targetId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) throw new Error('Non authentifié');
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('target_id', targetId)
          .eq('target_type', targetType);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: currentUserId, target_id: targetId, target_type: targetType });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['follow', currentUserId, targetId, targetType],
        !isFollowing
      );
      if (targetType === 'profile') {
        queryClient.invalidateQueries({ queryKey: ['profile', targetId] });
      }
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: 'Une erreur est survenue.' });
      }
    },
  });

  return {
    isFollowing,
    toggle: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
```

### Modification de `use-profile.ts` — option `autoCreate`

Seul le `queryFn` change. Le reste (queryKey, enabled, types) est identique :

```ts
// Signature modifiée
export function useProfile(
  userId: string,
  { autoCreate = true }: { autoCreate?: boolean } = {}
) {
  return useQuery<ProfileWithStats, PostgrestError>({
    ...
    queryFn: async () => {
      ...
      let profile = profileResult.data;
      if (!profile) {
        if (!autoCreate) throw new Error('Profil introuvable');
        // ... logique auto-create existante
      }
      ...
    },
  });
}
```

### Expo Router — route dynamique `app/user/[id].tsx`

`app/app/user/[id].tsx` est auto-découvert comme la route `/user/:id`. Aucune déclaration dans `_layout.tsx` n'est nécessaire.

```tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}
```

Navigation depuis `VehicleCard` :
```tsx
router.push(`/user/${vehicle.profiles?.id ?? vehicle.owner_id}`);
```

Navigation depuis `user/[id].tsx` (bouton back) :
```tsx
router.back();
```

### Structure visuelle de `user/[id].tsx`

Strictement identique à `profile.tsx` avec ces différences :

| Zone | `profile.tsx` | `user/[id].tsx` |
|------|--------------|-----------------|
| Bouton haut droite | ⚙️ Settings → déconnexion | `···` MoreHorizontal → Signaler/Bloquer |
| Bouton haut gauche | — | `←` ChevronLeft → `router.back()` |
| Bouton sous avatar | "Modifier" → `/profile/edit` | "Suivre"/"Suivi" → `toggle()` |
| Tab Favoris label | "Tes favoris apparaîtront ici" | "Les favoris de @{username} apparaîtront ici" |

Le bouton "Suivre" / "Suivi" :
```tsx
<KaraButton
  variant={isFollowing ? 'primary' : 'outline'}
  size="sm"
  full
  onPress={toggle}
  disabled={isPending}
>
  <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
    {isFollowing ? '✓ Suivi' : 'Suivre'}
  </Text>
</KaraButton>
```

Le menu ··· :
```tsx
<Pressable onPress={() =>
  Alert.alert('Options', undefined, [
    { text: 'Signaler', style: 'destructive', onPress: () => {} },
    { text: 'Bloquer', style: 'destructive', onPress: () => {} },
    { text: 'Annuler', style: 'cancel' },
  ])
}>
  <MoreHorizontal size={18} color="#fff" />
</Pressable>
```

### Modifications de `VehicleCard.tsx`

**Navigation vers le profil** — entourer la ligne propriétaire :

```tsx
// AVANT : View simple
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
  <KaraAvatar ... />
  <View style={{ flex: 1 }}>...</View>
</View>

// APRÈS : Pressable
<Pressable
  onPress={() => router.push(`/user/${vehicle.profiles?.id ?? vehicle.owner_id}`)}
  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}
>
  <KaraAvatar ... />
  <View style={{ flex: 1 }}>...</View>
</Pressable>
```

**Bouton Suivre** — remplacer `useState` :

```tsx
// AVANT (local state seulement)
const [following, setFollowing] = useState(false);
// ...
<KaraButton
  variant={following ? 'secondary' : 'primary'}
  onPress={() => setFollowing(!following)}
>
  {following ? '✓ Abonné' : 'Suivre'}
</KaraButton>

// APRÈS (use-follow)
const ownerId = vehicle.profiles?.id ?? vehicle.owner_id;
const currentUserId = useAuthStore((s) => s.user?.id);
const { isFollowing, toggle, isPending } = useFollow({ targetId: ownerId, targetType: 'profile' });
const isOwnVehicle = currentUserId === ownerId;
// ...
{!isOwnVehicle && (
  <KaraButton
    variant={isFollowing ? 'secondary' : 'primary'}
    size="md"
    style={{ flex: 1 }}
    onPress={toggle}
    disabled={isPending}
  >
    <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
      {isFollowing ? '✓ Abonné' : 'Suivre'}
    </Text>
  </KaraButton>
)}
```

Note : `vehicle.profiles?.id` est dans `VehicleWithRelations` via `profiles!vehicles_owner_id_fkey(id, username, ...)`. `vehicle.owner_id` est dans `VehicleRow` (colonne directe).

### Piège critique n°1 — `useFollow` dans une FlatList

`VehicleCard` est rendu dans une `FlatList` (feed infinite scroll). Chaque card appelle `useFollow`, ce qui génère une query `SELECT count` par card. Pour N cards, il y a N requêtes mais :
- TanStack Query déduplique les queries avec la même key (même owner affiché plusieurs fois)
- Les queries sont en parallèle (pas séquentielles)
- Le cache TTL par défaut est 5 minutes → les cards suivantes pour le même owner sont instantanées

Accepter ce comportement pour Story 4.3 — optimisation possible en Epic 6 (prefetch follow status en batch).

### Piège critique n°2 — `owner_id` vs `profiles?.id`

`VehicleWithRelations` a deux sources pour l'ID du propriétaire :
- `vehicle.owner_id` — colonne directe de `vehicles` (toujours présente)
- `vehicle.profiles?.id` — relation joinée (peut être `null` si le profil est inaccessible via RLS)

Utiliser `vehicle.profiles?.id ?? vehicle.owner_id` pour la navigation et le follow. Les deux sont des UUID v4 identiques (owner_id = profiles.id, FK).

### Piège critique n°3 — `autoCreate` doit être `false` dans `user/[id].tsx`

`useProfile(id, { autoCreate: false })` dans `user/[id].tsx`. Si `autoCreate: true` (default), et que le profil n'existe pas, la hook tentera d'insérer avec `id = autre-utilisateur`, ce qui échouera via RLS (`profiles_insert_own` vérifie `auth.uid() = id`). Passer `autoCreate: false` évite cette erreur et retourne directement un état d'erreur propre.

### Piège critique n°4 — `queryKey` partagée entre `useProfile` et `usePublicProfile`

`user/[id].tsx` et `profile.tsx` utilisent tous les deux `useProfile` avec la même `queryKey: ['profile', userId]`. Après un follow depuis `user/[id].tsx`, l'invalidation de `['profile', targetId]` recharge la query — y compris si l'utilisateur navigue vers `profile.tsx` de la cible plus tard. C'est le comportement attendu.

### Learnings des stories précédentes

- `KaraButton` accepte `onPress` directement (PressableProps) — pas de Pressable wrappant ✅
- `useAuthStore((s) => s.user?.id)` pour le sélecteur granulaire ✅
- `useAuthStore.getState().user?.id` pour accès hors hook (dans mutationFn) ✅
- `router.push('/profile/edit')` depuis `profile.tsx` — même pattern pour `/user/id` depuis `VehicleCard` ✅
- Gestion d'erreur : code `'23505'` → "Cette entrée existe déjà." (handleSupabaseError) ✅
- `npx tsc --noEmit` depuis `app/` (pas depuis la racine du projet) ✅

### Scope de cette story vs adjacentes

| Feature | Story 4.2 | Story 4.3 | Story 4.4 |
|---------|-----------|-----------|-----------|
| Modification profil propre | ✅ | — | — |
| Profil autre utilisateur | — | ✅ | — |
| `use-follow.ts` | — | ✅ créé | réutilisé |
| Follow profil | — | ✅ | — |
| Follow véhicule | — | — | ✅ |
| Profil véhicule (détail) | — | — | ✅ |
| Bouton Suivre feed (VehicleCard) | — | ✅ | — |

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.3]
- [Source: app/app/(tabs)/profile.tsx] — structure visuelle à dupliquer
- [Source: app/components/vehicle/VehicleCard.tsx] — bouton Suivre actuel à remplacer
- [Source: app/lib/hooks/use-profile.ts] — hook à modifier + pattern réutilisé
- [Source: supabase/migrations/002_follows.sql] — schéma follows

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_(vide — story pas encore implémentée)_

### Completion Notes List

_(vide)_

### File List

_(vide — à remplir pendant l'implémentation)_

### Change Log

- 2026-05-01 : Story créée (prête pour développement)
