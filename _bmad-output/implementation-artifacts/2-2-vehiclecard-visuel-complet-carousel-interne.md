# Story 2.2: VehicleCard — visuel complet avec carousel interne

Status: review

## Story

As a utilisateur,
I want voir les détails visuels complets d'un véhicule dans le feed,
so that je peux d'un coup d'œil apprécier le build et ses specs.

## Acceptance Criteria

1. `app/components/vehicle/VehicleCard.tsx` existe — le composant `VehicleCard` est extrait de son emplacement inline dans `app/app/(tabs)/index.tsx` et expose exactement la même interface props `{ vehicle: VehicleWithRelations; cardHeight: number }`
2. `app/components/vehicle/VehiclePhotoCarousel.tsx` existe — gère le carousel horizontal interne (swipe pour photos suivantes) via `FlatList` horizontal avec `pagingEnabled` ; chaque photo utilise `buildImageUrl(photo.storage_path, ...)` exclusivement (NFR2 — jamais l'URL brute Supabase)
3. `VehiclePhotoCarousel` accepte les props `photos`, `onPhotoChange` (callback `(index: number) => void`), et `width` (pour un snapping exact par photo)
4. La badge `[🚗 Voiture]` (ou autre type) s'affiche en haut à gauche via `KaraBadge` avec l'icône `Car` ou `Bike` (lucide)
5. L'indicateur de photo `JP · 1/6` (badge pays + numéro) est visible en haut à droite et se met à jour en temps réel lors du swipe sur le carousel
6. Un gradient noir transparent → opaque couvre le bas de la card (UX-DR4) — déjà présent dans le code existant, à conserver tel quel
7. L'overlay bas affiche : `KaraAvatar` + @pseudo + `MapPin` + localisation, nom véhicule en `SpaceGrotesk_700Bold`, specs en caps `SR20DET · 280CH · RWD`, tags scrollables (`KaraTag`), boutons Suivre + message
8. La colonne d'actions droite (style TikTok) contient les icônes `Heart` · `MessageCircle` · `Bookmark` · `Share2` avec compteur — visuels uniquement, sans logique métier (logique en Story 5.1)
9. Toutes les couleurs utilisent les tokens `kara-*` NativeWind ou les valeurs déjà en place dans `index.tsx` — aucune nouvelle couleur hardcodée (UX-DR1)
10. `app/app/(tabs)/index.tsx` importe `VehicleCard` depuis `@/components/vehicle/VehicleCard` — le composant inline est supprimé ; le scroll-snap et la pagination de Story 2.1 restent intacts
11. `npx tsc --noEmit` (depuis `app/`) passe sans erreur TypeScript

## Tasks / Subtasks

- [x] Créer `app/components/vehicle/VehiclePhotoCarousel.tsx` (AC: 2, 3)
  - [x] Props : `photos: Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>[]`, `width: number`, `onPhotoChange: (index: number) => void`
  - [x] FlatList horizontal `pagingEnabled`, `snapToInterval={width}`, `decelerationRate="fast"`, `showsHorizontalScrollIndicator={false}`
  - [x] Chaque item : `Image` RN pleine largeur (`width`, `height`) avec `buildImageUrl(photo.storage_path, { width: 800, quality: 80 })`
  - [x] `viewabilityConfig` défini au niveau module (jamais inline) : `{ itemVisiblePercentThreshold: 50 }`
  - [x] `onViewableItemsChanged` défini en `useCallback` stable (jamais inline) — appelle `onPhotoChange(item.index)`
  - [x] `keyExtractor` sur `photo.id`

- [x] Créer `app/components/vehicle/VehicleCard.tsx` (AC: 1, 4, 5, 6, 7, 8, 9)
  - [x] Extraire le contenu de la fonction `VehicleCard` d'`index.tsx` tel quel
  - [x] Remplacer le `<Image>` plein-fond unique par `<VehiclePhotoCarousel photos={vehicle.vehicle_photos} width={cardWidth} height={cardHeight} onPhotoChange={setPhotoIdx} />`
  - [x] `photoIdx` devient un `useState(0)` réactif mis à jour par `onPhotoChange`
  - [x] `KaraPhoto` fallback (si `vehicle.vehicle_photos.length === 0`) géré dans `VehiclePhotoCarousel`
  - [x] Badge `[🚗 Voiture]` et badge pays `JP · 1/6` s'affichent avec `photoIdx + 1` dynamique
  - [x] Dots de progression : `photoIdx` dynamique (largeur dot active = 18, inactive = 4)
  - [x] Conserver tous les styles existants (gradients, overlay, colonne actions) — copie fidèle

- [x] Modifier `app/app/(tabs)/index.tsx` (AC: 10)
  - [x] Supprimer le composant `VehicleCard` inline
  - [x] Ajouter import : `import { VehicleCard } from '@/components/vehicle/VehicleCard';`
  - [x] Supprimer les imports devenus inutilisés dans `index.tsx` après extraction
  - [x] `renderItem`, `getItemLayout`, `snapToInterval`, pagination — intacts

- [x] Vérification TypeScript (AC: 11)
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer (NEW)

```
app/components/vehicle/VehicleCard.tsx        ← extraction depuis index.tsx + carousel
app/components/vehicle/VehiclePhotoCarousel.tsx ← nouveau composant carousel horizontal
```

### Fichiers à modifier (UPDATE)

```
app/app/(tabs)/index.tsx  ← supprimer VehicleCard inline + ajouter import
```

### Fichiers à NE PAS MODIFIER

- `app/lib/hooks/use-vehicles.ts` — hook et type `VehicleWithRelations` déjà corrects ✅
- `app/lib/supabase.ts` — `buildImageUrl()` déjà implémenté ✅
- `app/components/shared/*` — composants partagés déjà prêts ✅
- `app/app/app/_layout.tsx` — routing guard, QueryClient — ne pas toucher ✅

### État actuel de `app/app/(tabs)/index.tsx` (CONNU — lire avant de modifier)

- `VehicleCard` est une fonction inline aux lignes ~48–353 ; elle prend `{ vehicle: VehicleWithRelations; cardHeight: number }`
- `photoIdx` est un `useState(0)` local, actuellement non mis à jour (le carousel swipe est cette story)
- La logique de mapping (COUNTRY_EMOJI, TYPE_LABEL, displayName, displaySpecs, coverPhoto, photoCount…) est DANS `VehicleCard` — elle part avec lui
- Les constantes `COUNTRY_EMOJI` et `TYPE_LABEL` sont déclarées au niveau module (lignes ~36–46) → les déplacer dans `VehicleCard.tsx`
- Imports qui resteront dans `index.tsx` après extraction : `React`, `useState`, `useEffect`, `View`, `FlatList`, `useSafeAreaInsets`, `Bell`, `SlidersHorizontal`, `Toast`, `KaraWordmark`, `useVehicles`, `handleSupabaseError`
- Imports à retirer d'`index.tsx` après extraction : `Text`, `Pressable`, `ScrollView`, `Image`, `LinearGradient`, `useRouter`, `Heart`, `MessageCircle`, `Bookmark`, `Share2`, `MapPin`, `Car`, `Bike`, `KaraPhoto`, `KaraAvatar`, `KaraTag`, `KaraBadge`, `KaraButton`, `VehicleWithRelations`, `buildImageUrl`

### Implémentation de `VehiclePhotoCarousel.tsx`

```tsx
import React, { useCallback, useRef } from 'react';
import { FlatList, Image, View, ViewabilityConfig, ViewToken } from 'react-native';
import { Database } from '@/types/database';
import { buildImageUrl } from '@/lib/supabase';
import { KaraPhoto } from '@/components/shared/KaraPhoto';

type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type Photo = Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>;

interface Props {
  photos: Photo[];
  width: number;
  height: number;
  onPhotoChange: (index: number) => void;
}

const viewabilityConfig: ViewabilityConfig = {
  itemVisibilityPercentThreshold: 50,
};

export function VehiclePhotoCarousel({ photos, width, height, onPhotoChange }: Props) {
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0] != null) {
        onPhotoChange(viewableItems[0].index ?? 0);
      }
    },
    [onPhotoChange]
  );

  if (photos.length === 0) {
    return <KaraPhoto tone="crimson-rwd" style={{ position: 'absolute', top: 0, left: 0, width, height }} />;
  }

  return (
    <FlatList
      data={photos}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={width}
      snapToAlignment="start"
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image
          source={{ uri: buildImageUrl(item.storage_path, { width: 800, quality: 80 }) }}
          style={{ width, height }}
          resizeMode="cover"
        />
      )}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
}
```

### Pièges critiques

#### Piège n°1 : `viewabilityConfig` et `onViewableItemsChanged` NE DOIVENT PAS être inline

```tsx
// ❌ Interdit — FlatList warning + crash potential
<FlatList
  viewabilityConfig={{ itemVisibilityPercentThreshold: 50 }}
  onViewableItemsChanged={({ viewableItems }) => { ... }}
/>

// ✅ Correct — définir à l'extérieur du composant ou en useRef/useCallback
const viewabilityConfig: ViewabilityConfig = { itemVisibilityPercentThreshold: 50 };
const onViewableItemsChanged = useCallback(...)
```

#### Piège n°2 : `width` du carousel doit correspondre exactement à `snapToInterval`

Le `width` passé à `VehiclePhotoCarousel` doit correspondre à la largeur réelle de la carte (pas de l'écran). Dans `index.tsx`, la carte a `paddingHorizontal: 12`, donc `cardWidth = screenWidth - 24`. Utiliser `useWindowDimensions().width - 24` dans `VehicleCard` et passer ce `width` au carousel.

```tsx
// Dans VehicleCard.tsx
import { useWindowDimensions } from 'react-native';
const { width: screenWidth } = useWindowDimensions();
const cardWidth = screenWidth - 24; // padding 12 * 2 de index.tsx
```

#### Piège n°3 : `Image` de react-native, pas expo-image

`expo-image` n'est PAS dans les dépendances. Utiliser `import { Image } from 'react-native'` dans VehiclePhotoCarousel.tsx comme dans index.tsx.

#### Piège n°4 : Le `KaraPhoto` fallback est dans le carousel, pas dans la card

Si `photos.length === 0`, `VehiclePhotoCarousel` retourne le `KaraPhoto` directement (position absolute, mêmes dimensions). `VehicleCard` n'a pas à gérer le cas vide séparément.

#### Piège n°5 : Ne pas extraire `VehicleSpecGrid` ou `OwnerCard` dans cette story

Ces composants ne sont pas dans le scope de Story 2.2. `VehicleCard.tsx` est self-contained avec son overlay inline. Extraction = Story 4.4.

#### Piège n°6 : Conserver le scroll-snap vertical de Story 2.1

Ne rien modifier dans la `FlatList` verticale de `index.tsx` : `pagingEnabled`, `snapToInterval={containerHeight}`, `removeClippedSubviews={true}`, `onEndReached` — tout doit rester intact.

#### Piège n°7 : `photoIdx` dans VehicleCard doit repartir à 0 entre les cards

Chaque instance `VehicleCard` a son propre `useState(0)`. Le carousel horizontal est interne à chaque card. Il n'y a pas de state partagé entre les cards du feed.

#### Piège n°8 : Hauteur du carousel = hauteur totale de la card

`VehiclePhotoCarousel` prend `height` en prop = `cardHeight`. Le carousel recouvre toute la carte en fond. Les gradients et overlays au-dessus (zIndex 2 et 3) couvrent visuellement le carousel.

### Learnings de Story 2.1

- `storage_path` est le nom réel de la colonne dans `vehicle_photos` (pas `url`) ✅
- `buildImageUrl(storage_path, ...)` obligatoire — jamais concaténation manuelle ✅
- `Image` de react-native (pas expo-image) ✅
- Path alias `@/` fonctionne pour les imports dans les composants ✅
- `KaraPhoto` accepte une prop `style` pour le positionnement ✅
- `profiles` peut être `null` si RLS bloque → toujours `vehicle.profiles?.username ?? ''` ✅

### Imports requis dans `VehicleCard.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // non — pas besoin dans la card
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Bookmark, Share2, MapPin, Car, Bike } from 'lucide-react-native';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraBadge } from '@/components/shared/KaraBadge';
import { KaraButton } from '@/components/shared/KaraButton';
import { VehiclePhotoCarousel } from './VehiclePhotoCarousel';
import { VehicleWithRelations } from '@/lib/hooks/use-vehicles';
```

### Scope de cette story vs autres stories

| Feature | Story 2.1 | Story 2.2 | Story 4.3 | Story 5.1 |
|---------|-----------|-----------|-----------|-----------|
| Hook `use-vehicles.ts` | ✅ | — | — | — |
| Données réelles feed | ✅ | — | — | — |
| `VehicleCard` inline dans index.tsx | ✅ temp | supprimer | — | — |
| `VehicleCard.tsx` composant extrait | — | ✅ créer | — | — |
| `VehiclePhotoCarousel.tsx` | — | ✅ créer | — | — |
| Carousel interactif (swipe) | — | ✅ | — | — |
| Bouton Suivre fonctionnel | visuel only | visuel only | ✅ | — |
| Likes fonctionnels (❤️) | — | visuel only | — | ✅ |

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Correction : `itemVisibilityPercentThreshold` → `itemVisiblePercentThreshold` (typo dans le nom de la prop `ViewabilityConfig` de React Native — TypeScript l'a catchée)

### Completion Notes List

- `app/components/vehicle/VehiclePhotoCarousel.tsx` créé : FlatList horizontal `pagingEnabled`, `snapToInterval={width}`, `viewabilityConfig` au niveau module, `onViewableItemsChanged` en `useCallback`, fallback `KaraPhoto` si photos vides, chaque image via `buildImageUrl(storage_path, { width: 800, quality: 80 })`
- `app/components/vehicle/VehicleCard.tsx` créé : extraction depuis `index.tsx`, `photoIdx` réactif via `onPhotoChange` callback, `cardWidth = screenWidth - 24` pour aligner avec le padding du Pressable, `COUNTRY_EMOJI` et `TYPE_LABEL` déplacés ici, `VehiclePhotoCarousel` intégré en fond, tous les overlays et styles conservés
- `app/app/(tabs)/index.tsx` allégé : composant `VehicleCard` inline supprimé, imports réduits au minimum, `VehicleCard` importé depuis `@/components/vehicle/VehicleCard`, scroll-snap vertical intact
- `npx tsc --noEmit` : zéro erreur ✅

### File List

- `app/components/vehicle/VehiclePhotoCarousel.tsx` (créé)
- `app/components/vehicle/VehicleCard.tsx` (créé)
- `app/app/(tabs)/index.tsx` (modifié)

## Change Log

- 2026-04-30 : Story créée — Epic 2 story 2.2, VehicleCard extraction + carousel interne
- 2026-04-30 : Implémentation complète — VehiclePhotoCarousel + VehicleCard extraits, index.tsx allégé, tsc OK
