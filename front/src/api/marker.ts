import {Marker} from '@/types/domain';
import {supabase} from './supabase';

async function getMarkers(): Promise<Marker[]> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  const {data: posts, error} = await supabase
    .from('posts')
    .select('id, latitude, longitude, color, score')
    .eq('userId', user.id);

  if (error) {
    throw error;
  }

  return (posts || []) as Marker[];
}

export {getMarkers};
