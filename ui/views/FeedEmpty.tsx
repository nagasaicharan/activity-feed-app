import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import tw from '../tw';

interface FeedEmptyProps {
  contentWidthStyle?: ViewStyle | null;
}

export const FeedEmpty = ({ contentWidthStyle }: FeedEmptyProps) => (
  <View style={[tw`mx-4 mt-4 rounded-2xl bg-white px-5 py-10`, contentWidthStyle]}>
    <Text style={tw`text-center text-sm text-zinc-600`}>No activity yet.</Text>
  </View>
);
