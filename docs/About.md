# Activity Feed App Architecture

## Important Packages Used

The following packages are the most important building blocks in the current app:

- `expo` (`^54.0.33`): runtime, bundling, and cross-platform project tooling.
- `react-native` (`0.81.5`) and `react` (`19.1.0`): core UI runtime.
- `expo-router` (`^6.0.13`): file-based routing for web and native.
- `@apollo/client` (`^4.1.7`) and `graphql` (`^16.13.2`): GraphQL queries, mutations, and normalized caching.
- `@reduxjs/toolkit` (`^2.11.2`) and `react-redux` (`^9.2.0`): local app state management and typed store access.
- `twrnc` (`^4.16.0`): Tailwind-style utility classes for React Native styles.
- `react-native-safe-area-context` (`^5.6.2`): safe insets support across devices.
- `react-native-reanimated` (`^4.1.7`) and `react-native-gesture-handler` (`^2.28.0`): interaction and animation support.
- `lucide-react-native` (`^1.8.0`): icon system used by tabs and UI.
- `zod` (`^4.3.6`): schema validation utility in the codebase.

## Technical Aspects of the App

- Cross-platform architecture: one codebase targets web, iOS, and Android through Expo and Expo Router.
- Provider-first composition: app-wide providers are mounted once in `app/_layout.tsx` via `AppProviders`.
- Split state model:
  - Apollo manages remote server state (feed, activity, comments, bookmarks).
  - Redux Toolkit manages local app state (current user selection and related UI state).
- GraphQL cache strategy:
  - `InMemoryCache` normalizes entities by `id`.
  - `activitiesCollection` has a merge policy that de-duplicates paginated edges by cursor.
- Feed scalability details:
  - Cursor-based pagination with `fetchMore`.
  - Duplicate request guard for repeated `onEndReached` events.
  - Pull-to-refresh via `refetch`.
- Detail screen interaction model:
  - Comment mutation flow with pending comment UI state.
  - Post-submit refetch to keep comment thread current.
- Styling system:
  - Centralized `tw` instance (`ui/tw.ts`) built from `tailwind.config.js`.
  - `useDeviceContext(tw)` binds utility behavior to device context.
- Type safety:
  - TypeScript across app logic.
  - typed Redux hooks (`useAppSelector`, `useAppDispatch`).

## Setup and Run

### Prerequisites

- Node.js 20 or newer.
- pnpm.
- Xcode and CocoaPods for iOS builds.
- Android Studio SDK setup for Android builds.

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment variables

Create a `.env` file at the repository root:

```env
EXPO_PUBLIC_SUPABASE_GRAPHQL_URL=https://<project-ref>.supabase.co/graphql/v1
EXPO_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>

# Also used in src/utils/env.ts
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
```

### 3) iOS native setup (macOS)

```bash
cd ios && pod install && cd ..
```

### 4) Start the app

```bash
pnpm start
```

### 5) Run on each platform

```bash
pnpm web
pnpm ios
pnpm android
```

### 6) Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```


## 1. Purpose

This document describes how the app is organized at runtime and in the repository, with emphasis on separation of concerns between routing, data access, local state, and UI composition.

## 2. High-Level Runtime Architecture

```text
Expo Router (app/*)
  -> Root providers (Redux + Apollo + SafeArea)
    -> Screen ViewModels (hooks in src/hooks)
      -> GraphQL operations (src/lib/apollo/*.ts)
      -> Local state updates (src/store/*)
      -> Shared UI rendering (ui/* and feature components)
```

The app uses Expo Router file-based routes as the entrypoint and composes global providers once at the root layout.

## 3. Repository Structure

```text
app/
  _layout.tsx              # Root stack + provider composition
  (tabs)/_layout.tsx       # Tab navigation
  (tabs)/feed.tsx          # Feed screen
  (tabs)/profile.tsx       # Profile screen
  activity/[id].tsx        # Activity detail screen

src/
  providers/AppProviders.tsx
  hooks/
    useFeedViewModel.ts
    useActivityDetailViewModel.ts
    useRedux.ts
  lib/apollo/
    client.ts
    cache.ts
    queries.ts
    mutations.ts
  store/
    index.ts
    slices/userSlice.ts
  features/
    activity-feed/
    activity-detail/

ui/
  tw.ts
  atoms/
  molecules/
  views/

docs/
  ADR_QUALITY.md
  ARCHITECTURE.md
  ...
```

## 4. Routing and Navigation

- Routing is implemented with Expo Router in `app/`.
- `app/_layout.tsx` mounts `AppProviders` once and defines a stack.
- `app/(tabs)/_layout.tsx` defines the bottom tabs (`feed`, `profile`).
- Dynamic route `app/activity/[id].tsx` reads the route param with `useLocalSearchParams`.
- Feed cards navigate to detail via `router.push('/activity/${id}')`.

## 5. Provider Composition

Global providers are composed in `src/providers/AppProviders.tsx`:

1. Redux `Provider` with the app store.
2. Apollo `ApolloProvider` with `apolloClient`.
3. `SafeAreaProvider` for platform-safe layout insets.
4. `useDeviceContext(tw)` to connect `twrnc` with device context.

This keeps cross-cutting runtime concerns in one place and prevents per-screen setup duplication.

## 6. Data Layer: Apollo Client

### Client

- Configured in `src/lib/apollo/client.ts` with `ApolloClient` and `HttpLink`.
- Endpoint uses `EXPO_PUBLIC_SUPABASE_GRAPHQL_URL`.
- Auth headers use `EXPO_PUBLIC_SUPABASE_ANON_KEY` when present.
- Default query options:
  - `watchQuery`: `cache-and-network`
  - `query`: `network-only`

### Cache

- `src/lib/apollo/cache.ts` defines `InMemoryCache` type policies.
- `activitiesCollection` merge policy appends unique edges by cursor.
- Normalized entity keys are set by `id` for `activities`, `authors`, `comments`.

### Operations

- Queries and fragments live in `src/lib/apollo/queries.ts`.
- Mutations live in `src/lib/apollo/mutations.ts`.
- Feed and detail queries include user-specific bookmark relation (`userBookmarks`) based on `userId`.

## 7. Local State Layer: Redux Toolkit

- Store is created with `configureStore` in `src/store/index.ts`.
- Current reducer map includes `user` slice (`src/store/slices/userSlice.ts`).
- `userSlice` maintains:
  - `users`
  - `currentUser`
  - `isLoading`
  - `error`
- Typed hooks are exported from `src/hooks/useRedux.ts`:
  - `useAppDispatch`
  - `useAppSelector`

Apollo handles remote server data; Redux handles local app/user state.

## 8. Screen ViewModel Pattern

The app uses hooks as ViewModels:

- `useFeedViewModel.ts`
  - Executes feed query
  - Maps GraphQL data into UI-friendly shape
  - Handles pagination (`fetchMore`) and pull-to-refresh (`refetch`)
  - Prevents duplicate pagination requests with cursor guard

- `useActivityDetailViewModel.ts`
  - Executes detail query
  - Manages comment input and submit flow
  - Calls comment mutation and refetches activity data
  - Provides derived comment lists for UI

This keeps screen components mostly declarative and focused on rendering.

## 9. UI Layer and Styling

- Shared UI primitives and components are in `ui/`.
- Styling uses `twrnc` with a shared config (`ui/tw.ts` + `tailwind.config.js`).
- Route screens and feature components consume `tw` for utility-class styling.

The setup enables consistent styling tokens and a single utility runtime across web and native.

## 10. End-to-End Data Flow

```text
User action (screen)
  -> ViewModel handler (hook)
    -> Apollo query/mutation
      -> Apollo cache update / merge
        -> mapped view model output
          -> UI render updates

If local user context changes:
  -> Redux action
    -> store update
      -> view model selector results change
        -> Apollo variables may change (userId)
          -> query refetch / updated UI state
```

## 11. Quality Characteristics Enabled

- Maintainability: clear boundaries between route, logic, and UI layers.
- Scalability: feature hooks and Apollo operations can grow without coupling to navigation.
- Testability: view-model hooks and reducers are isolated units.
- Consistency: shared provider composition and shared styling runtime reduce drift.

## 12. Known Constraints

- Current architecture relies on environment variables for GraphQL access.
- `watchQuery` and `query` defaults favor freshness; this may increase network usage.
- Pagination behavior assumes stable cursors from backend responses.
