import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { KaraPhoto } from '@/components/shared/KaraPhoto';
import { KaraWordmark } from '@/components/shared/KaraWordmark';
import { supabase } from '@/lib/supabase';
import { handleAuthError } from '@/lib/supabase-error';

export default function EmailLoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Toast.show({ type: 'error', text1: 'Remplis tous les champs.' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Le mot de passe doit faire au moins 6 caractères.' });
      return;
    }
    if (mode === 'signup' && password !== confirm) {
      Toast.show({ type: 'error', text1: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) {
          Toast.show({ type: 'error', text1: handleAuthError(error) });
        }
        // En cas de succès : onAuthStateChange dans _layout.tsx redirige vers /(tabs)
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });
        if (error) {
          Toast.show({ type: 'error', text1: handleAuthError(error) });
        } else if (!data.session) {
          // Supabase email confirmation activée — session non créée immédiatement
          Toast.show({
            type: 'success',
            text1: 'Compte créé !',
            text2: 'Vérifie ton email pour confirmer ton compte.',
          });
        }
        // Si data.session existe : onAuthStateChange redirige automatiquement
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <KaraPhoto
        tone="garage-night"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={['rgba(10,10,15,0.5)', 'rgba(10,10,15,0.92)', 'rgba(10,10,15,0.99)']}
        locations={[0, 0.45, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 28,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bouton retour */}
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <ArrowLeft size={20} color="#fff" strokeWidth={1.8} />
        </Pressable>

        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <KaraWordmark size={28} color="#fff" />
        </View>

        {/* Titre */}
        <Text
          style={{
            color: '#fff',
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 24,
            marginBottom: 6,
          }}
        >
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </Text>
        <Text
          style={{
            color: 'rgba(241,240,255,0.6)',
            fontFamily: 'Inter_400Regular',
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          {mode === 'login'
            ? 'Connecte-toi avec ton adresse email.'
            : 'Rejoins la communauté des passionnés.'}
        </Text>

        {/* Champ email */}
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 52,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              paddingHorizontal: 16,
              gap: 10,
            }}
          >
            <Mail size={16} color="rgba(255,255,255,0.45)" strokeWidth={1.5} />
            <TextInput
              style={{
                flex: 1,
                color: '#fff',
                fontFamily: 'Inter_400Regular',
                fontSize: 15,
              }}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </View>
        </View>

        {/* Champ mot de passe */}
        <View style={{ marginBottom: mode === 'signup' ? 14 : 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 52,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              paddingHorizontal: 16,
              gap: 10,
            }}
          >
            <Lock size={16} color="rgba(255,255,255,0.45)" strokeWidth={1.5} />
            <TextInput
              style={{
                flex: 1,
                color: '#fff',
                fontFamily: 'Inter_400Regular',
                fontSize: 15,
              }}
              placeholder="Mot de passe"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </View>
        </View>

        {/* Champ confirmation (signup uniquement) */}
        {mode === 'signup' && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 52,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
                paddingHorizontal: 16,
                gap: 10,
              }}
            >
              <Lock size={16} color="rgba(255,255,255,0.45)" strokeWidth={1.5} />
              <TextInput
                style={{
                  flex: 1,
                  color: '#fff',
                  fontFamily: 'Inter_400Regular',
                  fontSize: 15,
                }}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
              />
            </View>
          </View>
        )}

        {/* Bouton principal */}
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: '#7C3AED',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
            marginBottom: 16,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
              }}
            >
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Text>
          )}
        </Pressable>

        {/* Toggle login / signup */}
        <Pressable
          onPress={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setPassword('');
            setConfirm('');
          }}
          style={{ alignItems: 'center', paddingVertical: 8 }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
            }}
          >
            {mode === 'login' ? "Pas encore de compte ? " : 'Déjà un compte ? '}
            <Text style={{ color: '#A78BFA', fontFamily: 'Inter_600SemiBold' }}>
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
