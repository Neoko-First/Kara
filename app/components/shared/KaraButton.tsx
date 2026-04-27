import React from 'react';
import { Pressable, Text, PressableProps, ViewStyle } from 'react-native';

type Variant = 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger' | 'light';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { height: number; paddingH: number; fontSize: number }> = {
  sm: { height: 36, paddingH: 14, fontSize: 13 },
  md: { height: 48, paddingH: 20, fontSize: 15 },
  lg: { height: 56, paddingH: 24, fontSize: 16 },
};

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary:   { bg: '#7C3AED', fg: '#fff', border: 'transparent' },
  outline:   { bg: 'transparent', fg: '#F1F0FF', border: '#7C3AED' },
  secondary: { bg: 'rgba(255,255,255,0.06)', fg: '#F1F0FF', border: 'rgba(255,255,255,0.1)' },
  ghost:     { bg: 'transparent', fg: '#F1F0FF', border: 'transparent' },
  danger:    { bg: '#EF4444', fg: '#fff', border: 'transparent' },
  light:     { bg: '#fff', fg: '#0A0A0F', border: 'transparent' },
};

interface Props extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  style?: ViewStyle;
}

export function KaraButton({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  style,
  ...props
}: Props) {
  const sz = SIZES[size];
  const v = VARIANTS[variant];

  return (
    <Pressable
      {...props}
      style={[
        {
          height: sz.height,
          paddingHorizontal: sz.paddingH,
          width: full ? '100%' : undefined,
          backgroundColor: v.bg,
          borderWidth: 1,
          borderColor: v.border,
          borderRadius: 999,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            color: v.fg,
            fontFamily: 'Inter_600SemiBold',
            fontSize: sz.fontSize,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
