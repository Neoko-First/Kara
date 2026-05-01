import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { KaraAvatar } from '@/components/shared/KaraAvatar';
import { KaraButton } from '@/components/shared/KaraButton';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useProfile } from '@/lib/hooks/use-profile';
import { useUpdateProfile } from '@/lib/hooks/use-update-profile';
import { buildImageUrl } from '@/lib/supabase';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  const { data } = useProfile(userId ?? '');
  const { mutate, isPending } = useUpdateProfile();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setDisplayName(data.profile.display_name ?? '');
    setUsername(data.profile.username ?? '');
    setBio(data.profile.bio ?? '');
    setCity(data.profile.city ?? '');
    setTagsInput((data.profile.tags ?? []).join(', '));
  }, [data]);

  if (!userId) return null;

  const currentAvatarUrl = data?.profile.avatar_url
    ? buildImageUrl(data.profile.avatar_url, { width: 200, quality: 90 })
    : undefined;

  const avatarInitial = (data?.profile.display_name ?? data?.profile.username ?? 'K')[0].toUpperCase();

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as ImagePicker.MediaTypeOptions,
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    mutate({
      displayName: displayName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      city: city.trim(),
      tags,
      avatarUri: avatarUri ?? undefined,
    });
  };

  const inputStyle = {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#1E1E2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    color: '#F1F0FF' as string,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  };

  const labelStyle = {
    color: '#9594B5' as string,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    marginBottom: 8,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0A0A0F' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#1E1E2E',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: 'rgba(17,17,24,0.72)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={20} color="#F1F0FF" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#F1F0FF',
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 17,
            marginRight: 38,
          }}
        >
          Modifier le profil
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sélecteur avatar */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Pressable onPress={handlePickAvatar} style={{ position: 'relative' }}>
            <View style={{ borderRadius: 51, borderWidth: 3, borderColor: '#0A0A0F' }}>
              <KaraAvatar
                uri={avatarUri ?? currentAvatarUrl}
                size={96}
                initial={avatarInitial}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#7C3AED',
                borderWidth: 2,
                borderColor: '#0A0A0F',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={14} color="#fff" />
            </View>
          </Pressable>
          <Text
            style={{
              color: '#9594B5',
              fontSize: 13,
              fontFamily: 'Inter_400Regular',
              marginTop: 10,
            }}
          >
            Modifier la photo
          </Text>
        </View>

        {/* Nom affiché */}
        <View style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>Nom affiché</Text>
          <TextInput
            style={inputStyle}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Ton nom ou pseudo"
            placeholderTextColor="#5C5B78"
          />
        </View>

        {/* @Pseudo */}
        <View style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>@Pseudo</Text>
          <TextInput
            style={inputStyle}
            value={username}
            onChangeText={setUsername}
            placeholder="ton_pseudo"
            placeholderTextColor="#5C5B78"
            autoCapitalize="none"
          />
        </View>

        {/* Bio */}
        <View style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>Bio</Text>
          <TextInput
            style={[inputStyle, { height: 96, paddingTop: 14, textAlignVertical: 'top' }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Quelques mots sur toi..."
            placeholderTextColor="#5C5B78"
            multiline
            maxLength={300}
          />
          <Text
            style={{
              color: '#5C5B78',
              fontSize: 12,
              fontFamily: 'Inter_400Regular',
              marginTop: 6,
              textAlign: 'right',
            }}
          >
            {bio.length}/300
          </Text>
        </View>

        {/* Ville */}
        <View style={{ marginBottom: 20 }}>
          <Text style={labelStyle}>Ville</Text>
          <TextInput
            style={inputStyle}
            value={city}
            onChangeText={setCity}
            placeholder="Paris, Lyon..."
            placeholderTextColor="#5C5B78"
          />
        </View>

        {/* Tags */}
        <View style={{ marginBottom: 32 }}>
          <Text style={labelStyle}>Tags</Text>
          <TextInput
            style={inputStyle}
            value={tagsInput}
            onChangeText={setTagsInput}
            placeholder="jdm, drift, tuning"
            placeholderTextColor="#5C5B78"
            autoCapitalize="none"
          />
          <Text
            style={{
              color: '#5C5B78',
              fontSize: 12,
              fontFamily: 'Inter_400Regular',
              marginTop: 6,
            }}
          >
            Sépare les tags par des virgules
          </Text>
        </View>

        {/* Bouton Enregistrer */}
        <KaraButton
          variant="primary"
          size="lg"
          full
          onPress={handleSave}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 16 }}>
              Enregistrer
            </Text>
          )}
        </KaraButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
