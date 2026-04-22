import { gql } from '@apollo/client';

export const ADD_COMMENT_MUTATION = gql`
  mutation AddComment($activityId: UUID!, $authorId: UUID!, $text: String!, $createdAt: Datetime!) {
    insertIntocommentsCollection(
      objects: [{ activityId: $activityId, authorId: $authorId, text: $text, created_at: $createdAt }]
    ) {
      affectedCount
    }
  }
`;

export const ADD_BOOKMARK_MUTATION = gql`
  mutation AddBookmark($activityId: UUID!, $userId: UUID!, $bookmarkCount: BigInt!, $createdAt: Datetime!) {
    insertIntobookmarksCollection(objects: [{ activityId: $activityId, userId: $userId, createdAt: $createdAt }]) {
      affectedCount
    }
    updateactivitiesCollection(
      set: { bookmarkCount: $bookmarkCount }
      filter: { id: { eq: $activityId } }
      atMost: 1
    ) {
      affectedCount
    }
  }
`;

export const REMOVE_BOOKMARK_MUTATION = gql`
  mutation RemoveBookmark($activityId: UUID!, $userId: UUID!, $bookmarkCount: BigInt!) {
    deleteFrombookmarksCollection(
      filter: { activityId: { eq: $activityId }, userId: { eq: $userId } }
      atMost: 1
    ) {
      affectedCount
    }
    updateactivitiesCollection(
      set: { bookmarkCount: $bookmarkCount }
      filter: { id: { eq: $activityId } }
      atMost: 1
    ) {
      affectedCount
    }
  }
`;