import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export default function AuthCallbackScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (!code) {
      router.replace('/(auth)/login');
      return;
    }

    supabase.auth.exchangeCodeForSession(String(code)).then(({ data, error }) => {
      if (error || !data.session) {
        Toast.show({ type: 'error', text1: 'Connexion échouée. Réessaie.' });
        router.replace('/(auth)/login');
        return;
      }
      setSession(data.session);
      // Le routing guard dans _layout.tsx redirige vers /(tabs) automatiquement
    });
  }, [code]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0A0A0F',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );
}
