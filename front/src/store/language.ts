import {create} from 'zustand';
import {Language} from '@/i18n';

interface LanguageState {
  language: Language;
  isSystem: boolean;
  setLanguage: (language: Language) => void;
  setSystemLanguage: (isSystem: boolean) => void;
}

const useLanguageStore = create<LanguageState>(set => ({
  language: 'ko',
  isSystem: true,
  setLanguage: (language: Language) => {
    set(state => ({...state, language}));
  },
  setSystemLanguage: (isSystem: boolean) => {
    set(state => ({...state, isSystem}));
  },
}));

export default useLanguageStore;
