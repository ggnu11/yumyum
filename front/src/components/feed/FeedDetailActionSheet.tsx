import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';

import useMutateDeletePost from '@/hooks/queries/useMutateDeletePost';
import {FeedStackParamList} from '@/types/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {ActionSheet} from '../common/ActionSheet';

interface FeedDetailActionSheetProps {
  id: number;
  isVisible: boolean;
  hideAction: () => void;
}

type Navigation = StackNavigationProp<FeedStackParamList>;

function FeedDetailActionSheet({
  id,
  isVisible,
  hideAction,
}: FeedDetailActionSheetProps) {
  const {t} = useTranslation();
  const navigation = useNavigation<Navigation>();
  const deletePost = useMutateDeletePost();

  const handleDeletePost = () => {
    Alert.alert(t('feed.confirmDelete'), t('feed.deleteDescription'), [
      {
        text: t('common.delete'),
        onPress: () =>
          deletePost.mutate(id, {
            onSuccess: () => {
              hideAction();
              navigation.goBack();
            },
          }),
        style: 'destructive',
      },
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
    ]);
  };

  const handleEditPost = () => {
    navigation.navigate('EditLocation', {id});
    hideAction();
  };

  return (
    <ActionSheet isVisible={isVisible} hideAction={hideAction}>
      <ActionSheet.Background>
        <ActionSheet.Container>
          <ActionSheet.Button isDanger onPress={handleDeletePost}>
            {t('feed.delete')}
          </ActionSheet.Button>
          <ActionSheet.Divider />
          <ActionSheet.Button onPress={handleEditPost}>
            {t('feed.edit')}
          </ActionSheet.Button>
        </ActionSheet.Container>
        <ActionSheet.Container>
          <ActionSheet.Button onPress={hideAction}>{t('common.cancel')}</ActionSheet.Button>
        </ActionSheet.Container>
      </ActionSheet.Background>
    </ActionSheet>
  );
}

export default FeedDetailActionSheet;
