import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { fetchTickerData } from '@/api/axios';

import { getStoredObject, storeObject } from '@/storage/storage';
import {
  DEFAULT,
  DEFAULT_TICKERS_SELECTED_FOR_UI,
  DEFAULT_CURRENCIES_SELECTED_FOR_UI,
  SPECS_CURRENCIES,
  SPECS_TICKERS,
} from '@/constants/Api';
import { debounce } from '@/utils/utils';
import {
  CoinsContextType,
  Option,
  TickerData,
  CombinedTickerDataType,
  CurrencyKey,
  CurrencyValue,
  TickerKey,
  CoinState,
  CurrencyMap,
  TickerMap,
  TickerValue,
} from '@/types/types';

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
  availableTickers: {} as Record<string, boolean>,
  setAvailableTickers: () => {},
  availableCurrencies: {} as Record<string, boolean>,
  setAvailableCurrencies: () => {},
  selectedCurrenciesForUI: {} as Record<CurrencyKey, CurrencyValue>,
  setSelectedCurrenciesForUI: () => {},
  selectedTickersForUI: {} as Record<TickerKey, TickerValue>,
  setSelectedTickersForUI: () => {},
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

  const [availableCurrencies, setAvailableCurrencies] = useState<Record<CurrencyKey, boolean>>(
    getDynamicAvailableState(SPECS_CURRENCIES, DEFAULT_CURRENCIES_SELECTED_FOR_UI)
  );
  const [availableTickers, setAvailableTickers] = useState<Record<TickerKey, boolean>>(
    getDynamicAvailableState(SPECS_TICKERS, DEFAULT_TICKERS_SELECTED_FOR_UI)
  );

  const getSelectedCurrenciesForUI = (currenciesAvailable: Record<CurrencyKey, boolean>) => {
    const selectedCurrencies: Partial<Record<CurrencyKey, CurrencyValue>> = {};

    Object.entries(SPECS_CURRENCIES).forEach(([key, value]) => {
      const _currencyKey = key as CurrencyKey;
      const _currencyValue = value as CurrencyValue;

      if (currenciesAvailable[_currencyKey] && selectedCurrencies[_currencyKey] === undefined) {
        selectedCurrencies[_currencyKey] = _currencyValue;
      }
    });

    return selectedCurrencies;
  };

  const [selectedCurrenciesForUI, setSelectedCurrenciesForUI] = useState<Partial<Record<CurrencyKey, CurrencyValue>>>(
    getSelectedCurrenciesForUI(DEFAULT_CURRENCIES_SELECTED_FOR_UI)
  );

  const getSelectedTickersForUI = (tickersAvailable: Record<TickerKey, boolean>) => {
    const selectedTickers: Partial<Record<TickerKey, TickerValue>> = {};

    Object.entries(SPECS_TICKERS).forEach(([key, value]) => {
      if (tickersAvailable[key as TickerKey] && selectedTickers[key as TickerKey] === undefined) {
        selectedTickers[key as TickerKey] = value as TickerValue;
      }
    });

    return selectedTickers;
  };

  const [selectedTickersForUI, setSelectedTickersForUI] = useState<Partial<Record<TickerKey, TickerValue>>>(
    getSelectedTickersForUI(availableTickers)
  );

  const isFirstRender = useRef(true);

  const storedSettings = getStoredObject('settings');
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
    async (currentTicker: string, selectedCurrencies: string[]) => {
      try {
        const _tickerData = await fetchTickerData(currentTicker, selectedCurrencies);

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
    const _currency = SPECS_CURRENCIES[newCurrencyKey];

    setCoinState((prev) => ({
      ...prev,
      currencyKey: newCurrencyKey,
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

  const makeTickerOptions = (optionsData: Partial<Record<TickerKey, TickerValue>>) => {
    const _tickersOptions: Option[] = Object.entries(optionsData).map(([key, value]) => ({
      label: `${value.split('-')[1].toUpperCase()} - ${value.split('-')[0].toUpperCase()}`,
      value: key,
    }));
    _tickersOptions ? setTickerOptions(() => _tickersOptions) : [];
    _tickersOptions ? setSelectedTickerOption(_tickersOptions[0]) : null;
  };

  useEffect(() => {
    const fetchAllTickerData = async () => {
      const _tickers = Object.values(selectedTickersForUI) as Array<string>;
      const _currencies = Object.values(selectedCurrenciesForUI) as Array<string>;

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
    const storedSettings = getStoredObject('settings');
    if (storedSettings) {
      setCoinState((prev) => ({
        ...prev,
        ...storedSettings,
      }));
    }
  };

  const saveSettings = () => {
    setCoinState((prev) => {
      storeObject('settings', prev);
      return prev;
    });
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
