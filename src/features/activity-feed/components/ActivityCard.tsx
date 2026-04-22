import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { BookmarkToggleButton } from './BookmarkToggleButton';
import { ActivitySummary } from '../../../types/activity';
import { formatTimestamp, truncateBody } from '../utils';
import { Image, Text, tw, View } from '@ui';

interface ActivityCardProps {
  activity: ActivitySummary;
  onOpenActivity: (activityId: string) => void;
}

const ActivityCardComponent = ({ activity, onOpenActivity }: ActivityCardProps) => {
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
        <Text style={tw`mt-2 text-sm leading-5 text-zinc-700`}>{truncateBody(activity.body)}</Text>
      </Pressable>

      <View style={tw`mt-3 h-[1px] bg-zinc-100`} />

      <View style={tw`mt-2 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onOpenActivity(activity.id)}
            style={tw`mr-4 flex-row items-center py-2`}
          >
            <Text style={tw`ml-1 text-xs font-semibold text-primary-800`}>View discussion</Text>
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
    </View>
  );
};

export const ActivityCard = memo(ActivityCardComponent);