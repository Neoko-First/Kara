import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface UseFollowParams {
  targetId: string;
  targetType: 'profile' | 'vehicle';
}

export function useFollow({ targetId, targetType }: UseFollowParams) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: isFollowing = false } = useQuery({
    queryKey: ['follow', currentUserId, targetId, targetType],
    queryFn: async () => {
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', currentUserId!)
        .eq('target_id', targetId)
        .eq('target_type', targetType);
      return (count ?? 0) > 0;
    },
    enabled: !!currentUserId && !!targetId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Non authentifié');
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', userId)
          .eq('target_id', targetId)
          .eq('target_type', targetType);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: userId, target_id: targetId, target_type: targetType });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['follow', currentUserId, targetId, targetType],
        !isFollowing
      );
      if (targetType === 'profile') {
        queryClient.invalidateQueries({ queryKey: ['profile', targetId] });
      }
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: 'Une erreur est survenue.' });
      }
    },
  });

  return {
    isFollowing,
    toggle: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
