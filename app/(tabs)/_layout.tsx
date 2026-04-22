import React from 'react';
import { Tabs } from 'expo-router';
import { Home, UserCircle2 } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopColor: '#e5e7eb',
          backgroundColor: '#ffffff',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        sceneStyle: {
          backgroundColor: '#f9fafb',
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserCircle2 color={color} size={size} strokeWidth={2.1} />,
        }}
      />
    </Tabs>
  );
}