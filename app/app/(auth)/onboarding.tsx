import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';

const SLIDES: { tone: PhotoTone; label: string; kicker: string; title: string; sub: string }[] = [
  {
    tone: 'cyan-tokyo',
    label: 'NIGHT MEET · TOKYO',
    kicker: 'Communauté',
    title: 'Trouve ta communauté',
    sub: 'Suis les builds, les owners et les meets de ta région. JDM, stance, custom, daily — tout y passe.',
  },
  {
    tone: 'track-magenta',
    label: 'TRACK DAY · DRIFT',
    kicker: 'Échange',
    title: 'Échange avec les passionnés',
    sub: "DM directs, conseils, pièces, spots. Ta tribu motorisée à portée de main.",
  },
  {
    tone: 'amber-stance',
    label: 'EVENTS · MARKETPLACE',
    kicker: 'Bientôt',
    title: 'Events & Marketplace',
    sub: "Billets, annonces, rencontres officielles. Le réseau s'agrandit.",
  },
];

export default function OnboardingScreen() {
  const [slide, setSlide] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const s = SLIDES[slide];

  function handleNext() {
    if (slide < 2) {
      setSlide(slide + 1);
    } else {
      router.push('/(auth)/login');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Background photo */}
      <KaraPhoto
        tone={s.tone}
        label={s.label}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Dark overlay */}
      <LinearGradient
        colors={['rgba(10,10,15,0.4)', 'rgba(10,10,15,0.65)', 'rgba(10,10,15,0.96)']}
        locations={[0, 0.4, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Logo */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 20,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <KaraWordmark size={28} color="#fff" />
      </View>

      {/* Skip */}
      <Pressable
        onPress={() => router.push('/(auth)/login')}
        style={{
          position: 'absolute',
          top: insets.top + 20,
          right: 20,
          zIndex: 5,
          padding: 8,
        }}
      >
        <Text
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'Inter_500Medium',
            fontSize: 14,
          }}
        >
          Passer
        </Text>
      </Pressable>

      {/* Bottom content */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 28,
          paddingBottom: insets.bottom + 50,
          zIndex: 5,
        }}
      >
        <Text
          style={{
            color: '#A78BFA',
            fontFamily: 'Inter_600SemiBold',
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          {String(slide + 1).padStart(2, '0')} — {s.kicker}
        </Text>

        <Text
          style={{
            color: '#fff',
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 42,
            lineHeight: 46,
            marginBottom: 14,
          }}
        >
          {s.title}
        </Text>

        <Text
          style={{
            color: 'rgba(241,240,255,0.75)',
            fontFamily: 'Inter_400Regular',
            fontSize: 15,
            lineHeight: 22,
            marginBottom: 32,
            maxWidth: 320,
          }}
        >
          {s.sub}
        </Text>

        {/* Dots + CTA row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {/* Progress dots */}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  height: 6,
                  width: i === slide ? 22 : 6,
                  borderRadius: 3,
                  backgroundColor:
                    i === slide ? '#7C3AED' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </View>

          <View style={{ flex: 1 }} />

          {slide < 2 ? (
            <Pressable
              onPress={handleNext}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#7C3AED',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <ArrowRight size={24} color="#fff" strokeWidth={2.25} />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              style={{
                height: 56,
                paddingHorizontal: 24,
                borderRadius: 999,
                backgroundColor: '#7C3AED',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Inter_600SemiBold',
                  fontSize: 16,
                }}
              >
                Commencer
              </Text>
              <ArrowRight size={18} color="#fff" strokeWidth={2.25} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
