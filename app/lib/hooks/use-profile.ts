import { useQuery } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { supabase } from '@/lib/supabase';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];

export type VehicleWithPhotos = VehicleRow & {
  vehicle_photos: Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>[];
};

export interface ProfileWithStats {
  profile: ProfileRow;
  vehicles: VehicleWithPhotos[];
  followerCount: number;
  followingCount: number;
}

export function useProfile(
  userId: string,
  { autoCreate = true }: { autoCreate?: boolean } = {}
) {
  return useQuery<ProfileWithStats, PostgrestError>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      // maybeSingle() retourne null sans erreur si la ligne est absente
      // (contrairement à single() qui lève PGRST116 — ex: trigger non exécuté à l'inscription)
      const [profileResult, vehiclesResult, followersResult, followingResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase
          .from('vehicles')
          .select('*, vehicle_photos(id, storage_path, position, is_cover)')
          .eq('owner_id', userId)
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('target_id', userId)
          .eq('target_type', 'profile'),
        supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId)
          .eq('target_type', 'profile'),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (vehiclesResult.error) throw vehiclesResult.error;
      if (followersResult.error) throw followersResult.error;
      if (followingResult.error) throw followingResult.error;

      let profile = profileResult.data;

      if (!profile) {
        if (!autoCreate) throw new Error('Profil introuvable');
        // Profil absent (trigger non exécuté à l'inscription) : création automatique
        const { data: created, error: createErr } = await supabase
          .from('profiles')
          .insert({ id: userId, username: `user_${userId.replace(/-/g, '').slice(0, 12)}` })
          .select('*')
          .single();
        if (createErr) throw createErr;
        profile = created;
      }

      return {
        profile,
        vehicles: (vehiclesResult.data ?? []) as VehicleWithPhotos[],
        followerCount: followersResult.count ?? 0,
        followingCount: followingResult.count ?? 0,
      };
    },
    enabled: !!userId,
  });
}
