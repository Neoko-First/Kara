import React from 'react';
import { View, Text } from 'react-native';
import { KaraPhoto, PhotoTone } from './KaraPhoto';

interface Props {
  size?: number;
  tone?: PhotoTone;
  initial?: string;
  online?: boolean;
}

export function KaraAvatar({ size = 36, tone = 'violet-dusk', initial = 'K', online = false }: Props) {
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <KaraPhoto
        tone={tone}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <Text
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: size * 0.36,
          }}
        >
          {initial}
        </Text>
      </KaraPhoto>
      {online && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: (size * 0.28) / 2,
            backgroundColor: '#7C3AED',
            borderWidth: 2,
            borderColor: '#0A0A0F',
          }}
        />
      )}
    </View>
  );
}
