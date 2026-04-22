import { useQuery } from '@apollo/client/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FEED_QUERY } from '../lib/apollo/queries';
import { ActivitySummary } from '../types/activity';
import { FeedQueryData, FeedQueryVariables, GqlActivity } from '../types/graphql-generated';
import { useAppSelector } from './useRedux';

const PAGE_SIZE = 5;

const mapActivity = (activity: GqlActivity): ActivitySummary => {
  return {
    __typename: 'Activity',
    id: activity.id,
    title: activity.title ?? '',
    body: activity.body ?? '',
    bookmarkCount: Number(activity.bookmarkCount ?? 0),
    isBookmarked: (activity.userBookmarks?.edges?.length ?? 0) > 0,
    createdAt: activity.createdAt,
    author: {
      __typename: 'Author',
      id: activity.author?.id ?? '',
      name: activity.author?.name ?? 'Unknown',
      avatarUrl: activity.author?.avatarUrl ?? '',
    },
  };
};

export const useFeedViewModel = () => {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRequestedCursorRef = useRef<string | null>(null);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const firstName = currentUser?.name.split(' ')[0] ?? 'Guest';

  const { data, loading, error, fetchMore, refetch } = useQuery<FeedQueryData, FeedQueryVariables>(FEED_QUERY, {
    variables: { first: PAGE_SIZE, after: null, userId: currentUser?.id ?? null },
    notifyOnNetworkStatusChange: true,
  });

  const edges = useMemo(
    () =>
      (data?.activitiesCollection.edges ?? []).map((edge) => ({
        cursor: edge.cursor,
        node: mapActivity(edge.node),
      })),
    [data?.activitiesCollection.edges],
  );
  const pageInfo = data?.activitiesCollection.pageInfo;

  const handleEndReached = useCallback(async () => {
    if (!pageInfo?.hasNextPage || isFetchingMore) {
      return;
    }

    // FlatList can fire onEndReached multiple times for the same viewport/cursor.
    // Guard against duplicate fetchMore calls for the same page.
    if (lastRequestedCursorRef.current === pageInfo.endCursor) {
      return;
    }

    setIsFetchingMore(true);
    lastRequestedCursorRef.current = pageInfo.endCursor;
    try {
      await fetchMore({
        variables: { first: PAGE_SIZE, after: pageInfo.endCursor, userId: currentUser?.id ?? null },
      });
    } finally {
      setIsFetchingMore(false);
    }
  }, [currentUser?.id, fetchMore, isFetchingMore, pageInfo?.endCursor, pageInfo?.hasNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    lastRequestedCursorRef.current = null;
    try {
      await refetch({ first: PAGE_SIZE, after: null, userId: currentUser?.id ?? null });
    } finally {
      setIsRefreshing(false);
    }
  }, [currentUser?.id, refetch]);

  return {
    // State
    edges,
    pageInfo,
    loading,
    error,
    isFetchingMore,
    isRefreshing,
    firstName,
    // Handlers
    handleEndReached,
    handleRefresh,
    refetch,
  };
};
