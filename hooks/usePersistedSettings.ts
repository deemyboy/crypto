import { useEffect } from 'react';
import { useCoins } from '@/contexts/coinsContext';
import { STORAGE_KEYS, storeObject, storeValue, getStoredObject, getStoredValue } from '@/storage/storage';
import { CurrencyKey, TickerKey, Option } from '@/types/types';

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

  const saveSettings = () => {
    storeObject(STORAGE_KEYS.COIN_STATE, coinState);
    storeObject(STORAGE_KEYS.SELECTED_CURRENCIES, selectedCurrenciesForUI);
    storeObject(STORAGE_KEYS.SELECTED_TICKERS, selectedTickersForUI);
    storeObject(STORAGE_KEYS.TICKER_OPTIONS, tickerOptions);
  };

  const loadPersistedSettings = () => {
    const storedCoinState = getStoredObject(STORAGE_KEYS.COIN_STATE);
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

  useEffect(() => {
    loadPersistedSettings();
  }, []);

  return { saveSettings, loadPersistedSettings };
};
