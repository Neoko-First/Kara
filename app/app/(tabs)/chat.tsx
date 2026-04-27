import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Edit, Search, ChevronLeft, Send, Image as ImageIcon } from 'lucide-react-native';
import { KaraPhoto, PhotoTone } from '@/components/shared/KaraPhoto';

const CONVERSATIONS = [
  { id: '1', name: 'aki_drift', vehicle: 'Nissan Silvia S15', tone: 'cyan-tokyo' as PhotoTone, last: "Stp t'as les coords du carrossier ?", time: '14:32', unread: 2, online: true },
  { id: '2', name: 'maxprt_rs', vehicle: 'Audi RS3 8V', tone: 'amber-stance' as PhotoTone, last: 'Yes je viens samedi 100%', time: '12:08', unread: 0, online: false },
  { id: '3', name: 'duc_panigale', vehicle: 'Ducati V4', tone: 'crimson-rwd' as PhotoTone, last: '🔥🔥', time: 'Hier', unread: 1, online: true },
  { id: '4', name: 'flo_e36', vehicle: 'BMW E36 M3', tone: 'violet-dusk' as PhotoTone, last: "Tu peux passer demain ? J'ai une session libre", time: 'Hier', unread: 0, online: false },
  { id: '5', name: 'rotary_kev', vehicle: 'Mazda RX-7 FD', tone: 'crimson-rwd' as PhotoTone, last: 'OK ça marche, à samedi', time: 'Lun.', unread: 0, online: false },
  { id: '6', name: 'b16_lou', vehicle: 'Civic EK9', tone: 'emerald-build' as PhotoTone, last: 'Photo qui claque mec', time: 'Lun.', unread: 0, online: false },
];

type Conversation = (typeof CONVERSATIONS)[0];

const MESSAGES = [
  { from: 'them', text: "Yo, j'ai vu tes photos du build, ça claque", time: '14:20' },
  { from: 'me', text: 'Merci frérot 🙏', time: '14:22' },
  { from: 'them', text: "T'as quoi comme suspension ?", time: '14:23' },
  { from: 'me', text: 'Ohlins DFV + bras BN Sports, le combo est cher mais ça vaut le coup', time: '14:25' },
  { from: 'them', text: "Stp t'as les coords du carrossier ?", time: '14:32' },
];

function ConversationScreen({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-kara-bg">
      <View style={{ height: insets.top }} />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1E1E2E', backgroundColor: '#0A0A0F' }}>
        <Pressable onPress={onBack} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={18} color="#F1F0FF" />
        </Pressable>
        <KaraPhoto tone={conv.tone} style={{ width: 38, height: 38, borderRadius: 19 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }}>@{conv.name}</Text>
          <Text style={{ fontSize: 11, color: '#A78BFA', fontFamily: 'Inter_500Medium', letterSpacing: 0.5 }}>
            {conv.vehicle.toUpperCase()}
          </Text>
        </View>
        <Pressable style={{ height: 32, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#2A2A3D', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#F1F0FF', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>Voir profil</Text>
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 14, gap: 8, paddingBottom: 100 }}
        style={{ flex: 1 }}
      >
        <Text style={{ textAlign: 'center', color: '#5C5B78', fontSize: 11, fontFamily: 'Inter_400Regular', letterSpacing: 1, textTransform: 'uppercase', marginVertical: 8 }}>
          AUJOURD'HUI · 14:20
        </Text>
        {MESSAGES.map((m, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <View style={{
              maxWidth: '78%',
              padding: 12,
              paddingHorizontal: 14,
              borderRadius: m.from === 'me' ? 18 : 18,
              borderBottomRightRadius: m.from === 'me' ? 4 : 18,
              borderBottomLeftRadius: m.from === 'me' ? 18 : 4,
              backgroundColor: m.from === 'me' ? '#7C3AED' : '#111118',
              borderWidth: m.from === 'me' ? 0 : 1,
              borderColor: '#1E1E2E',
            }}>
              <Text style={{ color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 }}>{m.text}</Text>
              <Text style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontFamily: 'Inter_400Regular', color: '#fff' }}>{m.time}</Text>
            </View>
          </View>
        ))}
        {/* Typing indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, paddingHorizontal: 16, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            {[0, 1, 2].map(i => <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5C5B78' }} />)}
          </View>
        </View>
      </ScrollView>

      {/* Composer */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 14, paddingTop: 10, paddingBottom: insets.bottom + 12, backgroundColor: '#0A0A0F', borderTopWidth: 1, borderTopColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' }}>
          <ImageIcon size={18} color="#9594B5" />
        </Pressable>
        <View style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', paddingHorizontal: 16, justifyContent: 'center' }}>
          <Text style={{ color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 14 }}>Écris un message…</Text>
        </View>
        <Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }}>
          <Send size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  if (activeConv) {
    return <ConversationScreen conv={activeConv} onBack={() => setActiveConv(null)} />;
  }

  return (
    <View className="flex-1 bg-kara-bg">
      <View style={{ height: insets.top + 8 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 14 }}>
        <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 30 }}>Messages</Text>
        <Pressable style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', alignItems: 'center', justifyContent: 'center' }}>
          <Edit size={16} color="#F1F0FF" />
        </Pressable>
      </View>
      <View style={{ paddingHorizontal: 18, marginBottom: 16 }}>
        <View style={{ height: 44, borderRadius: 14, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1E1E2E', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
          <Search size={16} color="#9594B5" />
          <Text style={{ color: '#5C5B78', fontFamily: 'Inter_400Regular', fontSize: 13 }}>Filtrer les conversations…</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {CONVERSATIONS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setActiveConv(c)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12 }}
          >
            <View style={{ position: 'relative' }}>
              <KaraPhoto tone={c.tone} style={{ width: 52, height: 52, borderRadius: 26 }} />
              {c.online && (
                <View style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#7C3AED', borderWidth: 2, borderColor: '#0A0A0F' }} />
              )}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#F1F0FF' }} numberOfLines={1}>@{c.name}</Text>
                  <Text style={{ fontSize: 11, color: '#5C5B78', fontFamily: 'Inter_400Regular' }} numberOfLines={1}>· {c.vehicle}</Text>
                </View>
                <Text style={{ fontSize: 11, color: c.unread > 0 ? '#A78BFA' : '#5C5B78', fontFamily: c.unread > 0 ? 'Inter_600SemiBold' : 'Inter_400Regular', flexShrink: 0 }}>
                  {c.time}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 3 }}>
                <Text style={{ fontSize: 13, color: c.unread > 0 ? '#F1F0FF' : '#9594B5', fontFamily: c.unread > 0 ? 'Inter_500Medium' : 'Inter_400Regular', flex: 1 }} numberOfLines={1}>
                  {c.last}
                </Text>
                {c.unread > 0 && (
                  <View style={{ minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>{c.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
