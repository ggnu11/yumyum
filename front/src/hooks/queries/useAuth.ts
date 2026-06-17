import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';

import {
  appleLogin,
  editProfile,
  getProfile,
  logout,
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

function useAppleLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: appleLogin,
    onSuccess: async ({refreshToken}) => {
      await setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH],
      });
    },
    throwOnError: true,
    ...mutationOptions,
  });
}

function useGetRefreshToken() {
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
        await setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
      }
    })();
  }, [isSuccess, data]);

  useEffect(() => {
    (async () => {
      if (isError) {
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
      await removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      queryClient.resetQueries({queryKey: [queryKeys.AUTH]});
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
      await removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      queryClient.resetQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useAuth() {
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
    appleLoginMutation,
    isLogin,
    logoutMutation,
    profileMutation,
    withdrawMutation,
  };
}

export default useAuth;
