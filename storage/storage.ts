import { MMKVLoader } from 'react-native-mmkv-storage';

export const MMKV = new MMKVLoader().withInstanceID('default').initialize();

export const storeData = (value: string) => {
  MMKV.setString('my-key', value);
};

export const storeDataAsJson = (value: object) => {
  MMKV.setMap('my-key', value);
};

export const getDataProperty = (): string | null => {
  return MMKV.getString('my-key') ?? null;
};

export const getDataObject = (): object | null => {
  return MMKV.getMap('my-key') ?? null;
};
