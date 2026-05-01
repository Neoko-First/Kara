# Story 4.2: Modification du profil

Status: review

## Story

As a utilisateur,
I want mettre à jour mon avatar, ma bio, mes tags et ma localisation,
So that mon profil reflète fidèlement qui je suis dans la communauté.

## Acceptance Criteria

1. **Navigation :** appuyer sur "Modifier" depuis `app/(tabs)/profile.tsx` navigue vers `app/profile/edit.tsx` via `router.push('/profile/edit')`
2. **Préremplissage :** l'écran de modification affiche les valeurs actuelles du profil (`display_name`, `username`, `bio`, `city`, `tags`) issues de la query TanStack Query `['profile', userId]` déjà en cache — pas de requête réseau supplémentaire
3. **Avatar :** un `KaraAvatar` cliquable permet de sélectionner une photo depuis la galerie via `expo-image-picker` ; la photo choisie est compressée (resize 800px, qualité 0.8, JPEG) via `expo-image-manipulator` et uploadée dans le bucket `avatars` avec `upsert: true`
4. **Formulaire :** les champs display name, @pseudo, bio (300 chars max avec compteur de caractères visible), ville et tags sont éditables ; les tags sont saisis en format comma-separated (ex: `jdm, drift, tuning`) et convertis en `string[]` à la sauvegarde
5. **Sauvegarde :** `use-update-profile.ts` (hook `useMutation`) appelle `supabase.from('profiles').update()` avec les nouvelles valeurs, puis invalide la query `['profile', userId]`
6. **Succès :** après sauvegarde réussie, `router.back()` ramène au profil et les nouvelles informations s'affichent grâce à l'invalidation de la query
7. **Erreur :** si la mise à jour échoue, `handleSupabaseError()` est appelé et un toast en français s'affiche ; les erreurs `StorageError` (avatar upload) et `PostgrestError` (update profil) sont gérées séparément
8. **État chargement :** pendant `isPending`, le bouton "Enregistrer" est désactivé et affiche un `ActivityIndicator`
9. **TypeScript :** `npx tsc --noEmit` depuis `app/` passe sans erreur

## Tasks / Subtasks

- [x] Modifier `app/app/(tabs)/profile.tsx` pour brancher la navigation (AC: 1)
  - [x] Importer `useRouter` depuis `expo-router`
  - [x] Ajouter `const router = useRouter()` dans le composant
  - [x] Ajouter `onPress={() => router.push('/profile/edit')}` sur le `<Pressable>` wrappant le `KaraButton` "Modifier"

- [x] Créer `app/lib/hooks/use-update-profile.ts` (AC: 3, 5, 6, 7, 8)
  - [x] Définir l'interface `UpdateProfileInput` : `{ displayName?: string; username?: string; bio?: string; city?: string; tags?: string[]; avatarUri?: string }`
  - [x] Implémenter `useUpdateProfile()` via `useMutation`
  - [x] Si `avatarUri` est fourni : compresser avec `manipulateAsync(avatarUri, [{ resize: { width: 800 } }], { compress: 0.8, format: SaveFormat.JPEG })` → `fetch(compressed.uri)` → `.blob()` → `supabase.storage.from('avatars').upload('${userId}/avatar.jpg', blob, { contentType: 'image/jpeg', upsert: true })` ; en cas d'erreur upload throw avec message explicite
  - [x] Construire le payload `update` : `{ display_name, username, bio: bio || null, city: city || null, tags: tags.length > 0 ? tags : null, ...(avatarUri ? { avatar_url: 'avatars/${userId}/avatar.jpg' } : {}) }`
  - [x] `supabase.from('profiles').update(payload).eq('id', userId)`
  - [x] `onSuccess` : `queryClient.invalidateQueries({ queryKey: ['profile', userId] })` + `Toast.show({ type: 'success', text1: 'Profil mis à jour !' })` + `router.back()`
  - [x] `onError` : détecter erreur StorageError (message includes 'upload') vs PostgrestError (objet avec `code`) → `handleSupabaseError` ou message générique

- [x] Créer `app/app/profile/edit.tsx` (AC: 2, 3, 4, 8, 9)
  - [x] Récupérer `userId` via `useAuthStore((s) => s.user?.id)`, guard si absent
  - [x] Appeler `useProfile(userId)` — déjà en cache depuis le profil
  - [x] État local : `displayName: string`, `username: string`, `bio: string`, `city: string`, `tagsInput: string` (comma-separated), `avatarUri: string | null` (null = pas changé)
  - [x] `useEffect([data])` pour préremplir les états depuis `data.profile` dès que les données arrivent
  - [x] Afficher `KaraAvatar` (cliquable) + overlay icône caméra ; `onPress` → `ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, aspect: [1, 1], quality: 1 })` → si non cancelled, stocker `result.assets[0].uri` dans `avatarUri`
  - [x] Afficher la preview de l'avatar : si `avatarUri` != null → `KaraAvatar uri={avatarUri}` ; sinon `KaraAvatar uri={avatarUrl}` (URL buildée depuis profile)
  - [x] `TextInput` pour chaque champ avec style cohérent (fond `#111118`, bordure `#1E1E2E`, texte `#F1F0FF`)
  - [x] Bio : `maxLength={300}`, `multiline`, compteur `{bio.length}/300` affiché sous le champ
  - [x] Bouton "Enregistrer" (`KaraButton variant="primary" size="lg" full`) : `onPress` parse `tagsInput.split(',').map(t => t.trim()).filter(Boolean)`, appelle `mutate({ displayName, username, bio, city, tags, avatarUri: avatarUri ?? undefined })`
  - [x] Pendant `isPending` : `disabled`, remplacer le texte par `<ActivityIndicator color="#fff" />`

- [x] Vérification TypeScript (AC: 9)
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer / modifier

```
app/app/(tabs)/profile.tsx          ← MODIFIER (brancher onPress du bouton Modifier)
app/lib/hooks/use-update-profile.ts ← CRÉER (hook useMutation)
app/app/profile/edit.tsx            ← CRÉER (nouvel écran)
```

### Ne PAS modifier

- `lib/hooks/use-profile.ts` — réutilisé tel quel pour le préremplissage
- `components/shared/KaraAvatar.tsx` — déjà étendu en 4.1 avec prop `uri`
- `lib/supabase.ts`, `lib/supabase-error.ts`, `types/database.ts` — hors scope
- `lib/stores/use-auth-store.ts` — complet, pas de changement
- `app/(tabs)/profile.tsx` — uniquement le `onPress` du bouton Modifier (1 ligne)

### Navigation Expo Router — route automatique

`app/app/profile/edit.tsx` est **auto-découvert** par Expo Router comme la route `/profile/edit`. Il n'y a **pas besoin** de déclarer `<Stack.Screen name="profile/edit" />` dans `app/_layout.tsx` ni dans aucun autre layout — Expo Router le détecte automatiquement.

Depuis `profile.tsx` :
```tsx
import { useRouter } from 'expo-router';
const router = useRouter();
// ...
router.push('/profile/edit');
```

### Pattern de mise à jour du bouton Modifier dans profile.tsx

Le bouton Modifier actuel (ligne ~88) est un `<Pressable>` qui wrap un `<KaraButton>`. Ajouter uniquement `onPress` :

```tsx
// AVANT
<Pressable style={{ flex: 1, paddingBottom: 4 }}>

// APRÈS
<Pressable style={{ flex: 1, paddingBottom: 4 }} onPress={() => router.push('/profile/edit')}>
```

### Convention chemin avatar dans Supabase Storage

**IMPORTANT — différence avec les photos de véhicules :**

`buildImageUrl(path)` génère `${SUPABASE_URL}/storage/v1/render/image/public/${path}?...`. Pour que l'URL soit valide, `path` doit inclure le **nom du bucket** :

```
✅ buildImageUrl('avatars/userId/avatar.jpg')
   → /storage/v1/render/image/public/avatars/userId/avatar.jpg
```

Donc :
- Uploader vers `supabase.storage.from('avatars').upload('${userId}/avatar.jpg', blob, ...)`
- Stocker dans `profiles.avatar_url` = **`avatars/${userId}/avatar.jpg`** (avec préfixe bucket)
- `buildImageUrl(data.profile.avatar_url, ...)` depuis `profile.tsx` génère alors l'URL correcte

```ts
// Mutationn fn : avatar upload
const avatarPath = `avatars/${userId}/avatar.jpg`;
const { error: storageError } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, blob, { contentType: 'image/jpeg', upsert: true });
if (storageError) throw new Error('Erreur lors de l\'upload de l\'avatar.');
// ← stocker avatarPath (= 'avatars/userId/avatar.jpg') dans la DB
```

### Préremplissage sans requête réseau

`useProfile(userId)` a `queryKey: ['profile', userId]`. Au moment où l'utilisateur navigue vers l'écran d'édition, cette query est déjà en cache (chargée sur l'écran Profil). TanStack Query retourne les données instantanément (état `isSuccess`) :

```tsx
const userId = useAuthStore((s) => s.user?.id);
const { data } = useProfile(userId ?? '');

const [displayName, setDisplayName] = useState('');
const [username, setUsername] = useState('');
// ... autres états

useEffect(() => {
  if (!data) return;
  setDisplayName(data.profile.display_name ?? '');
  setUsername(data.profile.username ?? '');
  setBio(data.profile.bio ?? '');
  setCity(data.profile.city ?? '');
  setTagsInput((data.profile.tags ?? []).join(', '));
}, [data]);
```

Ne pas initialiser les états directement avec `data?.profile.*` dans `useState()` — `data` peut être undefined au premier render et ne pas re-déclencher l'initialisation.

### Gestion des erreurs — StorageError vs PostgrestError

Le `mutationFn` peut échouer à deux endroits distincts :

```ts
onError: (error: unknown) => {
  if (error instanceof Error && error.message.includes('upload de l\'avatar')) {
    // StorageError wrappée dans un Error standard
    Toast.show({ type: 'error', text1: error.message });
  } else if (error && typeof error === 'object' && 'code' in error) {
    // PostgrestError (ex: violation unique sur username — code '23505')
    const message = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
    Toast.show({ type: 'error', text1: message });
  } else {
    Toast.show({ type: 'error', text1: 'Une erreur est survenue. Réessaie plus tard.' });
  }
}
```

Cas particulier : si `username` est modifié et qu'il est déjà pris, Supabase retourne `{ code: '23505' }`. `handleSupabaseError` doit gérer ce code — vérifier `lib/supabase-error.ts` qu'il est mappé en message français.

### Interface `UpdateProfileInput` recommandée

```ts
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface UpdateProfileInput {
  displayName?: string;
  username?: string;
  bio?: string;
  city?: string;
  tags?: string[];
  avatarUri?: string;  // URI locale (file:// ou content://) ; absent = pas de changement
}

export function useUpdateProfile() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Non authentifié');

      let avatarPath: string | undefined;
      if (input.avatarUri) {
        const compressed = await manipulateAsync(
          input.avatarUri,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: SaveFormat.JPEG }
        );
        const response = await fetch(compressed.uri);
        const blob = await response.blob();
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .upload(`${userId}/avatar.jpg`, blob, { contentType: 'image/jpeg', upsert: true });
        if (storageError) throw new Error('Erreur lors de l\'upload de l\'avatar.');
        avatarPath = `avatars/${userId}/avatar.jpg`;
      }

      const payload: Record<string, unknown> = {
        display_name: input.displayName || null,
        username: input.username,
        bio: input.bio || null,
        city: input.city || null,
        tags: (input.tags ?? []).length > 0 ? input.tags : null,
      };
      if (avatarPath) payload.avatar_url = avatarPath;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (userId) await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      Toast.show({ type: 'success', text1: 'Profil mis à jour !' });
      router.back();
    },
    onError: (error: unknown) => {
      if (error instanceof Error && error.message.includes('upload de l\'avatar')) {
        Toast.show({ type: 'error', text1: error.message });
      } else if (error && typeof error === 'object' && 'code' in error) {
        const message = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: message });
      } else {
        Toast.show({ type: 'error', text1: 'Une erreur est survenue. Réessaie plus tard.' });
      }
    },
  });
}
```

### Structure visuelle de l'écran `profile/edit.tsx`

```
┌──────────────────────────────────────────┐
│  ← [Bouton back]   Modifier le profil    │  ← Header (insets.top)
├──────────────────────────────────────────┤
│                                          │
│         [Avatar KaraAvatar 96px]         │  ← cliquable, overlay icône caméra
│         Modifier la photo                │
│                                          │
│  Nom affiché                             │
│  ┌──────────────────────────────────┐    │
│  │ Alex...                          │    │
│  └──────────────────────────────────┘    │
│                                          │
│  @Pseudo                                 │
│  ┌──────────────────────────────────┐    │
│  │ @aki_drift                        │   │
│  └──────────────────────────────────┘    │
│                                          │
│  Bio                                     │
│  ┌──────────────────────────────────┐    │
│  │ (multiline)                      │    │
│  └──────────────────────────────────┘    │
│  0/300                                   │  ← compteur
│                                          │
│  Ville                                   │
│  ┌──────────────────────────────────┐    │
│  │ Lyon                              │   │
│  └──────────────────────────────────┘    │
│                                          │
│  Tags (séparés par des virgules)         │
│  ┌──────────────────────────────────┐    │
│  │ jdm, drift, tuning                │   │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │         Enregistrer              │    │  ← KaraButton primary lg full
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**Design tokens à utiliser :**
- Fond écran : `#0A0A0F` (kara-bg)
- Fond input : `#111118` (kara-surface)
- Bordure input : `#1E1E2E` (kara-border)
- Texte label : `#9594B5`
- Texte input : `#F1F0FF`
- Texte placeholder : `#5C5B78`
- Padding horizontal : 20
- Radius input : 12
- Hauteur input simple ligne : 48
- Gap entre champs : 20

### Sélecteur Zustand granulaire (pattern établi en 4.1)

```tsx
// ✅ Sélecteur granulaire — évite les re-renders inutiles
const userId = useAuthStore((s) => s.user?.id);

// ❌ Ne pas faire
const { user } = useAuthStore();
```

### Packages déjà installés — ne pas réinstaller

- `expo-image-picker` — déjà dans `app.json` avec `photosPermission` en français ✅
- `expo-image-manipulator` — installé depuis Story 3.3 ✅
- `@tanstack/react-query` — disponible via `queryClient` exporté de `@/lib/query-client` ✅

### Scope de cette story vs stories adjacentes

| Feature | Story 4.1 | Story 4.2 | Story 4.3 |
|---------|-----------|-----------|-----------|
| Affichage profil | ✅ | — | — |
| `use-profile.ts` | ✅ créé | réutilisé | réutilisé |
| Navigation → édition | — | ✅ | — |
| Formulaire modification | — | ✅ | — |
| `use-update-profile.ts` | — | ✅ créé | — |
| Profil autre utilisateur | — | — | ✅ |
| Système de follow | — | — | ✅ |

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: app/lib/hooks/use-create-vehicle.ts] — pattern upload + mutation
- [Source: _bmad-output/implementation-artifacts/4-1-mon-profil-affichage.md#Dev Notes] — learnings Story 4.1

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `KaraButton` étend `PressableProps` et spread `...props`, donc `onPress` se passe directement dessus — pas besoin d'un `Pressable` wrappant.
- `mediaTypes: 'images' as ImagePicker.MediaTypeOptions` : cast nécessaire car l'API string-literal d'expo-image-picker SDK 54 n'est pas encore parfaitement typée en `as const`.
- `npx tsc --noEmit` : zéro erreur au premier passage.

### Completion Notes List

- Modifié `profile.tsx` : ajout `useRouter`, `router.push('/profile/edit')` sur le `KaraButton` "Modifier" — changement minimal, 3 lignes.
- Créé `use-update-profile.ts` : mutation TanStack Query avec upload avatar optionnel (compress 800px → blob → bucket `avatars`, `upsert: true`), update profil Supabase, invalidation query `['profile', userId]`, gestion séparée StorageError / PostgrestError.
- Créé `app/profile/edit.tsx` : écran d'édition avec préremplissage via `useEffect([data])`, avatar cliquable + overlay caméra + preview locale immédiate, 5 champs (display_name, username, bio multiline 300, city, tags csv), bouton Enregistrer avec état loading.
- Convention chemin avatar : `avatars/${userId}/avatar.jpg` stocké en DB pour que `buildImageUrl` génère une URL correcte (inclut le nom du bucket).

### File List

- app/app/(tabs)/profile.tsx (MODIFIÉ)
- app/lib/hooks/use-update-profile.ts (CRÉÉ)
- app/app/profile/edit.tsx (CRÉÉ)

### Change Log

- 2026-05-01 : Story créée (prête pour développement)
- 2026-05-01 : Story implémentée — écran de modification du profil avec upload avatar, formulaire prérempli, mutation Supabase + invalidation query
