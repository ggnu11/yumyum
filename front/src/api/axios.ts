import axios from 'axios';
import {Platform} from 'react-native';

export const BASE_URL = {
  android: 'http://43.200.183.61:3030',
  ios: 'http://43.200.183.61:3030', // ← EC2 IP로 변경!
};
const axiosInstance = axios.create({
  baseURL: Platform.OS === 'android' ? BASE_URL.android : BASE_URL.ios,
});

// Request 인터셉터
axiosInstance.interceptors.request.use(
  config => {
    console.log('[axios] 요청:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasAuth: !!config.headers?.Authorization,
    });
    return config;
  },
  error => {
    console.error('[axios] 요청 에러:', error);
    return Promise.reject(error);
  },
);

// Response 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    console.log('[axios] 응답 성공:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('[axios] 응답 에러:', {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      fullURL: `${error?.config?.baseURL}${error?.config?.url}`,
      data: error?.response?.data,
    });
    return Promise.reject(error);
  },
);

export default axiosInstance;
