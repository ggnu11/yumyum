import axios from 'axios';
import Config from 'react-native-config';

export const BASE_URL = Config.API_BASE_URL || 'http://localhost:3030';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
