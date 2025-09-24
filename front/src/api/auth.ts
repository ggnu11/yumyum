import {Profile} from '@/types/domain';
import {getEncryptStorage} from '@/utils/encryptStorage';
import axiosInstance from './axios';

export type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

async function kakaoLogin(token: string): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/kakao', {token});

  return data;
}

type RequestAppleIdentity = {
  identityToken: string;
  appId: string;
  sub?: string;
  email?: string;
  name?: {
    givenName?: string | null;
    familyName?: string | null;
  };
};

async function appleLogin(body: RequestAppleIdentity): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/apple', body);

  return data;
}

async function naverLogin(token: string): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/naver', {token});
  return data;
}

type RequestGoogleIdentity = {
  idToken: string;
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
};

async function googleLogin(
  body: RequestGoogleIdentity,
): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/google', body);
  return data;
}

async function getProfile(): Promise<Profile> {
  const {data} = await axiosInstance.get('/user/me');

  return data;
}

async function getAccessToken(): Promise<ResponseToken> {
  const refreshToken = await getEncryptStorage('refreshToken');

  const {data} = await axiosInstance.get('/auth/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
}

async function logout() {
  await axiosInstance.post('/auth/logout');
}

type RequestProfile = Pick<Profile, 'nickname' | 'imageUri'>;

async function editProfile(body: RequestProfile): Promise<Profile> {
  const {data} = await axiosInstance.patch('/user/me', body);

  return data;
}

async function withdrawUser(): Promise<{message: string}> {
  const {data} = await axiosInstance.delete('/user/withdraw');

  return data;
}

async function revokeAppleToken(
  authorizationCode: string,
): Promise<{message: string}> {
  const {data} = await axiosInstance.post('/auth/oauth/apple/revoke', {
    authorizationCode,
  });

  return data;
}

async function revokeGoogleToken(
  accessToken: string,
): Promise<{message: string}> {
  const {data} = await axiosInstance.post('/auth/oauth/google/revoke', {
    accessToken,
  });

  return data;
}

export {
  kakaoLogin,
  appleLogin,
  naverLogin,
  googleLogin,
  getProfile,
  getAccessToken,
  logout,
  editProfile,
  withdrawUser,
  revokeAppleToken,
  revokeGoogleToken,
};
