import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Switch, StyleSheet } from 'react-native';
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
import { useCreateVehicle } from '@/lib/hooks/use-create-vehicle';

const STEPS = ['Photos', 'Type & Specs', 'Description', 'Localisation'];

const VEHICLE_TYPES = [
  { id: 'car', label: 'Voiture', Icon: Car },
  { id: 'bike', label: 'Moto', Icon: Bike },
  { id: 'van', label: 'Van', Icon: Truck },
  { id: 'truck', label: 'Camion', Icon: Truck },
  { id: 'classic', label: 'Classic', Icon: Sparkles },
  { id: 'velo', label: 'Vélo', Icon: Bike },
];

const TAG_SUGGESTIONS_BY_TYPE: Record<string, string[]> = {
  car:     ['#JDM', '#Stance', '#Tuning', '#Track', '#Daily', '#Modified', '#OEM+'],
  bike:    ['#Moto', '#Scrambler', '#Café', '#Touring', '#Enduro', '#Supermot'],
  van:     ['#Vanlife', '#Camping', '#RoadTrip', '#Conversion', '#DIY'],
  truck:   ['#Pickup', '#4x4', '#OffRoad', '#Lifted', '#Utilitaire'],
  velo:    ['#Cycling', '#Gravel', '#MTB', '#Fixie', '#Vintage', '#Bikepacking'],
  classic: ['#Classic', '#Vintage', '#Oldtimer', '#Restauration', '#Patine'],
};

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
  const type            = usePostStore((s) => s.type);
  const setType         = usePostStore((s) => s.setType);
  const brand           = usePostStore((s) => s.brand);
  const setBrand        = usePostStore((s) => s.setBrand);
  const model           = usePostStore((s) => s.model);
  const setModel        = usePostStore((s) => s.setModel);
  const year            = usePostStore((s) => s.year);
  const setYear         = usePostStore((s) => s.setYear);
  const displacement    = usePostStore((s) => s.displacement);
  const setDisplacement = usePostStore((s) => s.setDisplacement);
  const power           = usePostStore((s) => s.power);
  const setPower        = usePostStore((s) => s.setPower);

  const inputStyle = { height: 48, borderRadius: 14, paddingHorizontal: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14 } as const;
  const labelStyle = { color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 } as const;

  return (
    <View>
      {/* Grille 2×3 types de véhicule */}
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
      {/* Champs specs connectés au store */}
      <View style={{ marginBottom: 14 }}>
        <Text style={labelStyle}>Marque</Text>
        <TextInput value={brand} onChangeText={setBrand} placeholder="ex. Nissan" placeholderTextColor="#5C5B78" style={inputStyle} />
      </View>
      <View style={{ marginBottom: 14 }}>
        <Text style={labelStyle}>Modèle</Text>
        <TextInput value={model} onChangeText={setModel} placeholder="ex. Silvia S15" placeholderTextColor="#5C5B78" style={inputStyle} />
      </View>
      <View style={{ marginBottom: 14 }}>
        <Text style={labelStyle}>Année</Text>
        <TextInput
          value={year !== null ? String(year) : ''}
          onChangeText={(text) => setYear(text.trim() ? parseInt(text, 10) : null)}
          placeholder="2001"
          placeholderTextColor="#5C5B78"
          keyboardType="numeric"
          maxLength={4}
          style={inputStyle}
        />
      </View>
      <View style={{ marginBottom: 14 }}>
        <Text style={labelStyle}>Cylindrée</Text>
        <TextInput value={displacement} onChangeText={setDisplacement} placeholder="ex. 2.0L Turbo" placeholderTextColor="#5C5B78" style={inputStyle} />
      </View>
      <View style={{ marginBottom: 24 }}>
        <Text style={labelStyle}>Puissance</Text>
        <TextInput
          value={power !== null ? String(power) : ''}
          onChangeText={(text) => setPower(text.trim() ? parseInt(text, 10) : null)}
          placeholder="ex. 280"
          placeholderTextColor="#5C5B78"
          keyboardType="numeric"
          style={inputStyle}
        />
      </View>
      {/* Suggestions de tags basées sur le type — visuel uniquement */}
      <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Suggestions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {(TAG_SUGGESTIONS_BY_TYPE[type] ?? []).map((tag) => <KaraTag key={tag}>{tag}</KaraTag>)}
      </View>
    </View>
  );
}

function StepDescription() {
  const description    = usePostStore((s) => s.description);
  const setDescription = usePostStore((s) => s.setDescription);
  const tags           = usePostStore((s) => s.tags);
  const addTag         = usePostStore((s) => s.addTag);
  const removeTag      = usePostStore((s) => s.removeTag);
  const type           = usePostStore((s) => s.type);
  const [tagInput, setTagInput] = useState('');

  const suggestions = (TAG_SUGGESTIONS_BY_TYPE[type] ?? []).filter((t) => !tags.includes(t));

  function handleAddTag() {
    const normalized = '#' + tagInput.replace(/^#/, '').trim();
    if (normalized !== '#') addTag(normalized);
    setTagInput('');
  }

  return (
    <View>
      {/* Textarea description avec compteur */}
      <View style={{ borderRadius: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', position: 'relative' }}>
        <TextInput
          value={description}
          onChangeText={(t) => setDescription(t.slice(0, 300))}
          multiline
          maxLength={300}
          placeholder="Décris ton build..."
          placeholderTextColor="#5C5B78"
          style={{ color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, padding: 16, minHeight: 120, textAlignVertical: 'top' }}
        />
        <Text style={{ position: 'absolute', bottom: 10, right: 14, color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 10 }}>{description.length} / 300</Text>
      </View>
      {/* Tags actifs avec bouton × pour supprimer */}
      <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Tags</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {tags.map((t) => (
          <Pressable
            key={t}
            onPress={() => removeTag(t)}
            style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(124,58,237,0.18)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.35)', flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Text style={{ color: '#A78BFA', fontFamily: 'Inter_500Medium', fontSize: 13 }}>{t}</Text>
            <X size={12} color="#A78BFA" strokeWidth={2} />
          </Pressable>
        ))}
        {/* Saisie libre */}
        <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#2A2A3D', borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={handleAddTag}
            returnKeyType="done"
            placeholder="+ Ajouter"
            placeholderTextColor="#5C5B78"
            style={{ color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 13, minWidth: 60 }}
          />
        </View>
      </View>
      {/* Suggestions filtrées — masquées si liste vide */}
      {suggestions.length > 0 && (
        <>
          <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 22, marginBottom: 10 }}>Suggestions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.map((t) => (
              <Pressable key={t} onPress={() => addTag(t)}>
                <KaraTag>{t}</KaraTag>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function StepLocation() {
  const city       = usePostStore((s) => s.city);
  const setCity    = usePostStore((s) => s.setCity);
  const precise    = usePostStore((s) => s.precise);
  const setPrecise = usePostStore((s) => s.setPrecise);
  const photos     = usePostStore((s) => s.photos);
  const brand      = usePostStore((s) => s.brand);
  const model      = usePostStore((s) => s.model);

  const vehicleName = brand && model ? `${brand} ${model}` : 'Nissan Silvia S15';

  return (
    <View>
      {/* Carte visuelle statique */}
      <View style={{ borderRadius: 18, height: 200, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(124,58,237,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#7C3AED', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 12, elevation: 8 }} />
        </View>
        <Text style={{ position: 'absolute', bottom: 12, left: 14, color: '#9594B5', fontFamily: 'Inter_500Medium', fontSize: 10 }}>45.764 N · 4.835 E</Text>
      </View>
      {/* Champ Ville de rattachement */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Ville de rattachement</Text>
        <View style={{ height: 48, borderRadius: 14, paddingHorizontal: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} color="#A78BFA" strokeWidth={1.6} />
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Lyon, 69"
            placeholderTextColor="#5C5B78"
            style={{ flex: 1, color: '#F1F0FF', fontFamily: 'Inter_400Regular', fontSize: 14 }}
          />
        </View>
      </View>
      {/* Toggle Position précise */}
      <View style={{ marginTop: 18, padding: 16, borderRadius: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }}>Position précise</Text>
          <Text style={{ fontSize: 12, color: '#9594B5', marginTop: 2, fontFamily: 'Inter_400Regular' }}>Visible à 200m près sur la map</Text>
        </View>
        <Switch
          value={precise}
          onValueChange={setPrecise}
          thumbColor={precise ? '#7C3AED' : '#fff'}
          trackColor={{ false: '#2A2A3D', true: 'rgba(124,58,237,0.4)' }}
        />
      </View>
      {/* Aperçu card — photo réelle si dispo, sinon placeholder */}
      <Text style={{ color: '#9594B5', fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 18, marginBottom: 10 }}>Aperçu de la card</Text>
      <View style={{ borderRadius: 18, overflow: 'hidden', height: 180, borderWidth: 1, borderColor: '#1E1E2E', position: 'relative' }}>
        {photos[0] ? (
          <Image source={{ uri: photos[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <KaraPhoto tone="cyan-tokyo" label="NISSAN S15 · MIDNIGHT" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        )}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, backgroundColor: 'rgba(10,10,15,0.8)' }}>
          <Text style={{ color: '#fff', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18 }}>{vehicleName}</Text>
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
  const { mutate: createVehicle, isPending, uploadProgress } = useCreateVehicle();

  const isContinueDisabled = (step === 0 && photos.length === 0) || isPending;

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
          onPress={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              const store = usePostStore.getState();
              createVehicle({
                photos: store.photos,
                type: store.type,
                brand: store.brand,
                model: store.model,
                year: store.year,
                displacement: store.displacement,
                power: store.power,
                description: store.description,
                tags: store.tags,
                city: store.city,
                precise: store.precise,
              });
            }
          }}
          disabled={isContinueDisabled}
          style={[
            { flex: 1, height: 52, borderRadius: 999, backgroundColor: '#7C3AED', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
            isContinueDisabled ? { opacity: 0.5 } : {},
          ]}
        >
          <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>
            {step === 3 && isPending
              ? `${uploadProgress + 1} / ${photos.length} photos uploadées...`
              : step === 3 ? 'Publier le build' : 'Continuer'}
          </Text>
          {!(step === 3 && isPending) && <ArrowRight size={18} color="#fff" strokeWidth={2.25} />}
        </Pressable>
      </View>
    </View>
  );
}
