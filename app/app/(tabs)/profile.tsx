import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, MapPin, Grid3x3, Bookmark } from 'lucide-react-native';
import { PostgrestError } from '@supabase/supabase-js';
import Toast from 'react-native-toast-message';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraButton } from '@/components/shared/KaraButton';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useProfile } from '@/lib/hooks/use-profile';
import { buildImageUrl } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabase-error';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<'vehicles' | 'favs'>('vehicles');

  const userId = useAuthStore((s) => s.user?.id);
  const signOut = useAuthStore((s) => s.signOut);
  const { data, isLoading, isError, error } = useProfile(userId ?? '');

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  useEffect(() => {
    if (isError && error) {
      const msg = handleSupabaseError(error as PostgrestError);
      Toast.show({ type: 'error', text1: msg });
    }
  }, [isError, error]);

  if (!userId || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  const coverPhoto = data?.vehicles[0]?.vehicle_photos.find((p) => p.is_cover);
  const coverUrl = coverPhoto ? buildImageUrl(coverPhoto.storage_path, { width: 600, quality: 85 }) : undefined;

  const avatarUrl = data?.profile.avatar_url
    ? buildImageUrl(data.profile.avatar_url, { width: 200, quality: 90 })
    : undefined;
  const avatarInitial = (data?.profile.display_name ?? data?.profile.username ?? 'K')[0].toUpperCase();

  const displayName = data?.profile.display_name ?? data?.profile.username ?? '';
  const username = data?.profile.username ?? '';
  const city = data?.profile.city ?? null;
  const bio = data?.profile.bio ?? null;
  const tags = data?.profile.tags ?? [];

  const vehicleCount = data?.vehicles.length ?? 0;
  const followerCount = data?.followerCount ?? 0;
  const followingCount = data?.followingCount ?? 0;

  return (
    <View className="flex-1 bg-kara-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cover photo */}
        <View style={{ position: 'relative', height: 230 }}>
          <KaraPhoto
            tone="cyan-tokyo"
            src={coverUrl}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={['rgba(10,10,15,0.5)', 'transparent', 'rgba(10,10,15,0.7)', '#0A0A0F']}
            locations={[0, 0.3, 0.7, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* Bouton settings */}
          <View style={{ position: 'absolute', top: insets.top + 8, right: 14, zIndex: 4 }}>
            <Pressable onPress={handleSignOut} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(17,17,24,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Avatar + identity */}
        <View style={{ marginTop: -56, paddingHorizontal: 20, position: 'relative', zIndex: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14 }}>
            <View style={{ borderRadius: 51, borderWidth: 3, borderColor: '#0A0A0F' }}>
              <KaraAvatar uri={avatarUrl} size={96} initial={avatarInitial} />
            </View>
            <View style={{ flex: 1, paddingBottom: 4 }}>
              <KaraButton variant="secondary" size="sm" full onPress={() => router.push('/profile/edit')}>
                <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Modifier</Text>
              </KaraButton>
            </View>
          </View>

          <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 26, marginTop: 14, marginBottom: 2 }}>
            {displayName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Text style={{ color: '#9594B5', fontSize: 13, fontFamily: 'Inter_400Regular' }}>@{username}</Text>
            {city && (
              <>
                <Text style={{ color: '#5C5B78' }}>·</Text>
                <MapPin size={11} color="#9594B5" strokeWidth={1.6} />
                <Text style={{ color: '#9594B5', fontSize: 13, fontFamily: 'Inter_400Regular' }}>{city}</Text>
              </>
            )}
          </View>

          {bio && (
            <Text style={{ marginTop: 12, color: '#F1F0FF', fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular' }}>
              {bio}
            </Text>
          )}

          {tags.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {tags.map((t) => <KaraTag key={t}>#{t}</KaraTag>)}
            </View>
          )}

          {/* Stats */}
          <View style={{ marginTop: 18, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row' }}>
            {[
              { v: String(vehicleCount), l: 'Véhicules' },
              { v: String(followerCount), l: 'Abonnés' },
              { v: String(followingCount), l: 'Abonnements' },
            ].map((s, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderRightColor: '#1E1E2E' }}>
                <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22 }}>{s.v}</Text>
                <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 16 }}>
          {([
            { id: 'vehicles', label: 'Véhicules', Icon: Grid3x3 },
            { id: 'favs', label: 'Favoris', Icon: Bookmark },
          ] as const).map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{
                flex: 1, height: 40, borderRadius: 12,
                backgroundColor: tab === t.id ? '#111118' : 'transparent',
                borderWidth: 1, borderColor: tab === t.id ? '#2A2A3D' : 'transparent',
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <t.Icon size={14} color={tab === t.id ? '#F1F0FF' : '#9594B5'} />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: tab === t.id ? '#F1F0FF' : '#9594B5' }}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Onglet Véhicules */}
        {tab === 'vehicles' && (
          <View style={{ paddingHorizontal: 20 }}>
            {vehicleCount === 0 ? (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <Text style={{ color: '#9594B5', fontFamily: 'Inter_400Regular', fontSize: 14 }}>
                  Aucun véhicule publié pour l'instant
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {data!.vehicles.map((v) => {
                  const cover = v.vehicle_photos.find((p) => p.is_cover);
                  const imgUrl = cover
                    ? buildImageUrl(cover.storage_path, { width: 300, quality: 75 })
                    : undefined;
                  return (
                    <View key={v.id} style={{ width: '31.5%', aspectRatio: 1, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                      <KaraPhoto
                        tone="violet-dusk"
                        src={imgUrl}
                        style={{ width: '100%', height: '100%' }}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }}
                      />
                      <Text style={{ position: 'absolute', bottom: 6, left: 8, color: '#fff', fontSize: 9, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8 }}>
                        {`${v.brand} ${v.model}`.toUpperCase()}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Onglet Favoris — scope Story 5.3 */}
        {tab === 'favs' && (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ color: '#9594B5', fontFamily: 'Inter_400Regular', fontSize: 14 }}>
              Tes favoris apparaîtront ici
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
