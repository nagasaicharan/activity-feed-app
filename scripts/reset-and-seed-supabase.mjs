import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');

const loadEnvFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

if (fs.existsSync(envPath)) {
  loadEnvFromFile(envPath);
}

const endpoint = process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!endpoint || !anonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_GRAPHQL_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in environment.');
}

const gqlRequest = async (query, variables = {}) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    const reason = payload.errors?.map((error) => error.message).join('; ') || `HTTP ${response.status}`;
    throw new Error(`Supabase GraphQL request failed: ${reason}`);
  }

  return payload.data;
};

const authors = [
  {
    id: '8f3d2a10-6c44-4b2f-9a6f-1d5e7c9b0a11',
    name: 'Aarav Patel',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Aarav',
  },
  {
    id: '3b7c91d2-2e5f-4f9a-8c3d-6a1b7e2f4c20',
    name: 'Mia Chen',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Mia',
  },
  {
    id: 'c1a5e8b3-9d72-4c6e-b8a1-2f7d3e9b5a30',
    name: 'Noah Singh',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Noah',
  },
  {
    id: '6e4b2f91-a7c3-4d5e-9b1f-8a2d6c7e4b40',
    name: 'Luna Garcia',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Luna',
  },
];

const activities = [
  {
    id: '1a7d3e4c-6b2f-4d9a-8c1e-5f7b3a9d2c10',
    title: 'Q2 roadmap checkpoint',
    body: 'Product and engineering aligned on the Q2 roadmap milestones and moved two platform tasks forward after clearing integration risks.',
    bookmarkCount: 3,
    authorId: authors[0].id,
  },
  {
    id: '2c8e4f5a-7d3b-4a1f-9e2c-6b4d8f1a3e21',
    title: 'Design token rollout',
    body: 'Design token sync now powers mobile and web themes from one source of truth, reducing manual drift across release trains.',
    bookmarkCount: 5,
    authorId: authors[1].id,
  },
  {
    id: '3d9f5a6b-8e4c-4b2a-9f3d-7c5e9a2b4f32',
    title: 'Incident response drill',
    body: 'The weekly reliability drill reduced median response time by 18 percent and highlighted one runbook that still needs cleanup.',
    bookmarkCount: 2,
    authorId: authors[2].id,
  },
  {
    id: '4e1a6b7c-9f5d-4c3b-8a4e-8d6f1b3c5a43',
    title: 'Onboarding flow refresh',
    body: 'New hire onboarding now includes role-based checklists and a mentor pairing flow to improve first-week contribution speed.',
    bookmarkCount: 4,
    authorId: authors[3].id,
  },
  {
    id: '5f2b7c8d-1a6e-4d4c-9b5f-9e7a2c4d6b54',
    title: 'Search indexing upgrade',
    body: 'Search indexing moved to incremental updates, improving freshness for activity feeds and reducing peak compute usage.',
    bookmarkCount: 1,
    authorId: authors[0].id,
  },
  {
    id: '6a3c8d9e-2b7f-4e5d-8c6a-af8b3d5e7c65',
    title: 'Mobile release cut',
    body: 'The mobile release branch was cut with all blockers resolved and zero high-severity crashes in final QA validation.',
    bookmarkCount: 6,
    authorId: authors[1].id,
  },
];

const comments = [
  {
    id: '7b4d9e1f-3c8a-4f6e-9d7b-bf9c4e6f8d76',
    activityId: activities[0].id,
    authorId: authors[1].id,
    text: 'Great clarity on sequencing.',
  },
  {
    id: '8c5e1f2a-4d9b-4a7f-8e8c-cf1d5f7a9e87',
    activityId: activities[1].id,
    authorId: authors[2].id,
    text: 'This will make theme updates much safer.',
  },
  {
    id: '9d6f2a3b-5e1c-4b8a-9f9d-df2e6a8b1f98',
    activityId: activities[1].id,
    authorId: authors[3].id,
    text: 'Please share the token docs in eng channel.',
  },
  {
    id: 'af7a3b4c-6f2d-4c9b-8a1e-ef3f7b9c2a09',
    activityId: activities[3].id,
    authorId: authors[0].id,
    text: 'Love the role-based approach.',
  },
];

const bookmarks = [
  {
    id: 'b18b4c5d-7a3e-4d1c-9b2f-f14a8c1d3b10',
    activityId: activities[0].id,
    userId: authors[0].id,
  },
  {
    id: 'c29c5d6e-8b4f-4e2d-8c3a-a25b9d2e4c21',
    activityId: activities[1].id,
    userId: authors[1].id,
  },
  {
    id: 'd3ad6e7f-9c5a-4f3e-9d4b-b36c1e3f5d32',
    activityId: activities[5].id,
    userId: authors[2].id,
  },
];

const resetAndSeedMutation = `
  mutation ResetAndSeed(
    $authors: [authorsInsertInput!]!
    $activities: [activitiesInsertInput!]!
    $comments: [commentsInsertInput!]!
    $bookmarks: [bookmarksInsertInput!]!
  ) {
    deleteFromcommentsCollection(atMost: 10000) { affectedCount }
    deleteFrombookmarksCollection(atMost: 10000) { affectedCount }
    deleteFromactivitiesCollection(atMost: 10000) { affectedCount }
    deleteFromauthorsCollection(atMost: 10000) { affectedCount }

    insertIntoauthorsCollection(objects: $authors) { affectedCount }
    insertIntoactivitiesCollection(objects: $activities) { affectedCount }
    insertIntocommentsCollection(objects: $comments) { affectedCount }
    insertIntobookmarksCollection(objects: $bookmarks) { affectedCount }
  }
`;

const verifyQuery = `
  query VerifySeed {
    authorsCollection(first: 20) { edges { node { id name } } }
    activitiesCollection(first: 20) { edges { node { id title authorId bookmarkCount } } }
    commentsCollection(first: 20) { edges { node { id activityId authorId text } } }
    bookmarksCollection(first: 20) { edges { node { id activityId userId } } }
  }
`;

const run = async () => {
  console.log('Resetting and seeding Supabase tables...');
  await gqlRequest(resetAndSeedMutation, {
    authors,
    activities,
    comments,
    bookmarks,
  });

  const verify = await gqlRequest(verifyQuery);
  const authorCount = verify.authorsCollection.edges.length;
  const activityCount = verify.activitiesCollection.edges.length;
  const commentCount = verify.commentsCollection.edges.length;
  const bookmarkCount = verify.bookmarksCollection.edges.length;

  console.log('Seed complete.');
  console.log(`authors=${authorCount}, activities=${activityCount}, comments=${commentCount}, bookmarks=${bookmarkCount}`);
  console.log('Active user IDs:');
  for (const author of authors) {
    console.log(`- ${author.name}: ${author.id}`);
  }
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
