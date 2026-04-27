import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Car,
  Bike,
  Truck,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react-native';
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';
import { KaraTag } from '@/components/shared/KaraTag';

const CATEGORIES = [
  { id: 'cars', label: 'Voitures', Icon: Car, count: '12.4k' },
  { id: 'motos', label: 'Motos', Icon: Bike, count: '8.1k' },
  { id: 'vans', label: 'Vans', Icon: Truck, count: '1.2k' },
  { id: 'trucks', label: 'Camions', Icon: Truck, count: '643' },
  { id: 'classics', label: 'Classics', Icon: Sparkles, count: '3.5k' },
  { id: 'other', label: 'Autres', Icon: Car, count: '2.8k' },
];

const TRENDING_TAGS = [
  '#S15', '#AE86', '#R34', '#Ducati', '#Stance', '#Drift', '#OEM+', '#JDM', '#Cafe', '#K20',
];

const NEAR_CARS = [
  { name: 'BMW E36 M3', owner: '@flo_e36', city: 'Paris 15e', tone: 'violet-dusk' as PhotoTone, label: 'BMW E36 · DUSK' },
  { name: 'Mazda RX-7 FD', owner: '@rotary_kev', city: 'Versailles', tone: 'crimson-rwd' as PhotoTone, label: 'RX-7 · ROTARY' },
  { name: 'Honda Civic EK9', owner: '@b16_lou', city: 'Boulogne', tone: 'emerald-build' as PhotoTone, label: 'EK9 · TYPE R' },
];

const RECENT_BUILDS = [
  { name: 'Toyota AE86 Trueno', owner: '@hachiroku.fr', tag: '#JDM #Drift', tone: 'cyan-tokyo' as PhotoTone, label: 'AE86 · TRUENO' },
  { name: 'Porsche 964 Carrera', owner: '@air_cooled', tag: '#Aircooled #Classic', tone: 'amber-stance' as PhotoTone, label: '964 · BACKDATE' },
  { name: 'Yamaha R1 2009', owner: '@r1_paul', tag: '#Track #Crossplane', tone: 'crimson-rwd' as PhotoTone, label: 'R1 · CROSSPLANE' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-kara-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ height: insets.top + 8 }} />

        {/* Title + Search */}
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
            <Text style={{ flex: 1, color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 14 }}>
              Marque, modèle, #tag…
            </Text>
            <View
              style={{
                width: 28, height: 28, borderRadius: 8, backgroundColor: '#7C3AED',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <SlidersHorizontal size={14} color="#fff" strokeWidth={1.6} />
            </View>
          </View>
        </View>

        {/* Categories grid */}
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
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setActiveCat(activeCat === c.id ? null : c.id)}
                style={{
                  width: '47%', height: 88, borderRadius: 18,
                  backgroundColor: activeCat === c.id ? '#7C3AED' : '#111118',
                  borderWidth: 1, borderColor: activeCat === c.id ? 'transparent' : '#1E1E2E',
                  padding: 14,
                }}
              >
                <c.Icon
                  size={26}
                  color={activeCat === c.id ? '#fff' : '#A78BFA'}
                  strokeWidth={1.75}
                />
                <Text
                  style={{
                    marginTop: 8, fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16,
                    color: activeCat === c.id ? '#fff' : '#F1F0FF',
                  }}
                >
                  {c.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2,
                    color: activeCat === c.id ? 'rgba(255,255,255,0.7)' : '#5C5B78',
                  }}
                >
                  {c.count} builds
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Trending */}
        <View style={{ paddingBottom: 22 }}>
          <Text
            style={{
              color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11,
              letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 18, marginBottom: 12,
            }}
          >
            Tendances
          </Text>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}
          >
            {TRENDING_TAGS.map((t, i) => <KaraTag key={t} active={i === 0}>{t}</KaraTag>)}
          </ScrollView>
        </View>

        {/* Near you */}
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
            <Text style={{ color: '#A78BFA', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
              Voir tout
            </Text>
          </View>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 18 }}
          >
            {NEAR_CARS.map((c) => (
              <View
                key={c.name}
                style={{
                  width: 200, borderRadius: 18, overflow: 'hidden',
                  backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E',
                }}
              >
                <KaraPhoto tone={c.tone} label={c.label} style={{ width: '100%', height: 112 }} />
                <View style={{ padding: 12 }}>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#F1F0FF' }}>
                    {c.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#9594B5', fontFamily: 'Inter_400Regular', marginTop: 2 }}>
                    {c.owner} · {c.city}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent builds */}
        <View style={{ paddingHorizontal: 18 }}>
          <Text
            style={{
              color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11,
              letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
            }}
          >
            Builds récents
          </Text>
          {RECENT_BUILDS.map((c) => (
            <Pressable
              key={c.name}
              style={{
                flexDirection: 'row', gap: 12, paddingVertical: 10,
                borderBottomWidth: 1, borderBottomColor: '#1E1E2E', alignItems: 'center',
              }}
            >
              <KaraPhoto tone={c.tone} label={c.label} style={{ width: 64, height: 64, borderRadius: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#F1F0FF' }}>
                  {c.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#9594B5', fontFamily: 'Inter_400Regular', marginTop: 2 }}>
                  {c.owner}
                </Text>
                <Text style={{ fontSize: 11, color: '#A78BFA', fontFamily: 'Inter_500Medium', marginTop: 2, letterSpacing: 0.5 }}>
                  {c.tag}
                </Text>
              </View>
              <ChevronRight size={18} color="#5C5B78" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
