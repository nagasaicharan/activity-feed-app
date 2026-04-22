import { InMemoryCache } from '@apollo/client';

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        activitiesCollection: {
          keyArgs: ['filter', 'orderBy'],
          merge(existing, incoming) {
            const existingEdges = existing?.edges ?? [];
            const incomingEdges = incoming?.edges ?? [];
            const seen = new Set(existingEdges.map((edge: { cursor: string }) => edge.cursor));

            const mergedEdges = [...existingEdges];
            for (const edge of incomingEdges) {
              if (!seen.has(edge.cursor)) {
                mergedEdges.push(edge);
              }
            }

            return {
              ...incoming,
              edges: mergedEdges,
            };
          },
        },
      },
    },
    activities: {
      keyFields: ['id'],
    },
    authors: {
      keyFields: ['id'],
    },
    comments: {
      keyFields: ['id'],
    },
  },
});