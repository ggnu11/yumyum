import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActionSheet} from '../common/ActionSheet';
import useLanguageStorage from '@/hooks/useLanguageStorage';
import {Language} from '@/i18n';

interface LanguageActionSheetProps {
  isVisible: boolean;
  hideAction: () => void;
}

function LanguageActionSheet({
  isVisible,
  hideAction,
}: LanguageActionSheetProps) {
  const {t} = useTranslation();
  const {language, isSystem, setMode, setSystem} = useLanguageStorage();

  const handlePressLanguage = (lang: Language) => {
    setMode(lang);
    setSystem(false);
    hideAction();
  };

  const handlePressSystem = () => {
    setSystem(true);
    hideAction();
  };

  return (
    <ActionSheet isVisible={isVisible} hideAction={hideAction}>
      <ActionSheet.Background>
        <ActionSheet.Container>
          <ActionSheet.Button
            onPress={() => handlePressLanguage('ko')}
            isChecked={!isSystem && language === 'ko'}>
            {t('language.korean')}
          </ActionSheet.Button>
          <ActionSheet.Divider />
          <ActionSheet.Button
            onPress={() => handlePressLanguage('en')}
            isChecked={!isSystem && language === 'en'}>
            {t('language.english')}
          </ActionSheet.Button>
          <ActionSheet.Divider />
          <ActionSheet.Button
            onPress={() => handlePressLanguage('ja')}
            isChecked={!isSystem && language === 'ja'}>
            {t('language.japanese')}
          </ActionSheet.Button>
          <ActionSheet.Divider />
          <ActionSheet.Button
            onPress={handlePressSystem}
            isChecked={isSystem}>
            {t('language.systemDefault')}
          </ActionSheet.Button>
        </ActionSheet.Container>
        <ActionSheet.Container>
          <ActionSheet.Button onPress={hideAction}>
            {t('common.cancel')}
          </ActionSheet.Button>
        </ActionSheet.Container>
      </ActionSheet.Background>
    </ActionSheet>
  );
}

export default LanguageActionSheet;
