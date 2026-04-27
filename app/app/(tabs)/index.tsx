import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
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
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraBadge } from '@/components/shared/KaraBadge';
import { KaraButton } from '@/components/shared/KaraButton';

const VEHICLE_DATA = [
  {
    id: '1',
    owner: 'aki_drift',
    city: 'Lyon, 69',
    name: 'Nissan Silvia S15',
    specs: 'SR20DET · 280ch · RWD',
    tags: ['#JDM', '#Turbo', '#Stance', '#Drift'],
    type: 'Voiture',
    tone: 'cyan-tokyo' as PhotoTone,
    label: 'NISSAN S15 · MIDNIGHT',
    country: '🇯🇵',
    photos: 6,
    photoIdx: 1,
    online: true,
    likes: 1245,
  },
  {
    id: '2',
    owner: 'maxprt_rs',
    city: 'Marseille, 13',
    name: 'Audi RS3 8V',
    specs: '2.5 TFSI · 400ch · AWD',
    tags: ['#Stance', '#Daily', '#OEM+', '#Track'],
    type: 'Voiture',
    tone: 'amber-stance' as PhotoTone,
    label: 'AUDI RS3 · GOLDEN HOUR',
    country: '🇩🇪',
    photos: 4,
    photoIdx: 1,
    online: false,
    likes: 892,
  },
  {
    id: '3',
    owner: 'duc_panigale',
    city: 'Nice, 06',
    name: 'Ducati Panigale V4',
    specs: '1103cc · 214ch · 198kg',
    tags: ['#Track', '#Italian', '#V4', '#Akrapovic'],
    type: 'Moto',
    tone: 'crimson-rwd' as PhotoTone,
    label: 'DUCATI V4 · ASCARI',
    country: '🇮🇹',
    photos: 5,
    photoIdx: 2,
    online: true,
    likes: 2341,
  },
];

type Vehicle = (typeof VEHICLE_DATA)[0];

function VehicleCard({ vehicle, cardHeight }: { vehicle: Vehicle; cardHeight: number }) {
  const [following, setFollowing] = useState(false);
  const router = useRouter();

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
        {/* Background photo */}
        <KaraPhoto
          tone={vehicle.tone}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* Top gradient */}
        <LinearGradient
          colors={['rgba(10,10,15,0.6)', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 2 }}
        />

        {/* Bottom gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(10,10,15,0.82)', 'rgba(10,10,15,0.98)']}
          locations={[0, 0.4, 1]}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 400, zIndex: 2 }}
        />

        {/* Top corners */}
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
            icon={vehicle.type === 'Moto'
              ? <Bike size={12} color="#fff" strokeWidth={2} />
              : <Car size={12} color="#fff" strokeWidth={2} />}
            label={vehicle.type}
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
            <Text style={{ fontSize: 13 }}>{vehicle.country}</Text>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Inter_500Medium',
                fontSize: 11,
              }}
            >
              · {vehicle.photoIdx}/{vehicle.photos}
            </Text>
          </View>
        </View>

        {/* Photo dots */}
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
          {Array.from({ length: vehicle.photos }).map((_, idx) => (
            <View
              key={idx}
              style={{
                height: 3,
                width: idx === vehicle.photoIdx - 1 ? 18 : 4,
                borderRadius: 2,
                backgroundColor:
                  idx === vehicle.photoIdx - 1
                    ? '#fff'
                    : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </View>

        {/* Side action rail */}
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
          <Text
            style={{
              fontFamily: 'Inter_500Medium',
              fontSize: 10,
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
            }}
          >
            {vehicle.likes}
          </Text>
        </View>

        {/* Bottom info overlay */}
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
          {/* Owner row */}
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
              tone={vehicle.tone}
              initial={vehicle.owner[0].toUpperCase()}
              online={vehicle.online}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 14,
                }}
              >
                @{vehicle.owner}
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
                  {vehicle.city}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              color: '#fff',
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 26,
              lineHeight: 28,
              marginBottom: 4,
            }}
          >
            {vehicle.name}
          </Text>
          <Text
            style={{
              color: '#A78BFA',
              fontSize: 11,
              fontFamily: 'Inter_500Medium',
              marginBottom: 14,
              letterSpacing: 0.8,
            }}
          >
            {vehicle.specs}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            style={{ marginBottom: 14 }}
          >
            {vehicle.tags.map((t) => (
              <KaraTag key={t}>{t}</KaraTag>
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <KaraButton
              variant={following ? 'secondary' : 'primary'}
              size="md"
              full
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

  return (
    <View className="flex-1 bg-kara-bg">
      {/* Floating header — overlaps the FlatList */}
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

      {/* Feed */}
      <View
        style={{ flex: 1 }}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight > 0 && (
          <FlatList
            data={VEHICLE_DATA}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToAlignment="start"
            snapToInterval={containerHeight}
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
