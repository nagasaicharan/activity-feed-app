import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ToastAndroid } from 'react-native';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { Bookmark } from 'lucide-react-native';
import { ACTIVITY_BOOKMARK_FRAGMENT, FEED_QUERY } from '../../../lib/apollo/queries';
import {
  ADD_BOOKMARK_MUTATION,
  REMOVE_BOOKMARK_MUTATION,
} from '../../../lib/apollo/mutations';
import { useAppSelector } from '../../../hooks/useRedux';
import { Text, tw } from '@ui';

interface BookmarkCacheActivity {
  bookmarkCount: number;
  userBookmarks?: {
    edges?: Array<{ node: { id: string } }>;
  };
}

interface BookmarkToggleButtonProps {
  activityId: string;
  bookmarkCount?: number;
  compact?: boolean;
  iconOnly?: boolean;
  isBookmarked?: boolean;
}

const BOOKMARK_FAILURE_MESSAGE = 'Could not update bookmark. Please try again.';
const ASSESSMENT_FAILURE_RATE = 0.2;

export const BookmarkToggleButton = ({
  activityId,
  bookmarkCount,
  compact = false,
  iconOnly = false,
  isBookmarked,
}: BookmarkToggleButtonProps) => {
  const client = useApolloClient();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [addBookmarkMutation] = useMutation(ADD_BOOKMARK_MUTATION);
  const [removeBookmarkMutation] = useMutation(REMOVE_BOOKMARK_MUTATION);
  // Prevent double-tap while in-flight
  const inFlight = useRef(false);
  const [optimisticState, setOptimisticState] = useState<{
    isBookmarked: boolean;
    bookmarkCount: number;
  } | null>(null);

  const displayedIsBookmarked = optimisticState?.isBookmarked ?? Boolean(isBookmarked);
  const displayedBookmarkCount = optimisticState?.bookmarkCount ?? (bookmarkCount ?? 0);

  useEffect(() => {
    if (!optimisticState) {
      return;
    }

    if (
      isBookmarked === optimisticState.isBookmarked
      && (bookmarkCount ?? 0) === optimisticState.bookmarkCount
    ) {
      setOptimisticState(null);
    }
  }, [bookmarkCount, isBookmarked, optimisticState]);

  const notifyFailure = (message: string) => {
    if (Platform.OS === 'android' && typeof ToastAndroid?.show === 'function') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }

    Alert.alert('Bookmark update failed', message);
  };

  const handlePress = () => {
    if (inFlight.current) return;
    if (!currentUser?.id) return;

    const cacheId = client.cache.identify({ __typename: 'activities', id: activityId });
    const previous = cacheId
      ? client.readFragment<BookmarkCacheActivity>({
          id: cacheId,
          fragment: ACTIVITY_BOOKMARK_FRAGMENT,
          fragmentName: 'ActivityBookmarkFragment',
        })
      : null;

    const currentlyBookmarked = (previous?.userBookmarks?.edges?.length ?? 0) > 0 || displayedIsBookmarked;
    const currentBookmarkCount = previous?.bookmarkCount ?? displayedBookmarkCount;
    const nextBookmarkCount = Math.max(0, currentBookmarkCount + (currentlyBookmarked ? -1 : 1));
    const optimisticBookmarkId = `optimistic-${currentUser.id}-${activityId}`;

    setOptimisticState({
      isBookmarked: !currentlyBookmarked,
      bookmarkCount: nextBookmarkCount,
    });

    // Write optimistic fields read by mapped UI (bookmarkCount + userBookmarks)
    if (cacheId && previous) {
      client.writeFragment({
        id: cacheId,
        fragment: ACTIVITY_BOOKMARK_FRAGMENT,
        fragmentName: 'ActivityBookmarkFragment',
        data: {
          ...previous,
          bookmarkCount: nextBookmarkCount,
          userBookmarks: {
            __typename: 'bookmarksConnection',
            edges: currentlyBookmarked
              ? []
              : [
                {
                  __typename: 'bookmarksEdge',
                  node: {
                    __typename: 'bookmarks',
                    id: optimisticBookmarkId,
                  },
                },
              ],
          },
        },
      });
    }

    const rollbackOptimisticState = () => {
      setOptimisticState(null);
      if (cacheId && previous) {
        client.writeFragment({
          id: cacheId,
          fragment: ACTIVITY_BOOKMARK_FRAGMENT,
          fragmentName: 'ActivityBookmarkFragment',
          data: previous,
        });
      }
    };

    inFlight.current = true;

    // keep the assessment-only 20% failure path in code,
    // but prefer mocking this offline with developer tools during demos/debugging
    // rather than treating random client failures as product behavior.
    if (Math.random() < ASSESSMENT_FAILURE_RATE) {
      rollbackOptimisticState();
      notifyFailure(BOOKMARK_FAILURE_MESSAGE);
      inFlight.current = false;
      return;
    }

    const mutationPromise = currentlyBookmarked
      ? removeBookmarkMutation({
          variables: {
            activityId,
            userId: currentUser.id,
            bookmarkCount: nextBookmarkCount,
          },
          optimisticResponse: {
            deleteFrombookmarksCollection: {
              __typename: 'bookmarksDeleteResponse',
              affectedCount: 1,
            },
            updateactivitiesCollection: {
              __typename: 'activitiesUpdateResponse',
              affectedCount: 1,
            },
          },
          refetchQueries: [
            {
              query: FEED_QUERY,
              variables: { first: 5, after: null, userId: currentUser.id },
            },
          ],
        })
      : addBookmarkMutation({
          variables: {
            activityId,
            userId: currentUser.id,
            bookmarkCount: nextBookmarkCount,
            createdAt: new Date().toISOString(),
          },
          optimisticResponse: {
            insertIntobookmarksCollection: {
              __typename: 'bookmarksInsertResponse',
              affectedCount: 1,
            },
            updateactivitiesCollection: {
              __typename: 'activitiesUpdateResponse',
              affectedCount: 1,
            },
          },
          refetchQueries: [
            {
              query: FEED_QUERY,
              variables: { first: 5, after: null, userId: currentUser.id },
            },
          ],
        });

    mutationPromise
      .then((result) => {
        if (result.error) {
          rollbackOptimisticState();
          notifyFailure(BOOKMARK_FAILURE_MESSAGE);
        }
      })
      .catch(() => {
        rollbackOptimisticState();
        notifyFailure(BOOKMARK_FAILURE_MESSAGE);
      })
      .finally(() => {
        inFlight.current = false;
      });
  };

  const compactButtonPaddingClassName = compact ? 'px-2 py-1.5' : 'px-3 py-2';
  const buttonContainerClassName = iconOnly
    ? 'flex-row items-center justify-center rounded-full px-2.5 py-1.5'
    : `${compactButtonPaddingClassName} rounded-full`;
  const buttonBackgroundColor = iconOnly && displayedIsBookmarked
    ? tw.color('primary-100')
    : tw.color('zinc-100');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={iconOnly ? 'Toggle bookmark' : 'Save activity'}
      onPress={handlePress}
      style={[
        tw`${buttonContainerClassName}`,
        {
          backgroundColor: buttonBackgroundColor,
        },
      ]}
    >
      {iconOnly ? (
        <>
          <Bookmark
            size={14}
            color={displayedIsBookmarked ? tw.color('primary-700') : tw.color('zinc-500')}
            strokeWidth={2.2}
          />
          <Text
            style={[
              tw`ml-1 text-[11px] font-semibold`,
              { color: displayedIsBookmarked ? tw.color('primary-700') : tw.color('zinc-500') },
            ]}
          >
            {displayedBookmarkCount}
          </Text>
        </>
      ) : (
        <Text style={tw`${compact ? 'text-xs' : 'text-sm'} font-semibold text-zinc-800`}>
          Save
        </Text>
      )}
    </Pressable>
  );
};