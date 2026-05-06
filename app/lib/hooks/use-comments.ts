import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export interface CommentWithAuthor {
  id: string;
  vehicle_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useComments(vehicleId: string) {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles:user_id(id, username, display_name, avatar_url)')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as CommentWithAuthor[];
    },
    enabled: !!vehicleId,
  });

  const addMutation = useMutation({
    mutationFn: async (body: string) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        Toast.show({ type: 'error', text1: 'Tu dois être connecté pour commenter.' });
        return;
      }
      const { error } = await supabase
        .from('comments')
        .insert({ vehicle_id: vehicleId, user_id: userId, body: body.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', vehicleId] });
    },
    onError: (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const msg = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: msg });
      } else {
        Toast.show({ type: 'error', text1: "Impossible d'envoyer le commentaire." });
      }
    },
  });

  return {
    comments,
    isLoading,
    addComment: (body: string) => addMutation.mutate(body),
    isAdding: addMutation.isPending,
  };
}
