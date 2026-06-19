import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActionSheet} from '../common/ActionSheet';

interface EditProfileActionSheetProps {
  isVisible: boolean;
  onChangeImage: () => void;
  hideAction: () => void;
}

function EditProfileActionSheet({
  isVisible,
  onChangeImage,
  hideAction,
}: EditProfileActionSheetProps) {
  const {t} = useTranslation();
  return (
    <ActionSheet isVisible={isVisible} hideAction={hideAction}>
      <ActionSheet.Background>
        <ActionSheet.Container>
          <ActionSheet.Button onPress={onChangeImage}>
            {t('setting.selectFromAlbum')}
          </ActionSheet.Button>
        </ActionSheet.Container>
        <ActionSheet.Container>
          <ActionSheet.Button onPress={hideAction}>{t('common.cancel')}</ActionSheet.Button>
        </ActionSheet.Container>
      </ActionSheet.Background>
    </ActionSheet>
  );
}

export default EditProfileActionSheet;
