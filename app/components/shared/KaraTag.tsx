import React from 'react';
import { Pressable, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}

export function KaraTag({ children, active = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 30,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? '#7C3AED' : 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: active ? 'transparent' : 'rgba(255,255,255,0.12)',
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <Text
        style={{
          color: active ? '#fff' : '#F1F0FF',
          fontFamily: 'Inter_500Medium',
          fontSize: 13,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
