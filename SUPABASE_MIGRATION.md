# Supabase 마이그레이션 가이드

## 완료된 작업

✅ 프론트엔드에서 Supabase 클라이언트 직접 사용하도록 변경
- 인증: Supabase Auth 사용
- 데이터베이스: Supabase PostgreSQL 직접 쿼리
- 스토리지: Supabase Storage 사용

## 환경 변수 설정

프론트엔드 `.env` 파일에 다음을 추가하세요:

```
SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

Supabase Dashboard > Settings > API에서 확인할 수 있습니다.

## Supabase 데이터베이스 테이블 생성

Supabase Dashboard > SQL Editor에서 다음 SQL을 실행하여 테이블을 생성하세요:

```sql
-- users 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  loginType TEXT NOT NULL CHECK (loginType IN ('email', 'kakao', 'apple', 'naver')),
  nickname TEXT,
  imageUri TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- posts 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id SERIAL PRIMARY KEY,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  color TEXT NOT NULL,
  address TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  score INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- images 테이블
CREATE TABLE IF NOT EXISTS public.images (
  id SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  uri TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- favorites 테이블
CREATE TABLE IF NOT EXISTS public.favorites (
  id SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "deletedAt" TIMESTAMP WITH TIME ZONE,
  UNIQUE("postId", "userId")
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts("userId");
CREATE INDEX IF NOT EXISTS idx_posts_date ON public.posts(date);
CREATE INDEX IF NOT EXISTS idx_images_post_id ON public.images("postId");
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites("userId");
CREATE INDEX IF NOT EXISTS idx_favorites_post_id ON public.favorites("postId");

-- Row Level Security (RLS) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정 (사용자는 자신의 데이터만 접근 가능)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own posts" ON public.posts
  FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Users can create own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = "userId");

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = "userId");

CREATE POLICY "Users can view own images" ON public.images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = images."postId" AND posts."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can create own images" ON public.images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = images."postId" AND posts."userId" = auth.uid()
    )
  );

CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = "userId");

CREATE POLICY "Users can create own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = "userId");
```

## 서버 테이블 변경 시

### 방법 1: Supabase Dashboard 사용 (권장)

1. Supabase Dashboard > Table Editor로 이동
2. 테이블 선택 후 수정
3. 컬럼 추가/삭제/수정 가능

### 방법 2: SQL 마이그레이션

Supabase Dashboard > SQL Editor에서 ALTER TABLE 문 실행:

```sql
-- 예시: posts 테이블에 새 컬럼 추가
ALTER TABLE public.posts
ADD COLUMN new_column TEXT;
```

### 방법 3: TypeORM Migration (서버 실행 시)

서버를 실행하면 TypeORM의 `synchronize: true` 옵션으로 자동으로 테이블이 생성/수정됩니다.

**중요**: 프로덕션 환경에서는 `synchronize: false`로 설정하고 마이그레이션 파일을 사용하세요.

## 서버 실행 필요 여부

### ❌ 더 이상 필요 없음

프론트엔드에서 Supabase를 직접 사용하므로 **서버를 실행할 필요가 없습니다**.

### ⚠️ 서버가 필요한 경우

다음 기능을 사용하려면 서버가 필요합니다:

1. **OAuth 로그인 (Kakao, Naver, Apple)**
   - Supabase는 OAuth를 지원하지만, 커스텀 로직이 필요할 수 있음
   - Supabase Dashboard > Authentication > Providers에서 설정 가능

2. **회원 탈퇴 시 Auth 사용자 삭제**
   - `supabase.auth.admin.deleteUser()`는 서버 사이드에서만 사용 가능
   - Edge Function 또는 서버 API를 통해 처리 필요

3. **복잡한 비즈니스 로직**
   - RPC 함수나 Edge Function 사용 가능

## 다음 단계

1. Supabase Dashboard에서 테이블 생성
2. `.env` 파일에 Supabase URL과 Anon Key 추가
3. 앱 테스트

## 주의사항

- Profile의 `id`는 Supabase Auth의 UUID를 사용하므로 `string` 타입입니다
- 기존 서버의 `number` 타입과 호환성을 위해 변환 로직이 포함되어 있습니다
- OAuth 로그인은 Supabase Dashboard에서 Provider 설정이 필요합니다

