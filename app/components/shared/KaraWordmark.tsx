import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

function SteeringWheel({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2.25" />
      <Circle cx="12" cy="12" r="2.5" fill="#fff" />
      <Path d="M12 4.5v5M3 12h6M21 12h-6M12 14.5v5" stroke="#fff" strokeWidth="2.25" strokeLinecap="round" />
    </Svg>
  );
}

export function KaraWordmark({ size = 28, color = '#fff' }: Props) {
  const logoSize = size * 0.95;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.25 }}>
      <View
        style={{
          width: logoSize,
          height: logoSize,
          borderRadius: logoSize * 0.28,
          backgroundColor: '#7C3AED',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <SteeringWheel size={logoSize * 0.62} />
      </View>
      <Text
        style={{
          color,
          fontFamily: 'SpaceGrotesk_700Bold',
          fontSize: size,
          letterSpacing: -0.04 * size,
        }}
      >
        kara
      </Text>
    </View>
  );
}
