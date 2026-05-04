import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { buildImageUrl } from '@/lib/supabase';

interface OwnerCardProps {
  ownerId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  city: string | null;
}

export function OwnerCard({ ownerId, username, displayName, avatarUrl, city }: OwnerCardProps) {
  const router = useRouter();
  const builtAvatarUrl = avatarUrl
    ? buildImageUrl(avatarUrl, { width: 100, quality: 80 })
    : undefined;
  const initial = (displayName ?? username ?? '?')[0].toUpperCase();

  return (
    <Pressable
      onPress={() => router.push(`/user/${ownerId}`)}
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
      <KaraAvatar uri={builtAvatarUrl} size={44} initial={initial} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: '#9594B5',
            fontFamily: 'Inter_600SemiBold',
            fontSize: 10,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          Propriétaire
        </Text>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }}>
          @{username ?? '—'}
        </Text>
        {city && (
          <Text style={{ fontSize: 11, color: '#9594B5', fontFamily: 'Inter_400Regular' }}>
            {city}
          </Text>
        )}
      </View>
      <ChevronRight size={18} color="#5C5B78" />
    </Pressable>
  );
}
