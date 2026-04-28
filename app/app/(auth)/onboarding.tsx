import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';
import { KaraButton } from '@/components/shared/KaraButton';

const SLIDES: { title: string; subtitle: string; tone: PhotoTone }[] = [
  {
    title: 'Trouve ta communauté',
    subtitle: 'Des milliers de passionnés partagent leurs builds chaque jour.',
    tone: 'violet-dusk',
  },
  {
    title: 'Échange avec les passionnés',
    subtitle: 'Commente, like, et envoie des messages directement.',
    tone: 'track-magenta',
  },
  {
    title: 'Events & Marketplace',
    subtitle: 'Retrouve des événements près de toi et achète les pièces de tes rêves.',
    tone: 'amber-stance',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = () => {
    const next = activeIndex + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setActiveIndex(next);
  };

  const goToLogin = () => router.replace('/(auth)/login');

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      >
        {SLIDES.map((slide, i) => (
          <KaraPhoto
            key={i}
            tone={slide.tone}
            style={{ width, flex: 1 }}
          >
            {/* Wordmark haut gauche */}
            <View
              style={{
                position: 'absolute',
                top: insets.top + 16,
                left: 24,
              }}
            >
              <KaraWordmark size={24} color="#fff" />
            </View>

            {/* Contenu bas de slide */}
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: 32,
                paddingBottom: insets.bottom + 140,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'SpaceGrotesk_700Bold',
                  fontSize: 36,
                  lineHeight: 42,
                  marginBottom: 16,
                }}
              >
                {slide.title}
              </Text>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'Inter_400Regular',
                  fontSize: 17,
                  lineHeight: 26,
                }}
              >
                {slide.subtitle}
              </Text>
            </View>
          </KaraPhoto>
        ))}
      </ScrollView>

      {/* "Passer" en overlay absolu (hors ScrollView — évite la duplication pendant le scroll) */}
      {activeIndex < 2 && (
        <Pressable
          onPress={goToLogin}
          style={{
            position: 'absolute',
            top: insets.top + 20,
            right: 24,
            zIndex: 10,
            padding: 4,
          }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'Inter_500Medium',
              fontSize: 15,
            }}
          >
            Passer
          </Text>
        </Pressable>
      )}

      {/* Footer fixe — dots + bouton action */}
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + 32,
          left: 0,
          right: 0,
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Dots indicateurs */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i === activeIndex ? '#7C3AED' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </View>

        {/* Flèche → sur slides 1–2, "Commencer" sur slide 3 */}
        {activeIndex < 2 ? (
          <Pressable
            onPress={goToNext}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#7C3AED',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <ChevronRight size={24} color="#fff" strokeWidth={2.5} />
          </Pressable>
        ) : (
          <KaraButton
            variant="primary"
            size="lg"
            onPress={goToLogin}
            style={{ paddingHorizontal: 48 }}
          >
            Commencer
          </KaraButton>
        )}
      </View>
    </View>
  );
}
