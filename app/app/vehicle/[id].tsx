import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MoreHorizontal,
  Car,
  MessageCircle,
  Plus,
  ChevronRight,
} from 'lucide-react-native';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraBadge } from '@/components/shared/KaraBadge';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraButton } from '@/components/shared/KaraButton';

const VEHICLE = {
  id: '1',
  name: 'Nissan Silvia S15 — Spec R',
  specs: '2001 · 2.0L TURBO · 280CH · RWD',
  tags: ['#JDM', '#Turbo', '#Stance', '#Drift', '#BNSports', '#Ohlins'],
  description:
    'Build daily-track. Suspension Ohlins DFV, échappement Tomei, kit BN Sports. 280ch sur banc. Spotté à Lurcy-Lévis le mois dernier — la suite arrive.',
  tone: 'cyan-tokyo' as const,
  label: 'NISSAN SILVIA S15 · 1/6',
  photos: 6,
  specGrid: [
    { l: 'Année', v: '2001' },
    { l: 'Cylindrée', v: '1998 cc' },
    { l: 'Puissance', v: '280 ch' },
    { l: 'Couple', v: '350 Nm' },
    { l: 'Transmission', v: '6 vit. man.' },
    { l: 'Poids', v: '1240 kg' },
  ],
  owner: { name: 'aki_drift', followers: '2.4k', city: 'Lyon, 69', tone: 'cyan-tokyo' as const },
  comments: [
    { who: '@maxprt_rs', txt: 'La caisse est crémeuse, les jantes !', tone: 'amber-stance' as const },
    { who: '@flo_e36', txt: 'On se croise à Tarare samedi ?', tone: 'violet-dusk' as const },
  ],
};

export default function VehicleDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-kara-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero photo */}
        <View style={{ position: 'relative', height: 380 }}>
          <KaraPhoto
            tone={VEHICLE.tone}
            label={VEHICLE.label}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={['rgba(10,10,15,0.5)', 'transparent', 'transparent', '#0A0A0F']}
            locations={[0, 0.25, 0.75, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Top bar */}
          <View
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 14,
              right: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              zIndex: 4,
            }}
          >
            <Pressable
              onPress={() => router.back()}
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
              <ChevronLeft size={18} color="#fff" />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[Share2, MoreHorizontal].map((Icon, i) => (
                <Pressable
                  key={i}
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
                  <Icon size={16} color="#fff" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Photo dots */}
          <View
            style={{
              position: 'absolute',
              bottom: 80,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 4,
              zIndex: 4,
            }}
          >
            {Array.from({ length: VEHICLE.photos }).map((_, idx) => (
              <View
                key={idx}
                style={{
                  width: idx === 0 ? 18 : 4,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: idx === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>

          {/* Type badge */}
          <View style={{ position: 'absolute', top: insets.top + 56, left: 14, flexDirection: 'row', gap: 6, zIndex: 4 }}>
            <KaraBadge tone="glass" icon={<Car size={12} color="#fff" strokeWidth={2} />} label="Voiture" />
            <KaraBadge tone="glass" label="🇯🇵 JP" />
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, marginTop: -50, zIndex: 3 }}>
          <Text style={{ color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 30, lineHeight: 33, marginBottom: 6 }}>
            {VEHICLE.name}
          </Text>
          <Text style={{ color: '#A78BFA', fontSize: 12, fontFamily: 'Inter_500Medium', letterSpacing: 0.8, marginBottom: 16 }}>
            {VEHICLE.specs}
          </Text>

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            style={{ marginBottom: 18, marginHorizontal: -20 }}
          >
            <View style={{ width: 20 }} />
            {VEHICLE.tags.map((t) => <KaraTag key={t}>{t}</KaraTag>)}
            <View style={{ width: 20 }} />
          </ScrollView>

          <Text style={{ color: '#F1F0FF', fontSize: 14, lineHeight: 22, fontFamily: 'Inter_400Regular', marginBottom: 22 }}>
            {VEHICLE.description}
          </Text>

          {/* Specs grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {VEHICLE.specGrid.map((s) => (
              <View
                key={s.l}
                style={{
                  width: '47%',
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: '#111118',
                  borderWidth: 1,
                  borderColor: '#1E1E2E',
                }}
              >
                <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
                  {s.l}
                </Text>
                <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16 }}>
                  {s.v}
                </Text>
              </View>
            ))}
          </View>

          {/* Owner card */}
          <Pressable
            style={{
              padding: 14,
              borderRadius: 16,
              backgroundColor: '#111118',
              borderWidth: 1,
              borderColor: '#1E1E2E',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginBottom: 22,
            }}
          >
            <KaraAvatar size={44} tone={VEHICLE.owner.tone} initial="A" online />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>
                Propriétaire
              </Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }}>
                @{VEHICLE.owner.name}
              </Text>
              <Text style={{ fontSize: 11, color: '#9594B5', fontFamily: 'Inter_400Regular' }}>
                {VEHICLE.owner.followers} abonnés · {VEHICLE.owner.city}
              </Text>
            </View>
            <ChevronRight size={18} color="#5C5B78" />
          </Pressable>

          {/* Comments */}
          <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Commentaires · 89
          </Text>
          {VEHICLE.comments.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              <KaraPhoto tone={c.tone} style={{ width: 32, height: 32, borderRadius: 16 }} />
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#111118',
                  borderWidth: 1,
                  borderColor: '#1E1E2E',
                  borderRadius: 14,
                  padding: 10,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#F1F0FF' }}>{c.who}</Text>
                <Text style={{ fontSize: 13, color: '#F1F0FF', fontFamily: 'Inter_400Regular', marginTop: 2 }}>{c.txt}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom action */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: insets.bottom + 14,
          backgroundColor: 'rgba(10,10,15,0.95)',
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <KaraButton variant="primary" size="md" full>
          <Plus size={16} color="#fff" strokeWidth={2.25} />
          <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
            Suivre ce véhicule
          </Text>
        </KaraButton>
        <Pressable
          style={{
            width: 52,
            height: 48,
            borderRadius: 999,
            backgroundColor: '#111118',
            borderWidth: 1,
            borderColor: '#2A2A3D',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MessageCircle size={18} color="#F1F0FF" />
        </Pressable>
      </View>
    </View>
  );
}
