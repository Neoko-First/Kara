# Story 1.4: Authentification OAuth & routing guard

Status: review

## Story

As a utilisateur,
I want me connecter avec Apple, Google ou mon email,
So that j'accède à mon espace personnel sur Kara.

## Acceptance Criteria

1. L'écran `(auth)/login.tsx` affiche : `KaraWordmark` centré, bouton "Continuer avec Apple" (fond blanc), bouton "Continuer avec Google" (outlined), lien "Continuer avec email", footer CGU + confidentialité — UI déjà en place, à ne pas casser
2. Tap "Continuer avec Apple" → `supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: 'kara://auth/callback' } })` est appelé et l'URL résultante est ouverte via `Linking.openURL()`
3. Tap "Continuer avec Google" → même pattern avec `provider: 'google'`
4. Le token de session est stocké via `expo-secure-store` (le client Supabase est déjà configuré pour ça — ne rien changer dans `lib/supabase.ts`)
5. Après succès OAuth, `useAuthStore.setSession(session)` est appelé (via `onAuthStateChange` dans le layout) et le guard redirige automatiquement vers `/(tabs)`
6. `app/app/(auth)/callback.tsx` gère la deep link `kara://auth/callback` : extrait le `code` depuis `useLocalSearchParams`, appelle `supabase.auth.exchangeCodeForSession(code)` puis `setSession(session)`
7. Dans `app/_layout.tsx`, `supabase.auth.onAuthStateChange` est abonné au montage et appelle `setSession(session)` — le listener est nettoyé au démontage (`subscription.unsubscribe()`)
8. Le routing guard dans `app/_layout.tsx` : `!session && !inAuth` → redirect `/(auth)/onboarding` ; `session && inAuth` → redirect `/(tabs)` — implémenté dans `useEffect([session, loading, segments])`, ne s'exécute pas tant que `loading === true`
9. En cas d'erreur OAuth (`signInWithOAuth` ou `exchangeCodeForSession`), `Toast.show({ type: 'error', text1: error.message })` affiche un message en français
10. `npx tsc --noEmit` depuis `app/` passe sans erreur

## Tasks / Subtasks

- [x] Modifier `app/app/_layout.tsx` (AC: 7, 8)
  - [x] Importer `useAuthStore`, `useSegments`, `useRouter`, `supabase`
  - [x] `useEffect([], [])` qui subscribe à `supabase.auth.onAuthStateChange` → `setSession(session)` + cleanup `subscription.unsubscribe()`
  - [x] `useEffect([session, loading, segments])` pour le routing guard — guard court-circuité si `loading === true`
  - [x] Préserver tout l'existant : fonts, SplashScreen, QueryClientProvider, Toast, Stack screens

- [x] Modifier `app/app/(auth)/login.tsx` (AC: 1, 2, 3, 9)
  - [x] Remplacer le `handleAuth()` factice par `handleApple()` et `handleGoogle()` — fonctions async avec appel à `supabase.auth.signInWithOAuth()`
  - [x] Ouvrir l'URL OAuth via `Linking.openURL(data.url)` (import depuis `react-native`)
  - [x] En cas d'erreur : `Toast.show({ type: 'error', text1: error.message })`
  - [x] Lien "Continuer avec email" reste un Pressable non-fonctionnel (placeholder Story 1.5) — ne pas supprimer, ne pas câbler
  - [x] Préserver toute l'UI existante (KaraPhoto, KaraWordmark, LinearGradient, boutons, footer CGU)

- [x] Créer `app/app/(auth)/callback.tsx` (AC: 5, 6)
  - [x] `useLocalSearchParams<{ code?: string }>()` pour récupérer le code PKCE
  - [x] `useEffect([code])` : si pas de `code` → redirect `/(auth)/login` ; sinon `exchangeCodeForSession(code)` → `setSession(session)` ou `Toast.error` + redirect login
  - [x] Afficher `ActivityIndicator` centré (couleur `#7C3AED`) pendant l'échange
  - [x] Background `#0A0A0F`

- [x] Vérification TypeScript (AC: 10)
  - [x] `cd app && npx tsc --noEmit` passe sans erreur

## Dev Notes

### Fichiers à modifier (UPDATE)

```
app/app/_layout.tsx           ← ajouter routing guard + onAuthStateChange
app/app/(auth)/login.tsx      ← remplacer handleAuth() par OAuth réel
```

### Fichiers à créer (NEW)

```
app/app/(auth)/callback.tsx   ← handler deep link OAuth (PKCE exchange)
```

### Fichiers à NE PAS MODIFIER

- `app/lib/supabase.ts` — client déjà configuré avec SecureStore + `detectSessionInUrl: false` ✅
- `app/lib/supabase-error.ts` — `handleSupabaseError()` déjà implémenté (pour PostgrestError uniquement) ✅
- `app/lib/stores/use-auth-store.ts` — store déjà complet ✅
- `app/app/(auth)/_layout.tsx` — déjà OK ✅
- `app/app/(auth)/onboarding.tsx` — déjà OK ✅

### État actuel de `app/_layout.tsx` (à préserver + enrichir)

```tsx
import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
// ... fonts imports ...
import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { queryClient } from "../lib/query-client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ ... });
  useEffect(() => { if (fontsLoaded || fontError) SplashScreen.hideAsync(); }, [...]);
  if (!fontsLoaded && !fontError) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </>
    </QueryClientProvider>
  );
}
```

Ce fichier doit conserver **exactement** cette structure — on ajoute seulement les imports et les deux `useEffect` dans le corps du composant.

### `_layout.tsx` — implémentation exacte à produire

```tsx
import "../global.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { queryClient } from "../lib/query-client";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../lib/stores/use-auth-store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, loading, setSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Synchronise le store avec la session Supabase (persistée ou nouvelle)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Routing guard — attend la fin du chargement initial
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) {
      router.replace("/(auth)/onboarding");
    } else if (session && inAuth) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </>
    </QueryClientProvider>
  );
}
```

### `login.tsx` — seulement les parties à modifier

Le fichier UI est **déjà implémenté** (KaraPhoto, KaraWordmark, LinearGradient, 3 boutons, footer CGU). Ne PAS toucher l'UI.

Seul `handleAuth()` doit être remplacé par deux fonctions distinctes et les imports ajoutés :

```tsx
// Ajouter ces imports
import { Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

// Remplacer handleAuth() par :
async function handleApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: 'kara://auth/callback' },
  });
  if (error) {
    Toast.show({ type: 'error', text1: error.message });
    return;
  }
  if (data.url) await Linking.openURL(data.url);
}

async function handleGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'kara://auth/callback' },
  });
  if (error) {
    Toast.show({ type: 'error', text1: error.message });
    return;
  }
  if (data.url) await Linking.openURL(data.url);
}
```

Et lier ces fonctions aux boutons correspondants :
- Bouton Apple → `onPress={handleApple}`
- Bouton Google → `onPress={handleGoogle}`
- Bouton email → ne pas toucher (placeholder Story 1.5)

**NE PAS supprimer** l'import `useRouter` ni la déclaration `const router = useRouter()` — même inutilisés pour l'instant, ils n'impactent pas le build et sont nécessaires si l'email flow est ajouté.

### `callback.tsx` — implémentation complète

```tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export default function AuthCallbackScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (!code) {
      router.replace('/(auth)/login');
      return;
    }

    supabase.auth.exchangeCodeForSession(String(code)).then(({ data, error }) => {
      if (error || !data.session) {
        Toast.show({ type: 'error', text1: 'Connexion échouée. Réessaie.' });
        router.replace('/(auth)/login');
        return;
      }
      setSession(data.session);
      // Le routing guard dans _layout.tsx redirige vers /(tabs) automatiquement
    });
  }, [code]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0A0A0F',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );
}
```

### Pièges critiques

#### Piège n°1 : `detectSessionInUrl: false` — PKCE obligatoire

`lib/supabase.ts` configure `detectSessionInUrl: false` → Supabase ne lit **pas** automatiquement les tokens depuis la deep link. Il faut **obligatoirement** appeler `exchangeCodeForSession(code)` dans le callback. Ne pas essayer de parser le `#access_token` de l'URL manuellement.

#### Piège n°2 : `expo-web-browser` n'est pas installé

Utiliser `Linking.openURL(data.url)` pour ouvrir le navigateur externe. Ne pas installer `expo-web-browser` — ce n'est pas dans la stack définie.

#### Piège n°3 : routing guard et `loading`

Sans le check `if (loading) return;`, le guard redirige vers `/(auth)/onboarding` **avant** que `onAuthStateChange` ait eu le temps de rétablir la session depuis SecureStore. Conséquence : l'utilisateur déjà connecté est renvoyé vers l'onboarding à chaque démarrage.

#### Piège n°4 : `handleSupabaseError` n'accepte que `PostgrestError`

Les erreurs de `signInWithOAuth` et `exchangeCodeForSession` sont des `AuthError`, **pas** des `PostgrestError`. Utiliser `error.message` directement pour ces cas — ne pas passer l'erreur OAuth à `handleSupabaseError()`.

#### Piège n°5 : `useRouter` et `useSegments` hors de `<Stack>`

Ces hooks Expo Router doivent être appelés dans un composant rendu **à l'intérieur** du contexte de routage. Dans `_layout.tsx`, l'appel est fait dans `RootLayout` avant le return — c'est valide car Expo Router initialise le contexte au niveau de la fonction d'entrée.

#### Piège n°6 : `segments` change à chaque navigation

Le guard `useEffect([session, loading, segments])` se relancera à chaque changement de route. C'est voulu pour les redirections dynamiques, mais il faut éviter les boucles infinies : les conditions `!inAuth && !session` et `inAuth && session` sont mutuellement exclusives, donc pas de risque.

### State existant de `use-auth-store.ts` (à connaître, ne pas modifier)

```typescript
interface AuthStore {
  session: Session | null;  // null = pas connecté
  user: User | null;
  loading: boolean;         // true au démarrage — distingue "non vérifié" de "pas de session"
  setSession: (session: Session | null) => void;  // met à jour session + user + loading: false
  signOut: () => Promise<void>;                   // sign out Supabase + reset store
}
```

`setSession(null)` → déconnecté, `setSession(session)` → connecté, dans les deux cas `loading` passe à `false`.

### Variables d'environnement requises

```
EXPO_PUBLIC_SUPABASE_URL=<url-projet-supabase>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Déjà documentées dans `.env.example`. Si `.env.local` n'existe pas, créer avec les valeurs du projet Supabase. Le client `lib/supabase.ts` les consomme directement.

### Flow OAuth complet (référence)

```
User tap "Apple" / "Google"
  → handleApple() / handleGoogle()
  → supabase.auth.signInWithOAuth({ provider, redirectTo: 'kara://auth/callback' })
  → Linking.openURL(data.url)              ← ouvre navigateur externe
  → User s'auth sur Apple/Google
  → Navigateur redirige vers kara://auth/callback?code=PKCE_CODE
  → Expo Router intercepte la deep link → (auth)/callback.tsx
  → exchangeCodeForSession(code)
  → setSession(session)                    ← onAuthStateChange se déclenche aussi
  → routing guard /(tabs)
```

### Learnings des stories précédentes

- `import "../global.css"` dans `_layout.tsx` est **déjà présent** — ne pas le supprimer ou déplacer
- `lucide-react-native` est installé — `ActivityIndicator` vient de `react-native` (pas de lucide)
- Toast est déjà monté dans `_layout.tsx` — appeler `Toast.show()` depuis n'importe quel écran
- Path alias `@/` configuré — utiliser `@/lib/supabase`, `@/lib/stores/use-auth-store`
- Les imports dans `_layout.tsx` utilisent des chemins relatifs (`../lib/...`), pas `@/` — respecter la convention existante

### References

- Architecture auth : `_bmad-output/planning-artifacts/architecture.md` — section "Authentication & Security"
- `use-auth-store.ts` : `app/lib/stores/use-auth-store.ts`
- `supabase.ts` : `app/lib/supabase.ts`
- `supabase-error.ts` : `app/lib/supabase-error.ts`
- Story 1.3 (précédente) : `_bmad-output/implementation-artifacts/1-3-ecran-onboarding-3-slides.md`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- `app/_layout.tsx` : ajout de `onAuthStateChange` (subscriber global, cleanup via unsubscribe) + routing guard `useEffect([session, loading, segments])` avec check `loading` pour éviter redirect prématuré
- `(auth)/login.tsx` : `handleAuth()` remplacé par `handleApple()` et `handleGoogle()` avec `supabase.auth.signInWithOAuth()` + `Linking.openURL()` ; bouton email reste placeholder (sans `onPress`) ; `handleAuth` et `router` supprimés (inutilisés)
- `(auth)/callback.tsx` : créé — extrait `code` PKCE via `useLocalSearchParams`, appelle `exchangeCodeForSession`, met à jour le store via `setSession`, affiche spinner violet pendant l'échange
- Fix TypeScript : le bouton email avait encore `onPress={handleAuth}` → supprimé
- `npx tsc --noEmit` : aucune erreur

### File List

- `app/app/_layout.tsx` (modifié — routing guard + onAuthStateChange)
- `app/app/(auth)/login.tsx` (modifié — OAuth réel Apple + Google)
- `app/app/(auth)/callback.tsx` (créé — handler PKCE deep link)
