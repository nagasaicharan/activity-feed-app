import React, { memo, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
} from 'react-native';
import { BookmarkToggleButton } from './BookmarkToggleButton';
import { ActivitySummary } from '../../../types/activity';
import { formatTimestamp } from '../utils';
import { Image, Text, tw, View } from '@ui';

interface ActivityCardProps {
  activity: ActivitySummary;
  onOpenActivity: (activityId: string) => void;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ActivityCardComponent = ({ activity, onOpenActivity }: ActivityCardProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const latestComments = useMemo(
    () => [...activity.comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [activity.comments],
  );
  const previewComments = useMemo(() => latestComments.slice(0, 1), [latestComments]);

  const handleToggleComments = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCommentsOpen((previous) => !previous);
  };

  return (
    <View style={tw`mb-3 rounded-2xl bg-white px-4 pb-3 pt-3`}>
      <View style={tw`flex-row items-start justify-between`}>
        <View style={tw`mr-3 flex-1 flex-row`}>
          <Image
            source={{ uri: activity.author.avatarUrl }}
            style={tw`h-9 w-9 rounded-full bg-zinc-200`}
          />
          <View style={tw`ml-3 flex-1`}>
            <Text style={tw`text-[15px] font-semibold leading-5 text-zinc-900`}>{activity.author.name}</Text>
            <Text style={tw`mt-[2px] text-xs leading-4 text-zinc-500`}>{formatTimestamp(activity.createdAt)}</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={() => onOpenActivity(activity.id)} style={tw`mt-3`}>
        <Text style={tw`text-[15px] font-semibold leading-5 text-zinc-900`}>{activity.title}</Text>
        <Text style={tw`mt-2 text-sm leading-5 text-zinc-700`}>{activity.body}</Text>
      </Pressable>

      <View style={tw`mt-3 h-[1px] bg-zinc-100`} />

      <View style={tw`mt-2 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Pressable
            accessibilityRole="button"
            onPress={handleToggleComments}
            style={tw`mr-4 flex-row items-center py-2`}
          >
            <Text style={tw`ml-1 text-xs text-primary-800`}>
              {activity.comments.length} comment{activity.comments.length === 1 ? '' : 's'}
            </Text>
          </Pressable>

          <BookmarkToggleButton
            activityId={activity.id}
            bookmarkCount={activity.bookmarkCount}
            compact
            iconOnly
            isBookmarked={activity.isBookmarked}
          />
        </View>
      </View>

      {isCommentsOpen ? (
        <View style={tw`mt-2 rounded-xl bg-zinc-50 px-3 py-2`}>
          {previewComments.length === 0 ? (
            <Text style={tw`text-xs text-zinc-500`}>No comments yet.</Text>
          ) : (
            previewComments.map((comment, index) => (
              <View key={comment.id} style={[tw`mb-2`, index === previewComments.length - 1 ? tw`mb-0` : null]}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-[13px] font-semibold text-zinc-900`}>{comment.author.name}</Text>
                  <Text style={tw`ml-2 text-[12px] text-zinc-500`}>{formatTimestamp(comment.createdAt)}</Text>
                </View>
                <Text style={tw`mt-1 text-[13px] leading-5 text-zinc-700`}>{comment.text}</Text>
              </View>
            ))
          )}

          <Pressable onPress={() => onOpenActivity(activity.id)} style={tw`mt-1 py-1`}>
            <Text style={tw`text-[13px] font-semibold text-primary-700`}>Open full discussion</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export const ActivityCard = memo(ActivityCardComponent);