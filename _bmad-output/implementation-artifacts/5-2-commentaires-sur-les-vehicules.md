# Story 5.2 : Commentaires sur les véhicules

Status: review

## Story

As a utilisateur,
I want laisser un commentaire sur un build,
So that je peux échanger avec le propriétaire et la communauté sur le véhicule.

## Acceptance Criteria

1. **Given** l'utilisateur est sur la page détail d'un véhicule `app/vehicle/[id].tsx`, **When** il appuie sur l'icône 💬, **Then** un modal de commentaires s'ouvre depuis le bas de l'écran (`animationType="slide"`)
2. `lib/hooks/use-comments.ts` charge les commentaires via TanStack Query (query key `['comments', vehicleId]`) depuis la table `comments` avec jointure sur `profiles` pour les données auteur
3. Chaque commentaire affiche : avatar de l'auteur (`KaraAvatar`), @pseudo (`Inter_600SemiBold`), corps du message, timestamp formaté en relatif (ex: "il y a 2h")
4. Un `TextInput` en bas du modal permet de saisir un nouveau commentaire ; le bouton d'envoi est **désactivé** si le corps est vide ou contient uniquement des espaces
5. La soumission insère dans `comments` (`vehicle_id`, `user_id = auth.uid()`, `body`) puis invalide la query `['comments', vehicleId]` — le nouveau commentaire apparaît immédiatement
6. Un commentaire peut être liké via `useLike({ targetId: comment.id, targetType: 'comment' })` — réutiliser `use-like.ts` existant (déjà prévu pour `target_type = 'comment'`)
7. Un utilisateur non authentifié peut lire les commentaires mais le bouton d'envoi reste désactivé ; si tentative via contournement, Toast d'erreur en français

## Tasks / Subtasks

- [x] Vérifier que la table `comments` existe en DB (voir section Migration ci-dessous) (AC: 2, 5)
- [x] Créer `app/lib/hooks/use-comments.ts` (AC: 2, 5, 7)
  - [x] Query TanStack `['comments', vehicleId]` avec jointure `profiles` sur `user_id`
  - [x] Mutation `addComment(body)` : insert + invalidation query
  - [x] Guard non-authentifié dans `mutationFn` + Toast
  - [x] Gestion erreurs `handleSupabaseError()` + Toast
- [x] Créer `app/components/vehicle/CommentItem.tsx` (AC: 3, 6)
  - [x] Affichage avatar (`KaraAvatar`), @pseudo, body, timestamp relatif
  - [x] Bouton ❤️ branché sur `useLike({ targetId: comment.id, targetType: 'comment' })`
- [x] Modifier `app/app/vehicle/[id].tsx` (AC: 1, 4, 5, 7)
  - [x] Ajouter `useState` pour `commentsOpen` et `commentBody`
  - [x] Brancher `useComments(id)`
  - [x] Ajouter bouton 💬 dans la zone sticky bas (à côté du bouton Suivre)
  - [x] Créer `Modal` RN avec FlatList commentaires + TextInput + bouton envoi
  - [x] Désactiver envoi si corps vide ou `!currentUserId`
- [x] Lancer `npx tsc --noEmit` depuis `app/` — 0 erreur attendu

## Dev Notes

### ⚠️ Contrainte critique héritée : PAS DE REACT-NATIVE-REANIMATED

`react-native-reanimated` provoque un crash `NullPointerException` sur Android avec `newArchEnabled: true` (cf. `app.json`). **Ne jamais importer `react-native-reanimated`** dans les nouveaux fichiers. Utiliser uniquement l'`Animated` natif de React Native si une animation est nécessaire :

```ts
import { Animated } from 'react-native';
import { useRef } from 'react';

const scale = useRef(new Animated.Value(1)).current;
Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }).start();
```

### Migration DB — Vérification obligatoire avant implémentation

Vérifier que la table `comments` existe (SQL Editor Supabase Dashboard) :

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name = 'comments' AND table_schema = 'public';
```

Si absente, créer la migration (numéroter après la dernière migration existante) :

```sql
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);
alter table comments enable row level security;

create policy "Lecture publique commentaires"
  on comments for select using (true);
create policy "Insertion commentaire authentifié"
  on comments for insert with check (auth.uid() = user_id);
create policy "Suppression par propriétaire"
  on comments for delete using (auth.uid() = user_id);
```

### Hook `use-comments.ts` — Structure cible complète

```ts
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export interface CommentWithAuthor {
  id: string;
  vehicle_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useComments(vehicleId: string) {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles:user_id(id, username, display_name, avatar_url)')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as CommentWithAuthor[];
    },
    enabled: !!vehicleId,
  });

  const addMutation = useMutation({
    mutationFn: async (body: string) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        Toast.show({ type: 'error', text1: 'Tu dois être connecté pour commenter.' });
        return;
      }
      const { error } = await supabase
        .from('comments')
        .insert({ vehicle_id: vehicleId, user_id: userId, body: body.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', vehicleId] });
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: "Impossible d'envoyer le commentaire." });
      }
    },
  });

  return {
    comments,
    isLoading,
    addComment: (body: string) => addMutation.mutate(body),
    isAdding: addMutation.isPending,
  };
}
```

### Composant `CommentItem.tsx` — Structure cible complète

À créer dans `app/components/vehicle/CommentItem.tsx` :

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { buildImageUrl } from '@/lib/supabase';
import { useLike } from '@/lib/hooks/use-like';
import { CommentWithAuthor } from '@/lib/hooks/use-comments';

function formatRelative(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

export function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  const { isLiked, likeCount, toggle, isPending } = useLike({
    targetId: comment.id,
    targetType: 'comment',
  });
  const initial = comment.profiles?.username?.[0]?.toUpperCase() ?? '?';
  const avatarUri = comment.profiles?.avatar_url
    ? buildImageUrl(comment.profiles.avatar_url, { width: 60 })
    : undefined;

  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 10, paddingHorizontal: 16 }}>
      <KaraAvatar size={32} tone="crimson-rwd" initial={initial} uri={avatarUri} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
          @{comment.profiles?.username ?? ''}
        </Text>
        <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 2 }}>
          {comment.body}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 }}>
          {formatRelative(comment.created_at)}
        </Text>
      </View>
      <Pressable onPress={toggle} disabled={isPending} style={{ alignItems: 'center', gap: 2, paddingTop: 2 }}>
        <Heart
          size={14}
          color={isLiked ? '#F97316' : 'rgba(255,255,255,0.4)'}
          fill={isLiked ? '#F97316' : 'transparent'}
        />
        {likeCount > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Inter_500Medium' }}>
            {likeCount}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
```

### Modification `vehicle/[id].tsx` — Zones précises à modifier

Le fichier est actuellement ~340 lignes. Il a déjà été modifié en story 5-1 (Heart + useLike + useFollow présents). **Ne pas casser l'existant.**

**Zone 1 — Imports React Native** (ligne ~3) — ajouter `Modal`, `TextInput`, `KeyboardAvoidingView`, `Platform`, `FlatList` :
```ts
import { View, Text, ScrollView, Pressable, ActivityIndicator, useWindowDimensions,
  Modal, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
```

**Zone 2 — Imports lucide** (ligne ~7) — ajouter `MessageCircle` :
```ts
import { ChevronLeft, Heart, Share2, MoreHorizontal, Car, Bike, MessageCircle } from 'lucide-react-native';
```

**Zone 3 — Imports hooks/composants** — ajouter :
```ts
import { useComments } from '@/lib/hooks/use-comments';
import { CommentItem } from '@/components/vehicle/CommentItem';
```

**Zone 4 — State dans le composant** (après les hooks existants, ligne ~55 environ) :
```ts
const [commentsOpen, setCommentsOpen] = useState(false);
const [commentBody, setCommentBody] = useState('');
const { comments, isLoading: commentsLoading, addComment, isAdding } = useComments(id);
```

**Zone 5 — Bouton 💬 dans la zone sticky bas** (environ ligne 325, dans le `<View>` avec `flexDirection: 'row', gap: 10`) — ajouter à côté du `KaraButton` Suivre :
```tsx
<Pressable
  onPress={() => setCommentsOpen(true)}
  style={{
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  }}
>
  <MessageCircle size={20} color="#fff" />
</Pressable>
```

**Zone 6 — Modal** (juste avant le `</View>` final fermant la racine) :
```tsx
<Modal
  visible={commentsOpen}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setCommentsOpen(false)}
>
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: '#0A0A0F' }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    {/* Header */}
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
      borderBottomWidth: 1, borderBottomColor: '#1E1E2E',
    }}>
      <Text style={{ color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18 }}>
        Commentaires
      </Text>
      <Pressable onPress={() => setCommentsOpen(false)}>
        <Text style={{ color: '#7C3AED', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Fermer</Text>
      </Pressable>
    </View>

    {/* Liste */}
    <FlatList
      data={comments}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => <CommentItem comment={item} />}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingVertical: 8 }}
      ListEmptyComponent={
        <Text style={{
          color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter_400Regular',
          fontSize: 14, textAlign: 'center', marginTop: 40,
        }}>
          Aucun commentaire pour l'instant.
        </Text>
      }
    />

    {/* Input */}
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 16, paddingVertical: 12,
      borderTopWidth: 1, borderTopColor: '#1E1E2E',
    }}>
      <TextInput
        value={commentBody}
        onChangeText={setCommentBody}
        placeholder="Ajoute un commentaire..."
        placeholderTextColor="rgba(255,255,255,0.3)"
        style={{
          flex: 1, backgroundColor: '#111118', borderRadius: 20,
          paddingHorizontal: 14, paddingVertical: 10,
          color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 14,
          borderWidth: 1, borderColor: '#1E1E2E', maxHeight: 100,
        }}
        multiline
        maxLength={500}
      />
      <Pressable
        onPress={() => {
          if (!commentBody.trim() || !currentUserId) return;
          addComment(commentBody);
          setCommentBody('');
        }}
        disabled={!commentBody.trim() || isAdding || !currentUserId}
        style={{
          backgroundColor: (commentBody.trim() && currentUserId) ? '#7C3AED' : 'rgba(124,58,237,0.3)',
          borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
        }}
      >
        <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
          {isAdding ? '…' : 'Envoyer'}
        </Text>
      </Pressable>
    </View>
  </KeyboardAvoidingView>
</Modal>
```

### `KaraAvatar` — Vérification prop `uri`

Le composant `KaraAvatar` existant accepte-t-il une prop `uri` pour afficher une vraie image ? Lire `app/components/shared/KaraAvatar.tsx` avant d'implémenter `CommentItem`. Si la prop `uri` n'existe pas, l'ajouter (pattern : si `uri` fourni → `<Image source={{ uri }} />`, sinon → `<Text>{initial}</Text>`).

### Contraintes architecturales à respecter

- **Pas d'import `supabase` direct dans les composants** — tout via `use-comments.ts` et `use-like.ts`
- **Sélecteur Zustand granulaire** : `useAuthStore((s) => s.user?.id)` (jamais le store entier)
- **Dans `mutationFn`** : `useAuthStore.getState().user?.id` (pas le hook React)
- **Destructurer `{ data, error }`** : jamais `.throwOnError()`
- **Erreurs en français** via `handleSupabaseError()` + Toast
- **Pas de Reanimated** — `Animated` natif RN uniquement si animation nécessaire
- **`buildImageUrl()`** pour toutes les URLs d'images (avatars commentaires inclus)

### Query key structure — règle stricte

```ts
['comments', vehicleId]          // ✅ liste commentaires d'un véhicule
['like', userId, commentId, 'comment']  // ✅ état like d'un commentaire (géré par use-like.ts)
['like-count', commentId, 'comment']    // ✅ compteur likes commentaire (géré par use-like.ts)
```

### References

- [Source: epics.md — Epic 5, Story 5.2]
- [Source: architecture.md — Schéma table `comments`]
- [Source: architecture.md — Patterns TanStack Query, Supabase, Zustand]
- [Source: architecture.md — Frontières architecturales]
- [Source: app/lib/hooks/use-follow.ts — Pattern hook de référence]
- [Source: app/lib/hooks/use-like.ts — Hook réutilisable pour liker les commentaires]
- [Source: app/app/vehicle/[id].tsx — Fichier principal à modifier (déjà modifié en 5-1)]
- [Source: 5-1-likes-sur-les-vehicules.md — Learnings : Reanimated → RN Animated, patterns hook]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Aucune erreur. `npx tsc --noEmit` : 0 erreur.

### Completion Notes List

- Créé `app/lib/hooks/use-comments.ts` : query TanStack `['comments', vehicleId]` avec jointure profiles, mutation addComment avec guard non-authentifié, invalidation query après succès, gestion erreurs Toast.
- Créé `app/components/vehicle/CommentItem.tsx` : affichage avatar/pseudo/body/timestamp relatif, bouton ❤️ branché sur `useLike({ targetType: 'comment' })`.
- Modifié `app/app/vehicle/[id].tsx` : ajout bouton 💬 dans la barre sticky bas (visible même sur son propre véhicule), Modal RN `animationType="slide"` avec FlatList + TextInput + bouton Envoyer désactivé si vide ou non authentifié.
- `KaraAvatar` possédait déjà la prop `uri` — aucune modification nécessaire.
- Contrainte Reanimated respectée : aucun import `react-native-reanimated`.

### File List

- `app/lib/hooks/use-comments.ts` — CRÉÉ
- `app/components/vehicle/CommentItem.tsx` — CRÉÉ
- `app/app/vehicle/[id].tsx` — MODIFIÉ
