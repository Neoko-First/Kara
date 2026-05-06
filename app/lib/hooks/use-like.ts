import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface UseLikeParams {
  targetId: string;
  targetType: 'vehicle' | 'comment';
}

export function useLike({ targetId, targetType }: UseLikeParams) {
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: isLiked = false } = useQuery({
    queryKey: ['like', currentUserId, targetId, targetType],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId!)
        .eq('target_id', targetId)
        .eq('target_type', targetType);
      return (count ?? 0) > 0;
    },
    enabled: !!currentUserId && !!targetId,
  });

  const { data: likeCount = 0 } = useQuery({
    queryKey: ['like-count', targetId, targetType],
    queryFn: async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('target_id', targetId)
        .eq('target_type', targetType);
      return count ?? 0;
    },
    enabled: !!targetId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) return; // Guard non-authentifié : no-op silencieux
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('target_id', targetId)
          .eq('target_type', targetType);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: userId, target_id: targetId, target_type: targetType });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['like', currentUserId, targetId, targetType],
        !isLiked,
      );
      queryClient.setQueryData(
        ['like-count', targetId, targetType],
        (prev: number) => (isLiked ? Math.max(0, prev - 1) : prev + 1),
      );
      queryClient.invalidateQueries({ queryKey: ['vehicle', targetId] });
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: 'Impossible de liker pour le moment.' });
      }
    },
  });

  return {
    isLiked,
    likeCount,
    toggle: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
