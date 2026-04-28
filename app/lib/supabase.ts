import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Sur le web (Expo Web / Metro web), ExpoSecureStore n'a pas de module natif
// (ExpoSecureStore.web.js retourne {}). On replie sur localStorage.
// Sur iOS/Android, SecureStore chiffré est obligatoire pour les tokens auth.
const ExpoSecureStoreAdapter =
  Platform.OS === "web"
    ? {
        getItem: async (key: string): Promise<string | null> => {
          if (typeof localStorage === "undefined") return null;
          return localStorage.getItem(key);
        },
        setItem: async (key: string, value: string): Promise<void> => {
          if (typeof localStorage !== "undefined")
            localStorage.setItem(key, value);
        },
        removeItem: async (key: string): Promise<void> => {
          if (typeof localStorage !== "undefined")
            localStorage.removeItem(key);
        },
      }
    : {
        getItem: (key: string) => SecureStore.getItemAsync(key),
        setItem: (key: string, value: string) =>
          SecureStore.setItemAsync(key, value),
        removeItem: (key: string) => SecureStore.deleteItemAsync(key),
      };

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;

// Point d'entrée unique pour toutes les URLs d'images Supabase Storage
// Utilise l'API de transformation intégrée (resize, quality) — jamais de raw URL ailleurs
export function buildImageUrl(
  path: string,
  opts: { width?: number; height?: number; quality?: number } = {}
): string {
  const { width = 800, quality = 80 } = opts;
  const params = new URLSearchParams();
  if (width) params.set("width", String(width));
  if (opts.height) params.set("height", String(opts.height));
  params.set("quality", String(quality));
  return `${SUPABASE_URL}/storage/v1/render/image/public/${path}?${params.toString()}`;
}
