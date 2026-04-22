import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../src/hooks/useRedux';
import { loginAsUser } from '../../src/store/slices/userSlice';
import { Image, Text, UserSelectCard, tw, View, Button } from '@ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const users = useAppSelector(state => state.user.users);
  const firstName = currentUser?.name.split(' ')[0] ?? 'Guest';

  const contentWidthStyle = useMemo(
    () =>
      Platform.OS === 'web'
        ? ({ width: '100%', maxWidth: 760, alignSelf: 'center' } as const)
        : null,
    [],
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <ScrollView
        style={tw`flex-1 bg-zinc-50`}
        contentContainerStyle={tw`pb-8`}
      >
        <View style={[tw`bg-white px-4 pb-4 pt-4`, contentWidthStyle]}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xl font-semibold text-zinc-900`}>Profile</Text>
            <Text style={tw`text-xs text-zinc-500`}>Hi, {firstName}</Text>
          </View>

          <View style={tw`mt-4 rounded-2xl bg-zinc-50 p-4`}>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{ uri: currentUser?.avatarUrl }}
                style={tw`h-12 w-12 rounded-full bg-zinc-200`}
              />
              <View style={tw`ml-3 flex-1`}>
                <Text style={tw`text-[15px] font-semibold text-zinc-900`}>
                  {currentUser?.name ?? 'Guest User'}
                </Text>
                <Text style={tw`text-xs text-zinc-500`}>
                  {currentUser?.email ?? 'No email available'}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={tw`mt-5 text-xs font-semibold uppercase tracking-[1.2px] text-zinc-500`}
          >
            Switch account
          </Text>
          <View style={tw`mt-2`}>
            {users.map(user => {
              const isActive = currentUser?.id === user.id;
              return (
                <UserSelectCard
                  key={user.id}
                  user={user}
                  isActive={isActive}
                  onPress={() => dispatch(loginAsUser(user.id))}
                />
              );
            })}
          </View>

          <Button.Primary
            onPress={() => router.replace('/')}
            title="Go to login"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
