import React from 'react';
import { Stack } from 'expo-router';
import { AppProviders } from '../src/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: '#f4f1ea',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="activity/[id]" options={{ title: 'Activity Detail' }} />
      </Stack>
    </AppProviders>
  );
}