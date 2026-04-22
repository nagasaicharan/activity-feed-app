create extension if not exists pgcrypto;

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors(id),
  title text not null,
  body text not null,
  bookmark_count integer not null default 0,
  is_bookmarked boolean not null default false,
  created_at timestamptz not null
);

create index if not exists activities_created_at_idx
  on public.activities (created_at desc, id desc);

create index if not exists activities_author_id_idx
  on public.activities (author_id);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  author_id uuid not null references public.authors(id),
  text text not null,
  created_at timestamptz not null
);

create index if not exists comments_activity_id_idx
  on public.comments (activity_id, created_at asc);

create index if not exists comments_author_id_idx
  on public.comments (author_id);
