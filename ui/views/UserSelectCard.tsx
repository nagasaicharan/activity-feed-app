import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Image } from '../atoms';
import tw from '../tw';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface UserSelectCardProps {
  user: User;
  isActive: boolean;
  onPress: () => void;
}

export const UserSelectCard: React.FC<UserSelectCardProps> = ({ user, isActive, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        tw`mb-3 flex-row items-center rounded-2xl px-3 py-3`,
        isActive ? tw`bg-primary-50` : tw`bg-white`,
      ]}
    >
      <Image source={{ uri: user.avatarUrl }} style={tw`h-9 w-9 rounded-full bg-zinc-200`} />
      <View style={tw`ml-3 flex-1`}>
        <Text style={tw`text-sm font-semibold text-zinc-900`}>{user.name}</Text>
        <Text style={tw`text-xs text-zinc-500`}>{user.email}</Text>
      </View>
      {isActive ? <Text style={tw`text-xs font-semibold text-primary-700`}>Active</Text> : null}
    </Pressable>
  );
};
