import axios from 'axios';
import {Platform} from 'react-native';
import {getEncryptStorage} from '@/utils/encryptStorage';
import {storageKeys} from '@/constants/keys';

export const BASE_URL = {
  android: 'http://10.0.2.2:3031',
  ios: 'http://localhost:3031',
};

const axiosInstance = axios.create({
  baseURL: Platform.OS === 'android' ? BASE_URL.android : BASE_URL.ios,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getEncryptStorage(storageKeys.ACCESS_TOKEN);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
