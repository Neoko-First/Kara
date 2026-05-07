import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { VehicleWithPhotos } from '@/lib/hooks/use-profile';

export function useBookmarks(userId: string) {
  return useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('vehicle_id, vehicles!inner(*, vehicle_photos(id, storage_path, position, is_cover))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((b) => b.vehicles as unknown as VehicleWithPhotos);
    },
    enabled: !!userId,
  });
}
