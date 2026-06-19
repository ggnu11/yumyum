import {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';

import i18n from '@/i18n';
import useMutateImages from '@/hooks/queries/useMutateImages';
import {ImageUri} from '@/types/domain';
import {Alert} from 'react-native';

interface UseImagePickerProps {
  initialImages: ImageUri[];
  mode?: 'multiple' | 'single';
  onSettled?: () => void;
}

function useImagePicker({
  initialImages,
  mode = 'multiple',
  onSettled,
}: UseImagePickerProps) {
  const uploadImages = useMutateImages();
  const [imageUris, setImageUris] = useState<ImageUri[]>(initialImages);

  const addImageUris = (uris: string[]) => {
    setImageUris(prev => [...prev, ...uris.map(uri => ({uri}))]);
  };

  const deleteImageUri = (uri: string) => {
    const newImageUris = imageUris.filter(image => image.uri !== uri);
    setImageUris(newImageUris);
  };

  const replaceImageUri = (uris: string[]) => {
    if (uris.length > 1) {
      Alert.alert(i18n.t('image.maxExceeded'), i18n.t('image.maxOneImage'));
      return;
    }

    setImageUris([...uris.map(uri => ({uri}))]);
  };

  const handleChangeImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: mode === 'multiple',
      includeBase64: true,
      ...(mode === 'multiple' && {maxFiles: 5}),
    })
      .then(images => {
        const imageArray = Array.isArray(images) ? images : [images];
        uploadImages.mutate(imageArray, {
          onSuccess: data =>
            mode === 'multiple' ? addImageUris(data) : replaceImageUri(data),
          onSettled: () => onSettled && onSettled(),
        });
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.log('[error]', error);
          Toast.show({
            type: 'error',
            text1: i18n.t('image.checkPermission'),
            position: 'bottom',
          });
        }
      });
  };

  return {imageUris, handleChangeImage, delete: deleteImageUri};
}

export default useImagePicker;
