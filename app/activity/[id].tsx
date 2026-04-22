import React, { useMemo } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ActivityDetailHero } from '../../src/features/activity-detail/ui';
import { CommentSkeletonList, FeedCardSkeletonList, ShimmerBlock } from '../../src/features/activity-feed/components/Shimmer';
import { ActivityComment } from '../../src/types/activity';
import { formatTimestamp } from '../../src/features/activity-feed/utils';
import { useActivityDetailViewModel } from '../../src/hooks/useActivityDetailViewModel';
import { Image, Text, tw, View } from '@ui';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    activity,
    loading,
    error,
    commentText,
    showAllComments,
    pendingCommentText,
    isAddingComment,
    mergedComments,
    visibleComments,
    currentUser,
    setCommentText,
    setShowAllComments,
    handleAddComment,
    refetch,
  } = useActivityDetailViewModel(id);

  const contentWidthStyle = useMemo(
    () =>
      Platform.OS === 'web'
        ? ({ width: '100%', maxWidth: 860, alignSelf: 'center' } as const)
        : null,
    [],
  );

  if (loading && !activity) {
    return (
      <View style={tw`flex-1 bg-zinc-50`}>
        <FeedCardSkeletonList count={1} />
        <View style={tw`mx-4 rounded-2xl bg-white px-4 py-4`}>
          <ShimmerBlock style={tw`h-3 w-24`} />
          <CommentSkeletonList count={3} />
        </View>
      </View>
    );
  }

  if (error && !activity) {
    return (
      <View style={tw`flex-1 bg-zinc-50 px-4 pt-6`}>
        <View style={tw`rounded-2xl bg-white px-4 py-5`}>
          <Text style={tw`text-base font-semibold text-zinc-900`}>Activity not available</Text>
          <Text style={tw`mt-2 text-sm text-zinc-600`}>
            {error.message}
          </Text>
          <Pressable onPress={() => refetch({ id })} style={tw`mt-4 self-start rounded-full bg-zinc-900 px-4 py-2`}>
            <Text style={tw`text-xs font-semibold text-white`}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!activity) {
    return null;
  }

  return (
    <ScrollView style={tw`flex-1 bg-zinc-50`} contentContainerStyle={tw`pb-10`}>
      <View style={[tw`px-4`, contentWidthStyle]}>
        <ActivityDetailHero activity={activity} />

        {error ? (
          <View style={tw`mt-3 rounded-xl bg-rose-50 px-3 py-2`}>
            <Text style={tw`text-xs text-rose-700`}>Could not refresh latest comments. Pull to retry.</Text>
          </View>
        ) : null}
      </View>

      <View style={[tw`mt-3 rounded-t-3xl bg-white px-4 pb-5 pt-4`, contentWidthStyle]}>
        <Text style={tw`text-xs font-semibold uppercase tracking-[1.3px] text-zinc-500`}>
          Comments
        </Text>

        <View style={tw`mt-3 flex-row items-center`}>
          <Image
            source={{ uri: currentUser?.avatarUrl }}
            style={tw`h-8 w-8 rounded-full bg-zinc-200`}
          />
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="#71717a"
            style={tw`ml-3 flex-1 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-900`}
          />
          <Pressable disabled={!commentText.trim()} onPress={handleAddComment} style={tw`ml-3`}>
            <Text style={tw`text-sm font-semibold text-primary-700`}>
              {isAddingComment ? 'Commenting' : 'Comment'}
            </Text>
          </Pressable>
        </View>

        {loading && activity ? (
          <View style={tw`mt-3 rounded-xl bg-zinc-100 px-3 py-2`}>
            <ShimmerBlock style={tw`h-3 w-32`} />
          </View>
        ) : null}

        {pendingCommentText ? (
          <View style={tw`mt-3 rounded-2xl bg-zinc-100 p-3`}>
            <View style={tw`flex-row items-center`}>
              <Image source={{ uri: currentUser?.avatarUrl }} style={tw`h-7 w-7 rounded-full bg-zinc-200`} />
              <View style={tw`ml-2 flex-1`}>
                <Text style={tw`text-[13px] font-semibold text-zinc-900`}>{currentUser?.name ?? 'You'}</Text>
                <Text style={tw`text-[12px] text-zinc-500`}>Posting...</Text>
              </View>
            </View>
            <ShimmerBlock style={tw`mt-3 h-3 w-full`} />
            <ShimmerBlock style={tw`mt-2 h-3 w-3/4`} />
          </View>
        ) : null}

        {mergedComments.length === 0 ? (
          <Text style={tw`mt-3 text-sm text-zinc-500`}>No comments yet.</Text>
        ) : (
          visibleComments.map((comment: ActivityComment) => (
            <View key={comment.id} style={tw`mt-3 rounded-2xl bg-zinc-100 p-3`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={{ uri: comment.author.avatarUrl }}
                  style={tw`h-8 w-8 rounded-full bg-zinc-200`}
                />
                <View style={tw`ml-3 flex-1`}>
                  <Text style={tw`text-[14px] font-semibold text-zinc-900`}>
                    {comment.author.name}
                  </Text>
                  <Text style={tw`text-[12px] text-zinc-500`}>
                    {formatTimestamp(comment.createdAt)}
                  </Text>
                </View>
              </View>
              <Text style={tw`mt-2 text-[14px] leading-5 text-zinc-700`}>
                {comment.text}
              </Text>
            </View>
          ))
        )}

        {mergedComments.length > 1 ? (
          <Pressable
            onPress={() => setShowAllComments(!showAllComments)}
            style={tw`mt-3 self-start rounded-full bg-zinc-100 px-3 py-1.5`}
          >
            <Text style={tw`text-xs font-semibold text-zinc-700`}>
              {showAllComments ? 'Show latest only' : `Show older comments (${mergedComments.length - 1})`}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}