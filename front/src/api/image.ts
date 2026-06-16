import {supabase} from './supabase';
import {Image} from 'react-native-image-crop-picker';

async function uploadImages(images: Image[]): Promise<string[]> {
  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error('인증이 필요합니다.');
  }

  const bucketName = 'images';
  const uuid = crypto.randomUUID();
  const uploadPromises = images.map(async (image, index) => {
    // React Native의 이미지 URI를 Blob으로 변환
    const response = await fetch(image.path);
    const blob = await response.blob();

    const fileExtension = image.mime?.split('/')[1] || 'jpg';
    const fileName = `${uuid}_${index}.${fileExtension}`;
    const filePath = `original/${fileName}`;

    const {error: uploadError} = await supabase.storage
      .from(bucketName)
      .upload(filePath, blob, {
        contentType: image.mime || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
    }

    // Public URL 생성
    const {
      data: {publicUrl},
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return publicUrl;
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
}

export {uploadImages};
