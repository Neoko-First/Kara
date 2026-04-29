import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  SlidersHorizontal,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  Car,
  Bike,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraBadge } from '@/components/shared/KaraBadge';
import { KaraButton } from '@/components/shared/KaraButton';
import { useVehicles, VehicleWithRelations } from '@/lib/hooks/use-vehicles';
import { buildImageUrl } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase-error';

// Mapping code pays ISO 3166-1 alpha-2 → emoji drapeau
const COUNTRY_EMOJI: Record<string, string> = {
  JP: '🇯🇵', FR: '🇫🇷', DE: '🇩🇪', IT: '🇮🇹', US: '🇺🇸',
  GB: '🇬🇧', ES: '🇪🇸', KR: '🇰🇷', SE: '🇸🇪', BE: '🇧🇪',
  NL: '🇳🇱', CH: '🇨🇭', AT: '🇦🇹', AU: '🇦🇺', CA: '🇨🇦',
};

// Mapping type DB → libellé français affiché
const TYPE_LABEL: Record<string, string> = {
  car: 'Voiture', moto: 'Moto', van: 'Van',
  truck: 'Camion', bike: 'Vélo', classic: 'Classic',
};

function VehicleCard({ vehicle, cardHeight }: { vehicle: VehicleWithRelations; cardHeight: number }) {
  const [following, setFollowing] = useState(false);
  // photoIdx géré localement — le carousel interactif arrive en Story 2.2
  const [photoIdx] = useState(0);
  const router = useRouter();

  // Valeurs dérivées depuis les données DB
  const displayName = `${vehicle.brand} ${vehicle.model}`;
  const specsArr = [
    vehicle.displacement,
    vehicle.power != null ? `${vehicle.power}ch` : null,
    vehicle.transmission,
  ].filter(Boolean) as string[];
  const displaySpecs = specsArr.join(' · ');

  const coverPhoto = vehicle.vehicle_photos.find((p) => p.is_cover) ?? vehicle.vehicle_photos[0];
  const photoCount = vehicle.vehicle_photos.length;
  // storage_path = chemin brut Supabase Storage → buildImageUrl() obligatoire (NFR2)
  const coverUrl = coverPhoto
    ? buildImageUrl(coverPhoto.storage_path, { width: 800, quality: 80 })
    : null;

  // Profil propriétaire — protégé contre null (RLS peut bloquer la lecture)
  const ownerUsername = vehicle.profiles?.username ?? '';
  const ownerCity = vehicle.profiles?.city ?? vehicle.city ?? '';
  const ownerInitial = ownerUsername[0]?.toUpperCase() ?? '?';

  const countryEmoji = COUNTRY_EMOJI[vehicle.country_code ?? ''] ?? '';
  const typeLabel = TYPE_LABEL[vehicle.type] ?? vehicle.type;
  const TypeIcon = ['moto', 'bike'].includes(vehicle.type) ? Bike : Car;

  return (
    <Pressable
      onPress={() => router.push(`/vehicle/${vehicle.id}`)}
      style={{ height: cardHeight, paddingHorizontal: 12 }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 28,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#1E1E2E',
        }}
      >
        {/* Photo de couverture — Image réelle ou placeholder KaraPhoto */}
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            resizeMode="cover"
          />
        ) : (
          <KaraPhoto
            tone="crimson-rwd"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}

        {/* Gradient haut */}
        <LinearGradient
          colors={['rgba(10,10,15,0.6)', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 2 }}
        />

        {/* Gradient bas */}
        <LinearGradient
          colors={['transparent', 'rgba(10,10,15,0.82)', 'rgba(10,10,15,0.98)']}
          locations={[0, 0.4, 1]}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 400, zIndex: 2 }}
        />

        {/* Badges haut (type + pays/index photo) */}
        <View
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 4,
          }}
        >
          <KaraBadge
            tone="glass"
            icon={<TypeIcon size={12} color="#fff" strokeWidth={2} />}
            label={typeLabel}
          />
          <View
            style={{
              height: 26,
              paddingHorizontal: 10,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.55)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 13 }}>{countryEmoji}</Text>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Inter_500Medium',
                fontSize: 11,
              }}
            >
              · {photoIdx + 1}/{photoCount > 0 ? photoCount : 1}
            </Text>
          </View>
        </View>

        {/* Dots de progression photos */}
        <View
          style={{
            position: 'absolute',
            top: 52,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
            zIndex: 4,
          }}
        >
          {Array.from({ length: Math.max(photoCount, 1) }).map((_, idx) => (
            <View
              key={idx}
              style={{
                height: 3,
                width: idx === photoIdx ? 18 : 4,
                borderRadius: 2,
                backgroundColor: idx === photoIdx ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </View>

        {/* Colonne d'actions droite (style TikTok) — visuels uniquement, logique en Story 5.1 */}
        <View
          style={{
            position: 'absolute',
            right: 14,
            bottom: 200,
            alignItems: 'center',
            gap: 14,
            zIndex: 4,
          }}
        >
          {[Heart, MessageCircle, Bookmark, Share2].map((Icon, k) => (
            <Pressable
              key={k}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(0,0,0,0.45)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={20} color="#fff" />
            </Pressable>
          ))}
          {/* Compteur likes — 0 jusqu'à Story 5.1 */}
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 10,
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
            }}
          >
            0
          </Text>
        </View>

        {/* Overlay bas — infos véhicule */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 18,
            zIndex: 3,
          }}
        >
          {/* Ligne propriétaire */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <KaraAvatar
              size={36}
              tone="crimson-rwd"
              initial={ownerInitial}
              online={false}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 14,
                }}
              >
                @{ownerUsername}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} color="rgba(255,255,255,0.55)" strokeWidth={1.6} />
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: 12,
                    fontFamily: 'Inter_400Regular',
                  }}
                >
                  {ownerCity}
                </Text>
              </View>
            </View>
          </View>

          {/* Nom véhicule — font-display bold (UX-DR2) */}
          <Text
            style={{
              color: '#fff',
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 26,
              lineHeight: 28,
              marginBottom: 4,
            }}
          >
            {displayName}
          </Text>

          {/* Specs en caps */}
          <Text
            style={{
              color: '#A78BFA',
              fontSize: 11,
              fontFamily: 'Inter_500Medium',
              marginBottom: 14,
              letterSpacing: 0.8,
            }}
          >
            {displaySpecs}
          </Text>

          {/* Tags scrollables */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            style={{ marginBottom: 14 }}
          >
            {(vehicle.tags ?? []).map((t) => (
              <KaraTag key={t}>{t}</KaraTag>
            ))}
          </ScrollView>

          {/* Boutons Suivre + Message */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <KaraButton
              variant={following ? 'secondary' : 'primary'}
              size="md"
              className="flex-1"
              onPress={() => setFollowing(!following)}
            >
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 15,
                }}
              >
                {following ? '✓ Abonné' : 'Suivre'}
              </Text>
            </KaraButton>
            <Pressable
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageCircle size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

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
