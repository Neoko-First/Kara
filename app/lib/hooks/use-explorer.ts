import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Database } from '@/types/database';

type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export type NearbyVehicle = {
  id: string;
  brand: string;
  model: string;
  type: string;
  city: string | null;
  vehicle_photos: Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>[];
  profiles: Pick<ProfileRow, 'username' | 'display_name'> | null;
};

// City du profil connecté — utilisée pour filtrer les "Près de toi"
export function useCurrentUserCity() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery<string | null, PostgrestError>({
    queryKey: ['profile-city', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data?.city ?? null;
    },
    enabled: !!userId,
    retry: false,
  });
}

// Comptage des véhicules publiés par type via RPC get_vehicle_counts_by_type()
export function useCategoryCounts() {
  return useQuery<{ type: string; count: number }[], PostgrestError>({
    queryKey: ['explorer-categories'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.rpc as any)('get_vehicle_counts_by_type');
      if (error) {
        Toast.show({ type: 'error', text1: handleSupabaseError(error as PostgrestError) });
        throw error;
      }
      return ((data ?? []) as { type: string; count: string | number }[]).map((r) => ({
        type: r.type,
        count: Number(r.count),
      }));
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Tags les plus fréquents via RPC get_trending_tags(limit_count)
export function useTrendingTags() {
  return useQuery<string[], PostgrestError>({
    queryKey: ['explorer-tags'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.rpc as any)('get_trending_tags', { limit_count: 10 });
      if (error) {
        Toast.show({ type: 'error', text1: handleSupabaseError(error as PostgrestError) });
        throw error;
      }
      return (data as string[] | null) ?? [];
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

// Véhicules publiés dans la même ville que l'utilisateur connecté
export function useNearbyVehicles(userCity: string | null) {
  return useQuery<NearbyVehicle[], PostgrestError>({
    queryKey: ['explorer-nearby', userCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id, brand, model, type, city,
          vehicle_photos(id, storage_path, position, is_cover),
          profiles!vehicles_owner_id_fkey(username, display_name)
        `)
        .eq('is_published', true)
        .eq('city', userCity!)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) {
        Toast.show({ type: 'error', text1: handleSupabaseError(error) });
        throw error;
      }
      return (data ?? []) as unknown as NearbyVehicle[];
    },
    enabled: !!userCity,
    retry: false,
  });
}
