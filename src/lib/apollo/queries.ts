import { gql } from '@apollo/client';

export const ACTIVITY_AUTHOR_FIELDS = gql`
  fragment ActivityAuthorFields on authors {
    __typename
    id
    name
    avatarUrl
  }
`;

export const ACTIVITY_COMMENT_FIELDS = gql`
  fragment ActivityCommentFields on comments {
    __typename
    id
    text
    createdAt: created_at
    author {
      ...ActivityAuthorFields
    }
  }
  ${ACTIVITY_AUTHOR_FIELDS}
`;

export const ACTIVITY_FIELDS = gql`
  fragment ActivityFields on activities {
    __typename
    id
    title
    body
    bookmarkCount
    createdAt
    author {
      ...ActivityAuthorFields
    }
    commentsCollection(first: 50) {
      edges {
        node {
          ...ActivityCommentFields
        }
      }
    }
  }
  ${ACTIVITY_AUTHOR_FIELDS}
  ${ACTIVITY_COMMENT_FIELDS}
`;

export const FEED_QUERY = gql`
  query Feed($first: Int!, $after: Cursor, $userId: UUID) {
    activitiesCollection(first: $first, after: $after, orderBy: [{ createdAt: DescNullsLast }]) {
      __typename
      edges {
        __typename
        cursor
        node {
          ...ActivityFields
          userBookmarks: bookmarksCollection(filter: { userId: { eq: $userId } }, first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
      pageInfo {
        __typename
        hasNextPage
        endCursor
      }
    }
  }
  ${ACTIVITY_FIELDS}
`;

export const ACTIVITY_QUERY = gql`
  query Activity($id: UUID!, $userId: UUID) {
    activitiesCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          ...ActivityFields
          userBookmarks: bookmarksCollection(filter: { userId: { eq: $userId } }, first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
  ${ACTIVITY_FIELDS}
`;

export const ACTIVITY_BOOKMARK_FRAGMENT = gql`
  fragment ActivityBookmarkFragment on activities {
    __typename
    id
    title
    body
    bookmarkCount
    createdAt
    author {
      ...ActivityAuthorFields
    }
    commentsCollection(first: 50) {
      edges {
        node {
          ...ActivityCommentFields
        }
      }
    }
    userBookmarks: bookmarksCollection(first: 1) {
      edges {
        node {
          id
        }
      }
    }
  }
  ${ACTIVITY_AUTHOR_FIELDS}
  ${ACTIVITY_COMMENT_FIELDS}
`;