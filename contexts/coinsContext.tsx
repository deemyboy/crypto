import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { fetchTickerData } from '@/api/axios';
import { MMKV } from '@/storage/storage';

import { DEFAULT, SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import {
  CoinsContextType,
  Option,
  TickerData,
  CombinedTickerDataType,
  CurrencyKey,
  CurrencyValue,
  TickerKey,
  TickerValue,
  TickerMap as TTickers,
  CoinState,
} from '@/types/types';

const CoinsContext = createContext<CoinsContextType>({
  coinState: {
    currency: DEFAULT.currency,
    currencyKey: DEFAULT.currencyKey,
    ticker: DEFAULT.ticker,
    tickerKey: DEFAULT.tickerKey,
  },
  setCoinState: () => {},
  selectedTickerOption: null,
  refreshing: false,
  setRefreshing: () => {},
  tickerOptions: [],
  handleTickerSelect: () => {},
  handleCurrencyChange: () => {},
  combinedTickerData: null,
});

export const useCoins = () => {
  return useContext(CoinsContext);
};

export const CoinsProvider = ({ children }: any) => {
  const [combinedTickerData, setCombinedTickerData] =
    // @ts-ignore - empty object allows for dynamic typing/extension
    useState<CombinedTickerDataType>({});
  const [refreshing, setRefreshing] = useState(true);
  const [selectedTickerOption, setSelectedTickerOption] = useState<Option | null>(null);
  const [tickerOptions, setTickerOptions] = useState<Option[]>([]);

  const isFirstRender = useRef(true);

  const storedSettings = MMKV.getMap<Partial<CoinState>>('settings');
  const [coinState, setCoinState] = useState<CoinState>({
    currency: storedSettings?.currency || DEFAULT.currency,
    currencyKey: storedSettings?.currencyKey || DEFAULT.currencyKey,
    ticker: storedSettings?.ticker || DEFAULT.ticker,
    tickerKey: storedSettings?.tickerKey || DEFAULT.tickerKey,
  });

  const formatCurrency = (amount: number, value: CurrencyValue) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: value,
    }).format(amount);
  };

  const fetchPriceData = useCallback(
    async (currentTicker: string) => {
      try {
        const _tickerData = await fetchTickerData(currentTicker);

        return _tickerData;
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
      } finally {
        setRefreshing(false);
      }
    },
    [refreshing]
  );

  const handleCurrencyChange = (newCurrencyKey: CurrencyKey) => {
    const _currency = SPECS_CURRENCIES[newCurrencyKey];

    setCoinState((prev) => ({
      ...prev,
      currencyKey: newCurrencyKey, //
      currency: _currency,
    }));
  };

  const handleTickerSelect = (newTickerKey: TickerKey) => {
    const _ticker = SPECS_TICKERS[newTickerKey];
    const _selectedTickerOption = tickerOptions.find((option) => option.value === newTickerKey);

    setCoinState((prev) => ({
      ...prev,
      tickerKey: newTickerKey,
      ticker: _ticker,
    }));

    if (_selectedTickerOption) setSelectedTickerOption(_selectedTickerOption);
  };

  const makePrice = (amount: string, currencyValue: CurrencyValue) => {
    return formatCurrency(Math.round(+amount * 100) / 100, currencyValue);
  };

  const makeTickerOptions = (optionsData: TTickers) => {
    const _tickersOptions: Option[] = Object.entries(optionsData).map(([key, value]) => ({
      label: `${value.split('-')[1].toUpperCase()} - ${value.split('-')[0].toUpperCase()}`,
      value: key,
    }));
    _tickersOptions ? setTickerOptions(() => _tickersOptions) : [];
    _tickersOptions ? setSelectedTickerOption(_tickersOptions[0]) : null;
  };

  useEffect(() => {
    const fetchAllTickerData = async () => {
      const tickers = Object.values(SPECS_TICKERS) as Array<string>;

      const results = await Promise.all(
        tickers.map(async (key) => {
          const data = await fetchPriceData(key);
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
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        saveSettings();
      } else if (nextAppState === 'active') {
        loadPersistedSettings();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const loadPersistedSettings = () => {
    const storedSettings = MMKV.getMap<Partial<CoinState>>('settings');
    if (storedSettings) {
      setCoinState((prev) => ({
        ...prev,
        ...storedSettings,
      }));
    }
  };

  const saveSettings = () => {
    setCoinState((prev) => {
      MMKV.setMap('settings', prev);
      return prev; // Ensure we don’t modify state here
    });
  };

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const saveSettingsDebounced = useCallback(
    debounce(() => saveSettings(), 100),
    [coinState]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveSettingsDebounced();
  }, [coinState]);

  useEffect(() => {
    makeTickerOptions(SPECS_TICKERS);
  }, []);

  return (
    <CoinsContext.Provider
      value={{
        coinState,
        setCoinState,
        selectedTickerOption,
        setRefreshing,
        refreshing,
        tickerOptions,
        handleTickerSelect,
        handleCurrencyChange,
        combinedTickerData,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};
