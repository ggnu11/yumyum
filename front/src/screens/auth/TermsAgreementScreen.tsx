import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import CustomButton from '@/components/common/CustomButton';
import {
  TermsHeader,
  TermsItemComponent,
  useTermsAgreement,
} from '@/components/terms';
import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import {AuthStackParamList} from '@/types/navigation';

type Navigation = StackNavigationProp<AuthStackParamList>;

function TermsAgreementScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();

  const {termsItems, handleItemCheck, isRequiredTermsChecked} =
    useTermsAgreement();

  const handleSpecificTermsDetail = (type: string, title: string) => {
    navigation.navigate('TermsDetail', {
      type: type,
      title: title,
    });
  };

  const handleAgree = () => {
    // TODO: API 연동 시 약관 동의 정보 저장
    // 임시로 AuthHome으로 돌아가기 (실제로는 프로필 설정 화면으로 이동)
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TermsHeader title={'서비스 이용을 위해\n이용약관 동의가 필요합니다.'} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {termsItems.map((item, index) => (
          <TermsItemComponent
            key={item.id}
            item={item}
            index={index}
            onItemCheck={handleItemCheck}
            onDetailPress={handleSpecificTermsDetail}
          />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          label="동의하고 시작하기"
          variant="filled"
          size="large"
          style={styles.agreeButton}
          onPress={handleAgree}
          disabled={!isRequiredTermsChecked()}
        />
      </View>
    </SafeAreaView>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme][0],
    },
    content: {
      flex: 1,
      paddingHorizontal: 30,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      paddingTop: 30,
    },
    agreeButton: {
      backgroundColor: colors[theme].BLUE_500,
      borderRadius: 10,
    },
  });

export default TermsAgreementScreen;
