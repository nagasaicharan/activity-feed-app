import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { tw, View } from '@ui';

interface ShimmerBlockProps {
  style?: StyleProp<ViewStyle>;
}

export const ShimmerBlock = ({ style }: ShimmerBlockProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1250,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 220],
  });

  const glowStyle = useMemo(
    () => [
      tw`absolute left-0 top-0 h-full w-20`,
      {
        backgroundColor: 'rgba(255,255,255,0.55)',
        transform: [{ translateX }],
      },
    ],
    [translateX],
  );

  return (
    <View style={[tw`overflow-hidden rounded-xl bg-zinc-200`, style]}>
      <Animated.View style={glowStyle} />
    </View>
  );
};

interface FeedCardSkeletonListProps {
  count?: number;
}

export const FeedCardSkeletonList = ({ count = 3 }: FeedCardSkeletonListProps) => {
  return (
    <View style={tw`px-4 pt-3`}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`feed-skeleton-${index}`} style={tw`mb-4 rounded-2xl bg-white p-4`}>
          <View style={tw`flex-row items-center`}>
            <ShimmerBlock style={tw`h-10 w-10 rounded-full`} />
            <View style={tw`ml-3 flex-1`}>
              <ShimmerBlock style={tw`h-3 w-28`} />
              <ShimmerBlock style={tw`mt-2 h-3 w-20`} />
            </View>
          </View>

          <ShimmerBlock style={tw`mt-4 h-3 w-4/5`} />
          <ShimmerBlock style={tw`mt-2 h-3 w-11/12`} />
          <ShimmerBlock style={tw`mt-3 h-44 w-full rounded-2xl`} />

          <View style={tw`mt-4 flex-row items-center justify-between`}>
            <ShimmerBlock style={tw`h-4 w-24`} />
            <ShimmerBlock style={tw`h-4 w-14`} />
          </View>
        </View>
      ))}
    </View>
  );
};

interface CommentSkeletonListProps {
  count?: number;
}

export const CommentSkeletonList = ({ count = 2 }: CommentSkeletonListProps) => {
  return (
    <View style={tw`mt-3`}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`comment-skeleton-${index}`} style={tw`mb-3 flex-row items-start`}>
          <ShimmerBlock style={tw`h-8 w-8 rounded-full`} />
          <View style={tw`ml-3 flex-1 rounded-2xl bg-zinc-100 p-3`}>
            <ShimmerBlock style={tw`h-3 w-24`} />
            <ShimmerBlock style={tw`mt-2 h-3 w-full`} />
            <ShimmerBlock style={tw`mt-2 h-3 w-2/3`} />
          </View>
        </View>
      ))}
    </View>
  );
};
