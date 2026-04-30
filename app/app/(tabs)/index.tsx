import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  SlidersHorizontal,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { KaraWordmark } from '@/components/shared/KaraWordmark';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { useVehicles } from '@/lib/hooks/use-vehicles';
import { handleSupabaseError } from '@/lib/supabase-error';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [containerHeight, setContainerHeight] = useState(0);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVehicles();

  // Items à afficher : toutes les pages aplaties en tableau unique
  const items = data?.pages.flatMap((page) => page) ?? [];

  // Toast d'erreur si le chargement Supabase échoue
  useEffect(() => {
    if (isError && error) {
      Toast.show({ type: 'error', text1: handleSupabaseError(error) });
    }
  }, [isError, error]);

  // Skeleton affiché pendant le chargement initial (aucune donnée encore disponible)
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
        <View
          style={{
            position: 'absolute',
            top: insets.top + 8,
            left: 0,
            right: 0,
            zIndex: 20,
            paddingHorizontal: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          pointerEvents="box-none"
        >
          <KaraWordmark size={22} color="#fff" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View
              style={{
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: 'rgba(17,17,24,0.72)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Bell size={18} color="#fff" />
            </View>
            <View
              style={{
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: 'rgba(17,17,24,0.72)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <SlidersHorizontal size={18} color="#fff" strokeWidth={1.6} />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: insets.top + 56 }}>
          <View style={{ flex: 1, borderRadius: 28, backgroundColor: '#111118' }} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-kara-bg pt-14 pb-4">
      {/* Header flottant — au-dessus du FlatList */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 0,
          right: 0,
          zIndex: 20,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        pointerEvents="box-none"
      >
        <KaraWordmark size={22} color="#fff" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'rgba(17,17,24,0.72)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={18} color="#fff" />
          </View>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: 'rgba(17,17,24,0.72)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SlidersHorizontal size={18} color="#fff" strokeWidth={1.6} />
          </View>
        </View>
      </View>

      {/* Feed scroll-snap vertical (style TikTok) */}
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight > 0 && (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToAlignment="start"
            snapToInterval={containerHeight}
            removeClippedSubviews={true}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <VehicleCard vehicle={item} cardHeight={containerHeight} />
            )}
            getItemLayout={(_, index) => ({
              length: containerHeight,
              offset: containerHeight * index,
              index,
            })}
          />
        )}
      </View>
    </View>
  );
}
