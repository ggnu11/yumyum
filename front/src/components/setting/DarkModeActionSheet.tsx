import React from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native';
import {ActionSheet} from '../common/ActionSheet';
import useThemeStorage from '@/hooks/useThemeStorage';

interface DarkModeActionSheetProps {
  isVisible: boolean;
  hideAction: () => void;
}

function DarkModeActionSheet({
  isVisible,
  hideAction,
}: DarkModeActionSheetProps) {
  const {t} = useTranslation();
  const {theme, isSystem, setMode, setSystem} = useThemeStorage();
  const systemDefault = useColorScheme();

  const handlePressLight = () => {
    setMode('light');
    setSystem(false);
    hideAction();
  };

  const handlePressDark = () => {
    setMode('dark');
    setSystem(false);
    hideAction();
  };

  const handlePressSystem = () => {
    setMode(systemDefault ?? 'light');
    setSystem(true);
    hideAction();
  };

  return (
    <ActionSheet isVisible={isVisible} hideAction={hideAction}>
      <ActionSheet.Background>
        <ActionSheet.Container>
          <ActionSheet.Button
            onPress={handlePressLight}
            isChecked={isSystem === false && theme === 'light'}>
            {t('setting.lightMode')}
          </ActionSheet.Button>
          <ActionSheet.Divider />
          <ActionSheet.Button
            onPress={handlePressDark}
            isChecked={isSystem === false && theme === 'dark'}>
            {t('setting.darkModeOption')}
          </ActionSheet.Button>
          <ActionSheet.Divider />
          <ActionSheet.Button
            onPress={handlePressSystem}
            isChecked={isSystem === true}>
            {t('setting.systemDefault')}
          </ActionSheet.Button>
        </ActionSheet.Container>
        <ActionSheet.Container>
          <ActionSheet.Button onPress={hideAction}>{t('common.cancel')}</ActionSheet.Button>
        </ActionSheet.Container>
      </ActionSheet.Background>
    </ActionSheet>
  );
}

export default DarkModeActionSheet;
