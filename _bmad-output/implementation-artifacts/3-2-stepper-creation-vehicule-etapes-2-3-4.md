# Story 3.2: Stepper création véhicule — Étapes 2, 3 & 4

Status: review

## Story

As a utilisateur,
I want saisir les caractéristiques, la description, les tags et la localisation de mon véhicule,
so that les autres passionnés trouvent et comprennent facilement mon build.

## Acceptance Criteria

1. **Étape 2 — Grille types :** une grille 2×3 avec icônes permet de choisir le type (Voiture, Moto, Van, Camion, Vélo, Classic) ; le type sélectionné est surligné (fond violet) et stocké via `usePostStore`
2. **Étape 2 — Champs specs :** les champs Marque, Modèle, Année, Cylindrée, Puissance sont des vrais `TextInput` préremplis à vide, connectés au store via setters granulaires Zustand
3. **Étape 2 — Suggestions tags :** des suggestions de tags basées sur le type sélectionné s'affichent sous les champs (visuel uniquement, non interactif à cette étape)
4. **Étape 3 — Textarea :** un `TextInput` multiline limité à 300 caractères avec compteur visible (`X / 300`) permet la description libre, connecté à `usePostStore`
5. **Étape 3 — Tags actifs :** les tags actifs (initialement vides, remplis via suggestions ou saisie libre) s'affichent avec un bouton × pour les supprimer ; l'état est dans `usePostStore`
6. **Étape 3 — Suggestions tags :** les suggestions de tags de l'Étape 2 (basées sur le type) sont proposées ; tapper sur une suggestion l'ajoute aux tags actifs ; les tags déjà actifs ne sont pas proposés
7. **Étape 4 — Ville :** un `TextInput` "Ville de rattachement" est connecté à `usePostStore` via `setCity`
8. **Étape 4 — Toggle :** le toggle "Position précise" est un vrai `Switch` React Native connecté à `usePostStore` via `setPrecise`
9. **Étape 4 — Aperçu card :** l'aperçu de la card finale affiche la première photo locale du store (`photos[0]`) via `Image source={{ uri: photos[0] }}` si disponible, sinon le `KaraPhoto` placeholder existant ; le nom du véhicule affiche `brand + ' ' + model` du store si renseignés
10. **TypeScript :** `npx tsc --noEmit` passe sans erreur

## Tasks / Subtasks

- [x] Ajouter les setters manquants à `usePostStore` (AC: 1, 2, 4, 5, 7, 8)
  - [x] Ajouter à l'interface `PostStore` : `setType`, `setBrand`, `setModel`, `setYear`, `setDisplacement`, `setPower`, `setDescription`, `addTag`, `removeTag`, `setCity`, `setPrecise`
  - [x] Implémenter chaque setter dans `create()` :
    - `setType: (type) => set({ type })`
    - `setBrand: (brand) => set({ brand })`
    - `setModel: (model) => set({ model })`
    - `setYear: (year) => set({ year })`
    - `setDisplacement: (displacement) => set({ displacement })`
    - `setPower: (power) => set({ power })`
    - `setDescription: (description) => set({ description })`
    - `addTag: (tag) => set((s) => ({ tags: s.tags.includes(tag) ? s.tags : [...s.tags, tag] }))`
    - `removeTag: (tag) => set((s) => ({ tags: s.tags.filter((t) => t !== tag) }))`
    - `setCity: (city) => set({ city })`
    - `setPrecise: (precise) => set({ precise })`

- [x] Mettre à jour la constante `VEHICLE_TYPES` dans `post.tsx` (AC: 1)
  - [x] Remplacer `{ id: 'other', label: 'Autre', Icon: Car }` par `{ id: 'velo', label: 'Vélo', Icon: Bike }`
  - [x] Vérifier que les 6 types résultants sont : `car`, `bike`, `van`, `truck`, `velo`, `classic`

- [x] Ajouter la constante `TAG_SUGGESTIONS_BY_TYPE` dans `post.tsx` (AC: 3, 6)
  - [x] Définir le dictionnaire hors des composants :
    ```ts
    const TAG_SUGGESTIONS_BY_TYPE: Record<string, string[]> = {
      car:     ['#JDM', '#Stance', '#Tuning', '#Track', '#Daily', '#Modified', '#OEM+'],
      bike:    ['#Moto', '#Scrambler', '#Café', '#Touring', '#Enduro', '#Supermot'],
      van:     ['#Vanlife', '#Camping', '#RoadTrip', '#Conversion', '#DIY'],
      truck:   ['#Pickup', '#4x4', '#OffRoad', '#Lifted', '#Utilitaire'],
      velo:    ['#Cycling', '#Gravel', '#MTB', '#Fixie', '#Vintage', '#Bikepacking'],
      classic: ['#Classic', '#Vintage', '#Oldtimer', '#Restauration', '#Patine'],
    };
    ```

- [x] Réécrire `StepSpecs` connecté au store (AC: 1, 2, 3)
  - [x] Supprimer `const [type, setType] = useState('car')` — lire depuis le store
  - [x] Lire depuis le store (sélecteurs granulaires) :
    ```ts
    const type         = usePostStore((s) => s.type);
    const setType      = usePostStore((s) => s.setType);
    const brand        = usePostStore((s) => s.brand);
    const setBrand     = usePostStore((s) => s.setBrand);
    // …idem pour model, year, displacement, power
    ```
  - [x] La grille 2×3 reste visuelle identique (même styles), mais `onPress` appelle `setType(t.id)` et `type === t.id` lit depuis le store
  - [x] Chaque champ de specs devient un vrai `TextInput` (remplace le `<View>` + `<Text>` statiques) :
    - `Marque` : `value={brand}`, `onChangeText={setBrand}`, `placeholder="ex. Nissan"`, `placeholderTextColor="#5C5B78"`
    - `Modèle` : `value={model}`, `onChangeText={setModel}`, `placeholder="ex. Silvia S15"`
    - `Année` : `value={year !== null ? String(year) : ''}`, `onChangeText={(t) => setYear(t ? parseInt(t, 10) : null)}`, `keyboardType="numeric"`, `maxLength={4}`, `placeholder="2001"`
    - `Cylindrée` : `value={displacement}`, `onChangeText={setDisplacement}`, `placeholder="ex. 2.0L Turbo"`
    - `Puissance` : `value={power !== null ? String(power) : ''}`, `onChangeText={(t) => setPower(t ? parseInt(t, 10) : null)}`, `keyboardType="numeric"`, `placeholder="ex. 280"`
  - [x] Afficher les suggestions `TAG_SUGGESTIONS_BY_TYPE[type] ?? []` sous les champs — visuellement identique au mock (`KaraTag`), non interactif ici
  - [x] Supprimer l'import du champ `Plaque (optionnel)` — non dans le scope (absent de l'epic AC)

- [x] Réécrire `StepDescription` connecté au store (AC: 4, 5, 6)
  - [x] Lire depuis le store :
    ```ts
    const description = usePostStore((s) => s.description);
    const setDescription = usePostStore((s) => s.setDescription);
    const tags        = usePostStore((s) => s.tags);
    const addTag      = usePostStore((s) => s.addTag);
    const removeTag   = usePostStore((s) => s.removeTag);
    const type        = usePostStore((s) => s.type);
    ```
  - [x] `TextInput` multiline pour la description :
    - `value={description}`, `onChangeText={(t) => setDescription(t.slice(0, 300))}`
    - `multiline={true}`, `maxLength={300}`, `placeholder="Décris ton build..."`
    - Compteur : `<Text>{description.length} / 300</Text>`
  - [x] Tags actifs : mapper `tags` → chips avec bouton ×, `onPress={() => removeTag(t)}`
  - [x] Saisie libre de tag : `TextInput` inline qui, au submit (`onSubmitEditing`), appelle `addTag('#' + value.replace(/^#/, '').trim())` si non vide, puis reset l'input
  - [x] Suggestions : `TAG_SUGGESTIONS_BY_TYPE[type] ?? []` filtrées par `!tags.includes(t)` → chips pressables → `onPress={() => addTag(t)}`
  - [x] Ne pas afficher de suggestion si la liste filtrée est vide

- [x] Réécrire `StepLocation` connecté au store (AC: 7, 8, 9)
  - [x] Lire depuis le store :
    ```ts
    const city    = usePostStore((s) => s.city);
    const setCity = usePostStore((s) => s.setCity);
    const precise = usePostStore((s) => s.precise);
    const setPrecise = usePostStore((s) => s.setPrecise);
    const photos  = usePostStore((s) => s.photos);
    const brand   = usePostStore((s) => s.brand);
    const model   = usePostStore((s) => s.model);
    ```
  - [x] La zone carte reste le bloc visuel existant (fond sombre + point violet) — aucune vraie carte requise
  - [x] Champ "Ville de rattachement" : `TextInput value={city} onChangeText={setCity} placeholder="Lyon, 69"`
  - [x] Toggle : remplacer le faux toggle visuel par `<Switch value={precise} onValueChange={setPrecise} thumbColor={precise ? '#7C3AED' : '#fff'} trackColor={{ false: '#2A2A3D', true: 'rgba(124,58,237,0.4)' }} />`
  - [x] Aperçu card : si `photos[0]` existe → `<Image source={{ uri: photos[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />` ; sinon garder `<KaraPhoto ...>` ; afficher `{brand} {model}` ou "Nissan Silvia S15" si vide

- [x] Vérification TypeScript (AC: 10)
  - [x] Ajouter les imports manquants dans `post.tsx` : `TextInput, Switch, StyleSheet` depuis `'react-native'`
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à modifier (UPDATE)

```
app/lib/stores/use-post-store.ts   ← ajouter 11 setters
app/app/(tabs)/post.tsx            ← réécrire StepSpecs, StepDescription, StepLocation
```

### Ne PAS modifier

- `StepPhotos` — scope Story 3.1, ne pas toucher
- `PostScreen` — la logique stepper et le bouton "Continuer" sont corrects. Ne pas ajouter de validation `disabled` pour les étapes 1, 2, 3 (non demandé dans les AC)
- `app/lib/supabase.ts`, `app/components/shared/*` — hors scope

### État actuel de `use-post-store.ts` (CRITIQUE)

L'interface a tous les **champs** mais seulement `setPhotos` et `reset` comme actions.
Les champs `type`, `brand`, `model`, `year`, `displacement`, `power`, `description`, `tags`, `city`, `precise` existent déjà en state — ne pas les re-déclarer, juste ajouter les setters.

```ts
// État actuel — setters MANQUANTS :
interface PostStore {
  photos: string[];       // ← setter existant : setPhotos
  type: string;           // ← MANQUE : setType
  brand: string;          // ← MANQUE : setBrand
  model: string;          // ← MANQUE : setModel
  year: number | null;    // ← MANQUE : setYear
  displacement: string;   // ← MANQUE : setDisplacement
  power: number | null;   // ← MANQUE : setPower
  description: string;    // ← MANQUE : setDescription
  tags: string[];         // ← MANQUE : addTag, removeTag
  city: string;           // ← MANQUE : setCity
  precise: boolean;       // ← MANQUE : setPrecise
  reset: () => void;      // ← existant
  setPhotos: ...;         // ← existant
}
```

### État actuel de `post.tsx` — ce qui change vs ce qui reste

| Composant | État actuel | Action story 3.2 |
|---|---|---|
| `VEHICLE_TYPES` const | 'other'/'Autre' en dernier | Remplacer par 'velo'/'Vélo' |
| `StepPhotos` | Fonctionnel (story 3.1) | **Ne pas toucher** |
| `StepSpecs` | Mock + local `useState` pour type | **Réécrire** → store |
| `StepDescription` | Mock statique hardcodé | **Réécrire** → store |
| `StepLocation` | Mock statique + faux toggle | **Réécrire** → store |
| `PostScreen` | Correct, `isContinueDisabled` step 0 only | **Ne pas toucher** |

### Pièges critiques

#### Piège n°1 : Année et Puissance — conversion string ↔ number

`TextInput` retourne toujours une string. `year: number | null` et `power: number | null` dans le store.

```tsx
// ✅ Correct — handler Année
onChangeText={(text) => setYear(text.trim() ? parseInt(text, 10) : null)}

// ✅ Correct — affichage
value={year !== null ? String(year) : ''}

// ❌ Incorrect — NaN dans le store
onChangeText={(text) => setYear(parseInt(text, 10))}
```

Même logique pour `power`. `parseInt` retourne `NaN` sur chaîne vide — toujours vérifier `text.trim()` avant.

#### Piège n°2 : Sélecteurs Zustand granulaires — obligatoire

```tsx
// ✅ Correct — un sélecteur par valeur
const type    = usePostStore((s) => s.type);
const setType = usePostStore((s) => s.setType);

// ❌ Interdit — re-render global sur tout changement du store
const { type, setType, brand, ... } = usePostStore();
```

#### Piège n°3 : `addTag` — idempotence et format

```ts
// ✅ Correct dans le store — empêche les doublons
addTag: (tag) => set((s) => ({
  tags: s.tags.includes(tag) ? s.tags : [...s.tags, tag]
})),

// ✅ Correct dans le composant — normalise le format
const normalized = '#' + rawInput.replace(/^#/, '').trim();
if (normalized !== '#') addTag(normalized);
```

#### Piège n°4 : `Switch` — props `thumbColor` et `trackColor` obligatoires pour styliser

Sans ces props, le Switch utilise les couleurs système iOS/Android qui ne correspondent pas au design.

```tsx
<Switch
  value={precise}
  onValueChange={setPrecise}
  thumbColor={precise ? '#7C3AED' : '#fff'}
  trackColor={{ false: '#2A2A3D', true: 'rgba(124,58,237,0.4)' }}
/>
```

#### Piège n°5 : `TextInput` style — `height` explicite pour le textarea description

Sur Android, un `TextInput multiline` sans `minHeight` peut s'effondrer à zéro.

```tsx
<TextInput
  multiline
  style={{ minHeight: 120, textAlignVertical: 'top', ... }}
  ...
/>
```

#### Piège n°6 : Ne pas supprimer le champ `Plaque (optionnel)` du mock

Ce champ est présent dans le mock actuel mais **absent** des AC et du schéma DB. **Le supprimer silencieusement** pour garder le code propre — ne pas l'implémenter, ne pas le laisser statique.

#### Piège n°7 : Aperçu card — `Image` de RN supporte les URIs locaux

Les photos du store à cette étape sont des URIs locaux (`file:///...`), pas des URLs Supabase. `buildImageUrl()` ne s'applique PAS ici. Utiliser directement `Image source={{ uri: photos[0] }}`.

```tsx
// ✅ Correct — URI local, pas besoin de buildImageUrl
{photos[0] ? (
  <Image source={{ uri: photos[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
) : (
  <KaraPhoto tone="cyan-tokyo" ... />
)}
```

#### Piège n°8 : `VEHICLE_TYPES` const — changement d'ID 'other' → 'velo'

L'ID `'velo'` sera stocké en DB lors de la Story 3.3. Vérifier qu'aucun autre endroit dans le code ne référence l'ID `'other'` pour les types véhicule (grep rapide avant de modifier).

### Imports à ajouter dans `post.tsx`

```tsx
import { View, Text, ScrollView, Pressable, Image,
         TextInput, Switch, StyleSheet } from 'react-native';  // ajouter TextInput, Switch, StyleSheet
```

`KeyboardAvoidingView` et `Platform` ne sont pas nécessaires — `ScrollView` gère le scroll naturellement et `textAlignVertical` est géré par `multiline`.

### Learnings des stories précédentes

- `Image` de react-native (pas expo-image, non installé) ✅
- Sélecteurs Zustand granulaires — **critique**, déjà établi en 3.1 ✅
- `Toast.show()` disponible depuis `react-native-toast-message` — pas utilisé dans cette story (pas d'erreurs Supabase)
- `@/` path alias fonctionne partout sous `app/` ✅
- `npx tsc --noEmit` depuis `app/` (pas depuis la racine) ✅
- `KaraTag` existe dans `components/shared/KaraTag.tsx` — utiliser pour les chips de suggestion

### Scope de cette story vs stories adjacentes

| Feature | Story 3.1 | **Story 3.2** | Story 3.3 |
|---------|-----------|---------------|-----------|
| Photos picker | ✅ | — | — |
| Type & Specs fonctionnel (store) | — | **✅** | — |
| Description & Tags fonctionnel (store) | — | **✅** | — |
| Localisation fonctionnel (store) | — | **✅** | — |
| Validation required avant "Publier" | — | — | — |
| Compression expo-image-manipulator | — | — | ✅ |
| Upload Supabase Storage | — | — | ✅ |
| INSERT `vehicles` en DB | — | — | ✅ |

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture — Zustand]
- [Source: _bmad-output/planning-artifacts/architecture.md#Communication Patterns — Zustand sélecteurs granulaires]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns — Naming]
- [Source: _bmad-output/implementation-artifacts/3-1-stepper-creation-vehicule-etape-1-photos.md#Learnings]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Aucun blocage rencontré.

### Completion Notes List

- Ajouté 11 setters granulaires dans `usePostStore` (setType, setBrand, setModel, setYear, setDisplacement, setPower, setDescription, addTag, removeTag, setCity, setPrecise)
- `StepSpecs` réécrit : grille type connectée au store, 5 vrais TextInput (Marque, Modèle, Année, Cylindrée, Puissance) avec conversions string↔number pour year et power, champ Plaque supprimé, suggestions TAG_SUGGESTIONS_BY_TYPE[type] affichées via KaraTag
- `StepDescription` réécrit : TextInput multiline avec compteur X/300, tags actifs pressables (× = removeTag), saisie libre via onSubmitEditing, suggestions filtrées masquées quand vide
- `StepLocation` réécrit : TextInput pour ville, Switch React Native stylisé pour precise, aperçu card avec photo locale réelle (photos[0]) ou KaraPhoto placeholder, nom = `${brand} ${model}` ou fallback
- `npx tsc --noEmit` — zéro erreur

### File List

- app/lib/stores/use-post-store.ts
- app/app/(tabs)/post.tsx

### Change Log

- 2026-04-30 : Story 3.2 implémentée — étapes 2, 3 et 4 du stepper création véhicule connectées à usePostStore avec sélecteurs Zustand granulaires
