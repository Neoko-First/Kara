# Story 3.3: Pipeline upload & publication du véhicule

Status: review

## Story

As a utilisateur,
I want que mon build soit publié avec les photos compressées et optimisées,
so that le feed reste performant pour tous les utilisateurs.

## Acceptance Criteria

1. **Compression + upload :** chaque photo du store passe par `expo-image-manipulator` (resize 1200px max, qualité 0.8, JPEG) puis est uploadée dans le bucket Supabase Storage `vehicles`
2. **INSERT `vehicles` :** l'enregistrement est créé avec `brand`, `model`, `type`, `owner_id`, `year`, `displacement`, `power`, `description`, `tags`, `city`, `is_published: true` — les champs `lat`/`lng` ne sont transmis que si `precise` est `true` dans le store
3. **INSERT `vehicle_photos` :** pour chaque photo uploadée, une ligne est insérée dans `vehicle_photos` avec `vehicle_id`, `storage_path` (chemin brut Storage, jamais la full URL), `position` (index 0-based) et `is_cover: position === 0`
4. **URLs stockées en DB :** les `storage_path` sont les chemins passés à `.upload()` (ex: `{userId}/{vehicleId}/{index}.jpg`), jamais les URLs transformées
5. **Progression :** pendant l'upload, un indicateur "X / N photos uploadées" est affiché à la place du bouton "Publier le build"
6. **Succès :** après publication réussie, `queryClient.invalidateQueries({ queryKey: ['vehicles'] })` est appelé, `usePostStore.reset()` est appelé, l'utilisateur est redirigé vers `/(tabs)` et un toast "Build publié !" s'affiche
7. **Erreur photo :** si l'upload d'une photo échoue, le message d'erreur est affiché via Toast sans planter l'app (l'opération est annulée proprement)
8. **Erreur DB :** si l'INSERT `vehicles` ou `vehicle_photos` échoue, `handleSupabaseError(error)` est appelé et un toast en français s'affiche
9. **TypeScript :** `npx tsc --noEmit` depuis `app/` passe sans erreur

## Tasks / Subtasks

- [x] Créer `app/lib/hooks/use-create-vehicle.ts` (AC: 1, 2, 3, 4, 5, 6, 7, 8)
  - [x] Importer `useMutation` de `@tanstack/react-query`, `queryClient` de `@/lib/query-client`, `supabase` de `@/lib/supabase`, `handleSupabaseError` de `@/lib/supabase-error`, `manipulateAsync` de `expo-image-manipulator`
  - [x] Déclarer la fonction `compressPhoto(uri: string): Promise<string>` qui appelle `manipulateAsync(uri, [{ resize: { width: 1200 } }], { compress: 0.8, format: SaveFormat.JPEG })` et retourne `result.uri`
  - [x] Implémenter `uploadPhoto(uri: string, ownerId: string, vehicleId: string, index: number): Promise<string>` qui : (1) fetch blob depuis URI local via `fetch(uri).then(r => r.blob())`, (2) appelle `supabase.storage.from('vehicles').upload(\`{ownerId}/{vehicleId}/{index}.jpg\`, blob, { contentType: 'image/jpeg', upsert: false })`, (3) retourne le `path` du résultat ou throw si `error`
  - [x] Implémenter `createVehicle(data: PostStoreSnapshot): Promise<void>` qui : (1) INSERT `vehicles` avec `is_published: false` puis update à `true` après upload, (2) récupère l'id, (3) upload + compresse chaque photo avec progress callback, (4) INSERT toutes les `vehicle_photos`, (5) gère les erreurs
  - [x] Exporter `useCreateVehicle()` via `useMutation` avec `mutationFn: createVehicle`, `onSuccess` (invalidate + reset + navigate + toast) et `onError` (toast)

- [x] Modifier `app/app/(tabs)/post.tsx` pour câbler la mutation (AC: 5, 6, 7)
  - [x] Ajouter `useCreateVehicle` import
  - [x] `uploadProgress` géré dans le hook `useCreateVehicle` (state interne), exposé en retour
  - [x] Remplacer le `onPress` du bouton "Publier le build" (`step === 3`) par un appel à `createVehicle(usePostStore.getState() snapshot)`
  - [x] Afficher l'indicateur de progression si `isPending`: remplacer le texte du bouton par `"{uploadProgress + 1} / {photos.length} photos uploadées..."`
  - [x] Désactiver le bouton pendant `isPending`

- [x] Vérification TypeScript (AC: 9)
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer / modifier

```
app/lib/hooks/use-create-vehicle.ts   ← CRÉER (nouveau hook mutation)
app/app/(tabs)/post.tsx               ← MODIFIER (câbler la mutation, ajouter progress)
```

### Ne PAS modifier

- `use-post-store.ts` — complet, aucun setter manquant
- `StepPhotos`, `StepSpecs`, `StepDescription`, `StepLocation` — scope stories 3.1/3.2, ne pas toucher
- `lib/supabase.ts`, `types/database.ts`, `lib/supabase-error.ts` — hors scope
- `use-vehicles.ts` — déjà configuré pour invalider `['vehicles']`

### État actuel de `post.tsx` — point de changement exact

```tsx
// LIGNE ~436 — état ACTUEL (Story 3.2) à REMPLACER
<Pressable
  onPress={() => step < 3 ? setStep(step + 1) : router.replace('/(tabs)')}
  disabled={isContinueDisabled}
  ...
>
  <Text>
    {step === 3 ? 'Publier le build' : 'Continuer'}
  </Text>
```

Le `router.replace('/(tabs)')` direct à l'étape 3 est le placeholder laissé par Story 3.2. **C'est le seul point à modifier** dans le composant `PostScreen`.

### Implémentation recommandée de `use-create-vehicle.ts`

```ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { usePostStore } from '@/lib/stores/use-post-store';

// Snapshot des données du store passé en argument de la mutation
interface CreateVehicleInput {
  photos: string[];
  type: string;
  brand: string;
  model: string;
  year: number | null;
  displacement: string;
  power: number | null;
  description: string;
  tags: string[];
  city: string;
  precise: boolean;
}
```

### Piège critique n°1 : Blob depuis URI local React Native

`supabase.storage.from(...).upload()` attend un `Blob`. Sur React Native, la manière correcte de convertir un URI local en Blob est :

```ts
const response = await fetch(uri);
const blob = await response.blob();
await supabase.storage.from('vehicles').upload(path, blob, {
  contentType: 'image/jpeg',
  upsert: false,
});
```

**Ne pas** utiliser `fs.readFile()` ou un ArrayBuffer — `fetch().blob()` est la seule approche stable sur iOS/Android avec Expo.

### Piège critique n°2 : `StorageError` ≠ `PostgrestError`

`handleSupabaseError` accepte `PostgrestError` (venant de PostgREST). Les erreurs Supabase Storage sont de type `StorageError` et **ne sont pas compatibles** avec cette signature.

Pour les erreurs Storage, utiliser un message générique :

```ts
const { error: uploadError } = await supabase.storage.from('vehicles').upload(...);
if (uploadError) {
  // StorageError n'est PAS un PostgrestError
  Toast.show({ type: 'error', text1: 'Erreur lors de l\'upload de la photo.' });
  throw uploadError;
}
```

Pour les erreurs DB (INSERT vehicles / vehicle_photos) : utiliser `handleSupabaseError(error)` normalement.

### Piège critique n°3 : Ordre des opérations (robustesse)

**Ordre recommandé :**
1. INSERT `vehicles` avec `is_published: false` → récupère `id`
2. Pour chaque photo : compress → upload → INSERT `vehicle_photos`
3. UPDATE `vehicles` SET `is_published = true` WHERE `id = vehicleId`
4. Invalider queries, reset store, navigate, toast

Pourquoi `is_published: false` d'abord ? Si l'upload échoue à mi-parcours, le véhicule n'est pas visible dans le feed. Cela évite un véhicule publié sans photos. En cas d'erreur, la ligne `vehicles` orpheline reste en DB (non visible) mais ne pollue pas l'UX.

Note AC : l'AC dit "créé avec `is_published = true`" comme état final attendu — l'ordre interne d'implémentation reste libre tant que le résultat est correct.

### Piège critique n°4 : Chemin de stockage unique

Le path passé à `.upload()` doit être unique pour éviter les conflits. Pattern recommandé :

```ts
const vehicleId = vehicleRow.id; // UUID généré par Supabase
const storagePath = `${ownerId}/${vehicleId}/${index}.jpg`;
// Exemple : "abc123-user/def456-vehicle/0.jpg"
```

`ownerId` = `useAuthStore.getState().user?.id` — appeler `getState()` dans le mutationFn pour éviter les stale closures dans une mutation async.

### Piège critique n°5 : `getPublicUrl` ne retourne pas d'erreur

```ts
const { data } = supabase.storage.from('vehicles').getPublicUrl(storagePath);
// data.publicUrl est toujours présent — pas de champ error
```

Ne pas destructurer `error` depuis `getPublicUrl` — il n'en retourne pas. Le `storagePath` (pas la `publicUrl`) est ce qui est stocké dans `vehicle_photos.storage_path`.

### Piège critique n°6 : `manipulateAsync` — `expo-image-manipulator`

```ts
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const result = await manipulateAsync(
  uri,
  [{ resize: { width: 1200 } }],  // resize garde le ratio automatiquement
  { compress: 0.8, format: SaveFormat.JPEG }
);
// result.uri = URI local compressé
```

Le `resize` avec seulement `width` préserve le ratio. Ne pas spécifier `height` pour éviter la déformation.

### Piège critique n°7 : `owner_id` depuis l'auth store

Dans une mutation async (hors composant React), ne pas lire depuis un hook. Utiliser :

```ts
const ownerId = useAuthStore.getState().user?.id;
if (!ownerId) throw new Error('Non authentifié');
```

### Indicateur de progression dans `post.tsx`

La mutation TanStack Query n'expose pas de progress callbacks nativement. Pour afficher "X / N photos uploadées", ajouter un `useState` local dans `PostScreen` et le mettre à jour via un callback passé à la mutation :

```tsx
// Dans PostScreen
const [uploadProgress, setUploadProgress] = useState<number>(0);
const { mutate, isPending } = useCreateVehicle({ onProgress: setUploadProgress });
```

Ou plus simplement : le hook `useCreateVehicle` peut exposer un `progress` state directement (via `useState` interne au hook + callback).

### Invalidation TanStack Query après publication

```ts
// Dans onSuccess de useMutation
await queryClient.invalidateQueries({ queryKey: ['vehicles'] });
```

La query key dans `use-vehicles.ts` est `['vehicles']` (sans cursor dans la key). L'invalidation globale recharge le feed.

### Schéma DB — champs vehicles utilisés dans cette story

```ts
// Champs obligatoires
brand: string       // depuis store.brand
model: string       // depuis store.model
type: string        // depuis store.type (ex: 'car', 'velo')
owner_id: string    // depuis useAuthStore.getState().user.id

// Champs optionnels
year: number | null
displacement: string | null
power: number | null
description: string | null
tags: string[] | null
city: string | null
lat: number | null   // null si !store.precise
lng: number | null   // null si !store.precise
is_published: boolean | null
```

Note : le champ `precise` du store n'existe pas en DB. Il contrôle uniquement si `lat`/`lng` sont inclus dans l'INSERT. Comme aucune géolocalisation réelle n'est implémentée dans ce stepper (la carte est visuelle), `lat` et `lng` resteront `null` pour l'instant — le toggle `precise` n'a pas d'effet concret dans cette story.

### Schéma DB — champs vehicle_photos

```ts
vehicle_id: string     // id du véhicule créé
storage_path: string   // chemin brut (ex: "{userId}/{vehicleId}/0.jpg")
position: number       // index 0-based dans le tableau photos
is_cover: boolean      // true uniquement pour position === 0
```

### Learnings des stories précédentes

- `Image` de react-native (pas expo-image) ✅
- Sélecteurs Zustand granulaires obligatoires ✅ — dans cette story, le mutationFn lit depuis `usePostStore.getState()` (pas de hook dans async)
- `Toast.show({ type: 'error', text1: '...' })` depuis `react-native-toast-message` ✅
- `@/` path alias fonctionne partout sous `app/` ✅
- `npx tsc --noEmit` depuis `app/` (pas depuis la racine) ✅
- `queryClient` est exporté depuis `@/lib/query-client` ✅

### Scope de cette story vs stories adjacentes

| Feature | Story 3.1 | Story 3.2 | **Story 3.3** |
|---------|-----------|-----------|---------------|
| Photos picker | ✅ | — | — |
| Type & Specs connecté store | — | ✅ | — |
| Description & Tags connecté store | — | ✅ | — |
| Localisation connectée store | — | ✅ | — |
| Compression expo-image-manipulator | — | — | **✅** |
| Upload Supabase Storage | — | — | **✅** |
| INSERT `vehicles` en DB | — | — | **✅** |
| INSERT `vehicle_photos` en DB | — | — | **✅** |
| Invalidation feed après publication | — | — | **✅** |

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#Image pipeline]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/implementation-artifacts/3-2-stepper-creation-vehicule-etapes-2-3-4.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `expo-image-manipulator` absent de `package.json` → installé (`npm install expo-image-manipulator`, version ^55.0.15 compatible). API `manipulateAsync` / `SaveFormat` confirmée dans le module installé.
- Ordre d'implémentation choisi : INSERT vehicles avec `is_published: false`, upload photos, UPDATE `is_published: true` (plus robuste que l'approche direct `is_published: true`).
- `StorageError` géré séparément de `PostgrestError` via instanceof + message check.

### Completion Notes List

- Créé `use-create-vehicle.ts` : hook TanStack Query mutation complet avec compression (`expo-image-manipulator`), upload Supabase Storage (blob via fetch), INSERT vehicles + vehicle_photos, invalidation query, reset store, navigation, toasts
- `uploadProgress` exposé comme state interne au hook, remontée progressive "X / N photos uploadées..." dans le bouton
- `post.tsx` : import ajouté, `isContinueDisabled` étendu à `isPending`, bouton "Publier le build" câblé sur `createVehicle(usePostStore.getState())`
- `npx tsc --noEmit` — zéro erreur

### File List

- app/lib/hooks/use-create-vehicle.ts (CRÉÉ)
- app/app/(tabs)/post.tsx (MODIFIÉ)
- app/package.json (MODIFIÉ — ajout expo-image-manipulator)
- app/package-lock.json (MODIFIÉ)

### Change Log

- 2026-04-30 : Story 3.3 implémentée — pipeline upload & publication du véhicule avec compression expo-image-manipulator, hook useCreateVehicle, indicateur de progression, gestion d'erreurs StorageError/PostgrestError
