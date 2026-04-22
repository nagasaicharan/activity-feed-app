/**
 * Environment configuration
 * Centralized access to all environment variables
 */

const readEnv = (primaryKey: string, fallbackKey?: string) => {
  const primary = process.env[primaryKey];
  if (primary) {
    return primary;
  }

  if (fallbackKey) {
    return process.env[fallbackKey];
  }

  return undefined;
};

const SUPABASE_URL = readEnv('EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
const SUPABASE_ANON_KEY = readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required environment variables. Please check your .env file.',
  );
}

export const ENV = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} as const;

export default ENV;
