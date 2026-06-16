import {Post, ImageUri} from '@/types/domain';
import {supabase} from './supabase';

async function createPost(body: Omit<Post, 'id'>): Promise<Post> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  // Post 생성
  const {data: post, error: postError} = await supabase
    .from('posts')
    .insert({
      userId: user.id,
      latitude: body.latitude,
      longitude: body.longitude,
      color: body.color,
      address: body.address,
      title: body.title,
      description: body.description,
      date: body.date,
      score: body.score,
    })
    .select()
    .single();

  if (postError) {
    throw postError;
  }

  // Images 생성
  if (body.imageUris && body.imageUris.length > 0) {
    const images = body.imageUris.map(img => ({
      postId: post.id,
      uri: img.uri,
    }));

    const {error: imageError} = await supabase.from('images').insert(images);

    if (imageError) {
      console.error('이미지 저장 실패:', imageError);
    }
  }

  // 이미지 정보 포함하여 반환
  const {data: images} = await supabase
    .from('images')
    .select('*')
    .eq('postId', post.id)
    .order('id');

  return {
    ...post,
    imageUris: (images || []).map(img => ({id: img.id, uri: img.uri})),
  };
}

async function getPost(id: number): Promise<Post> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  const {data: post, error: postError} = await supabase
    .from('posts')
    .select('*, images(id, uri), favorites!left(id)')
    .eq('id', id)
    .eq('userId', user.id)
    .single();

  if (postError) {
    throw postError;
  }

  return {
    ...post,
    imageUris: (post.images || []).map((img: any) => ({id: img.id, uri: img.uri})),
    isFavorite: (post.favorites || []).length > 0,
  };
}

async function getPosts(page = 1): Promise<Post[]> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  const perPage = 10;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const {data: posts, error: postsError} = await supabase
    .from('posts')
    .select('*, images(id, uri)')
    .eq('userId', user.id)
    .order('date', {ascending: false})
    .range(from, to);

  if (postsError) {
    throw postsError;
  }

  return (posts || []).map(post => ({
    ...post,
    imageUris: (post.images || []).map((img: any) => ({id: img.id, uri: img.uri})),
  }));
}

async function deletePost(id: number) {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  // CASCADE로 images와 favorites도 자동 삭제됨
  const {error} = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('userId', user.id);

  if (error) {
    throw error;
  }
}

type RequestUpdatePost = {
  id: number;
  body: Omit<Post, 'id' | 'longitude' | 'latitude' | 'address'>;
};

async function updatePost({id, body}: RequestUpdatePost): Promise<Post> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  // Post 업데이트
  const {data: post, error: postError} = await supabase
    .from('posts')
    .update({
      color: body.color,
      title: body.title,
      description: body.description,
      date: body.date,
      score: body.score,
    })
    .eq('id', id)
    .eq('userId', user.id)
    .select()
    .single();

  if (postError) {
    throw postError;
  }

  // 기존 이미지 삭제 후 새 이미지 추가
  if (body.imageUris) {
    await supabase.from('images').delete().eq('postId', id);

    if (body.imageUris.length > 0) {
      const images = body.imageUris.map(img => ({
        postId: id,
        uri: img.uri,
      }));

      await supabase.from('images').insert(images);
    }
  }

  // 업데이트된 이미지 정보 가져오기
  const {data: images} = await supabase
    .from('images')
    .select('*')
    .eq('postId', id)
    .order('id');

  return {
    ...post,
    imageUris: (images || []).map(img => ({id: img.id, uri: img.uri})),
  };
}

async function getFavoritePosts(page = 1): Promise<Post[]> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  const perPage = 10;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Favorites를 통해 Post 가져오기
  const {data: favorites, error: favoritesError} = await supabase
    .from('favorites')
    .select('postId')
    .eq('userId', user.id)
    .range(from, to);

  if (favoritesError) {
    throw favoritesError;
  }

  if (!favorites || favorites.length === 0) {
    return [];
  }

  const postIds = favorites.map(f => f.postId);

  const {data: posts, error: postsError} = await supabase
    .from('posts')
    .select('*, images(id, uri)')
    .in('id', postIds)
    .order('date', {ascending: false});

  if (postsError) {
    throw postsError;
  }

  return (posts || []).map(post => ({
    ...post,
    imageUris: (post.images || []).map((img: any) => ({id: img.id, uri: img.uri})),
    isFavorite: true,
  }));
}

async function updateFavoritePost(id: number): Promise<number> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  // 기존 favorite 확인
  const {data: existingFavorite} = await supabase
    .from('favorites')
    .select('id')
    .eq('postId', id)
    .eq('userId', user.id)
    .single();

  if (existingFavorite) {
    // 삭제
    const {error} = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    if (error) {
      throw error;
    }
    return 0;
  } else {
    // 추가
    const {data, error} = await supabase
      .from('favorites')
      .insert({
        postId: id,
        userId: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data.id;
  }
}

export type CalendarPost = {
  id: number;
  title: string;
  address: string;
};

export type ResponseCalendarPost = Record<number, CalendarPost[]>;

async function getCalendarPosts(
  year: number,
  month: number,
): Promise<ResponseCalendarPost> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  // 해당 월의 시작일과 종료일 계산
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const {data: posts, error: postsError} = await supabase
    .from('posts')
    .select('id, title, address, date')
    .eq('userId', user.id)
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', {ascending: true});

  if (postsError) {
    throw postsError;
  }

  // 날짜별로 그룹화
  const grouped: ResponseCalendarPost = {};

  (posts || []).forEach(post => {
    const date = new Date(post.date);
    const day = date.getDate();

    if (!grouped[day]) {
      grouped[day] = [];
    }

    grouped[day].push({
      id: post.id,
      title: post.title,
      address: post.address,
    });
  });

  return grouped;
}

export {
  createPost,
  getPost,
  getPosts,
  deletePost,
  updatePost,
  updateFavoritePost,
  getFavoritePosts,
  getCalendarPosts,
};
