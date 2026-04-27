import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type PhotoTone =
  | 'violet-dusk'
  | 'garage-night'
  | 'track-magenta'
  | 'amber-stance'
  | 'cyan-tokyo'
  | 'crimson-rwd'
  | 'emerald-build';

const TONE_COLORS: Record<PhotoTone, readonly [string, string, ...string[]]> = {
  'violet-dusk':   ['#A78BFA33', '#7C3AED66', '#2a1858', '#0a0a0f'],
  'garage-night':  ['#7C3AED22', '#1a1830', '#06060a'],
  'track-magenta': ['#EC489966', '#7C3AED55', '#1f0d2e', '#0a0a0f'],
  'amber-stance':  ['#F59E0B44', '#7C3AED44', '#1a1428', '#050505'],
  'cyan-tokyo':    ['#22D3EE44', '#7C3AED66', '#0d1a2e', '#0a0a0f'],
  'crimson-rwd':   ['#DC262677', '#2a0a14', '#0a0a0f'],
  'emerald-build': ['#10B98144', '#7C3AED44', '#0d1a14', '#0a0a0f'],
};

interface Props {
  tone?: PhotoTone;
  label?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function KaraPhoto({ tone = 'violet-dusk', label, style, children }: Props) {
  const colors = TONE_COLORS[tone] as readonly [string, string, ...string[]];
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[{ overflow: 'hidden' }, style]}
    >
      {label && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 9,
              letterSpacing: 2,
              fontFamily: 'Inter_500Medium',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Text>
        </View>
      )}
      {children}
    </LinearGradient>
  );
}
