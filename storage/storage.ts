import { CoinState } from '@/types/types';
import { MMKVLoader } from 'react-native-mmkv-storage';

export const MMKV = new MMKVLoader().withInstanceID('default').initialize();

export const storeValue = (key: string, value: string) => {
  MMKV.setString(key, value);
};

export const storeObject = (key: string, value: object) => {
  MMKV.setMap(key, value);
};

export const getStoredValue = (key: string): string | null => {
  return MMKV.getString(key) ?? null;
};

export const getStoredObject = (key: string): Partial<CoinState> | null => {
  return MMKV.getMap(key) ?? null;
};
