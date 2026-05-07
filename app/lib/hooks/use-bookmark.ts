import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export function useBookmark({ vehicleId }: { vehicleId: string }) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: isBookmarked = false } = useQuery({
    queryKey: ['bookmark', currentUserId, vehicleId],
    queryFn: async () => {
      const { count } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId!)
        .eq('vehicle_id', vehicleId);
      return (count ?? 0) > 0;
    },
    enabled: !!currentUserId && !!vehicleId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        Toast.show({ type: 'error', text1: 'Tu dois être connecté pour sauvegarder un favori.' });
        return;
      }
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('vehicle_id', vehicleId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: userId, vehicle_id: vehicleId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['bookmark', currentUserId, vehicleId],
        !isBookmarked,
      );
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', currentUserId] });
      }
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: 'Impossible de mettre à jour les favoris.' });
      }
    },
  });

  return {
    isBookmarked,
    toggle: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
