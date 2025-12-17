import {LatLng} from 'react-native-maps';
import {SearchResultItem} from '@/types/api';
import axiosInstance from './axios';

interface GetMapPinsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  zoom_level?: number;
  filters?: string[]; // PRIVATE, FRIEND, Group_id_123 등
}

async function getMapPins(params: GetMapPinsParams): Promise<SearchResultItem[]> {
  const {data} = await axiosInstance.get('/map/pins', {
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      ...(params.radius && {radius: params.radius}),
      ...(params.zoom_level && {zoom_level: params.zoom_level}),
      ...(params.filters && params.filters.length > 0 && {filters: params.filters}),
    },
  });

  return data;
}

// 기존 호환성을 위한 함수 (deprecated)
async function getMarkers(): Promise<any[]> {
  const {data} = await axiosInstance.get('/markers');
  return data;
}

export {getMapPins, getMarkers};
