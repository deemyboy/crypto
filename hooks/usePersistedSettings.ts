import { useCallback, useEffect, useRef, useState } from 'react';
import { useCoins } from '@/contexts/coinsContext';
import { STORAGE_KEYS, storeObject, storeValue, getStoredObject, getStoredValue } from '@/storage/storage';
import { CurrencyKey, TickerKey, Option } from '@/types/types';
import { AppState } from 'react-native';
import { debounce } from '@/utils/utils';

export const usePersistedSettings = () => {
  const {
    coinState,
    setCoinState,
    selectedCurrenciesForUI,
    setSelectedCurrenciesForUI,
    selectedTickersForUI,
    setSelectedTickersForUI,
    tickerOptions,
    setTickerOptions,
  } = useCoins();

  const isFirstRender = useRef(true);

  useEffect(() => {
    console.log('🚀 | usePersistedSettings initialized, forcing loadPersistedSettings...');
    loadPersistedSettings();
  }, []);

  useEffect(() => {
    console.log('🚀 | coinState updated: ', coinState);
    console.log('🚀 | selectedCurrenciesForUI updated: ', selectedCurrenciesForUI);
    console.log('🚀 | selectedTickersForUI updated: ', selectedTickersForUI);
    console.log('🚀 | tickerOptions updated: ', tickerOptions);
  }, [coinState, selectedCurrenciesForUI, selectedTickersForUI, tickerOptions]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      console.log('🚀  |  file: coinsContext.tsx:220  |  handleAppStateChange  |,nextAppState:', nextAppState);
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        saveSettingsDebounced();
      } else if (nextAppState === 'active') {
        loadPersistedSettings();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      console.log('🚀 | Removing AppState listener');
      subscription.remove();
    };
  }, []);

  const saveSettingsDebounced = useCallback(
    debounce(() => {
      console.log('🚀 | saveSettingsDebounced called');
      saveSettings();
    }, 100),
    [coinState]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveSettingsDebounced();
  }, [coinState]);

  const saveSettings = () => {
    if (AppState.currentState === 'inactive' || AppState.currentState === 'background') {
      console.log(`🚀  |  saveSettings called - ${AppState.currentState}`);
      storeObject(STORAGE_KEYS.COIN_STATE, coinState);
      console.log('🚀  |  usePersistedSettings.ts:24  |  saveSettings  |  coinState:', coinState);
      storeObject(STORAGE_KEYS.SELECTED_CURRENCIES, selectedCurrenciesForUI);
      storeObject(STORAGE_KEYS.SELECTED_TICKERS, selectedTickersForUI);
      storeObject(STORAGE_KEYS.TICKER_OPTIONS, tickerOptions);
    } else {
      console.log(`🚀  |  Not saving because app is ${AppState.currentState}`);
    }
  };

  const loadPersistedSettings = () => {
    if (AppState.currentState === 'inactive' || AppState.currentState === 'background') {
      console.log(`🚀  |  Not loading because app is ${AppState.currentState}`);

      return;
    }
    console.log(`🚀  |  loadPersistedSettings called - ${AppState.currentState}`);
    const storedCoinState = getStoredObject(STORAGE_KEYS.COIN_STATE);
    console.log('🚀  |  usePersistedSettings.ts:42  |  loadPersistedSettings  |  storedCoinState:', storedCoinState);
    const storedSelectedCurrencies = getStoredObject(STORAGE_KEYS.SELECTED_CURRENCIES);
    const storedSelectedTickers = getStoredObject(STORAGE_KEYS.SELECTED_TICKERS);
    const storedTickerOptions = getStoredObject(STORAGE_KEYS.TICKER_OPTIONS);

    if (storedCoinState) setCoinState((prev) => ({ ...prev, ...storedCoinState }));
    if (storedSelectedCurrencies) {
      setSelectedCurrenciesForUI(storedSelectedCurrencies as CurrencyKey[]);
    }

    if (storedSelectedTickers) {
      setSelectedTickersForUI(storedSelectedTickers as TickerKey[]);
    }

    if (storedTickerOptions) {
      setTickerOptions(storedTickerOptions as Option[]);
    }
  };

  return { saveSettings, loadPersistedSettings };
};
