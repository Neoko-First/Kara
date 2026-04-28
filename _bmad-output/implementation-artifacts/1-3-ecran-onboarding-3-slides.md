# Story 1.3: Écran Onboarding (3 slides)

Status: review

## Story

As a nouvel utilisateur,
I want voir 3 slides d'introduction à Kara avant de m'inscrire,
so that je comprends la valeur du produit avant de créer mon compte.

## Acceptance Criteria

1. `app/app/(auth)/_layout.tsx` existe et configure un Stack sans header pour le groupe auth
2. `app/app/(auth)/onboarding.tsx` s'affiche avec les 3 slides en scroll horizontal paginé (une slide par page complète)
3. Slide 1 — titre "Trouve ta communauté" — fond `violet-dusk` (KaraPhoto)
4. Slide 2 — titre "Échange avec les passionnés" — fond `track-magenta` (KaraPhoto)
5. Slide 3 — titre "Events & Marketplace" (teaser) — fond `amber-stance` (KaraPhoto)
6. Des dots indicateurs en bas reflètent la slide active (dot violet plein vs dot gris transparent)
7. Sur les slides 1 et 2 : un bouton flèche → en bas permet de passer à la slide suivante, et un bouton "Passer" (texte, haut droite) navigue directement vers `/(auth)/login`
8. Sur la slide 3 : le bouton flèche est remplacé par un bouton "Commencer" (`KaraButton` variant `primary`) qui navigue vers `/(auth)/login`
9. `KaraWordmark` est affiché en haut à gauche de chaque slide
10. Les composants `KaraButton`, `KaraWordmark`, `KaraPhoto` issus de `components/shared/` sont utilisés — aucun composant réinventé
11. `npm run build` (ou `npx tsc --noEmit` depuis `app/`) passe sans erreur TypeScript

## Tasks / Subtasks

- [x] Créer `app/app/(auth)/_layout.tsx` (AC: 1)
  - [x] Stack avec `screenOptions={{ headerShown: false, animation: 'none' }}`
  - [x] Pas de logique d'auth guard ici (celui-ci est dans `app/_layout.tsx` — Story 1.4)

- [x] Créer `app/app/(auth)/onboarding.tsx` (AC: 2–10)
  - [x] Données des slides : tableau de 3 objets `{ title, subtitle, tone }` (AC: 3, 4, 5)
  - [x] `ScrollView` horizontal `pagingEnabled` avec ref pour `scrollTo()` (AC: 2)
  - [x] Tracking index actif via `onMomentumScrollEnd` (AC: 6, 7, 8)
  - [x] Dots indicateurs (AC: 6)
  - [x] Bouton "Passer" conditionnel (slide 1 et 2 uniquement) (AC: 7)
  - [x] Bouton flèche → (slide 1 et 2) / bouton "Commencer" (slide 3) (AC: 7, 8)
  - [x] `KaraWordmark` en overlay haut gauche (AC: 9)
  - [x] `useSafeAreaInsets` pour paddings iOS/Android (AC: 2)

- [x] Créer placeholder `app/app/(auth)/login.tsx` (AC: 7, 8)
  - [x] Écran vide minimal — juste `<View className="flex-1 bg-kara-bg" />` + un `<Text>` "Login (Story 1.4)" pour que la route existe
  - [x] Sera remplacé intégralement en Story 1.4

- [x] Vérification TypeScript (AC: 11)
  - [x] `cd app && npx tsc --noEmit` passe sans erreur

## Dev Notes

### Fichiers à créer (NEW)

```
app/app/(auth)/_layout.tsx      ← layout Stack auth group
app/app/(auth)/onboarding.tsx   ← écran onboarding 3 slides
app/app/(auth)/login.tsx        ← placeholder minimal (Story 1.4 le remplace)
```

### Fichiers existants à NE PAS MODIFIER

- `app/app/_layout.tsx` — déjà configuré avec `<Stack.Screen name="(auth)" />` et `global.css` importé ✅
- `app/app.json` — `scheme: "kara"` déjà présent ✅
- `components/shared/*` — NE PAS recréer ces composants

### Mapping tones KaraPhoto → slides

| Slide | Titre | Tone |
|---|---|---|
| 1 | "Trouve ta communauté" | `violet-dusk` |
| 2 | "Échange avec les passionnés" | `track-magenta` |
| 3 | "Events & Marketplace" | `amber-stance` |

La prop `tone` de `KaraPhoto` accepte exactement ces valeurs (type `PhotoTone` importé de `components/shared/KaraPhoto`).

### `(auth)/_layout.tsx` — implémentation exacte

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'none' }} />;
}
```

### `onboarding.tsx` — structure complète recommandée

```tsx
import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';
import { KaraButton } from '@/components/shared/KaraButton';

const SLIDES: { title: string; subtitle: string; tone: PhotoTone }[] = [
  {
    title: 'Trouve ta communauté',
    subtitle: 'Des milliers de passionnés partagent leurs builds chaque jour.',
    tone: 'violet-dusk',
  },
  {
    title: 'Échange avec les passionnés',
    subtitle: 'Commente, like, et envoie des messages directement.',
    tone: 'track-magenta',
  },
  {
    title: 'Events & Marketplace',
    subtitle: 'Retrouve des événements près de toi et achète les pièces de tes rêves.',
    tone: 'amber-stance',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = () => {
    const nextIndex = activeIndex + 1;
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setActiveIndex(nextIndex);
  };

  const goToLogin = () => router.replace('/(auth)/login');

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      >
        {SLIDES.map((slide, i) => (
          <KaraPhoto
            key={i}
            tone={slide.tone}
            style={{ width, flex: 1 }}
          >
            {/* Wordmark haut gauche */}
            <View
              style={{
                position: 'absolute',
                top: insets.top + 16,
                left: 24,
              }}
            >
              <KaraWordmark size={24} color="#fff" />
            </View>

            {/* Bouton "Passer" haut droite — slide 1 et 2 uniquement */}
            {i < 2 && activeIndex === i && (
              <Pressable
                onPress={goToLogin}
                style={{
                  position: 'absolute',
                  top: insets.top + 20,
                  right: 24,
                }}
              >
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'Inter_500Medium',
                    fontSize: 15,
                  }}
                >
                  Passer
                </Text>
              </Pressable>
            )}

            {/* Contenu central */}
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: 32,
                paddingBottom: insets.bottom + 140,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'SpaceGrotesk_700Bold',
                  fontSize: 36,
                  lineHeight: 42,
                  marginBottom: 16,
                }}
              >
                {slide.title}
              </Text>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'Inter_400Regular',
                  fontSize: 17,
                  lineHeight: 26,
                }}
              >
                {slide.subtitle}
              </Text>
            </View>
          </KaraPhoto>
        ))}
      </ScrollView>

      {/* Footer fixe — dots + bouton */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 32,
          left: 0,
          right: 0,
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Dots */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i === activeIndex ? '#7C3AED' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </View>

        {/* Bouton action */}
        {activeIndex < 2 ? (
          <Pressable
            onPress={goToNext}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#7C3AED',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <ChevronRight size={24} color="#fff" strokeWidth={2.5} />
          </Pressable>
        ) : (
          <KaraButton
            variant="primary"
            size="lg"
            onPress={goToLogin}
            style={{ paddingHorizontal: 48 }}
          >
            Commencer
          </KaraButton>
        )}
      </View>
    </View>
  );
}
```

### Piège n°1 : "Passer" conditionnel sur le bon slide

Le bouton "Passer" est rendu **dans** chaque slide (`KaraPhoto`) mais il doit apparaître uniquement sur les slides 1 et 2 (`i < 2`). Ne pas le mettre en overlay global (sinon il s'affiche à travers le scroll). Filtrer avec `activeIndex === i` pour éviter le double rendu pendant le scroll.

Alternative plus propre : mettre "Passer" en position absolue **en dehors** du ScrollView, et le cacher conditionnellement sur slide 3 :

```tsx
{/* En dehors du ScrollView */}
{activeIndex < 2 && (
  <Pressable
    style={{ position: 'absolute', top: insets.top + 20, right: 24, zIndex: 10 }}
    onPress={goToLogin}
  >
    <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_500Medium', fontSize: 15 }}>
      Passer
    </Text>
  </Pressable>
)}
```

Cette approche est recommandée car elle évite la duplication et garantit l'affichage correct pendant les transitions de scroll.

### Piège n°2 : `scrollTo` et index désynchronisé

Lors du tap sur la flèche `→`, mettre à jour `activeIndex` **avant** ou **immédiatement après** le `scrollTo`. Si on attend `onMomentumScrollEnd`, le dot ne sera pas mis à jour pendant l'animation. Solution : mettre à jour l'index directement dans `goToNext()`.

```tsx
const goToNext = () => {
  const next = activeIndex + 1;
  scrollRef.current?.scrollTo({ x: next * width, animated: true });
  setActiveIndex(next); // mise à jour immédiate — pas besoin d'attendre le scroll event
};
```

### Piège n°3 : largeur dynamique

Utiliser `useWindowDimensions().width` plutôt que `Dimensions.get('window').width` pour être réactif aux changements (même si l'app est portrait uniquement — bonne pratique). Chaque slide doit avoir exactement `width: width` pour que le paging fonctionne.

### Placeholder `login.tsx` (minimal)

Ce fichier sera **intégralement remplacé** par Story 1.4. Le créer vide pour que la navigation `router.replace('/(auth)/login')` ne crash pas :

```tsx
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff' }}>Login — Story 1.4</Text>
    </View>
  );
}
```

### Composants shared — API de référence

```typescript
// KaraPhoto
<KaraPhoto tone="violet-dusk" style={{ width, flex: 1 }}>
  {/* children en overlay */}
</KaraPhoto>

// KaraWordmark
<KaraWordmark size={24} color="#fff" />

// KaraButton — variante 'primary' pour "Commencer"
<KaraButton variant="primary" size="lg" onPress={fn}>
  Commencer
</KaraButton>
// "Passer" = simple Pressable + Text (pas un KaraButton — plus discret visuellement)
```

### `app/app/_layout.tsx` — état actuel (NE PAS MODIFIER)

```tsx
// global.css importé ✅
// Stack.Screen name="(auth)" ✅ — déjà déclaré
// Stack.Screen name="(tabs)" ✅
// QueryClientProvider + Toast ✅
// Fonts chargées ✅
```

Aucune modification de ce fichier pour Story 1.3. Le routing guard (session → redirect) sera ajouté en Story 1.4.

### Conventions à respecter

- Couleurs : tokens `kara-*` ou valeurs hex du design system — aucune couleur arbitraire
- Fonts : `SpaceGrotesk_700Bold` pour titres, `Inter_400Regular` pour corps, `Inter_500Medium` pour labels
- Path alias `@/` configuré dans tsconfig — utiliser pour les imports (`@/components/shared/...`)
- `useSafeAreaInsets` obligatoire pour les paddings — jamais de valeur fixe pour les zones system

### Learnings des stories précédentes

- `.env*` ne peut pas être créé par Write tool — non applicable ici
- `global.css` doit être importé dans le root layout — **déjà fait en 1.1** ✅
- Les `className` NativeWind fonctionnent sur la `View` racine uniquement si le composant est dans l'arbre rendu après le root layout (c'est le cas pour tout `(auth)/`)
- `lucide-react-native` est déjà installé — `ChevronRight` ou `ArrowRight` sont disponibles

### Project Structure Notes

- Tous les fichiers de cet écran sont dans `app/app/(auth)/` — **pas** dans `app/components/`
- Le dossier `(auth)` n'existe pas encore — le créer implicitement en créant les fichiers
- Aucun dossier `app/app/user/` ou `app/app/vehicle/` n'est nécessaire pour cette story
- Travailler depuis `app/` pour les commandes npm/tsc

### References

- Story spec : `_bmad-output/planning-artifacts/epics.md` — section "Story 1.3: Écran Onboarding"
- Design visual : `docs/prd.md` — section "5.1 Onboarding (3 slides)"
- UX-DR8 : tones slides — `_bmad-output/planning-artifacts/epics.md` — section "UX Design Requirements"
- Architecture `(auth)` group : `_bmad-output/planning-artifacts/architecture.md` — section "Code Organization"
- KaraPhoto tones : `app/components/shared/KaraPhoto.tsx`
- KaraButton variants : `app/components/shared/KaraButton.tsx`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- `(auth)/_layout.tsx` : corrigé pour ajouter `animation: 'none'` dans screenOptions (était absent)
- `onboarding.tsx` : réécrit pour respecter les ACs — ScrollView horizontal pagingEnabled (vs useState switch), tone slide 1 corrigé `violet-dusk` (était `cyan-tokyo`), KaraWordmark haut gauche (était centré), bouton "Passer" conditionnel `activeIndex < 2` en dehors du ScrollView, `KaraButton variant="primary"` pour "Commencer" (était Pressable custom)
- `login.tsx` : déjà présent et fonctionnel — conservé tel quel (implémentation avancée compatible Story 1.4)
- `npx tsc --noEmit` : aucune erreur TypeScript

### File List

- `app/app/(auth)/_layout.tsx` (modifié — ajout `animation: 'none'`)
- `app/app/(auth)/onboarding.tsx` (réécrit — ScrollView pagingEnabled, tones corrects, composants shared)
- `app/app/(auth)/login.tsx` (existant — conservé intact)
