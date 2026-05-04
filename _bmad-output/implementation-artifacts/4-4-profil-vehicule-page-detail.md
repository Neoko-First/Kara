# Story 4.4: Profil véhicule (page détail)

Status: review

## Story

As a utilisateur,
I want voir la fiche complète d'un véhicule avec toutes ses specs et photos,
So that je peux explorer en détail le build d'un passionné.

## Acceptance Criteria

1. **Hook `use-vehicle.ts` :** `app/lib/hooks/use-vehicle.ts` expose `useVehicle(vehicleId: string)` qui charge le véhicule avec query key `['vehicle', vehicleId]`, ses photos ordonnées par `position ASC`, et le profil propriétaire (join `profiles!vehicles_owner_id_fkey`)
2. **Carousel plein écran :** `VehiclePhotoCarousel` est utilisé dans `vehicle/[id].tsx` avec `width = screenWidth` et `height ≈ screenHeight * 0.5` ; les dots de pagination sont affichés en overlay et réactifs au swipe
3. **Badges :** le badge type (icône + libellé) et le badge pays (emoji + code) sont affichés en haut à gauche de la zone hero, issus des données réelles (`vehicle.type`, `vehicle.country_code`)
4. **Nom du véhicule :** `${brand} ${model}` s'affiche en `SpaceGrotesk_700Bold` (font-display) — même style que le mockup
5. **Specs en caps :** la ligne specs affiche `${year} · ${displacement} · ${power}CH · ${transmission}` en Inter_500Medium 12px violet `#A78BFA`, avec les valeurs `null` omises
6. **Tags + description :** les tags sont scrollables horizontalement (`ScrollView horizontal`) ; la `description` s'affiche si non-null
7. **`VehicleSpecGrid` :** le composant `app/components/vehicle/VehicleSpecGrid.tsx` reçoit le véhicule et affiche une grille 2 colonnes avec 6 items : Année / Cylindrée / Puissance / Couple / Transmission / Poids ; les valeurs `null` sont remplacées par `—`
8. **`OwnerCard` :** le composant `app/components/profile/OwnerCard.tsx` reçoit les données du profil propriétaire et affiche avatar + pseudo + ville ; un tap navigue vers `app/user/${ownerId}`
9. **Follow véhicule :** le bouton sticky en bas utilise `useFollow({ targetId: vehicleId, targetType: 'vehicle' })` ; affiche "Suivre ce véhicule" (variant `primary`) ou "✓ Suivi" (variant `secondary`) ; désactivé pendant `isPending`
10. **Boutons haut :** back (ChevronLeft) + Share2 + MoreHorizontal dans la barre supérieure ; Share2 et MoreHorizontal sont visuels seulement (sans logique serveur à ce stade)
11. **Loading / Error :** ActivityIndicator pendant le chargement ; message d'erreur si le véhicule est introuvable
12. **TypeScript :** `npx tsc --noEmit` depuis `app/` passe sans erreur

## Tasks / Subtasks

- [x] Créer `app/lib/hooks/use-vehicle.ts` (AC: 1)
  - [x] Définir type `VehicleDetail` = `VehicleRow & { vehicle_photos: Photo[]; profiles: OwnerProfile | null }`
  - [x] Implémenter `useVehicle(vehicleId: string)` avec `useQuery<VehicleDetail, PostgrestError>` et key `['vehicle', vehicleId]`
  - [x] Query : `supabase.from('vehicles').select('*, vehicle_photos(id, storage_path, position, is_cover), profiles!vehicles_owner_id_fkey(id, username, display_name, avatar_url, city)').eq('id', vehicleId).order('position', { ascending: true, referencedTable: 'vehicle_photos' }).single()`
  - [x] `enabled: !!vehicleId`

- [x] Créer `app/components/vehicle/VehicleSpecGrid.tsx` (AC: 7)
  - [x] Props : `vehicle: Pick<VehicleRow, 'year' | 'displacement' | 'power' | 'torque' | 'transmission' | 'weight'>`
  - [x] Afficher grille 2 colonnes, 6 items : Année / Cylindrée / Puissance / Couple / Transmission / Poids
  - [x] Formater les valeurs : `year` → string, `power` → `${power} ch`, `torque` → `${torque} Nm`, `weight` → `${weight} kg`, null → `—`
  - [x] Style identique au mockup existant : `backgroundColor: '#111118'`, `borderColor: '#1E1E2E'`, label Inter_600SemiBold 10px `#9594B5`, valeur SpaceGrotesk_700Bold 16px `#F1F0FF`

- [x] Créer `app/components/profile/OwnerCard.tsx` (AC: 8)
  - [x] Props : `{ ownerId: string; username: string | null; displayName: string | null; avatarUrl: string | null; city: string | null }`
  - [x] Afficher un `Pressable` qui navigue vers `/user/${ownerId}`
  - [x] Intérieur : KaraAvatar (44px, initial = premier char display_name ou username) + View infos (label "Propriétaire", @username, city si non-null) + ChevronRight
  - [x] Style identique au mockup : `backgroundColor: '#111118'`, `borderColor: '#1E1E2E'`, `borderRadius: 16`, `padding: 14`
  - [x] Si `avatarUrl` non-null : passer `uri={buildImageUrl(avatarUrl, { width: 100, quality: 80 })}` à KaraAvatar

- [x] Modifier `app/app/vehicle/[id].tsx` (AC: 2, 3, 4, 5, 6, 8, 9, 10, 11)
  - [x] Récupérer `id` via `useLocalSearchParams<{ id: string }>()` (déjà présent)
  - [x] Remplacer le mock `VEHICLE` par `useVehicle(id)` — supprimer toute la constante `VEHICLE`
  - [x] Loading state : `ActivityIndicator` centré (fond `#0A0A0F`)
  - [x] Error state : message d'erreur + bouton Retour
  - [x] Hero : remplacer `KaraPhoto` par `VehiclePhotoCarousel` avec `width = screenWidth`, `height = Math.round(screenHeight * 0.5)` ; ajouter state `photoIdx` + dots overlay (même pattern que VehicleCard)
  - [x] Badges : calculer `typeLabel` (mapping type → libellé) et `countryEmoji` (mapping country_code → emoji) comme dans VehicleCard
  - [x] Ligne specs : `[year, displacement, power != null ? \`${power}CH\` : null, transmission].filter(Boolean).join(' · ')`
  - [x] Remplacer la grille specs inline par `<VehicleSpecGrid vehicle={data} />`
  - [x] Remplacer le bloc owner inline par `<OwnerCard ownerId={ownerId} username={...} displayName={...} avatarUrl={...} city={...} />`
  - [x] Bouton sticky "Suivre ce véhicule" : brancher sur `useFollow({ targetId: id, targetType: 'vehicle' })`
  - [x] Ajouter `useAuthStore` pour `currentUserId` si nécessaire (masquer follow si propriétaire propre)
  - [x] Supprimer la section Commentaires (hors scope — Story 5.2)
  - [x] Ajouter `useWindowDimensions` pour `screenWidth` et `screenHeight`

- [x] Vérification TypeScript (AC: 12)
  - [x] `cd app && npx tsc --noEmit` — zéro erreur

## Dev Notes

### Fichiers à créer / modifier

```
app/lib/hooks/use-vehicle.ts                ← CRÉER (hook détail véhicule)
app/components/vehicle/VehicleSpecGrid.tsx  ← CRÉER (grille specs détaillées)
app/components/profile/OwnerCard.tsx        ← CRÉER (carte propriétaire)
app/app/vehicle/[id].tsx                    ← MODIFIER (relier données réelles + follow)
```

### Ne PAS modifier

- `app/components/vehicle/VehiclePhotoCarousel.tsx` — déjà fonctionnel, hors scope
- `app/lib/hooks/use-vehicles.ts` — feed paginé, hors scope
- `app/lib/hooks/use-follow.ts` — créé en 4.3, réutiliser tel quel
- `app/(tabs)/profile.tsx`, `app/app/user/[id].tsx` — profils, hors scope

### Schéma `vehicles` — colonnes utilisées

```ts
{
  id: string
  brand: string
  model: string
  year: number | null
  displacement: string | null   // ex: "2.0L TURBO" (stocké comme string)
  power: number | null          // en chevaux
  torque: number | null         // en Nm
  transmission: string | null   // ex: "6 vit. man."
  weight: number | null         // en kg
  type: string                  // 'car' | 'moto' | 'van' | 'truck' | 'bike' | 'classic'
  country_code: string | null   // ISO 3166-1 alpha-2 ex: 'JP', 'FR'
  tags: string[] | null
  description: string | null
  owner_id: string              // FK → profiles.id
  is_published: boolean | null
  city: string | null
}
```

### Type `VehicleDetail` à définir dans `use-vehicle.ts`

```ts
import { Database } from '@/types/database';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type Photo = Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>;
type OwnerProfile = Pick<ProfileRow, 'id' | 'username' | 'display_name' | 'avatar_url' | 'city'>;

export type VehicleDetail = VehicleRow & {
  vehicle_photos: Photo[];
  profiles: OwnerProfile | null;
};
```

### Implémentation recommandée de `use-vehicle.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { supabase } from '@/lib/supabase';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type Photo = Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>;
type OwnerProfile = Pick<ProfileRow, 'id' | 'username' | 'display_name' | 'avatar_url' | 'city'>;

export type VehicleDetail = VehicleRow & {
  vehicle_photos: Photo[];
  profiles: OwnerProfile | null;
};

export function useVehicle(vehicleId: string) {
  return useQuery<VehicleDetail, PostgrestError>({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(
          '*, vehicle_photos(id, storage_path, position, is_cover), profiles!vehicles_owner_id_fkey(id, username, display_name, avatar_url, city)'
        )
        .eq('id', vehicleId)
        .order('position', { ascending: true, referencedTable: 'vehicle_photos' })
        .single();
      if (error) throw error;
      return data as VehicleDetail;
    },
    enabled: !!vehicleId,
  });
}
```

### Mappings type → libellé et country_code → emoji

Reprendre **exactement** les mêmes mappings que dans `VehicleCard.tsx` pour la cohérence visuelle :

```ts
const COUNTRY_EMOJI: Record<string, string> = {
  JP: '🇯🇵', FR: '🇫🇷', DE: '🇩🇪', IT: '🇮🇹', US: '🇺🇸',
  GB: '🇬🇧', ES: '🇪🇸', KR: '🇰🇷', SE: '🇸🇪', BE: '🇧🇪',
  NL: '🇳🇱', CH: '🇨🇭', AT: '🇦🇹', AU: '🇦🇺', CA: '🇨🇦',
};

const TYPE_LABEL: Record<string, string> = {
  car: 'Voiture', moto: 'Moto', van: 'Van',
  truck: 'Camion', bike: 'Vélo', classic: 'Classic',
};

const TypeIcon = ['moto', 'bike'].includes(data.type) ? Bike : Car;
```

### Hero carousel — pattern VehicleCard réutilisé

Dans `vehicle/[id].tsx`, le carousel remplace le `KaraPhoto` unique :

```tsx
import { useWindowDimensions } from 'react-native';
import { VehiclePhotoCarousel } from '@/components/vehicle/VehiclePhotoCarousel';

const [photoIdx, setPhotoIdx] = useState(0);
const { width: screenWidth, height: screenHeight } = useWindowDimensions();
const heroHeight = Math.round(screenHeight * 0.5);

// Dans le JSX :
<View style={{ position: 'relative', height: heroHeight }}>
  <VehiclePhotoCarousel
    photos={data.vehicle_photos}
    width={screenWidth}
    height={heroHeight}
    onPhotoChange={setPhotoIdx}
  />
  {/* Gradient, dots, top bar, badges — par-dessus le carousel */}
  ...
  {/* Dots overlay */}
  <View style={{ position: 'absolute', bottom: 80, ... }}>
    {data.vehicle_photos.map((_, idx) => (
      <View key={idx} style={{ width: idx === photoIdx ? 18 : 4, height: 3, ... }} />
    ))}
  </View>
</View>
```

### Bouton "Suivre ce véhicule" — follow vehicule

Le hook `useFollow` créé en Story 4.3 supporte déjà `targetType: 'vehicle'`. Brancher directement :

```tsx
const { isFollowing, toggle, isPending } = useFollow({ targetId: id, targetType: 'vehicle' });

// Bouton sticky :
<KaraButton
  variant={isFollowing ? 'secondary' : 'primary'}
  size="md"
  full
  onPress={toggle}
  disabled={isPending}
>
  <Plus size={16} color="#fff" strokeWidth={2.25} />
  <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
    {isFollowing ? '✓ Suivi' : 'Suivre ce véhicule'}
  </Text>
</KaraButton>
```

### `VehicleSpecGrid` — structure attendue

```tsx
interface VehicleSpecGridProps {
  vehicle: Pick<VehicleRow, 'year' | 'displacement' | 'power' | 'torque' | 'transmission' | 'weight'>;
}

export function VehicleSpecGrid({ vehicle }: VehicleSpecGridProps) {
  const items = [
    { l: 'Année', v: vehicle.year != null ? String(vehicle.year) : '—' },
    { l: 'Cylindrée', v: vehicle.displacement ?? '—' },
    { l: 'Puissance', v: vehicle.power != null ? `${vehicle.power} ch` : '—' },
    { l: 'Couple', v: vehicle.torque != null ? `${vehicle.torque} Nm` : '—' },
    { l: 'Transmission', v: vehicle.transmission ?? '—' },
    { l: 'Poids', v: vehicle.weight != null ? `${vehicle.weight} kg` : '—' },
  ];
  // Grille 2 colonnes flexWrap — style identique au mockup
}
```

### `OwnerCard` — structure attendue

```tsx
interface OwnerCardProps {
  ownerId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  city: string | null;
}

export function OwnerCard({ ownerId, username, displayName, avatarUrl, city }: OwnerCardProps) {
  const router = useRouter();
  const avatarUrl_built = avatarUrl ? buildImageUrl(avatarUrl, { width: 100, quality: 80 }) : undefined;
  const initial = (displayName ?? username ?? '?')[0].toUpperCase();

  return (
    <Pressable
      onPress={() => router.push(`/user/${ownerId}`)}
      style={{
        padding: 14, borderRadius: 16, backgroundColor: '#111118',
        borderWidth: 1, borderColor: '#1E1E2E',
        flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22,
      }}
    >
      <KaraAvatar uri={avatarUrl_built} size={44} initial={initial} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>
          Propriétaire
        </Text>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }}>
          @{username ?? '—'}
        </Text>
        {city && (
          <Text style={{ fontSize: 11, color: '#9594B5', fontFamily: 'Inter_400Regular' }}>{city}</Text>
        )}
      </View>
      <ChevronRight size={18} color="#5C5B78" />
    </Pressable>
  );
}
```

### Section Commentaires — hors scope

Le mockup `vehicle/[id].tsx` contient une section Commentaires avec 2 commentaires mockés. **Supprimer** cette section dans la version finale — les commentaires sont prévus pour la Story 5.2. Supprimer aussi les imports `Plus`, `ChevronRight` si non utilisés ailleurs (sauf si OwnerCard les réimporte).

### Piège critique n°1 — `referencedTable` dans `.order()`

Pour ordonner les photos par `position` dans la query supabase, utiliser `referencedTable` (pas `foreignTable`) :
```ts
.order('position', { ascending: true, referencedTable: 'vehicle_photos' })
```
Si le SDK cible ne supporte pas cette option, trier les photos côté client après la query :
```ts
const sortedPhotos = [...data.vehicle_photos].sort((a, b) => a.position - b.position);
```

### Piège critique n°2 — `id` peut être `string | string[]`

`useLocalSearchParams` retourne `string | string[]`. Déjà présent dans le fichier actuel mais non utilisé (mock). Le cast `<{ id: string }>` garantit `string`.

### Piège critique n°3 — frontière architecturale Data

Les écrans (`app/`) n'importent **jamais** `supabase` directement. Passer par `app/lib/hooks/use-vehicle.ts`. Les composants (`components/`) n'importent **jamais** les hooks Supabase — recevoir les données en props.

### Piège critique n°4 — `profiles` peut être null (RLS)

Si l'utilisateur n'a pas accès au profil du propriétaire via RLS, `data.profiles` sera `null`. L'OwnerCard doit gérer ce cas :
- `ownerId = data.owner_id` (toujours présent)
- `username = data.profiles?.username ?? null`
- Afficher "Voir le profil" si username null

### Learnings des stories précédentes

- `KaraButton` accepte `onPress` directement — pas besoin de Pressable wrappant ✅
- `useAuthStore((s) => s.user?.id)` pour le sélecteur granulaire ✅
- `useAuthStore.getState().user?.id` pour accès hors hook (dans mutationFn) ✅
- `buildImageUrl(storage_path, { width, quality })` pour toutes les URLs de photos ✅
- `useFollow({ targetId, targetType: 'vehicle' })` — le hook supporte déjà `'vehicle'` ✅
- `npx tsc --noEmit` depuis `app/` (pas depuis la racine du projet) ✅
- `VehiclePhotoCarousel` prend `photos`, `width`, `height`, `onPhotoChange` — défini au niveau module ✅

### Scope de cette story vs adjacentes

| Feature | Story 4.3 | Story 4.4 | Story 5.1-5.3 |
|---------|-----------|-----------|---------------|
| Profil autre utilisateur | ✅ | — | — |
| `use-follow.ts` créé | ✅ | réutilisé | — |
| Follow profil | ✅ | — | — |
| Page détail véhicule | — | ✅ | — |
| Follow véhicule | — | ✅ | — |
| Commentaires | — | hors scope | ✅ Story 5.2 |
| Likes véhicule | — | — | ✅ Story 5.1 |

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.4]
- [Source: app/app/vehicle/[id].tsx] — mockup complet à brancher
- [Source: app/components/vehicle/VehiclePhotoCarousel.tsx] — composant carousel à réutiliser
- [Source: app/lib/hooks/use-follow.ts] — hook follow à réutiliser tel quel
- [Source: app/lib/hooks/use-vehicles.ts] — pattern query à adapter pour use-vehicle.ts
- [Source: app/components/vehicle/VehicleCard.tsx] — mappings COUNTRY_EMOJI + TYPE_LABEL à copier

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_(aucun blocage rencontré)_

### Completion Notes List

- `use-vehicle.ts` : hook créé avec type `VehicleDetail`, query key `['vehicle', id]`, join profil propriétaire via `profiles!vehicles_owner_id_fkey`, tri photos par position via `referencedTable`.
- `VehicleSpecGrid.tsx` : composant créé, grille 2 colonnes avec 6 items, valeurs `null` remplacées par `—`, style identique au mockup.
- `OwnerCard.tsx` : composant créé dans `components/profile/`, navigation vers `/user/${ownerId}`, avatar via `buildImageUrl`, KaraAvatar, ChevronRight.
- `vehicle/[id].tsx` : mockup entièrement remplacé par données réelles — `useVehicle`, `VehiclePhotoCarousel` plein écran (`screenWidth × screenHeight * 0.5`), `VehicleSpecGrid`, `OwnerCard`, `useFollow({ targetType: 'vehicle' })`. Section commentaires supprimée (hors scope). Bouton sticky masqué si propriétaire propre.
- `npx tsc --noEmit` : zéro erreur.

### File List

- app/lib/hooks/use-vehicle.ts (créé)
- app/components/vehicle/VehicleSpecGrid.tsx (créé)
- app/components/profile/OwnerCard.tsx (créé)
- app/app/vehicle/[id].tsx (modifié)

### Change Log

- 2026-05-04 : Story créée (prête pour développement)
- 2026-05-04 : Implémentation complète — use-vehicle, VehicleSpecGrid, OwnerCard, vehicle/[id].tsx données réelles + follow. TypeScript OK. Status → review.
