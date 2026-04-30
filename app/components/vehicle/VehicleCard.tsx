import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  Car,
  Bike,
} from 'lucide-react-native';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraBadge } from '@/components/shared/KaraBadge';
import { KaraButton } from '@/components/shared/KaraButton';
import { VehiclePhotoCarousel } from './VehiclePhotoCarousel';
import { VehicleWithRelations } from '@/lib/hooks/use-vehicles';

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

export function VehicleCard({ vehicle, cardHeight }: { vehicle: VehicleWithRelations; cardHeight: number }) {
  const [following, setFollowing] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const router = useRouter();
  // cardWidth = screenWidth - (paddingHorizontal 12 * 2) du Pressable dans index.tsx
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 24;

  // Valeurs dérivées depuis les données DB
  const displayName = `${vehicle.brand} ${vehicle.model}`;
  const specsArr = [
    vehicle.displacement,
    vehicle.power != null ? `${vehicle.power}ch` : null,
    vehicle.transmission,
  ].filter(Boolean) as string[];
  const displaySpecs = specsArr.join(' · ');

  const photoCount = vehicle.vehicle_photos.length;

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
        {/* Carousel photos horizontal — remplace l'Image plein-fond unique de Story 2.1 */}
        <VehiclePhotoCarousel
          photos={vehicle.vehicle_photos}
          width={cardWidth}
          height={cardHeight}
          onPhotoChange={setPhotoIdx}
        />

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

        {/* Dots de progression photos — réactifs au swipe du carousel */}
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
