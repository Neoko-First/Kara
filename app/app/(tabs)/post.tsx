import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X, ArrowRight, ChevronLeft, Car, Bike, Truck, Sparkles, Plus, MapPin, Camera,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraTag } from '@/components/shared/KaraTag';
import { usePostStore } from '@/lib/stores/use-post-store';

const STEPS = ['Photos', 'Type & Specs', 'Description', 'Localisation'];

const VEHICLE_TYPES = [
  { id: 'car', label: 'Voiture', Icon: Car },
  { id: 'bike', label: 'Moto', Icon: Bike },
  { id: 'van', label: 'Van', Icon: Truck },
  { id: 'truck', label: 'Camion', Icon: Truck },
  { id: 'classic', label: 'Classic', Icon: Sparkles },
  { id: 'other', label: 'Autre', Icon: Car },
];

function StepPhotos() {
  const photos = usePostStore((s) => s.photos);
  const setPhotos = usePostStore((s) => s.setPhotos);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  async function handlePickPhotos() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Accès à la galerie refusé. Active-le dans les réglages.' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10 - photos.length,
      quality: 1,
    });
    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setPhotos([...photos, ...newUris].slice(0, 10));
    }
  }

  function handleRemove(idx: number) {
    const next = photos.filter((_, i) => i !== idx);
    setPhotos(next);
    setSelectedIdx(null);
  }

  // Long-press sélectionne ; re-tap sur même index désélectionne ; tap sur autre index échange
  function handleLongPress(idx: number) {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      const next = [...photos];
      [next[selectedIdx], next[idx]] = [next[idx], next[selectedIdx]];
      setPhotos(next);
      setSelectedIdx(null);
    }
  }

  if (photos.length === 0) {
    return (
      <Pressable
        onPress={handlePickPhotos}
        style={{
          width: '100%',
          height: 220,
          borderRadius: 18,
          borderWidth: 1.5,
          borderColor: '#2A2A3D',
          borderStyle: 'dashed',
          backgroundColor: '#111118',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <Camera size={32} color="#9594B5" strokeWidth={1.5} />
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#9594B5' }}>
          Ajoute ta première photo
        </Text>
      </Pressable>
    );
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {photos.map((uri, idx) => (
          <Pressable
            key={`${uri}-${idx}`}
            onLongPress={() => handleLongPress(idx)}
            style={[
              idx === 0
                ? { width: '100%', height: 220, borderRadius: 18, overflow: 'hidden' }
                : { width: '47%', height: 100, borderRadius: 14, overflow: 'hidden' },
              selectedIdx === idx ? { borderWidth: 2, borderColor: '#7C3AED' } : {},
            ]}
          >
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {idx === 0 && (
              <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#7C3AED', paddingHorizontal: 10, height: 26, borderRadius: 999, justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>Photo principale</Text>
              </View>
            )}
            <Pressable
              onPress={() => handleRemove(idx)}
              style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} color="#fff" />
            </Pressable>
            {selectedIdx !== null && selectedIdx !== idx && (
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, height: 22, borderRadius: 11, justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Inter_600SemiBold' }}>Tap pour échanger</Text>
              </View>
            )}
          </Pressable>
        ))}
        {photos.length < 10 && (
          <Pressable
            onPress={handlePickPhotos}
            style={{
              width: '47%',
              height: 100,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: '#2A2A3D',
              borderStyle: 'dashed',
              backgroundColor: '#111118',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Plus size={20} color="#9594B5" />
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9594B5' }}>Ajouter</Text>
          </Pressable>
        )}
      </View>
      <Text style={{ color: '#5C5B78', fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 14, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {photos.length} / 10 PHOTOS · LONG-PRESS POUR RÉORDONNER
      </Text>
    </View>
  );
}

function StepSpecs() {
  const [type, setType] = useState('car');
  const fields = [
    { label: 'Marque', value: 'Nissan', placeholder: 'ex. Nissan' },
    { label: 'Modèle', value: 'Silvia S15', placeholder: 'ex. Silvia S15' },
    { label: 'Année', value: '2001', placeholder: '2001' },
    { label: 'Cylindrée', value: '2.0L Turbo', placeholder: '' },
    { label: 'Puissance', value: '280 ch', placeholder: '' },
    { label: 'Plaque (optionnel)', value: '', placeholder: 'Pour le badge pays' },
  ];
  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {VEHICLE_TYPES.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setType(t.id)}
            style={{ width: '30%', height: 78, borderRadius: 14, backgroundColor: type === t.id ? 'rgba(124,58,237,0.15)' : '#111118', borderWidth: 1, borderColor: type === t.id ? '#7C3AED' : '#1E1E2E', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <t.Icon size={22} strokeWidth={1.75} color={type === t.id ? '#A78BFA' : '#F1F0FF'} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: type === t.id ? '#A78BFA' : '#F1F0FF' }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      {fields.map((f) => (
        <View key={f.label} style={{ marginBottom: 14 }}>
          <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{f.label}</Text>
          <View style={{ height: 48, borderRadius: 14, paddingHorizontal: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', justifyContent: 'center' }}>
            <Text style={{ color: f.value ? '#F1F0FF' : '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 14 }}>{f.value || f.placeholder}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function StepDescription() {
  const desc = 'Build daily-track. Suspension Ohlins, échappement Tomei, kit BN Sports. 280ch sur banc.';
  const activeTags = ['#JDM', '#Turbo', '#SR20', '#Drift', '#BNSports'];
  return (
    <View>
      <View style={{ borderRadius: 16, padding: 16, minHeight: 140, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', position: 'relative' }}>
        <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 }}>{desc}</Text>
        <Text style={{ position: 'absolute', bottom: 10, right: 14, color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 10 }}>{desc.length} / 300</Text>
      </View>
      <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Tags</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {activeTags.map((t) => (
          <View key={t} style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(124,58,237,0.18)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.35)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ color: '#A78BFA', fontFamily: 'Inter_500Medium', fontSize: 13 }}>{t}</Text>
            <X size={12} color="#A78BFA" strokeWidth={2} />
          </View>
        ))}
        <Pressable style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#2A2A3D', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 13 }}>+ Ajouter</Text>
        </Pressable>
      </View>
      <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Suggestions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {['#Stance', '#Track', '#Daily', '#OEM+', '#Rotary', '#Akrapovic'].map((t) => <KaraTag key={t}>{t}</KaraTag>)}
      </View>
    </View>
  );
}

function StepLocation() {
  return (
    <View>
      <View style={{ borderRadius: 18, height: 200, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(124,58,237,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#7C3AED', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 12, elevation: 8 }} />
        </View>
        <Text style={{ position: 'absolute', bottom: 12, left: 14, color: '#9594B5', fontFamily: 'Inter_500Medium', fontSize: 10 }}>45.764 N · 4.835 E</Text>
      </View>
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Ville de rattachement</Text>
        <View style={{ height: 48, borderRadius: 14, paddingHorizontal: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} color="#A78BFA" strokeWidth={1.6} />
          <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14 }}>Lyon, 69</Text>
        </View>
      </View>
      <View style={{ marginTop: 18, padding: 16, borderRadius: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }}>Position précise</Text>
          <Text style={{ fontSize: 12, color: '#9594B5', marginTop: 2, fontFamily: 'Inter_400Regular' }}>Visible à 200m près sur la map</Text>
        </View>
        <View style={{ width: 48, height: 28, borderRadius: 999, backgroundColor: '#2A2A3D', padding: 3, justifyContent: 'center' }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' }} />
        </View>
      </View>
      <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 18, marginBottom: 10 }}>Aperçu de la card</Text>
      <View style={{ borderRadius: 18, overflow: 'hidden', height: 180, borderWidth: 1, borderColor: '#1E1E2E', position: 'relative' }}>
        <KaraPhoto tone="cyan-tokyo" label="NISSAN S15 · MIDNIGHT" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, backgroundColor: 'rgba(10,10,15,0.8)' }}>
          <Text style={{ color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18 }}>Nissan Silvia S15</Text>
          <Text style={{ color: '#A78BFA', fontSize: 10, fontFamily: 'Inter_500Medium', letterSpacing: 0.8, marginTop: 2 }}>2001 · 2.0T · 280CH · LYON 69</Text>
        </View>
      </View>
    </View>
  );
}

export default function PostScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const photos = usePostStore((s) => s.photos);

  const isContinueDisabled = step === 0 && photos.length === 0;

  return (
    <View className="flex-1 bg-kara-bg">
      <View style={{ height: insets.top + 8 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} color="#F1F0FF" />
        </Pressable>
        <Text style={{ color: '#9594B5', fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 1 }}>
          {String(step + 1).padStart(2, '0')} / 04
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: '#9594B5', fontFamily: 'Inter_500Medium', fontSize: 13 }}>Brouillon</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 18, gap: 6, marginBottom: 18 }}>
        {STEPS.map((_, i) => (
          <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i <= step ? '#7C3AED' : '#1E1E2E' }} />
        ))}
      </View>
      <View style={{ paddingHorizontal: 18, marginBottom: 12 }}>
        <Text style={{ color: '#A78BFA', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
          Étape {step + 1}
        </Text>
        <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 28, marginBottom: 4 }}>
          {['Ajoute tes photos', 'Type & caractéristiques', 'Décris ton build', 'Où est garé ce véhicule ?'][step]}
        </Text>
        <Text style={{ color: '#9594B5', fontSize: 13, fontFamily: 'Inter_400Regular' }}>
          {[
            'Min. 1 photo, max. 10. La 1ʳᵉ devient la principale.',
            'On utilise ces infos pour suggérer des tags.',
            'Texte libre, 300 caractères max. Ajoute des tags.',
            'On affiche la ville. La position précise reste optionnelle.',
          ][step]}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 120 }} style={{ flex: 1 }}>
        {step === 0 && <StepPhotos />}
        {step === 1 && <StepSpecs />}
        {step === 2 && <StepDescription />}
        {step === 3 && <StepLocation />}
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 18, paddingTop: 14, paddingBottom: insets.bottom + 14, backgroundColor: 'rgba(10,10,15,0.95)', flexDirection: 'row', gap: 10 }}>
        {step > 0 && (
          <Pressable onPress={() => setStep(step - 1)} style={{ height: 52, paddingHorizontal: 22, borderRadius: 999, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ChevronLeft size={18} color="#F1F0FF" />
            <Text style={{ color: '#F1F0FF', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Retour</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => step < 3 ? setStep(step + 1) : router.replace('/(tabs)')}
          disabled={isContinueDisabled}
          style={[
            { flex: 1, height: 52, borderRadius: 999, backgroundColor: '#7C3AED', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
            isContinueDisabled ? { opacity: 0.5 } : {},
          ]}
        >
          <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
            {step === 3 ? 'Publier le build' : 'Continuer'}
          </Text>
          <ArrowRight size={18} color="#fff" strokeWidth={2.25} />
        </Pressable>
      </View>
    </View>
  );
}
