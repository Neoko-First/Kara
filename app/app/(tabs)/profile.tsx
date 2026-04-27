import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Settings, MapPin, Grid3x3, Bookmark } from 'lucide-react-native';
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraButton } from '@/components/shared/KaraButton';

const GRID: { tone: PhotoTone; label: string }[] = [
  { tone: 'cyan-tokyo', label: 'S15' },
  { tone: 'amber-stance', label: 'RS3' },
  { tone: 'crimson-rwd', label: 'EK9' },
  { tone: 'violet-dusk', label: 'E36' },
  { tone: 'track-magenta', label: 'V4' },
  { tone: 'emerald-build', label: 'AE86' },
];

const STATS = [
  { v: '6', l: 'Véhicules' },
  { v: '2.4k', l: 'Abonnés' },
  { v: '312', l: 'Abonnements' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'vehicles' | 'favs'>('vehicles');

  return (
    <View className="flex-1 bg-kara-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cover photo */}
        <View style={{ position: 'relative', height: 230 }}>
          <KaraPhoto
            tone="cyan-tokyo"
            label="NISSAN S15 · COVER"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={['rgba(10,10,15,0.5)', 'transparent', 'rgba(10,10,15,0.7)', '#0A0A0F']}
            locations={[0, 0.3, 0.7, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* Top buttons */}
          <View style={{ position: 'absolute', top: insets.top + 8, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', zIndex: 4 }}>
            <Pressable style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(17,17,24,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={18} color="#fff" />
            </Pressable>
            <Pressable style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(17,17,24,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Avatar + identity */}
        <View style={{ marginTop: -56, paddingHorizontal: 20, position: 'relative', zIndex: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14 }}>
            <View style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#0A0A0F', overflow: 'hidden' }}>
              <KaraPhoto tone="track-magenta" style={{ width: '100%', height: '100%' }} />
            </View>
            <View style={{ flex: 1, paddingBottom: 4 }}>
              <KaraButton variant="secondary" size="sm" full>
                <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>Modifier</Text>
              </KaraButton>
            </View>
          </View>

          <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 26, marginTop: 14, marginBottom: 2 }}>
            Aki — JDM Build
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: '#9594B5', fontSize: 13, fontFamily: 'Inter_400Regular' }}>@aki_drift</Text>
            <Text style={{ color: '#5C5B78' }}>·</Text>
            <MapPin size={11} color="#9594B5" strokeWidth={1.6} />
            <Text style={{ color: '#9594B5', fontSize: 13, fontFamily: 'Inter_400Regular' }}>Lyon, 69</Text>
          </View>

          <Text style={{ marginTop: 12, color: '#F1F0FF', fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular' }}>
            Daily-track team. Silvia S15 + Hachiroku project. Spotté tous les samedis à Tarare.
          </Text>

          <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {['#JDM', '#Drift', '#Lyon69'].map(t => <KaraTag key={t}>{t}</KaraTag>)}
          </View>

          {/* Stats */}
          <View style={{ marginTop: 18, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row' }}>
            {STATS.map((s, i) => (
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
          ] as const).map(t => (
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

        {/* Photo grid */}
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
          {GRID.map((g, i) => (
            <View key={i} style={{ width: '31.5%', aspectRatio: 1, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <KaraPhoto tone={g.tone} style={{ width: '100%', height: '100%' }} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' }}
              />
              <Text style={{ position: 'absolute', bottom: 6, left: 8, color: '#fff', fontSize: 9, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8 }}>
                {g.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
