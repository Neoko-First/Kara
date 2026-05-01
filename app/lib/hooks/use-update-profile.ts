import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';

interface UpdateProfileInput {
  displayName?: string;
  username?: string;
  bio?: string;
  city?: string;
  tags?: string[];
  avatarUri?: string;
}

export function useUpdateProfile() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('Non authentifié');

      let avatarPath: string | undefined;
      if (input.avatarUri) {
        const compressed = await manipulateAsync(
          input.avatarUri,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: SaveFormat.JPEG }
        );
        const response = await fetch(compressed.uri);
        const blob = await response.blob();
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .upload(`${userId}/avatar.jpg`, blob, { contentType: 'image/jpeg', upsert: true });
        if (storageError) throw new Error("Erreur lors de l'upload de l'avatar.");
        avatarPath = `avatars/${userId}/avatar.jpg`;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: input.displayName?.trim() || null,
          username: input.username?.trim() || undefined,
          bio: input.bio?.trim() || null,
          city: input.city?.trim() || null,
          tags: (input.tags ?? []).filter(Boolean).length > 0 ? input.tags?.filter(Boolean) ?? null : null,
          ...(avatarPath ? { avatar_url: avatarPath } : {}),
        })
        .eq('id', userId);

      if (error) throw error;
    },

    onSuccess: async () => {
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
      Toast.show({ type: 'success', text1: 'Profil mis à jour !' });
      router.back();
    },

    onError: (error: unknown) => {
      if (error instanceof Error && error.message.includes("upload de l'avatar")) {
        Toast.show({ type: 'error', text1: error.message });
      } else if (error && typeof error === 'object' && 'code' in error) {
        const message = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: message });
      } else {
        Toast.show({ type: 'error', text1: 'Une erreur est survenue. Réessaie plus tard.' });
      }
    },
  });
}
