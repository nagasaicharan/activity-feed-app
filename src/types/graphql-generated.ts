export type UUID = string;
export type Cursor = string;
export type Datetime = string;

export interface GqlAuthor {
  __typename?: 'authors';
  id: UUID;
  name: string | null;
  avatarUrl: string | null;
}

export interface GqlComment {
  __typename?: 'comments';
  id: UUID;
  text: string | null;
  createdAt: Datetime;
  author: GqlAuthor | null;
}

export interface GqlBookmarkEdgeNode {
  id: UUID;
}

export interface GqlActivity {
  __typename?: 'activities';
  id: UUID;
  title: string | null;
  body: string | null;
  bookmarkCount: number | string | null;
  createdAt: Datetime;
  author: GqlAuthor | null;
  commentsCollection?: {
    edges?: Array<{ node: GqlComment }>;
  } | null;
  userBookmarks?: {
    edges?: Array<{ node: GqlBookmarkEdgeNode }>;
  } | null;
}

export interface FeedQueryData {
  activitiesCollection: {
    edges: Array<{ cursor: Cursor; node: GqlActivity }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: Cursor | null;
    };
  };
}

export interface FeedQueryVariables {
  first: number;
  after: Cursor | null;
  userId: UUID | null;
}

export interface ActivityQueryData {
  activitiesCollection: {
    edges: Array<{ node: GqlActivity }>;
  };
}

export interface ActivityQueryVariables {
  id: UUID;
  userId: UUID | null;
}

export interface AddCommentMutationData {
  insertIntocommentsCollection: {
    affectedCount: number;
  };
}

export interface AddCommentMutationVariables {
  activityId: UUID;
  authorId: UUID;
  text: string;
  createdAt: Datetime;
}
