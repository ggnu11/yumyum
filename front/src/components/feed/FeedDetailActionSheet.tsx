import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, StyleSheet} from 'react-native';

import useMutateDeletePost from '@/hooks/queries/useMutateDeletePost';
import {FeedStackParamList} from '@/types/navigation';
import {StackNavigationProp} from '@react-navigation/stack';
import CommonActionSheet from '../common/CommonActionSheet';

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
  const navigation = useNavigation<Navigation>();
  const deletePost = useMutateDeletePost();

  const handleDeletePost = () => {
    Alert.alert('삭제하시겠습니까?', '피드와 지도에서 모두 삭제됩니다.', [
      {
        text: '삭제',
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
        text: '취소',
        style: 'cancel',
      },
    ]);
  };

  const handleEditPost = () => {
    navigation.navigate('EditLocation', {id});
    hideAction();
  };

  // ActionSheet 액션들 정의
  const actionSheetActions = [
    {
      text: '삭제하기',
      onPress: handleDeletePost,
      isDanger: true,
    },
    {
      text: '수정하기',
      onPress: handleEditPost,
    },
    {
      text: '취소',
      onPress: hideAction,
      isCancel: true,
    },
  ];

  return (
    <CommonActionSheet
      isVisible={isVisible}
      onClose={hideAction}
      actions={actionSheetActions}
    />
  );
}

const styles = StyleSheet.create({});

export default FeedDetailActionSheet;
