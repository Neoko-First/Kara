import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Apple, Mail } from 'lucide-react-native';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.55, fontFamily: 'Inter_600SemiBold', color: '#4285F4' }}>G</Text>
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  function handleAuth() {
    router.replace('/(tabs)');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <KaraPhoto
        tone="garage-night"
        label="GARAGE · BUILD HERO"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <LinearGradient
        colors={['rgba(10,10,15,0.4)', 'rgba(10,10,15,0.85)', 'rgba(10,10,15,0.98)']}
        locations={[0, 0.55, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View
        style={{
          flex: 1,
          padding: 28,
          paddingTop: insets.top + 90,
          paddingBottom: insets.bottom + 50,
          zIndex: 5,
        }}
      >
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <KaraWordmark size={32} color="#fff" />
        </View>

        <Text
          style={{
            color: 'rgba(241,240,255,0.7)',
            textAlign: 'center',
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            marginTop: 12,
          }}
        >
          Le réseau social des passionnés d&apos;auto.
        </Text>

        <View style={{ flex: 1 }} />

        {/* Auth buttons */}
        <View style={{ gap: 10 }}>
          <Pressable
            onPress={handleAuth}
            style={{
              height: 54,
              borderRadius: 16,
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Apple size={20} color="#0a0a0f" />
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
                color: '#0a0a0f',
              }}
            >
              Continuer avec Apple
            </Text>
          </Pressable>

          <Pressable
            onPress={handleAuth}
            style={{
              height: 54,
              borderRadius: 16,
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <GoogleIcon size={20} />
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
                color: '#fff',
              }}
            >
              Continuer avec Google
            </Text>
          </Pressable>

          <Pressable
            onPress={handleAuth}
            style={{
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            <Mail size={16} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
            <Text
              style={{
                fontFamily: 'Inter_500Medium',
                fontSize: 13,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Continuer avec email
            </Text>
          </Pressable>
        </View>

        {/* Footer legal */}
        <Text
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 11,
            fontFamily: 'Inter_400Regular',
            marginTop: 18,
            lineHeight: 16,
          }}
        >
          En continuant, tu acceptes les{' '}
          <Text style={{ color: '#A78BFA' }}>CGU</Text> et la{' '}
          <Text style={{ color: '#A78BFA' }}>politique de confidentialité</Text>.
        </Text>
      </View>
    </View>
  );
}
