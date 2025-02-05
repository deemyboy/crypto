import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { fetchTickerData } from '@/api/axios';
import { isEqualWith } from 'lodash';

import { getStoredObject, storeObject } from '@/storage/storage';
import {
  DEFAULT,
  DEFAULT_TICKERS_SELECTED_FOR_UI,
  DEFAULT_CURRENCIES_SELECTED_FOR_UI,
  SPECS_CURRENCIES,
  SPECS_TICKERS,
} from '@/constants/Api';
import { debounce, getCurrency, getTicker } from '@/utils/utils';
import {
  CoinsContextType,
  Option,
  TickerData,
  CombinedTickerDataType,
  CurrencyKey,
  CurrencyValue,
  TickerKey,
  CoinState,
} from '@/types/types';
import { usePersistedSettings } from '@/hooks/usePersistedSettings';

const getDynamicAvailableState = <T extends Record<string, boolean>>(
  specs: Record<string, string>,
  defaults: Record<string, boolean>
): Record<string, boolean> => {
  return Object.keys(specs).reduce((acc, key) => {
    acc[key] = defaults[key as keyof typeof defaults] ?? false;
    return acc;
  }, {} as Record<string, boolean>);
};

const CoinsContext = createContext<CoinsContextType>({
  coinState: {
    currencyKey: DEFAULT.currencyKey,
    tickerKey: DEFAULT.tickerKey,
  },
  setCoinState: () => {},
  selectedTickerOption: null,
  refreshing: false,
  setRefreshing: () => {},
  tickerOptions: [],
  setTickerOptions: () => {},
  handleTickerSelect: () => {},
  handleCurrencyChange: () => {},
  combinedTickerData: null,
  availableTickers: {} as Record<string, boolean>,
  setAvailableTickers: () => {},
  availableCurrencies: {} as Record<string, boolean>,
  setAvailableCurrencies: () => {},
  selectedCurrenciesForUI: [],
  setSelectedCurrenciesForUI: () => {},
  selectedTickersForUI: [],
  setSelectedTickersForUI: () => {},
});

export const useCoins = () => {
  return useContext(CoinsContext);
};

export const CoinsProvider = ({ children }: any) => {
  const { saveSettings, loadPersistedSettings } = usePersistedSettings();
  const [combinedTickerData, setCombinedTickerData] =
    // @ts-ignore - empty object allows for dynamic typing/extension
    useState<CombinedTickerDataType>({});
  const [refreshing, setRefreshing] = useState(true);
  const [selectedTickerOption, setSelectedTickerOption] = useState<Option | null>(null);
  const [tickerOptions, setTickerOptions] = useState<Option[]>([]);

  const [availableCurrencies, setAvailableCurrencies] = useState<Record<CurrencyKey, boolean>>(
    getDynamicAvailableState(SPECS_CURRENCIES, DEFAULT_CURRENCIES_SELECTED_FOR_UI)
  );
  const [availableTickers, setAvailableTickers] = useState<Record<TickerKey, boolean>>(
    getDynamicAvailableState(SPECS_TICKERS, DEFAULT_TICKERS_SELECTED_FOR_UI)
  );

  const getSelectedCurrenciesForUI = (currenciesAvailable: Record<CurrencyKey, boolean>) => {
    return Object.keys(currenciesAvailable).filter((key) => currenciesAvailable[key as CurrencyKey]) as CurrencyKey[];
  };
  const getSelectedTickersForUI = (tickersAvailable: Record<TickerKey, boolean>) => {
    return Object.keys(tickersAvailable).filter((key) => tickersAvailable[key as TickerKey]) as TickerKey[];
  };

  const [selectedCurrenciesForUI, setSelectedCurrenciesForUI] = useState<CurrencyKey[]>(
    getSelectedCurrenciesForUI(availableCurrencies)
  );

  const [selectedTickersForUI, setSelectedTickersForUI] = useState<TickerKey[]>(
    getSelectedTickersForUI(availableTickers)
  );

  const storedSettings = getStoredObject('settings');
  const [coinState, setCoinState] = useState<CoinState>({
    currencyKey: storedSettings?.currencyKey || DEFAULT.currencyKey,
    tickerKey: storedSettings?.tickerKey || DEFAULT.tickerKey,
  });
  console.log('🚀  |  coinsContext.tsx:104  |  CoinsProvider  |  coinState:', coinState);

  const formatCurrency = (amount: number, value: CurrencyValue) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: value,
    }).format(amount);
  };

  const fetchPriceData = useCallback(
    async (currentTicker: string, selectedCurrenciesAsParams: string) => {
      try {
        const _tickerData = await fetchTickerData(currentTicker, selectedCurrenciesAsParams);

        return _tickerData;
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
      } finally {
        setRefreshing(false);
      }
    },
    [refreshing, selectedCurrenciesForUI, selectedTickersForUI]
  );

  const handleCurrencyChange = (newCurrencyKey: CurrencyKey) => {
    setCoinState((prev) => ({
      ...prev,
      currencyKey: newCurrencyKey,
    }));
  };

  const handleTickerSelect = (newTickerKey: TickerKey) => {
    const _selectedTickerOption = tickerOptions.find((option) => option.value === newTickerKey);

    setCoinState((prev) => ({
      ...prev,
      tickerKey: newTickerKey,
    }));

    if (_selectedTickerOption) setSelectedTickerOption(_selectedTickerOption);
  };

  const makePrice = (amount: string, currencyValue: CurrencyValue) => {
    return formatCurrency(Math.round(+amount * 100) / 100, currencyValue);
  };

  const makeTickerOptions = (optionsData: TickerKey[]) => {
    const _tickersOptions: Option[] = optionsData.map((key) => {
      const value = getTicker(key);
      return {
        label: `${value.split('-')[1].toUpperCase()} - ${value.split('-')[0].toUpperCase()}`,
        value: key,
      };
    });

    if (_tickersOptions.length) {
      setTickerOptions(_tickersOptions);
      setSelectedTickerOption(_tickersOptions[0]);
    }
  };

  useEffect(() => {
    const fetchAllTickerData = async () => {
      const _tickers = selectedTickersForUI.map((key) => getTicker(key)) as Array<string>;
      const _currencies = selectedCurrenciesForUI.map((key) => getCurrency(key)).join(',') as string;

      const results = await Promise.all(
        _tickers.map(async (key) => {
          const data = await fetchPriceData(key, _currencies);
          return { key, data };
        })
      );

      const newCombinedData: CombinedTickerDataType = results.reduce(
        (acc, { key, data }: { key: string; data: TickerData }) => {
          Object.keys(data.quotes).forEach((ck) => {
            const currency = ck as CurrencyValue;

            data.quotes[currency].price =
              makePrice(data.quotes[currency].price.toString(), currency as CurrencyValue) || '0';
          });
          return {
            ...acc,
            [key]: data,
          };
        },
        {} as CombinedTickerDataType
      );

      setCombinedTickerData(newCombinedData);
    };

    fetchAllTickerData();
  }, [fetchPriceData]);

  useEffect(() => {
    if (selectedTickersForUI) makeTickerOptions(selectedTickersForUI);
  }, [selectedTickersForUI]);

  useEffect(() => {
    const _tickers = getSelectedTickersForUI(availableTickers);
    if (_tickers) setSelectedTickersForUI(_tickers);
  }, [availableTickers]);

  useEffect(() => {
    const _currencies = getSelectedCurrenciesForUI(availableCurrencies);
    if (_currencies) setSelectedCurrenciesForUI(_currencies);
  }, [availableCurrencies]);

  return (
    <CoinsContext.Provider
      value={{
        coinState,
        setCoinState,
        selectedTickerOption,
        setRefreshing,
        refreshing,
        tickerOptions,
        setTickerOptions,
        handleTickerSelect,
        handleCurrencyChange,
        combinedTickerData,
        availableTickers,
        setAvailableTickers,
        availableCurrencies,
        setAvailableCurrencies,
        selectedCurrenciesForUI,
        setSelectedCurrenciesForUI,
        selectedTickersForUI,
        setSelectedTickersForUI,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};
