import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/query-client';
import { handleSupabaseError } from '@/lib/supabase-error';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { usePostStore } from '@/lib/stores/use-post-store';

interface CreateVehicleInput {
  photos: string[];
  type: string;
  brand: string;
  model: string;
  year: number | null;
  displacement: string;
  power: number | null;
  description: string;
  tags: string[];
  city: string;
  precise: boolean;
}

async function compressPhoto(uri: string): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.8, format: SaveFormat.JPEG }
  );
  return result.uri;
}

async function uploadPhoto(
  uri: string,
  ownerId: string,
  vehicleId: string,
  index: number
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storagePath = `${ownerId}/${vehicleId}/${index}.jpg`;

  const { error } = await supabase.storage
    .from('vehicles')
    .upload(storagePath, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) {
    throw new Error('Erreur lors de l\'upload de la photo.');
  }

  return storagePath;
}

export function useCreateVehicle() {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (input: CreateVehicleInput) => {
      const ownerId = useAuthStore.getState().user?.id;
      if (!ownerId) throw new Error('Non authentifié');

      // Étape 1 : créer le véhicule en brouillon pour obtenir son id
      const vehicleInsert = {
        brand: input.brand,
        model: input.model,
        type: input.type,
        owner_id: ownerId,
        year: input.year,
        displacement: input.displacement || null,
        power: input.power,
        description: input.description || null,
        tags: input.tags.length > 0 ? input.tags : null,
        city: input.city || null,
        lat: null as number | null,
        lng: null as number | null,
        is_published: false,
      };

      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .insert(vehicleInsert)
        .select('id')
        .single();

      if (vehicleError) {
        throw vehicleError;
      }

      const vehicleId = vehicleData.id;

      // Étape 2 : compresser, uploader chaque photo et insérer dans vehicle_photos
      for (let i = 0; i < input.photos.length; i++) {
        setUploadProgress(i);

        const compressed = await compressPhoto(input.photos[i]);
        const storagePath = await uploadPhoto(compressed, ownerId, vehicleId, i);

        const { error: photoError } = await supabase
          .from('vehicle_photos')
          .insert({
            vehicle_id: vehicleId,
            storage_path: storagePath,
            position: i,
            is_cover: i === 0,
          });

        if (photoError) {
          throw photoError;
        }
      }

      // Étape 3 : publier le véhicule
      const { error: publishError } = await supabase
        .from('vehicles')
        .update({ is_published: true })
        .eq('id', vehicleId);

      if (publishError) {
        throw publishError;
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      usePostStore.getState().reset();
      setUploadProgress(0);
      Toast.show({ type: 'success', text1: 'Build publié !' });
      router.replace('/(tabs)');
    },

    onError: (error: unknown) => {
      setUploadProgress(0);
      if (
        error instanceof Error &&
        error.message.includes('upload de la photo')
      ) {
        Toast.show({ type: 'error', text1: error.message });
      } else if (error && typeof error === 'object' && 'code' in error) {
        const message = handleSupabaseError(error as Parameters<typeof handleSupabaseError>[0]);
        Toast.show({ type: 'error', text1: message });
      } else {
        Toast.show({ type: 'error', text1: 'Une erreur est survenue. Réessaie plus tard.' });
      }
    },
  });

  return {
    mutate: (input: CreateVehicleInput) => mutation.mutate(input),
    isPending: mutation.isPending,
    uploadProgress,
  };
}
