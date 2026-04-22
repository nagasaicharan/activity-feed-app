import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityCard } from '../../src/features/activity-feed/components/ActivityCard';
import {
  FeedCardSkeletonList,
  ShimmerBlock,
} from '../../src/features/activity-feed/components/Shimmer';
import { ActivitySummary } from '../../src/types/activity';
import { useFeedViewModel } from '../../src/hooks/useFeedViewModel';
import { FeedHeader, FeedEmpty, Text, tw, View } from '@ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const router = useRouter();
  const {
    edges,
    pageInfo,
    loading,
    error,
    isFetchingMore,
    isRefreshing,
    firstName,
    handleEndReached,
    handleRefresh,
    refetch,
  } = useFeedViewModel();

  const contentWidthStyle = useMemo(
    () =>
      Platform.OS === 'web'
        ? ({ width: '100%', maxWidth: 760, alignSelf: 'center' } as const)
        : null,
    [],
  );

  const renderItem = useCallback<
    ListRenderItem<{ cursor: string; node: ActivitySummary }>
  >(
    ({ item }) => (
      <View style={[tw`px-4`, contentWidthStyle]}>
        <ActivityCard
          activity={item.node}
          onOpenActivity={activityId => router.push(`/activity/${activityId}`)}
        />
      </View>
    ),
    [contentWidthStyle, router],
  );

  const keyExtractor = useCallback(
    (item: { cursor: string }) => item.cursor,
    [],
  );

  if (loading && edges.length === 0) {
    return (
      <View style={tw`flex-1 bg-zinc-50`}>
        <View style={[tw`bg-white px-4 pb-3 pt-4`, contentWidthStyle]}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xl font-semibold text-zinc-900`}>
              Activity
            </Text>
            <Text style={tw`text-xs text-zinc-500`}>Hi, {firstName}</Text>
          </View>
        </View>
        <FeedCardSkeletonList count={4} />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <FlatList
        style={tw`flex-1 bg-zinc-50`}
        contentContainerStyle={tw`pb-8`}
        data={edges}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#71717a"
            colors={['#71717a']}
            progressBackgroundColor="#ffffff"
          />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        ListHeaderComponent={
          <FeedHeader
            firstName={firstName}
            error={error}
            onRetry={() => refetch()}
            contentWidthStyle={contentWidthStyle}
          />
        }
        ListEmptyComponent={<FeedEmpty contentWidthStyle={contentWidthStyle} />}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={[tw`px-4 py-2`, contentWidthStyle]}>
              <View style={tw`rounded-2xl bg-white p-4`}>
                <ShimmerBlock style={tw`h-4 w-36`} />
                <ShimmerBlock style={tw`mt-3 h-3 w-full`} />
                <ShimmerBlock style={tw`mt-2 h-3 w-5/6`} />
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
