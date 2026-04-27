import React from 'react';
import { View, Text } from 'react-native';

type Tone = 'glass' | 'purple' | 'outline';

const STYLES: Record<Tone, { bg: string; color: string; border: string }> = {
  glass:   { bg: 'rgba(0,0,0,0.55)', color: '#fff', border: 'rgba(255,255,255,0.15)' },
  purple:  { bg: '#7C3AED', color: '#fff', border: 'transparent' },
  outline: { bg: 'transparent', color: '#F1F0FF', border: '#2A2A3D' },
};

interface Props {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  tone?: Tone;
}

export function KaraBadge({ children, icon, label, tone = 'glass' }: Props) {
  const s = STYLES[tone];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 26,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: s.bg,
        borderWidth: 1,
        borderColor: s.border,
        gap: 4,
      }}
    >
      {icon}
      {label ? (
        <Text style={{ color: s.color, fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>
          {label}
        </Text>
      ) : null}
      {children ? (
        typeof children === 'string' ? (
          <Text style={{ color: s.color, fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>
            {children}
          </Text>
        ) : children
      ) : null}
    </View>
  );
}
