export interface ActivityAuthor {
  __typename: 'Author';
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ActivityComment {
  __typename: 'Comment';
  id: string;
  author: ActivityAuthor;
  text: string;
  createdAt: string;
}

interface ActivityBase {
  __typename: 'Activity';
  id: string;
  title: string;
  body: string;
  author: ActivityAuthor;
  bookmarkCount: number;
  isBookmarked: boolean;
  createdAt: string;
}

export interface ActivitySummary extends ActivityBase {}

export interface ActivityDetail extends ActivityBase {
  comments: ActivityComment[];
}

export interface FeedEdge {
  __typename: 'FeedEdge';
  cursor: string;
  node: ActivitySummary;
}

export interface FeedConnection {
  __typename: 'FeedConnection';
  edges: FeedEdge[];
  pageInfo: {
    __typename: 'PageInfo';
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export interface ToggleBookmarkPayload {
  __typename: 'ToggleBookmarkPayload';
  activity: ActivityDetail | null;
  error: string | null;
}

export interface AddCommentPayload {
  __typename: 'AddCommentPayload';
  activity: ActivityDetail | null;
  error: string | null;
}
