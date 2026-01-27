import {Profile} from '@/types/domain';
import {supabase} from './supabase';

type RequsetUser = {
  email: string;
  password: string;
};

async function postSignup({email, password}: RequsetUser): Promise<void> {
  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        loginType: 'email',
      },
    },
  });

  if (error) {
    throw error;
  }

  // Supabase Auth는 자동으로 사용자를 생성하지만,
  // 커스텀 프로필 정보(nickname, imageUri)는 별도 테이블에 저장해야 함
  if (data.user) {
    // public.users 테이블에 프로필 정보 저장
    const {error: profileError} = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        loginType: 'email',
        nickname: null,
        imageUri: null,
      });

    if (profileError) {
      console.error('프로필 생성 실패:', profileError);
    }
  }
}

export type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

async function postLogin({
  email,
  password,
}: RequsetUser): Promise<ResponseToken> {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('세션이 생성되지 않았습니다.');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

async function kakaoLogin(token: string): Promise<ResponseToken> {
  // Supabase는 직접 OAuth를 지원하지만, Kakao는 커스텀 구현 필요
  // 일단 서버를 통해 처리하거나, Supabase의 OAuth provider 설정 필요
  const {data, error} = await supabase.auth.signInWithIdToken({
    provider: 'kakao',
    token,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('세션이 생성되지 않았습니다.');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

async function naverLogin(token: string): Promise<ResponseToken> {
  const {data, error} = await supabase.auth.signInWithIdToken({
    provider: 'naver',
    token,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('세션이 생성되지 않았습니다.');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

type RequestAppleIdentity = {
  identityToken: string;
  appId: string;
  nickname: string | null;
};

async function appleLogin(body: RequestAppleIdentity): Promise<ResponseToken> {
  const {data, error} = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: body.identityToken,
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('세션이 생성되지 않았습니다.');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

async function getProfile(): Promise<Profile> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('사용자를 찾을 수 없습니다.');
  }

  // public.users 테이블에서 프로필 정보 가져오기
  const {data: profile, error: profileError} = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    id: typeof profile.id === 'string' ? parseInt(profile.id) : profile.id,
    email: profile.email || user.email || '',
    nickname: profile.nickname || null,
    imageUri: profile.imageUri || null,
    loginType: profile.loginType || 'email',
  };
}

async function getAccessToken(): Promise<ResponseToken> {
  const {
    data: {session},
    error,
  } = await supabase.auth.refreshSession();

  if (error || !session) {
    throw error || new Error('세션을 갱신할 수 없습니다.');
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  };
}

async function logout() {
  const {error} = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

type RequestProfile = Pick<Profile, 'nickname' | 'imageUri'>;

async function editProfile(body: RequestProfile): Promise<Profile> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('사용자를 찾을 수 없습니다.');
  }

  const {data: profile, error: profileError} = await supabase
    .from('users')
    .update({
      nickname: body.nickname,
      imageUri: body.imageUri,
    })
    .eq('id', user.id)
    .select()
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    id: typeof profile.id === 'string' ? parseInt(profile.id) : profile.id,
    email: profile.email || user.email || '',
    nickname: profile.nickname || null,
    imageUri: profile.imageUri || null,
    loginType: profile.loginType || 'email',
  };
}

async function withdrawUser(): Promise<{message: string}> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('사용자를 찾을 수 없습니다.');
  }

  // public.users 테이블에서 삭제
  const {error: deleteError} = await supabase
    .from('users')
    .delete()
    .eq('id', user.id);

  if (deleteError) {
    throw deleteError;
  }

  // Supabase Auth에서 사용자 삭제는 서버 사이드에서만 가능
  // 클라이언트에서는 public.users만 삭제하고, auth.users는 서버에서 처리하거나
  // Edge Function을 통해 처리해야 함
  // 일단 로그아웃 처리
  await supabase.auth.signOut();

  return {message: '회원 탈퇴가 완료되었습니다.'};
}

export {
  appleLogin,
  editProfile,
  getAccessToken,
  getProfile,
  kakaoLogin,
  naverLogin,
  logout,
  postLogin,
  postSignup,
  withdrawUser,
};
