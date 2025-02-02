import { CoinState } from '@/types/types';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const storeValue = (key: string, value: string) => {
  storage.set(key, value);
};

export const storeObject = (key: string, value: object) => {
  storage.set(key, JSON.stringify(value));
};

export const getStoredValue = (key: string): string | null => {
  return storage.getString(key) ?? null;
};

export const getStoredObject = (key: string): Partial<CoinState> | null => {
  const json = storage.getString(key);
  return json ? JSON.parse(json) : null;
};
