import React from 'react';
import { ViewStyle } from 'react-native';
import { BookmarkToggleButton } from '../../activity-feed/components/BookmarkToggleButton';
import { ActivityDetail } from '../../../types/activity';
import { formatTimestamp } from '../../activity-feed/utils';
import { Image, Text, tw, View } from '@ui';

interface ActivityDetailHeroProps {
  activity: ActivityDetail;
  contentWidthStyle?: ViewStyle | null;
}

export const ActivityDetailHero = ({ activity, contentWidthStyle }: ActivityDetailHeroProps) => (
  <View style={[tw`mt-3 rounded-3xl border border-zinc-200 bg-white px-4 pb-4 pt-4 shadow-sm`, contentWidthStyle]}>
    <View style={tw`flex-row items-center justify-between`}>
      <View style={tw`flex-1 flex-row items-center pr-4`}>
        <Image source={{ uri: activity.author.avatarUrl }} style={tw`h-9 w-9 rounded-full bg-zinc-200`} />
        <View style={tw`ml-3 flex-1`}>
          <Text style={tw`text-[15px] font-semibold leading-5 text-zinc-900`}>{activity.author.name}</Text>
          <Text style={tw`text-xs text-zinc-500`}>{formatTimestamp(activity.createdAt)}</Text>
        </View>
      </View>
      <BookmarkToggleButton
        activityId={activity.id}
        bookmarkCount={activity.bookmarkCount}
        compact
        iconOnly
        isBookmarked={activity.isBookmarked}
      />
    </View>

    <Text style={tw`mt-3 text-[17px] font-semibold leading-6 text-zinc-900`}>{activity.title}</Text>
    <Text style={tw`mt-2 text-sm leading-6 text-zinc-700`}>{activity.body}</Text>
  </View>
);