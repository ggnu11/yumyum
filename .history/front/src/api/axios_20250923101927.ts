import axios from 'axios';
import {Platform} from 'react-native';

export const BASE_URL = {
  android: 'http://10.0.2.2:3031',
  ios: 'http://localhost:3031',
};

const axiosInstance = axios.create({
  baseURL: Platform.OS === 'android' ? BASE_URL.android : BASE_URL.ios,
});

export default axiosInstance;
