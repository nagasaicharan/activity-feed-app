import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { ApolloError } from '@apollo/client';
import tw from '../tw';

interface FeedHeaderProps {
  firstName: string;
  error?: ApolloError;
  onRetry?: () => void;
  contentWidthStyle?: ViewStyle | null;
}

export const FeedHeader = ({
  firstName,
  error,
  onRetry,
  contentWidthStyle,
}: FeedHeaderProps) => (
  <View style={[tw`bg-white px-4 pb-3 pt-4`, contentWidthStyle]}>
    <View style={tw`flex-row items-center justify-between`}>
      <Text style={tw`text-xl font-semibold text-zinc-900`}>Activity</Text>
      <Text style={tw`text-xs text-zinc-500`}>Hi, {firstName}</Text>
    </View>

    {error ? (
      <View style={tw`mt-3 flex-row items-center rounded-xl bg-rose-50 px-3 py-2`}>
        <Text style={tw`flex-1 text-xs text-rose-700`} numberOfLines={2}>
          Could not refresh feed: {error.message}
        </Text>
        {onRetry && (
          <Pressable onPress={onRetry}>
            <Text style={tw`ml-3 text-xs font-semibold text-rose-700`}>Retry</Text>
          </Pressable>
        )}
      </View>
    ) : null}
  </View>
);
