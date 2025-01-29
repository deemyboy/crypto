import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchTickerData } from '@/api/axios';

import { DEFAULT, SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import {
  TCoinsContext,
  Option,
  TTickerData,
  TCombinedTickerData,
  TCurrencyKey,
  TCurrencyValue,
  TTickerKey,
  TTickerValue,
  TTickerMap as TTickers,
} from '@/types/types';

const CoinsContext = createContext<TCoinsContext>({
  currency: DEFAULT.currency,
  selectedTickerOption: null,
  ticker: DEFAULT.ticker,
  tickerKey: 'btc',
  setTickerKey: () => {},
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
    useState<TCombinedTickerData>({});
  const [currency, setCurrency] = useState<TCurrencyValue>(DEFAULT.currency);
  const [currencyKey, setCurrencyKey] = useState<TCurrencyKey>(DEFAULT.currencyKey);
  const [refreshing, setRefreshing] = useState(true);
  const [selectedTickerOption, setSelectedTickerOption] = useState<Option | null>(null);
  const [ticker, setTicker] = useState<TTickerValue>(DEFAULT.ticker);
  const [tickerKey, setTickerKey] = useState<TTickerKey>(DEFAULT.tickerKey);
  const [tickerOptions, setTickerOptions] = useState<Option[]>([]);

  const formatCurrency = (amount: number, value: TCurrencyValue) => {
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

  const handleCurrencyChange = (key: TCurrencyKey) => {
    if (key in SPECS_CURRENCIES) {
      const _currency = SPECS_CURRENCIES[key];
      setCurrency(_currency);
      if (key !== currencyKey) {
        setCurrencyKey(key);
      }
    }
  };

  const handleTickerSelect = (newTickerKey: TTickerKey) => {
    const _ticker = SPECS_TICKERS[newTickerKey];

    if (newTickerKey) setTickerKey(newTickerKey);
    if (_ticker) setTicker(_ticker);
    const _selectedTickerOption = tickerOptions.find((option) => option.value === newTickerKey);

    if (_selectedTickerOption) setSelectedTickerOption(_selectedTickerOption);
  };

  const makePrice = (amount: string, currencyValue: TCurrencyValue) => {
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

      const newCombinedData: TCombinedTickerData = results.reduce(
        (acc, { key, data }: { key: string; data: TTickerData }) => {
          Object.keys(data.quotes).forEach((ck) => {
            const currency = ck as TCurrencyValue;

            data.quotes[currency].price =
              makePrice(data.quotes[currency].price.toString(), currency as TCurrencyValue) || '0';
          });
          return {
            ...acc,
            [key]: data,
          };
        },
        {} as TCombinedTickerData
      );

      setCombinedTickerData(newCombinedData);
    };

    fetchAllTickerData();
  }, [fetchPriceData]);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = () => {
    makeTickerOptions(SPECS_TICKERS);
  };

  return (
    <CoinsContext.Provider
      value={{
        currency,
        selectedTickerOption,
        ticker,
        tickerKey,
        setTickerKey,
        refreshing,
        setRefreshing,
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
