import { ApolloClient, HttpLink } from '@apollo/client';
import { apolloCache } from './cache';

const supabaseGraphqlUrl = process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL;
const supabaseApiKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabaseLink = new HttpLink({
      uri: supabaseGraphqlUrl,
      headers: {
        ...(supabaseApiKey ? { apikey: supabaseApiKey } : {}),
        ...(supabaseApiKey
          ? { Authorization: `Bearer ${supabaseApiKey}` }
          : {}),
      },
    })
    
export const apolloClient = new ApolloClient({
  cache: apolloCache,
  link: supabaseLink,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});