# Story 3.1: Stepper création véhicule — Étape 1 Photos

Status: review

## Story

As a utilisateur,
I want uploader et ordonner les photos de mon véhicule,
so that mon build est présenté avec les meilleures photos dans le bon ordre.

## Acceptance Criteria

1. `expo-image-picker` est installé (`npx expo install expo-image-picker`) et déclaré dans `app.json` → plugins avec la permission galerie en français
2. La fonction `setPhotos(photos: string[]) => void` est ajoutée à `usePostStore` — les photos sont des URIs locaux (string)
3. Dans `StepPhotos` : le bouton "Ajouter" (et la zone vide initiale) ouvre la galerie via `ImagePicker.launchImageLibraryAsync` ; la sélection est limitée à `10 - photos.length` photos maximum
4. Les photos sélectionnées s'affichent sous forme de vignettes `Image` RN (pas de `KaraPhoto` mock) avec le vrai URI local
5. La première photo porte un badge "Photo principale" violet (`#7C3AED`)
6. Un bouton `X` sur chaque vignette supprime la photo du tableau et appelle `setPhotos`
7. Le compteur `X/10 PHOTOS · GLISSE POUR RÉORDONNER` reflète le nombre réel de photos sélectionnées
8. Les photos sont réordonnables : long-press sur une vignette la sélectionne (bordure violette), tap sur une autre vignette les échange de position — `selectedIdx` est un `useState` local dans `StepPhotos`
9. `usePostStore.setPhotos()` est appelé à chaque modification du tableau (ajout, suppression, réordonnancement)
10. Le bouton "Continuer" dans `PostScreen` est désactivé (`opacity: 0.5`, non pressable) quand `step === 0 && photos.length === 0`
11. Le bouton "Brouillon" dans le header de `PostScreen` appelle `router.back()` — le store conserve les photos en mémoire (pas de persistance cross-session nécessaire pour cette story)
12. `npx tsc --noEmit` passe sans erreur TypeScript

## Tasks / Subtasks

- [x] Installer `expo-image-picker` et configurer `app.json` (AC: 1)
  - [x] `npx expo install expo-image-picker` dans `app/`
  - [x] Ajouter le plugin `expo-image-picker` dans `app.json → expo.plugins` avec `photosPermission` en français
  - [x] Vérifier que `expo.ios.infoPlist.NSPhotoLibraryUsageDescription` n'est PAS ajouté manuellement (le plugin le gère)

- [x] Ajouter `setPhotos` à `usePostStore` (AC: 2)
  - [x] Dans l'interface `PostStore` : ajouter `setPhotos: (photos: string[]) => void`
  - [x] Dans `create()` : ajouter `setPhotos: (photos) => set({ photos })`

- [x] Implémenter `StepPhotos` avec expo-image-picker (AC: 3, 4, 5, 6, 7, 8, 9)
  - [x] Lire les photos depuis `usePostStore((s) => s.photos)` (sélecteur granulaire — jamais le store entier)
  - [x] Lire `setPhotos` depuis `usePostStore((s) => s.setPhotos)`
  - [x] Ajouter `const [selectedIdx, setSelectedIdx] = useState<number | null>(null)` pour le mode reorder
  - [x] Implémenter `handlePickPhotos()` : demander permission → ouvrir galerie → concaténer les nouveaux URIs → appeler `setPhotos`
  - [x] Implémenter `handleRemove(idx: number)` : filtrer le tableau → `setPhotos` → reset `selectedIdx`
  - [x] Implémenter `handleLongPress(idx: number)` : si `selectedIdx === null` → `setSelectedIdx(idx)` ; si `selectedIdx === idx` → désélectionner ; sinon → swapper les deux positions → `setPhotos` → `setSelectedIdx(null)`
  - [x] Afficher les vignettes : `Image source={{ uri: photo }}` (RN Image, pas expo-image)
  - [x] Badge "Photo principale" sur index 0 (violet `#7C3AED`)
  - [x] Bouton `X` sur chaque vignette → `handleRemove`
  - [x] Vignette sélectionnée : `borderColor: '#7C3AED'`, `borderWidth: 2`
  - [x] Bouton "Ajouter" visible si `photos.length < 10`
  - [x] Compteur `{photos.length} / 10 PHOTOS · LONG-PRESS POUR RÉORDONNER`
  - [x] Si aucune photo : afficher un état vide centré avec icône caméra et texte "Ajoute ta première photo"

- [x] Mettre à jour `PostScreen` — Brouillon + bouton Continuer conditionnel (AC: 10, 11)
  - [x] Lire `photos` depuis `usePostStore((s) => s.photos)`
  - [x] Brancher `onPress` du bouton "Brouillon" → `router.back()`
  - [x] Le bouton "Continuer" : `disabled={step === 0 && photos.length === 0}` avec style `opacity: step === 0 && photos.length === 0 ? 0.5 : 1`

- [x] Vérification TypeScript (AC: 12)
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer (NEW)

Aucun.

### Fichiers à modifier (UPDATE)

```
app/app.json                          ← ajouter plugin expo-image-picker
app/lib/stores/use-post-store.ts      ← ajouter setPhotos
app/app/(tabs)/post.tsx               ← implémenter StepPhotos réel + PostScreen branchements
```

### Ne PAS modifier

- `app/lib/supabase.ts` — buildImageUrl() ne s'applique pas aux URIs locaux (pas encore uploadés)
- `app/components/shared/*` — composants partagés suffisants
- Aucun autre écran que `post.tsx`

### État actuel de `app/app/(tabs)/post.tsx` (CRITIQUE — lire avant de modifier)

Le fichier contient **4 composants inline** et un écran principal :
- `StepPhotos` (lignes ~22–52) — mock statique avec KaraPhoto, à remplacer entièrement
- `StepSpecs` (lignes ~54–88) — formulaire mock, à **NE PAS toucher**
- `StepDescription` (lignes ~90–117) — mock, à **NE PAS toucher**
- `StepLocation` (lignes ~119–154) — mock, à **NE PAS toucher**
- `PostScreen` (lignes ~156–219) — écran principal avec step navigation

Dans `PostScreen` :
- La barre de progression est déjà branchée sur `step` ✅
- `step === 0 && <StepPhotos />` est déjà rendu ✅
- Le bouton "Brouillon" est un `<Text>` sans `onPress` → à brancher
- Le bouton "Continuer" avance toujours → à conditionner pour step 0

**RULE** : La logique de navigation Retour/Continuer est déjà correcte. Ne pas la modifier sauf pour ajouter la condition `disabled`.

### État actuel de `use-post-store.ts`

```ts
interface PostStore {
  photos: string[];    // ← URIs locaux, vide au départ
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
  reset: () => void;   // ← seule action existante
  // setPhotos MANQUANT — à ajouter
}
```

Ajouter uniquement `setPhotos`. Ne PAS ajouter de setters pour les autres champs (scope Story 3.1).

### Implémentation de `StepPhotos` — code de référence

```tsx
import * as ImagePicker from 'expo-image-picker';

function StepPhotos() {
  const photos = usePostStore((s) => s.photos);
  const setPhotos = usePostStore((s) => s.setPhotos);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  async function handlePickPhotos() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission galerie refusée.' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10 - photos.length,
      quality: 1, // pas de compression ici — pipeline Story 3.3
    });
    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setPhotos([...photos, ...newUris].slice(0, 10));
    }
  }

  function handleRemove(idx: number) {
    const next = photos.filter((_, i) => i !== idx);
    setPhotos(next);
    setSelectedIdx(null);
  }

  function handleLongPress(idx: number) {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null); // désélectionner
    } else {
      // Swap des deux positions
      const next = [...photos];
      [next[selectedIdx], next[idx]] = [next[idx], next[selectedIdx]];
      setPhotos(next);
      setSelectedIdx(null);
    }
  }

  if (photos.length === 0) {
    return (
      <Pressable
        onPress={handlePickPhotos}
        style={{ /* plein-largeur, height 220, dashed border, centré */ }}
      >
        {/* icône caméra + texte */}
      </Pressable>
    );
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {photos.map((uri, idx) => (
          <Pressable
            key={uri}
            onLongPress={() => handleLongPress(idx)}
            style={[
              idx === 0
                ? { width: '100%', height: 220, borderRadius: 18, overflow: 'hidden' }
                : { width: '47%', height: 100, borderRadius: 14, overflow: 'hidden' },
              selectedIdx === idx && { borderWidth: 2, borderColor: '#7C3AED' },
            ]}
          >
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {/* Badge "Photo principale" sur index 0 */}
            {idx === 0 && (
              <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#7C3AED', paddingHorizontal: 10, height: 26, borderRadius: 999, justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>Photo principale</Text>
              </View>
            )}
            {/* Bouton X */}
            <Pressable
              onPress={() => handleRemove(idx)}
              style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} color="#fff" />
            </Pressable>
            {/* Indice de sélection visible */}
            {selectedIdx !== null && selectedIdx !== idx && (
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, height: 22, borderRadius: 11, justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Inter_600SemiBold' }}>Tap pour échanger</Text>
              </View>
            )}
          </Pressable>
        ))}
        {/* Bouton Ajouter — visible si < 10 photos */}
        {photos.length < 10 && (
          <Pressable
            onPress={handlePickPhotos}
            style={{ width: photos.length === 0 ? '100%' : '47%', height: photos.length === 0 ? 220 : 100, /* ... */ }}
          >
            <Plus size={20} color="#9594B5" />
            <Text>Ajouter</Text>
          </Pressable>
        )}
      </View>
      <Text style={{ color: '#5C5B78', fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 14, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {photos.length} / 10 PHOTOS · LONG-PRESS POUR RÉORDONNER
      </Text>
    </View>
  );
}
```

### Configuration `app.json` — plugin expo-image-picker

```json
"plugins": [
  "expo-router",
  "expo-font",
  "expo-secure-store",
  [
    "expo-image-picker",
    {
      "photosPermission": "Kara utilise ta galerie photo pour publier tes builds."
    }
  ]
]
```

### Branchements dans `PostScreen`

```tsx
// En haut de PostScreen — ajouter :
const photos = usePostStore((s) => s.photos);

// Bouton Brouillon (actuellement juste un <Text>) :
<Pressable onPress={() => router.back()}>
  <Text ...>Brouillon</Text>
</Pressable>

// Bouton Continuer — ajouter disabled :
const isContinueDisabled = step === 0 && photos.length === 0;
<Pressable
  onPress={() => step < 3 ? setStep(step + 1) : router.replace('/(tabs)')}
  disabled={isContinueDisabled}
  style={[
    { /* styles existants */ },
    isContinueDisabled && { opacity: 0.5 },
  ]}
>
```

### Pièges critiques

#### Piège n°1 : `expo-image-picker` — `selectionLimit` avec `allowsMultipleSelection`

```tsx
// ✅ Correct — limiter à ce qu'il reste disponible
selectionLimit: 10 - photos.length

// ❌ Incorrect — ne pas hardcoder 10, l'utilisateur a peut-être déjà 8 photos
selectionLimit: 10
```

`selectionLimit` fonctionne sur iOS 14+. Sur Android et Expo Go, `allowsMultipleSelection` peut ignorer la limite — ajouter `slice(0, 10)` sur le résultat final.

#### Piège n°2 : URI local ≠ URL Supabase Storage

Les URIs retournés par `expo-image-picker` sont des URIs locaux (`file:///...`). **Ne jamais** appeler `buildImageUrl()` dessus. Ces URIs servent uniquement à l'affichage dans le stepper. La compression + upload se passe en Story 3.3.

#### Piège n°3 : `Image` de react-native, pas expo-image

Cohérent avec les autres stories : `import { Image } from 'react-native'`. `expo-image` n'est pas installé.

#### Piège n°4 : Sélecteur Zustand granulaire obligatoire

```tsx
// ✅ Correct
const photos = usePostStore((s) => s.photos);
const setPhotos = usePostStore((s) => s.setPhotos);

// ❌ Interdit — re-render global sur tout changement du store
const store = usePostStore();
```

#### Piège n°5 : le `key` de la FlatList/map doit être stable

```tsx
// ❌ Utiliser l'index comme key — break swap animation
photos.map((uri, idx) => <View key={idx} ...>)

// ✅ Utiliser l'URI comme key — stable même après réordonnancement
photos.map((uri, idx) => <View key={uri} ...>)
```

Si l'utilisateur peut sélectionner la même photo deux fois, utiliser `${uri}-${idx}`.

#### Piège n°6 : Permission galerie — flow iOS

Sur iOS, si l'utilisateur refuse la permission et rappuie sur "Ajouter" :
- `requestMediaLibraryPermissionsAsync()` retourne `{ status: 'denied' }` immédiatement (sans redemander)
- Afficher un toast d'erreur et NE PAS ouvrir la galerie

```tsx
if (status !== 'granted') {
  Toast.show({ type: 'error', text1: 'Accès à la galerie refusé. Active-le dans les réglages.' });
  return;
}
```

#### Piège n°7 : `StepSpecs`, `StepDescription`, `StepLocation` — ne pas modifier

Ces 3 composants sont des maquettes visuelles fonctionnelles. Leur logique réelle est dans les stories 3.2 et 3.3. **Ne rien toucher** en dehors de `StepPhotos` et des ajustements `PostScreen` (Brouillon + disabled).

#### Piège n°8 : Toast import

`Toast` est déjà disponible — `import Toast from 'react-native-toast-message'`. Le composant `<Toast />` est déjà monté dans `_layout.tsx`. Juste appeler `Toast.show()`.

### Learnings des stories précédentes (Epics 1 & 2)

- `@/` path alias fonctionne dans tous les fichiers sous `app/` ✅
- `Image` de react-native (pas expo-image) ✅
- Sélecteurs Zustand granulaires obligatoires ✅
- `handleSupabaseError` / `handleAuthError` pour les erreurs — pas applicable ici (pas de requête Supabase dans cette story)
- `npx tsc --noEmit` doit passer avant de valider la story ✅

### Imports à ajouter dans `post.tsx`

```tsx
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';  // déjà disponible dans RN, probablement pas encore importé ici
import Toast from 'react-native-toast-message';
import { usePostStore } from '@/lib/stores/use-post-store';
```

### Scope de cette story vs stories suivantes

| Feature | Story 3.1 | Story 3.2 | Story 3.3 |
|---------|-----------|-----------|-----------|
| Sélection photos (picker) | ✅ | — | — |
| Affichage vignettes locales | ✅ | — | — |
| Réordonnancement | ✅ | — | — |
| Suppression photo | ✅ | — | — |
| Type & Specs formulaire fonctionnel | — | ✅ | — |
| Description & Tags fonctionnel | — | ✅ | — |
| Localisation fonctionnel | — | ✅ | — |
| Compression images (expo-image-manipulator) | — | — | ✅ |
| Upload Supabase Storage | — | — | ✅ |
| Création enregistrement `vehicles` | — | — | ✅ |

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Aucun bug bloquant. `npx tsc --noEmit` passe sans erreur.

### Completion Notes List

- `expo-image-picker` installé (SDK 54 compatible) et plugin déclaré dans `app.json` avec permission galerie en français
- `setPhotos` ajouté à `usePostStore` (interface + implémentation `create`)
- `StepPhotos` entièrement réécrit : état vide (icône caméra + texte), grille photo réelle (1er large, suivants petits), badge "Photo principale", bouton X, sélection long-press + swap, bouton "Ajouter", compteur dynamique
- `PostScreen` : "Brouillon" wrappé dans `<Pressable onPress={() => router.back()}>`, "Continuer" disabled + opacity 0.5 quand `step === 0 && photos.length === 0`
- Sélecteurs Zustand granulaires respectés (`s.photos`, `s.setPhotos`)
- `Image` de react-native (pas expo-image, non installé)
- `key` des vignettes : `${uri}-${idx}` pour stabilité après swap

### File List

- `app/app.json` — plugin expo-image-picker ajouté
- `app/lib/stores/use-post-store.ts` — setPhotos ajouté à interface + implémentation
- `app/app/(tabs)/post.tsx` — StepPhotos réimplémenté, PostScreen branchements

## Change Log

- 2026-04-30 : Story créée — Epic 3 story 3.1, Stepper création véhicule Étape 1 Photos
- 2026-04-30 : Story implémentée — toutes les ACs satisfaites, tsc sans erreur → status: review
