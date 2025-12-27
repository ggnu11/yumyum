import axios from 'axios';
import {Platform} from 'react-native';
import {getEncryptStorage} from '@/utils/encryptStorage';
import {storageKeys} from '@/constants/keys';

export const BASE_URL = {
  android: 'http://10.0.2.2:3031',