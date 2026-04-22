Staff Frontend Engineer 
Take-Home Assignment 
Time Limit: 48 hours from receipt 
AI Usage: Permitted and encouraged — see AI Policy below 
Target Platforms: Web + iOS/Android (single Expo codebase) 
Overview 
Build a cross-platform Activity Feed application using Expo (web + native) that consumes a GraphQL API. The app should display a paginated feed of activity items, allow users to navigate to a detail view, and support an optimistic “bookmark” action. 
A GraphQL schema and seed data are provided. You are responsible for setting up the mock layer — there is no backend to run. 
Requirements 
Core (Must Have) 
1. Feed Screen 
Display a paginated list of activity items from the provided GraphQL API. Each item should show: author name, avatar, title, timestamp, and bookmark count. Implement cursor-based infinite scroll (the API uses Relay-style pagination). Show appropriate loading and empty states. 
2. Detail Screen 
Tapping/clicking a feed item navigates to a detail view. Display the full activity content, author info, and a list of comments. Use stack-based navigation that works on both web and native. 
3. Bookmark Action 
Each activity item has a “bookmark” toggle (on feed and detail screens). Bookmarking must use an optimistic UI update — the UI reflects the change immediately, rolling back on failure. Your mock API should randomly fail ~20% of the time so you can demonstrate rollback behavior. 
4. Cross-Platform 
The app must run on web and at least one native platform (iOS or Android) from the same Expo codebase. You do not need to achieve pixel-perfect parity, but the experience should be appropriate for each platform. 
Stretch (Nice to Have)
Do not prioritize these over core quality: filter/search on the feed screen, pull-to-refresh on native, animated transitions or micro-interactions, accessibility considerations (semantic roles, screen reader labels), unit or integration tests for a critical path (e.g., optimistic update + rollback). 
Technical Constraints 
Area 
Requirement
Framework 
Expo SDK 54+ (managed workflow)
Routing 
Expo Router
GraphQL Client 
Your choice — justify in your ADR
Styling 
Your choice — justify in your ADR
State Management 
Your choice — justify in your ADR
Language 
TypeScript (strict mode preferred)
API Mocking 
Your choice (e.g., MSW, local resolver, etc.)



Provided Schema & Seed Data 
The provided materials include: 
schema.graphql — The full GraphQL schema your app should consume. 
seed-data.json — 15 activity items with authors, comments, and bookmark states. Use this to populate your mock layer. 
You are responsible for setting up the mock API layer. Use MSW, a local GraphQL server, hand-written resolvers, or whatever approach you prefer — just make sure your app works with npx expo start and doesn’t require us to run a separate backend process. Document your approach in the ADR. 
Schema Highlights 
type Query { 
 feed(first: Int!, after: String): FeedConnection! 
 activity(id: ID!): Activity 
} 
type Mutation { 
 toggleBookmark(activityId: ID!): ToggleBookmarkPayload! 
} 
Key things to note:
Pagination follows the Relay connection spec (edges, node, cursor, pageInfo). 
toggleBookmark should randomly fail ~20% of the time in your mock, returning an error string on the payload. This is how we’ll evaluate your optimistic UI and rollback handling. 
The feed query should return a truncated body (preview). The activity query returns the full body and comments. 
Full Schema 
type FeedConnection { 
 edges: [FeedEdge!]! 
 pageInfo: PageInfo! 
} 
type FeedEdge { 
 cursor: String! 
 node: Activity! 
} 
type PageInfo { 
 hasNextPage: Boolean! 
 endCursor: String 
} 
type Activity { 
 id: ID! 
 title: String! 
 body: String! 
 author: Author! 
 comments: [Comment!]! 
 bookmarkCount: Int! 
 isBookmarked: Boolean! 
 createdAt: String! 
} 
type Author { 
 id: ID! 
 name: String! 
 avatarUrl: String! 
} 
type Comment { 
 id: ID! 
 author: Author! 
 text: String! 
 createdAt: String! 
} 
type ToggleBookmarkPayload { 
 activity: Activity 
 error: String 
}
Deliverables 
1. Working application — a repository or zip that we can run with npx expo start. 
2. Architecture Decision Record (ADR) — a markdown file (ADR.md) in the project root covering: key architectural decisions and their rationale, trade-offs you considered, what you would do differently with more time, and how you used AI during this project. 
3. Setup instructions — a README.md with clear steps to run the app on web and native. 
AI Policy 
We expect you to use AI tools (Copilot, ChatGPT, Claude, etc.) during this assignment. AI fluency is part of the role. 
Do use AI for: boilerplate, scaffolding, exploring API options, generating mock data, debugging, writing tests. 
What we’re evaluating: your ability to direct AI effectively, catch its mistakes, and make the final architectural and UX decisions yourself. 
In your ADR: be transparent about which parts AI helped with and where you had to override, correct, or rethink its output. This is a positive signal, not a penalty. 
We will be unimpressed by projects that are clearly AI-generated end-to-end with no evidence of human judgment, editorial review, or architectural intention. 
Evaluation Criteria 
Dimension 
What We’re Looking For
Architecture 
Clean separation of concerns, thoughtful project structure, scalable patterns.
GraphQL Integration 
Proper use of cursor-based pagination, cache management, optimistic updates with rollback.
Cross-Platform Quality 
Platform-appropriate UX from a shared codebase; evidence of understanding web vs. native trade-offs.
Code Quality 
Readable TypeScript, consistent patterns, appropriate abstractions (not over-engineered).
Production Mindset 
Error handling, loading states, edge cases, accessibility basics.



ADR Quality Clear reasoning, honest trade-off analysis, evidence of Staff-level systems thinking.
We value depth over breadth. A polished core experience with a thoughtful ADR is better than a feature-complete but shallow submission. 
Questions? 
If anything is ambiguous, make a reasonable assumption and document it in your ADR. This is intentional — we want to see how you handle ambiguity. 
Good luck, and have fun with it.
