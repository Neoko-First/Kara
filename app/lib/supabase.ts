import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Sur le web (Expo Web / Metro web), ExpoSecureStore n'a pas de module natif.
// Sur iOS/Android, les tokens OAuth dépassent souvent la limite de 2048 bytes de
// SecureStore — on découpe la valeur en chunks de 1900 bytes stockés séparément.
const CHUNK_SIZE = 1900;

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
        getItem: async (key: string): Promise<string | null> => {
          const chunkCount = await SecureStore.getItemAsync(`${key}.chunks`);
          if (chunkCount === null) {
            // Compatibilité : tentative de lecture comme valeur simple (ancien format)
            return SecureStore.getItemAsync(key);
          }
          const total = parseInt(chunkCount, 10);
          const parts: string[] = [];
          for (let i = 0; i < total; i++) {
            const chunk = await SecureStore.getItemAsync(`${key}.${i}`);
            if (chunk === null) return null;
            parts.push(chunk);
          }
          return parts.join("");
        },
        setItem: async (key: string, value: string): Promise<void> => {
          if (value.length <= CHUNK_SIZE) {
            await SecureStore.setItemAsync(key, value);
            await SecureStore.deleteItemAsync(`${key}.chunks`);
            return;
          }
          const chunks: string[] = [];
          for (let i = 0; i < value.length; i += CHUNK_SIZE) {
            chunks.push(value.slice(i, i + CHUNK_SIZE));
          }
          for (let i = 0; i < chunks.length; i++) {
            await SecureStore.setItemAsync(`${key}.${i}`, chunks[i]);
          }
          await SecureStore.setItemAsync(`${key}.chunks`, String(chunks.length));
          await SecureStore.deleteItemAsync(key);
        },
        removeItem: async (key: string): Promise<void> => {
          const chunkCount = await SecureStore.getItemAsync(`${key}.chunks`);
          if (chunkCount !== null) {
            const total = parseInt(chunkCount, 10);
            for (let i = 0; i < total; i++) {
              await SecureStore.deleteItemAsync(`${key}.${i}`);
            }
            await SecureStore.deleteItemAsync(`${key}.chunks`);
          }
          await SecureStore.deleteItemAsync(key);
        },
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
