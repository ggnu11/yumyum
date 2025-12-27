import {Profile} from '@/types/domain';
import {getEncryptStorage} from '@/utils/encryptStorage';
import { setEncryptStorage } from '@/utils/encryptStorage';
import axiosInstance from './axios';
import { storageKeys } from '@/constants/keys';

type RequsetUser = {
  email: string;
  password: string;
};

async function postSignup({email, password}: RequsetUser): Promise<void> {
  await axiosInstance.post('/auth/signup', {email, password});
}

export type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

async function postLogin({
  email,
  password,
}: RequsetUser): Promise<ResponseToken> {
  const { data } = await axiosInstance.post('/auth/signin', { email, password });

  const { accessToken, refreshToken } = data;

  // Always update access token
  await setEncryptStorage(storageKeys.ACCESS_TOKEN, accessToken);

  // Only update refresh token if backend returned a new one
  if (refreshToken) {
    await setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
  }

  // Set Axios default header
  setHeader('Authorization', `Bearer ${accessToken}`);

  return { accessToken, refreshToken };
}

async function kakaoLogin(token: string): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/kakao', {token});

  return data;
}

type RequestAppleIdentity = {
  identityToken: string;
  appId: string;
  nickname: string | null;
};

async function appleLogin(body: RequestAppleIdentity): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/apple', body);

  return data;
}

async function naverLogin(token: string): Promise<ResponseToken> {
  const {data} = await axiosInstance.post('/auth/oauth/naver', {token});
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

export {
  postSignup,
  postLogin,
  kakaoLogin,
  appleLogin,
  naverLogin,
  getProfile,
  getAccessToken,
  logout,
  editProfile,
  withdrawUser,
};
