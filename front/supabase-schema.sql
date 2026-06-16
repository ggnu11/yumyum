-- ============================================
-- YumYum 테이블 스키마 + RLS + Storage
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- 1. users 테이블 (프로필 정보)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  nickname text,
  "imageUri" text,
  "loginType" text not null default 'email',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users: 본인 조회" on public.users
  for select using (auth.uid() = id);

create policy "users: 본인 생성" on public.users
  for insert with check (auth.uid() = id);

create policy "users: 본인 수정" on public.users
  for update using (auth.uid() = id);

create policy "users: 본인 삭제" on public.users
  for delete using (auth.uid() = id);

-- 2. posts 테이블 (맛집 게시물)
create table public.posts (
  id bigint generated always as identity primary key,
  "userId" uuid references auth.users(id) on delete cascade not null,
  latitude numeric(10, 8) not null,
  longitude numeric(11, 8) not null,
  color text not null default 'RED',
  address text not null,
  title text not null,
  description text not null default '',
  date timestamptz not null default now(),
  score integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts: 본인 조회" on public.posts
  for select using (auth.uid() = "userId");

create policy "posts: 본인 생성" on public.posts
  for insert with check (auth.uid() = "userId");

create policy "posts: 본인 수정" on public.posts
  for update using (auth.uid() = "userId");

create policy "posts: 본인 삭제" on public.posts
  for delete using (auth.uid() = "userId");

-- 3. images 테이블 (게시물 이미지)
create table public.images (
  id bigint generated always as identity primary key,
  "postId" bigint references public.posts(id) on delete cascade not null,
  uri text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.images enable row level security;

-- images는 posts의 userId를 통해 접근 제어
create policy "images: 본인 게시물 조회" on public.images
  for select using (
    exists (
      select 1 from public.posts
      where posts.id = images."postId"
      and posts."userId" = auth.uid()
    )
  );

create policy "images: 본인 게시물에 생성" on public.images
  for insert with check (
    exists (
      select 1 from public.posts
      where posts.id = images."postId"
      and posts."userId" = auth.uid()
    )
  );

create policy "images: 본인 게시물 삭제" on public.images
  for delete using (
    exists (
      select 1 from public.posts
      where posts.id = images."postId"
      and posts."userId" = auth.uid()
    )
  );

-- 4. favorites 테이블 (즐겨찾기)
create table public.favorites (
  id bigint generated always as identity primary key,
  "postId" bigint references public.posts(id) on delete cascade not null,
  "userId" uuid references auth.users(id) on delete cascade not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("postId", "userId")
);

alter table public.favorites enable row level security;

create policy "favorites: 본인 조회" on public.favorites
  for select using (auth.uid() = "userId");

create policy "favorites: 본인 생성" on public.favorites
  for insert with check (auth.uid() = "userId");

create policy "favorites: 본인 삭제" on public.favorites
  for delete using (auth.uid() = "userId");

-- 5. Storage 버킷 (이미지 업로드용)
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Storage RLS: 인증된 사용자만 업로드, 누구나 조회
create policy "images bucket: 누구나 조회" on storage.objects
  for select using (bucket_id = 'images');

create policy "images bucket: 인증 사용자 업로드" on storage.objects
  for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "images bucket: 본인 파일 삭제" on storage.objects
  for delete using (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);
