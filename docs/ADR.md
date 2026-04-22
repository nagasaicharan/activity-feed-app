# ADR Quality: Project Structure and Core Libraries

- Date: 2026-04-22
- Scope: App architecture boundaries, data/state layers, and styling runtime

## Context

The app is an Expo Router based React Native project with shared code for web and native. The codebase needs clear boundaries for routing, data access, state management, and styling so that features remain easy to evolve.

This ADR documents quality-oriented decisions that are already implemented in the repository and explains why they support maintainability, consistency, and delivery speed.

## Decision Drivers

- Keep route concerns isolated from feature and data concerns.
- Minimize cross-layer coupling between UI, network, and local state.
- Preserve a single cross-platform code path for web and native.
- Support predictable state updates and easier debugging.
- Keep styling consistent without a fragmented theme/runtime setup.

## Decision 1: Structure the app by runtime entry points + domain code + UI system

Intent and decision ownership: Human-led architectural decision informed by Expo Router documentation and AI-assisted option exploration.

### Implemented structure

- `app/`: Expo Router route files and layouts.
- `src/`: application logic (providers, hooks, store, Apollo client/cache, feature logic).
- `ui/`: shared UI primitives and design helpers.
- `docs/`: architecture and reference documentation.

### Alternatives considered

- Keep all concerns under route files (`app/`) with minimal separation.
- Organize by technical type only (all hooks together, all API together, all components together) without clear feature boundaries.

### Why this decision

- Route files stay focused on navigation and screen composition.
- Core app logic remains reusable and testable outside route modules.
- Shared UI primitives are discoverable and harder to duplicate accidentally.

### Quality impact

- Clear ownership boundaries reduce accidental coupling.
- Route concerns stay near route files, while reusable logic stays in `src/`.
- Shared UI is centralized in `ui/`, reducing duplicated styling logic.

### Trade-offs

- More folders increase initial navigation overhead for new contributors.
- Requires discipline to avoid leaking business logic back into route files.

## Decision 2: Use Apollo Client for GraphQL data and normalized cache

Intent and decision ownership: Human-selected GraphQL client after comparing alternatives, with AI used to accelerate package and trade-off research.

### What is implemented

- Dependency: `@apollo/client` in `package.json`.
- Provider wiring: `ApolloProvider` wraps the app in `src/providers/AppProviders.tsx`.
- Client setup: `src/lib/apollo/client.ts` uses `ApolloClient` with `HttpLink`.
  - GraphQL endpoint: `process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL`.
  - Headers include `apikey` and `Authorization: Bearer ...` when `EXPO_PUBLIC_SUPABASE_ANON_KEY` is present.
- Cache setup: `src/lib/apollo/cache.ts` uses `InMemoryCache` with type policies.
  - `activitiesCollection` merges paginated edges while deduplicating by cursor.
  - Entity key fields are defined for `activities`, `authors`, and `comments` by `id`.
- Query defaults (`src/lib/apollo/client.ts`):
  - `watchQuery`: `cache-and-network`
  - `query`: `network-only`

### Alternatives considered

- urql with optional graphcache.
- React Query plus manual GraphQL fetchers.

### Why this decision

- Apollo provides first-class normalized caching and query orchestration.
- Centralized cache policies support cursor pagination with predictable merge behavior.
- Existing implementation already aligns with this model (`activitiesCollection` merge, entity key fields).

### Quality impact

- Centralized GraphQL client setup improves consistency.
- Normalized cache and merge policies reduce duplicate data and support paginated feed behavior.
- Environment-based endpoint and auth headers keep runtime configuration outside source logic.

### Trade-offs

- Apollo adds runtime and conceptual overhead versus thinner clients.
- Default query policies favor freshness, which can increase network usage.

### Assignment-specific divergence

The take-home prompt provided a simplified GraphQL contract centered on `feed`, `activity`, and `toggleBookmark`. This implementation intentionally uses Supabase's generated GraphQL API instead, which exposes collection-oriented queries and mutations such as `activitiesCollection`, `insertIntobookmarksCollection`, and `deleteFrombookmarksCollection`.

Why this choice was made:

- It allowed the app to run against a real hosted backend and real persistence instead of a local mock layer.
- It reduced the amount of custom GraphQL resolver or mocking infrastructure required inside the Expo client.
- It let the project focus time on pagination behavior, optimistic UI, cache updates, and cross-platform delivery.

What this means for reviewers:

- The app preserves the core product behavior requested by the assignment, but it does not consume the exact GraphQL schema provided in the prompt.
- Bookmarking is implemented as separate add/remove Supabase mutations rather than a single `toggleBookmark` field.
- `isBookmarked` is derived from user-specific bookmark query results rather than resolved as a first-class server field.
- The bookmark toggle also keeps an assessment-only 20% failure branch in the client so error handling can be demonstrated, even though a cleaner assessment setup would mock that offline in developer tools.

Trade-off accepted:

- This is a deliberate deviation from the requested mock-schema approach.
- This was a human decision to deviate for assessment storytelling: keep the failure path visible in code, but document that offline developer-tool mocking is the preferred way to simulate it.
- The implementation is closer to a production-backed app, but weaker as a strict reading of the assignment contract.
- Given more time, the cleaner submission would be a compatibility layer that maps the provided schema onto the same persistence model.

## Decision 3: Use Redux Toolkit for local app state

Intent and decision ownership: Human-led state-boundary decision, with AI used to pressure-test simpler alternatives before settling on Toolkit.

### What is implemented

- Dependency: `@reduxjs/toolkit` and `react-redux` in `package.json`.
- Store: `src/store/index.ts` uses `configureStore`.
- Current reducer map includes `user` from `src/store/slices/userSlice.ts`.
- Typed hooks: `src/hooks/useRedux.ts` exports `useAppDispatch` and `useAppSelector`.
- `userSlice` models user selection state:
  - `users`, `currentUser`, `isLoading`, `error`
  - actions: `setUser`, `loginAsUser`, `setLoading`, `setError`, `logout`

### Alternatives considered

- React Context plus `useReducer` for all local state.
- Co-locating all local state inside route/screen components.

### Why this decision

- Toolkit APIs reduce boilerplate while preserving explicit reducer logic.
- Typed store + typed hooks create stable interfaces for feature hooks and screens.
- Local user/session state stays separate from remote GraphQL entities.

### Quality impact

- Predictable reducer/action structure improves testability and onboarding.
- Typed hooks reduce type mismatches in component-level store access.
- Local UI/user state is separated from remote GraphQL server state.

### Trade-offs

- Introduces additional state infrastructure that may be unnecessary for tiny apps.
- Requires care to prevent duplication between Redux state and Apollo cache state.

## Decision 4: Use twrnc with a shared Tailwind config for styling

Intent and decision ownership: Human-selected styling direction for team velocity and consistency, with AI used for implementation references and comparison notes.

### What is implemented

- Dependency: `twrnc` in `package.json`.
- Shared tw instance: `ui/tw.ts` creates twrnc with `tailwind.config.js`.
- Export path: `ui/index.ts` exports `tw` for app-wide use.
- Provider integration: `src/providers/AppProviders.tsx` calls `useDeviceContext(tw)`.
- Tailwind scan paths in `tailwind.config.js` include:
  - `./App.{js,jsx,ts,tsx}`
  - `./src/**/*.{js,jsx,ts,tsx}`
  - `./ui/**/*.{js,jsx,ts,tsx}`

### Alternatives considered

- Plain React Native `StyleSheet` only.
- Other utility-first approaches without a centralized shared `tw` export.

### Why this decision

- Utility styling improves speed for screen composition.
- One shared `tw` runtime keeps style behavior consistent across screens and components.
- Device context wiring supports platform-aware style handling.

### Quality impact

- A single styling runtime (`tw`) enforces consistent utility interpretation.
- Device context integration supports platform-aware utility behavior.
- Shared config improves visual consistency and makes design-token changes easier.

### Trade-offs

- Utility class strings can become dense in complex UI blocks.
- Requires team consistency around token usage to avoid ad-hoc values.

## Combined quality outcomes

These decisions produce a clear separation of responsibilities:

- Routing and screen composition in `app/`.
- Remote GraphQL concerns in Apollo client/cache and feature hooks.
- Local app state in Redux Toolkit slices.
- Cross-app visual consistency through `twrnc` + shared Tailwind config.

This structure keeps the app easier to reason about while supporting iterative feature growth.

## Feed and Detail Data Shaping

The feed and detail screens now use intentionally different GraphQL payload shapes.

- Feed queries request summary data only: title, preview body text source, author, timestamp, bookmark state, and bookmark count.
- Detail queries request the full body plus comment data.

Why this matters:

- The paginated feed no longer pulls comment collections for every card.
- The feed UI presents activity previews while preserving the detail screen as the source of truth for full content and discussion.
- The resulting data flow better matches the product surface area of each screen.

Trade-off:

- The feed no longer tries to preview comment threads inline.
- Users move into the detail view to read the full discussion, which keeps the list cheaper and simpler.

## Architecture Guardrails

- Keep routing concerns in `app/`; avoid putting network/cache logic directly in route files.
- Keep GraphQL operations and cache behavior in `src/lib/apollo/`.
- Keep local app state in Redux slices and typed hooks.
- Reuse shared UI exports from `ui/` before creating new one-off primitives.

## Verification Checklist

Use these checks when validating architecture quality:

- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- Feed pagination merges without duplicate edges for repeated cursors.
- User switch updates query variables (`userId`) and reflected bookmark state.

## Revisit Triggers

Re-evaluate this ADR when one of the following occurs:

- New domain modules require a different folder strategy.
- Performance issues show Apollo policy defaults are too network-heavy.
- Local state grows beyond current Redux slice boundaries.
- Styling inconsistency rises despite shared `twrnc` configuration.

## AI Usage

AI tools were used during this project for targeted implementation support rather than end-to-end generation.

### Where AI helped

- Scaffolding and refining UI component structure.
- Reviewing Apollo Client v4 migration details and type-surface mismatches.
- Stress-testing GraphQL pagination and optimistic-update approaches.
- Drafting documentation language for architectural trade-offs.

### Where human judgment overrode AI output

- Rejecting suggestions that would have added unnecessary abstraction for a small codebase.
- Correcting Apollo-specific recommendations that assumed removed v3 APIs such as `ApolloError` exports.
- Choosing to keep the real Supabase backend and documenting that deviation explicitly instead of pretending it matched the provided mock-schema contract.
- Simplifying the feed surface so preview behavior matched the screen's purpose rather than overloading the list with detail-only discussion data.

### Validation applied to AI-assisted changes

- TypeScript typechecking after code edits.
- Jest test execution after behavior changes.
- Manual review of architectural trade-offs before accepting generated suggestions.

## What I Would Do Differently With More Time

- Add a compatibility layer that exposes the exact `feed`, `activity`, and `toggleBookmark` schema described in the assignment while keeping the same persistence model underneath.
- Add a self-contained mock runtime so reviewers can run the app without external backend provisioning.
- Add focused tests for optimistic bookmark success and rollback behavior.
- Improve the bookmark mutation shape so failure handling happens at the API boundary rather than being simulated in the UI layer.
- Expand accessibility coverage with stronger screen-reader labels, keyboard support on web, and clearer reduced-motion considerations.
- Tighten README setup guidance with a short reviewer path for web and native verification.
