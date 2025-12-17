import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomText from '@/components/common/CustomText';
import {colors} from '@/constants/colors';
import {TERMS_CONTENT} from '@/constants/termsContent';
import useThemeStore, {Theme} from '@/store/theme';
import {AuthStackParamList} from '@/types/navigation';

type Navigation = StackNavigationProp<AuthStackParamList>;
type Route = {
  key: string;
  name: string;
  params: {
    type: string;
    title: string;
  };
};

function TermsDetailScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();

  const {type, title} = route.params;
  const content = TERMS_CONTENT[type] || '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View style={styles.backButtonIcon} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{title}</CustomText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CustomText style={styles.contentText}>{content}</CustomText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[theme][0],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors[theme].GRAY_200,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    backButtonIcon: {
      width: 24,
      height: 24,
      backgroundColor: colors[theme].GRAY_300,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors[theme][100],
    },
    content: {
      flex: 1,
      paddingHorizontal: 30,
      paddingTop: 20,
    },
    contentText: {
      fontSize: 14,
      color: colors[theme][100],
      lineHeight: 22,
      paddingBottom: 40,
    },
  });

export default TermsDetailScreen;
