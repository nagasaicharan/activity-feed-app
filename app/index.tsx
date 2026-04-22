import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../src/hooks/useRedux';
import { loginAsUser } from '../src/store/slices/userSlice';
import { Button, Image, Text, tw, View } from '@ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.user.users);
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 px-6 pt-10 max-w-6xl mx-auto`}>
        <Text style={tw`text-3xl font-bold text-zinc-900`}>Welcome back</Text>
        <Text style={tw`mt-2 text-sm leading-6 text-zinc-600`}>
          Pick a mock profile to continue. This mimics an Instagram-style quick
          account switch.
        </Text>

        <View style={tw`mt-8`}>
          {users.map(user => {
            const isSelected = currentUser?.id === user.id;
            const userFirstName = user.name.split(' ')[0];

            return (
              <Pressable
                key={user.id}
                onPress={() => dispatch(loginAsUser(user.id))}
                style={[
                  tw`mb-3 flex-row items-center rounded-2xl border px-4 py-3`,
                  isSelected ? tw`border-primary-900 bg-primary-50` : tw`border-zinc-200 bg-white`,
                ]}
              >
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={tw`h-12 w-12 rounded-full bg-zinc-200`}
                />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`text-base font-semibold text-zinc-900`}>
                    {userFirstName}
                  </Text>
                  <Text style={tw`text-xs text-zinc-500`}>{user.email}</Text>
                </View>
                {isSelected ? (
                  <Text style={tw`text-xs font-bold text-primary-600`}>
                    ACTIVE
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <Button.Primary
          onPress={() => router.replace('/(tabs)/feed')}
          title="Continue to Feed"
          style={tw`mt-auto web:mb-8`}
        />
      </View>
    </SafeAreaView>
  );
}
