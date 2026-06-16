import EncryptedStorage from 'react-native-encrypted-storage';

async function setEncryptStorage<T>(key: string, data: T) {
  await EncryptedStorage.setItem(key, JSON.stringify(data));
}

async function getEncryptStorage(key: string) {
  const storedData = await EncryptedStorage.getItem(key);

  return storedData ? JSON.parse(storedData) : null;
}

async function removeEncryptStorage(key: string) {
  try {
    const data = await getEncryptStorage(key);
    if (data) {
      await EncryptedStorage.removeItem(key);
    }
  } catch {
    // 키 없음 또는 Keychain 오류 시 무시
  }
}

export {setEncryptStorage, getEncryptStorage, removeEncryptStorage};
