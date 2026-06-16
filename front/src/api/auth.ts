import {Profile} from '@/types/domain';
import {supabase} from './supabase';

export type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

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

function loginTypeFromProvider(provider: string): Profile['loginType'] {
  if (provider === 'apple') {
    return 'apple';
  }
  if (provider === 'google') {
    return 'google';
  }
  return 'email';
}

async function getProfile(): Promise<Profile> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('사용자를 찾을 수 없습니다.');
  }

  let result = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // 소셜 로그인 최초 사용자는 public.users에 행이 없음 → 생성 후 다시 조회
  if (result.error?.code === 'PGRST116') {
    const provider = user.app_metadata?.provider ?? user.user_metadata?.provider ?? 'email';
    const loginType = loginTypeFromProvider(provider);
    const {error: insertError} = await supabase.from('users').insert({
      id: user.id,
      email: user.email ?? '',
      loginType,
      nickname: null,
      imageUri: null,
    });
    if (insertError) {
      throw insertError;
    }
    result = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
  }

  if (result.error) {
    throw result.error;
  }

  const profile = result.data;
  return {
    id: profile.id,
    email: profile.email || user.email || '',
    nickname: profile.nickname ?? null,
    imageUri: profile.imageUri ?? null,
    loginType: profile.loginType || 'email',
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
    id: profile.id,
    email: profile.email || user.email || '',
    nickname: profile.nickname || null,
    imageUri: profile.imageUri || null,
    loginType: profile.loginType || 'email',
  };
}

async function withdrawUser(): Promise<{message: string}> {
  const {error} = await supabase.rpc('delete_user');

  if (error) {
    throw error;
  }

  await supabase.auth.signOut();
  return {message: '회원 탈퇴가 완료되었습니다.'};
}

export {
  appleLogin,
  editProfile,
  getProfile,
  logout,
  withdrawUser,
};
