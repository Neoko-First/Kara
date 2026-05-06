import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, useWindowDimensions,
  Modal, TextInput, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Heart,
  Share2,
  MoreHorizontal,
  Car,
  Bike,
  MessageCircle,
} from 'lucide-react-native';
import { KaraBadge } from '@/components/shared/KaraBadge';
import { KaraTag } from '@/components/shared/KaraTag';
import { KaraButton } from '@/components/shared/KaraButton';
import { VehiclePhotoCarousel } from '@/components/vehicle/VehiclePhotoCarousel';
import { VehicleSpecGrid } from '@/components/vehicle/VehicleSpecGrid';
import { OwnerCard } from '@/components/profile/OwnerCard';
import { useVehicle } from '@/lib/hooks/use-vehicle';
import { useFollow } from '@/lib/hooks/use-follow';
import { useLike } from '@/lib/hooks/use-like';
import { useComments } from '@/lib/hooks/use-comments';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { CommentItem } from '@/components/vehicle/CommentItem';

const COUNTRY_EMOJI: Record<string, string> = {
  JP: '🇯🇵', FR: '🇫🇷', DE: '🇩🇪', IT: '🇮🇹', US: '🇺🇸',
  GB: '🇬🇧', ES: '🇪🇸', KR: '🇰🇷', SE: '🇸🇪', BE: '🇧🇪',
  NL: '🇳🇱', CH: '🇨🇭', AT: '🇦🇹', AU: '🇦🇺', CA: '🇨🇦',
};

const TYPE_LABEL: Record<string, string> = {
  car: 'Voiture', moto: 'Moto', van: 'Van',
  truck: 'Camion', bike: 'Vélo', classic: 'Classic',
};

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.round(screenHeight * 0.5);

  const [photoIdx, setPhotoIdx] = useState(0);

  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data, isLoading, isError } = useVehicle(id);
  const ownerId = data?.profiles?.id ?? data?.owner_id ?? '';
  const isOwnVehicle = !!currentUserId && currentUserId === ownerId;

  const { isFollowing, toggle, isPending } = useFollow({
    targetId: id,
    targetType: 'vehicle',
  });

  const { isLiked, toggle: toggleLike, isPending: isLikePending } = useLike({
    targetId: id,
    targetType: 'vehicle',
  });

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const { comments, addComment, isAdding } = useComments(id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ color: '#9594B5', fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center' }}>
          Ce véhicule est introuvable.
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#7C3AED', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const displayName = `${data.brand} ${data.model}`;
  const specsArr = [
    data.year != null ? String(data.year) : null,
    data.displacement,
    data.power != null ? `${data.power}CH` : null,
    data.transmission,
  ].filter(Boolean) as string[];
  const displaySpecs = specsArr.join(' · ');

  const typeLabel = TYPE_LABEL[data.type] ?? data.type;
  const TypeIcon = ['moto', 'bike'].includes(data.type) ? Bike : Car;
  const countryEmoji = COUNTRY_EMOJI[data.country_code ?? ''] ?? '';

  const photoCount = data.vehicle_photos.length;

  return (
    <View className="flex-1 bg-kara-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero carousel */}
        <View style={{ position: 'relative', height: heroHeight }}>
          <VehiclePhotoCarousel
            photos={data.vehicle_photos}
            width={screenWidth}
            height={heroHeight}
            onPhotoChange={setPhotoIdx}
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
              <Pressable
                onPress={toggleLike}
                disabled={isLikePending}
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
                <Heart
                  size={16}
                  color={isLiked ? '#F97316' : '#fff'}
                  fill={isLiked ? '#F97316' : 'transparent'}
                />
              </Pressable>
              <Pressable
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
                <Share2 size={16} color="#fff" />
              </Pressable>
              <Pressable
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
                <MoreHorizontal size={16} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Dots de progression photos */}
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
            {Array.from({ length: Math.max(photoCount, 1) }).map((_, idx) => (
              <View
                key={idx}
                style={{
                  width: idx === photoIdx ? 18 : 4,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: idx === photoIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>

          {/* Badges type + pays */}
          <View
            style={{
              position: 'absolute',
              top: insets.top + 56,
              left: 14,
              flexDirection: 'row',
              gap: 6,
              zIndex: 4,
            }}
          >
            <KaraBadge
              tone="glass"
              icon={<TypeIcon size={12} color="#fff" strokeWidth={2} />}
              label={typeLabel}
            />
            {countryEmoji ? (
              <KaraBadge tone="glass" label={`${countryEmoji} ${data.country_code}`} />
            ) : null}
          </View>
        </View>

        {/* Contenu */}
        <View style={{ paddingHorizontal: 20, marginTop: -50, zIndex: 3 }}>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 30,
              lineHeight: 33,
              marginBottom: 6,
            }}
          >
            {displayName}
          </Text>
          <Text
            style={{
              color: '#A78BFA',
              fontSize: 12,
              fontFamily: 'Inter_500Medium',
              letterSpacing: 0.8,
              marginBottom: 16,
            }}
          >
            {displaySpecs}
          </Text>

          {/* Tags */}
          {(data.tags ?? []).length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6 }}
              style={{ marginBottom: 18, marginHorizontal: -20 }}
            >
              <View style={{ width: 20 }} />
              {(data.tags ?? []).map((t) => <KaraTag key={t}>{t}</KaraTag>)}
              <View style={{ width: 20 }} />
            </ScrollView>
          )}

          {/* Description */}
          {data.description && (
            <Text
              style={{
                color: '#F1F0FF',
                fontSize: 14,
                lineHeight: 22,
                fontFamily: 'Inter_400Regular',
                marginBottom: 22,
              }}
            >
              {data.description}
            </Text>
          )}

          {/* Grille specs */}
          <VehicleSpecGrid vehicle={data} />

          {/* Carte propriétaire */}
          <OwnerCard
            ownerId={ownerId}
            username={data.profiles?.username ?? null}
            displayName={data.profiles?.display_name ?? null}
            avatarUrl={data.profiles?.avatar_url ?? null}
            city={data.profiles?.city ?? null}
          />
        </View>
      </ScrollView>

      {/* Barre sticky bas — Suivre + Commenter */}
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
        {!isOwnVehicle && (
          <KaraButton
            variant={isFollowing ? 'secondary' : 'primary'}
            size="md"
            full
            onPress={toggle}
            disabled={isPending}
          >
            <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
              {isFollowing ? '✓ Suivi' : 'Suivre ce véhicule'}
            </Text>
          </KaraButton>
        )}
        <Pressable
          onPress={() => setCommentsOpen(true)}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
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

      {/* Modal commentaires */}
      <Modal
        visible={commentsOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCommentsOpen(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: '#0A0A0F' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#1E1E2E',
            }}
          >
            <Text style={{ color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18 }}>
              Commentaires
            </Text>
            <Pressable onPress={() => setCommentsOpen(false)}>
              <Text style={{ color: '#7C3AED', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
                Fermer
              </Text>
            </Pressable>
          </View>

          {/* Liste */}
          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => <CommentItem comment={item} />}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <Text
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 40,
                }}
              >
                Aucun commentaire pour l'instant.
              </Text>
            }
          />

          {/* Saisie */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: '#1E1E2E',
            }}
          >
            <TextInput
              value={commentBody}
              onChangeText={setCommentBody}
              placeholder="Ajoute un commentaire..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={{
                flex: 1,
                backgroundColor: '#111118',
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 10,
                color: '#fff',
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#1E1E2E',
                maxHeight: 100,
              }}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={() => {
                if (!commentBody.trim() || !currentUserId) return;
                addComment(commentBody);
                setCommentBody('');
              }}
              disabled={!commentBody.trim() || isAdding || !currentUserId}
              style={{
                backgroundColor: (commentBody.trim() && currentUserId) ? '#7C3AED' : 'rgba(124,58,237,0.3)',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
                {isAdding ? '…' : 'Envoyer'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
