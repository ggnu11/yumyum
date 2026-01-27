import {MutationFunction, useMutation, useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';

import {
  appleLogin,
  editProfile,
  getProfile,
  kakaoLogin,
  naverLogin,
  logout,
  postLogin,
  postSignup,
  ResponseToken,
  withdrawUser,
} from '@/api/auth';
import {supabase} from '@/api/supabase';
import queryClient from '@/api/queryClient';
import {queryKeys, storageKeys} from '@/constants/keys';
import {numbers} from '@/constants/numbers';
import {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/api';
import {Profile} from '@/types/domain';
import {removeEncryptStorage, setEncryptStorage} from '@/utils/encryptStorage';
import {removeHeader, setHeader} from '@/utils/header';

function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    throwOnError: error => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

function useLogin<T>(
  loginAPI: MutationFunction<ResponseToken, T>,
  mutationOptions?: UseMutationCustomOptions,
) {
  return useMutation({
    mutationFn: loginAPI,
    onSuccess: async ({accessToken, refreshToken}) => {
      setHeader('Authorization', `Bearer ${accessToken}`);
      await setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH],
      });
    },
    throwOnError: error => Number(error.response?.status) >= 500,
    ...mutationOptions,
  });
}

function useEmailLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(postLogin, mutationOptions);
}

function useKakaoLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(kakaoLogin, mutationOptions);
}

function useNaverLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(naverLogin, mutationOptions);
}

function useAppleLogin(mutationOptions?: UseMutationCustomOptions) {
  return useLogin(appleLogin, mutationOptions);
}

function useGetRefreshToken() {
  // Supabase는 자동으로 세션을 관리하므로, 세션 확인만 하면 됨
  const {data, isSuccess, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: async () => {
      const {
        data: {session},
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        throw error || new Error('세션이 없습니다.');
      }

      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      };
    },
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME,
    retry: false,
  });

  useEffect(() => {
    (async () => {
      if (isSuccess && data) {
        // Supabase는 자동으로 헤더를 관리하므로 별도 설정 불필요
        // 하지만 기존 코드와의 호환성을 위해 유지
        setHeader('Authorization', `Bearer ${data.accessToken}`);
        await setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
      }
    })();
  }, [isSuccess, data]);

  useEffect(() => {
    (async () => {
      if (isError) {
        removeHeader('Authorization');
        await removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      }
    })();
  }, [isError]);

  return {isSuccess, isError};
}

function useGetProfile(queryOptions?: UseQueryCustomOptions<Profile>) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    retry: false,
    ...queryOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      removeHeader('Authorization');
      await removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      queryClient.removeQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: newProfile => {
      queryClient.setQueryData(
        [queryKeys.AUTH, queryKeys.GET_PROFILE],
        newProfile,
      );
    },
    ...mutationOptions,
  });
}

function useWithdrawUser(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: withdrawUser,
    onSuccess: async () => {
      removeHeader('Authorization');
      await removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      queryClient.removeQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const loginMutation = useEmailLogin();
  const kakaoLoginMutation = useKakaoLogin();
  const naverLoginMutation = useNaverLogin();
  const appleLoginMutation = useAppleLogin();
  const refreshTokenQuery = useGetRefreshToken();
  const {data, isSuccess: isLogin} = useGetProfile({
    enabled: refreshTokenQuery.isSuccess,
  });
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();
  const withdrawMutation = useWithdrawUser();

  return {
    auth: {
      id: data?.id || '',
      nickname: data?.nickname || '',
      email: data?.email || '',
      imageUri: data?.imageUri || '',
      loginType: data?.loginType || 'email',
    },
    signupMutation,
    loginMutation,
    kakaoLoginMutation,
    naverLoginMutation,
    appleLoginMutation,
    isLogin,
    logoutMutation,
    profileMutation,
    withdrawMutation,
  };
}

export default useAuth;
