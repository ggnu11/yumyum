import axios from 'axios';
import {Platform} from 'react-native';

export const BASE_URL = {
  android: 'http://10.0.2.2:3030',
  ios: 'http://10.100.9.20:3030',
};

const axiosInstance = axios.create({
  baseURL: Platform.OS === 'android' ? BASE_URL.android : BASE_URL.ios,
});

export default axiosInstance;
