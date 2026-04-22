import type { User } from '../store/slices/userSlice';

export const MOCK_USERS: User[] = [
  {
    id: '8f3d2a10-6c44-4b2f-9a6f-1d5e7c9b0a11',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Aarav',
  },
  {
    id: 'c1a5e8b3-9d72-4c6e-b8a1-2f7d3e9b5a30',
    name: 'Noah Singh',
    email: 'noah.singh@example.com',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Noah',
  },
  {
    id: '6e4b2f91-a7c3-4d5e-9b1f-8a2d6c7e4b40',
    name: 'Luna Garcia',
    email: 'luna.garcia@example.com',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/png?seed=Luna',
  },
];