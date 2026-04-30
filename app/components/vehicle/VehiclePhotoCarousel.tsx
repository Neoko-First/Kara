import React, { useCallback } from 'react';
import { FlatList, Image, ViewabilityConfig, ViewToken } from 'react-native';
import { Database } from '@/types/database';
import { buildImageUrl } from '@/lib/supabase';
import { KaraPhoto } from '@/components/shared/KaraPhoto';

type VehiclePhotoRow = Database['public']['Tables']['vehicle_photos']['Row'];
type Photo = Pick<VehiclePhotoRow, 'id' | 'storage_path' | 'position' | 'is_cover'>;

interface Props {
  photos: Photo[];
  width: number;
  height: number;
  onPhotoChange: (index: number) => void;
}

// Défini au niveau module — jamais inline dans JSX (crash FlatList si recréé à chaque render)
const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};

export function VehiclePhotoCarousel({ photos, width, height, onPhotoChange }: Props) {
  // useCallback stable — requis par FlatList pour onViewableItemsChanged
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0] != null) {
        onPhotoChange(viewableItems[0].index ?? 0);
      }
    },
    [onPhotoChange]
  );

  if (photos.length === 0) {
    return (
      <KaraPhoto
        tone="crimson-rwd"
        style={{ position: 'absolute', top: 0, left: 0, width, height }}
      />
    );
  }

  return (
    <FlatList
      data={photos}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={width}
      snapToAlignment="start"
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image
          source={{ uri: buildImageUrl(item.storage_path, { width: 800, quality: 80 }) }}
          style={{ width, height }}
          resizeMode="cover"
        />
      )}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      style={{ position: 'absolute', top: 0, left: 0, width, height }}
    />
  );
}
