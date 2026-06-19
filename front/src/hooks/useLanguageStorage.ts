import {useEffect} from 'react';
import i18n, {getDeviceLanguage, Language} from '@/i18n';
import {storageKeys} from '@/constants/keys';
import useLanguageStore from '@/store/language';
import {getEncryptStorage, setEncryptStorage} from '@/utils/encryptStorage';

function useLanguageStorage() {
  const {language, isSystem, setLanguage, setSystemLanguage} =
    useLanguageStore();

  const setMode = async (lang: Language) => {
    await setEncryptStorage(storageKeys.LANGUAGE, lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const setSystem = async (flag: boolean) => {
    await setEncryptStorage(storageKeys.LANGUAGE_SYSTEM, flag);
    setSystemLanguage(flag);
    if (flag) {
      const deviceLang = getDeviceLanguage();
      setLanguage(deviceLang);
      i18n.changeLanguage(deviceLang);
    }
  };

  useEffect(() => {
    (async () => {
      const savedLang = await getEncryptStorage(storageKeys.LANGUAGE);
      const savedSystem =
        (await getEncryptStorage(storageKeys.LANGUAGE_SYSTEM)) ?? true;

      if (savedSystem) {
        const deviceLang = getDeviceLanguage();
        setLanguage(deviceLang);
        i18n.changeLanguage(deviceLang);
      } else if (savedLang) {
        setLanguage(savedLang);
        i18n.changeLanguage(savedLang);
      }
      setSystemLanguage(savedSystem);
    })();
  }, [setLanguage, setSystemLanguage]);

  return {language, isSystem, setMode, setSystem};
}

export default useLanguageStorage;
