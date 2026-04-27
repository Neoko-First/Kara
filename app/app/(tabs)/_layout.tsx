import { Tabs } from "expo-router";
import { View } from "react-native";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // Fond quasi-noir Kara
          backgroundColor: "#111118",
          borderTopColor: "#1E1E2E",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#9594B5",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      {/* Bouton + central surélevé */}
      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: () => (
            <View className="bg-kara-primary w-12 h-12 rounded-2xl items-center justify-center -mt-4">
              <Plus size={24} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
