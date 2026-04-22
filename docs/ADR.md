# ADR Quality: Project Structure and Core Libraries

- Status: Accepted
- Date: 2026-04-22
- Decision Owners: Frontend engineering
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

## Decision 3: Use Redux Toolkit for local app state

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

## Notes

All statements in this ADR were verified against current source files and dependency declarations as of 2026-04-22.
