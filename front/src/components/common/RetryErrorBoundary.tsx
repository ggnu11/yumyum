import {colors} from '@/constants/colors';
import useThemeStore, {Theme} from '@/store/theme';
import {useQueryErrorResetBoundary} from '@tanstack/react-query';
import React, {PropsWithChildren} from 'react';
import {useTranslation} from 'react-i18next';
import {ErrorBoundary} from 'react-error-boundary';
import {StyleSheet, Text, View} from 'react-native';
import CustomButton from './CustomButton';

function RetryErrorBoundary({children}: PropsWithChildren) {
  const {t} = useTranslation();
  const {reset} = useQueryErrorResetBoundary();
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({resetErrorBoundary}) => (
        <View style={styles.container}>
          <Text style={styles.titleText}>{t('common.retryMessage')}</Text>
          <Text style={styles.descriptionText}>
            {t('common.requestFailed')}
          </Text>
          <CustomButton
            label={t('common.retry')}
            variant="outlined"
            onPress={resetErrorBoundary}
            style={{width: '50%'}}
          />
        </View>
      )}>
      {children}
    </ErrorBoundary>
  );
}

const styling = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: colors[theme].WHITE,
    },
    titleText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors[theme].BLACK,
    },
    descriptionText: {
      fontSize: 15,
      color: colors[theme].GRAY_500,
    },
  });

export default RetryErrorBoundary;
