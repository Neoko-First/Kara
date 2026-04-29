import { useInfiniteQuery } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { supabase } from '@/lib/supabase';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Type enrichi retourné par le hook — véhicule + photos + propriétaire
export type VehicleWithRelations = VehicleRow & {
  // Note : la colonne est 'storage_path' (chemin Supabase Storage brut), pas 'url'
  vehicle_photos: Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>[];
  profiles: Pick<ProfileRow, 'id' | 'username' | 'display_name' | 'avatar_url' | 'city'> | null;
};

const FEED_PAGE_SIZE = 10;

// Pagination cursor-based sur created_at (AR10)
// Query key : ['vehicles'] — invalidation globale après publication d'un véhicule (Story 3.3)
export function useVehicles() {
  return useInfiniteQuery<VehicleWithRelations[], PostgrestError>({
    queryKey: ['vehicles'],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(
          `*,
          vehicle_photos(id, storage_path, position, is_cover),
          profiles!vehicles_owner_id_fkey(id, username, display_name, avatar_url, city)`
        )
        .eq('is_published', true)
        .lt('created_at', pageParam as string)
        .order('created_at', { ascending: false })
        .limit(FEED_PAGE_SIZE);

      if (error) throw error;
      return (data ?? []) as VehicleWithRelations[];
    },
    // Curseur initial = maintenant → charge les véhicules les plus récents en premier
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (lastPage) => {
      // Pas de page suivante si on a moins de FEED_PAGE_SIZE résultats
      if (lastPage.length < FEED_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].created_at ?? undefined;
    },
  });
}
