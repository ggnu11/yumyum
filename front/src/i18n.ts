import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Platform, NativeModules} from 'react-native';

import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

export type Language = 'ko' | 'en' | 'ja';

const supportedLanguages: Language[] = ['ko', 'en', 'ja'];

export function getDeviceLanguage(): Language {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'ko'
      : NativeModules.I18nManager?.localeIdentifier || 'ko';

  const langCode = locale.split(/[-_]/)[0] as Language;
  return supportedLanguages.includes(langCode) ? langCode : 'ko';
}

i18n.use(initReactI18next).init({
  resources: {
    ko: {translation: ko},
    en: {translation: en},
    ja: {translation: ja},
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
