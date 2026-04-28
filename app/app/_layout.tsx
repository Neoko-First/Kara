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

  // Routing guard — attend la fin du chargement initial pour éviter une
  // redirection prématurée vers onboarding quand la session est en cours de restauration
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
          {/* Groupe auth — pas de tab bar */}
          <Stack.Screen name="(auth)" />
          {/* Groupe tabs — avec tab bar */}
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </>
    </QueryClientProvider>
  );
}
