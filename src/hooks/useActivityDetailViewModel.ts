import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { ACTIVITY_QUERY } from '../lib/apollo/queries';
import { ADD_COMMENT_MUTATION } from '../lib/apollo/mutations';
import { ActivityDetail } from '../types/activity';
import {
  ActivityQueryData,
  ActivityQueryVariables,
  AddCommentMutationData,
  AddCommentMutationVariables,
  GqlActivity,
} from '../types/graphql-generated';
import { useAppSelector } from './useRedux';

const mapActivity = (activity: Partial<GqlActivity>): ActivityDetail => ({
  __typename: 'Activity',
  id: activity.id ?? '',
  title: activity.title ?? '',
  body: activity.body ?? '',
  bookmarkCount: Number(activity.bookmarkCount ?? 0),
  isBookmarked: (activity.userBookmarks?.edges?.length ?? 0) > 0,
  createdAt: activity.createdAt ?? new Date(0).toISOString(),
  author: {
    __typename: 'Author',
    id: activity.author?.id ?? '',
    name: activity.author?.name ?? 'Unknown',
    avatarUrl: activity.author?.avatarUrl ?? '',
  },
  comments: (activity.commentsCollection?.edges ?? []).map((edge) => ({
    __typename: 'Comment' as const,
    id: edge?.node?.id ?? '',
    text: edge?.node?.text ?? '',
    createdAt: edge?.node?.createdAt ?? new Date(0).toISOString(),
    author: {
      __typename: 'Author' as const,
      id: edge?.node?.author?.id ?? '',
      name: edge?.node?.author?.name ?? 'Unknown',
      avatarUrl: edge?.node?.author?.avatarUrl ?? '',
    },
  })).filter((comment) => Boolean(comment.id)),
});

export const useActivityDetailViewModel = (id: string | undefined) => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [pendingCommentText, setPendingCommentText] = useState<string | null>(null);

  const [addCommentMutation, { loading: isAddingComment }] = useMutation<
    AddCommentMutationData,
    AddCommentMutationVariables
  >(
    ADD_COMMENT_MUTATION,
  );

  const { data, loading, error, refetch } = useQuery<ActivityQueryData, ActivityQueryVariables>(ACTIVITY_QUERY, {
    variables: { id: id ?? '', userId: currentUser?.id ?? null },
    skip: !id,
  });

  const activityNode = data?.activitiesCollection?.edges?.[0]?.node;
  const activity: ActivityDetail | null = activityNode ? mapActivity(activityNode) : null;

  const mergedComments = useMemo(
    () =>
      [...(activity?.comments ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [activity?.comments],
  );

  const visibleComments = useMemo(
    () => (showAllComments ? mergedComments : mergedComments.slice(0, 1)),
    [mergedComments, showAllComments],
  );

  const handleAddComment = useCallback(async () => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      return;
    }

    if (!currentUser) {
      Alert.alert('Login required', 'Pick a mock user first to post a comment.');
      return;
    }

    if (!id) {
      Alert.alert('Activity missing', 'Could not find activity id to post this comment.');
      return;
    }

    try {
      setPendingCommentText(trimmedComment);
      setCommentText('');
      await addCommentMutation({
        variables: {
          activityId: id,
          authorId: currentUser.id,
          text: trimmedComment,
          createdAt: new Date().toISOString(),
        },
      });
      await refetch({ id, userId: currentUser.id });
    } catch (mutationError) {
      setCommentText(trimmedComment);
      Alert.alert(
        'Comment failed',
        mutationError instanceof Error ? mutationError.message : 'Unable to add comment.',
      );
    } finally {
      setPendingCommentText(null);
    }
  }, [addCommentMutation, commentText, currentUser, id, refetch]);

  return {
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
  };
};
