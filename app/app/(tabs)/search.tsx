import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Search,
  Car,
  Bike,
  Truck,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraTag } from '@/components/shared/KaraTag';
import { buildImageUrl } from '@/lib/supabase';
import {
  useCategoryCounts,
  useTrendingTags,
  useNearbyVehicles,
  useCurrentUserCity,
} from '@/lib/hooks/use-explorer';

// Mapping type DB → libellé et icône (source: 001_initial_schema.sql CHECK constraint)
const CATEGORY_MAP = [
  { typeValue: 'car',     label: 'Voitures', Icon: Car      },
  { typeValue: 'moto',    label: 'Motos',    Icon: Bike     },
  { typeValue: 'van',     label: 'Vans',     Icon: Truck    },
  { typeValue: 'truck',   label: 'Camions',  Icon: Truck    },
  { typeValue: 'bike',    label: 'Vélos',    Icon: Bike     },
  { typeValue: 'classic', label: 'Classics', Icon: Sparkles },
] as const;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: userCity } = useCurrentUserCity();
  const { data: categoryCounts = [] } = useCategoryCounts();
  const { data: trendingTags = [] } = useTrendingTags();
  const { data: nearbyVehicles = [] } = useNearbyVehicles(userCity ?? null);

  const getCount = (typeValue: string): string => {
    const entry = categoryCounts.find((c) => c.type === typeValue);
    if (!entry) return '—';
    return entry.count >= 1000
      ? `${(entry.count / 1000).toFixed(1)}k`
      : String(entry.count);
  };

  const handleCategoryPress = (typeValue: string) => {
    setActiveCat(activeCat === typeValue ? null : typeValue);
    setSearchQuery(typeValue);
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <View className="flex-1 bg-kara-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ height: insets.top + 8 }} />

        {/* Titre + Barre de recherche */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <Text
            style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 28, marginBottom: 14 }}
          >
            Explorer
          </Text>
          <View
            style={{
              height: 48, borderRadius: 16, backgroundColor: '#111118',
              borderWidth: 1, borderColor: '#1E1E2E',
              flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10,
            }}
          >
            <Search size={18} color="#9594B5" strokeWidth={1.75} />
            <TextInput
              style={{ flex: 1, color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14 }}
              placeholder="Marque, modèle, #tag…"
              placeholderTextColor="#5C5B78"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery !== '' ? (
              <Pressable onPress={() => { setSearchQuery(''); setActiveCat(null); }} hitSlop={8}>
                <X size={16} color="#9594B5" strokeWidth={1.75} />
              </Pressable>
            ) : (
              <View
                style={{
                  width: 28, height: 28, borderRadius: 8, backgroundColor: '#7C3AED',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <SlidersHorizontal size={14} color="#fff" strokeWidth={1.6} />
              </View>
            )}
          </View>
        </View>

        {searchQuery !== '' ? (
          /* ── Mode recherche (résultats implémentés en story 6.2) ── */
          <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 18 }}>
            <Search size={32} color="#5C5B78" strokeWidth={1.5} />
            <Text
              style={{
                color: '#9594B5', fontFamily: 'Inter_400Regular', fontSize: 14,
                marginTop: 16, textAlign: 'center',
              }}
            >
              Recherche en cours…{'\n'}Les résultats apparaîtront ici.
            </Text>
          </View>
        ) : (
          /* ── Mode Explorer ── */
          <>
            {/* Catégories 2×3 */}
            <View style={{ paddingHorizontal: 18, paddingBottom: 22 }}>
              <Text
                style={{
                  color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11,
                  letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
                }}
              >
                Catégories
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {CATEGORY_MAP.map((c) => (
                  <Pressable
                    key={c.typeValue}
                    onPress={() => handleCategoryPress(c.typeValue)}
                    style={{
                      width: '47%', height: 88, borderRadius: 18,
                      backgroundColor: activeCat === c.typeValue ? '#7C3AED' : '#111118',
                      borderWidth: 1, borderColor: activeCat === c.typeValue ? 'transparent' : '#1E1E2E',
                      padding: 14,
                    }}
                  >
                    <c.Icon
                      size={26}
                      color={activeCat === c.typeValue ? '#fff' : '#A78BFA'}
                      strokeWidth={1.75}
                    />
                    <Text
                      style={{
                        marginTop: 8, fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16,
                        color: activeCat === c.typeValue ? '#fff' : '#F1F0FF',
                      }}
                    >
                      {c.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2,
                        color: activeCat === c.typeValue ? 'rgba(255,255,255,0.7)' : '#5C5B78',
                      }}
                    >
                      {getCount(c.typeValue)} builds
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Tendances */}
            <View style={{ paddingBottom: 22 }}>
              <Text
                style={{
                  color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11,
                  letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 18, marginBottom: 12,
                }}
              >
                Tendances
              </Text>
              {trendingTags.length > 0 ? (
                <ScrollView
                  horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}
                >
                  {trendingTags.map((tag) => (
                    <KaraTag key={tag} onPress={() => handleTagPress(tag)}>
                      {tag}
                    </KaraTag>
                  ))}
                </ScrollView>
              ) : (
                <Text style={{ color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 13, paddingHorizontal: 18 }}>
                  Aucune tendance pour l'instant.
                </Text>
              )}
            </View>

            {/* Près de toi — masqué si l'utilisateur n'a pas de ville */}
            {userCity ? (
              <View style={{ paddingBottom: 24 }}>
                <View
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingHorizontal: 18, marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11,
                      letterSpacing: 1, textTransform: 'uppercase',
                    }}
                  >
                    Près de toi
                  </Text>
                  <Pressable>
                    <Text style={{ color: '#A78BFA', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
                      Voir tout
                    </Text>
                  </Pressable>
                </View>
                {nearbyVehicles.length > 0 ? (
                  <ScrollView
                    horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12, paddingHorizontal: 18 }}
                  >
                    {nearbyVehicles.map((v) => {
                      const cover = v.vehicle_photos.find((p) => p.is_cover) ?? v.vehicle_photos[0];
                      const imgUrl = cover ? buildImageUrl(cover.storage_path) : undefined;
                      return (
                        <Pressable
                          key={v.id}
                          onPress={() => router.push(`/vehicle/${v.id}`)}
                          style={{
                            width: 200, borderRadius: 18, overflow: 'hidden',
                            backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E',
                          }}
                        >
                          <KaraPhoto
                            src={imgUrl}
                            tone="violet-dusk"
                            label={`${v.brand} ${v.model}`.toUpperCase()}
                            style={{ width: '100%', height: 112 }}
                          />
                          <View style={{ padding: 12 }}>
                            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#F1F0FF' }}>
                              {v.brand} {v.model}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#9594B5', fontFamily: 'Inter_400Regular', marginTop: 2 }}>
                              @{v.profiles?.username} · {v.city}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <Text style={{ color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 13, paddingHorizontal: 18 }}>
                    Aucun build près de {userCity} pour l'instant.
                  </Text>
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
