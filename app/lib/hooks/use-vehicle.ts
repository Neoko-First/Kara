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
