import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { buildImageUrl } from '@/lib/supabase';
import { useLike } from '@/lib/hooks/use-like';
import { CommentWithAuthor } from '@/lib/hooks/use-comments';

function formatRelative(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

export function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  const { isLiked, likeCount, toggle, isPending } = useLike({
    targetId: comment.id,
    targetType: 'comment',
  });
  const initial = comment.profiles?.username?.[0]?.toUpperCase() ?? '?';
  const avatarUri = comment.profiles?.avatar_url
    ? buildImageUrl(comment.profiles.avatar_url, { width: 60 })
    : undefined;

  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 10, paddingHorizontal: 16 }}>
      <KaraAvatar size={32} tone="crimson-rwd" initial={initial} uri={avatarUri} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
          @{comment.profiles?.username ?? ''}
        </Text>
        <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 2 }}>
          {comment.body}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 }}>
          {formatRelative(comment.created_at)}
        </Text>
      </View>
      <Pressable onPress={toggle} disabled={isPending} style={{ alignItems: 'center', gap: 2, paddingTop: 2 }}>
        <Heart
          size={14}
          color={isLiked ? '#F97316' : 'rgba(255,255,255,0.4)'}
          fill={isLiked ? '#F97316' : 'transparent'}
        />
        {likeCount > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Inter_500Medium' }}>
            {likeCount}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
