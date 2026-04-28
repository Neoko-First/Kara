import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
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

// Empêche le splash screen de se cacher automatiquement
// avant que les polices soient chargées
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    // Dès que les polices sont prêtes (ou en erreur), on cache le splash
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // On ne rend rien tant que les polices ne sont pas prêtes
  // Évite un flash de texte sans police (FOUT)
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
