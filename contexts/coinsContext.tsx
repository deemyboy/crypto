import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchTickerData } from '@/api/axios';

import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import {
  TCoinsContext,
  Option,
  TTickerData,
  TTicker,
  TCombinedTickerData,
  TCurrencyKey,
  TCurrencyValue,
  TTickerKey,
  TTickerValue,
} from '@/types/types';

const CoinsContext = createContext<TCoinsContext>({
  currency: SPECS_CURRENCIES.usd,
  selectedTickerOption: null,
  ticker: SPECS_TICKERS.btc,
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
  const [currency, setCurrency] = useState<TCurrencyValue>(SPECS_CURRENCIES.usd);
  const [currencyKey, setCurrencyKey] = useState<TCurrencyKey>('usd');
  const [selectedTickerOption, setSelectedTickerOption] = useState<Option | null>(null);
  const [ticker, setTicker] = useState<TTickerValue>(SPECS_TICKERS.btc);
  const [tickerKey, setTickerKey] = useState<TTickerKey>('btc');
  const [refreshing, setRefreshing] = useState(true);
  const [tickerOptions, setTickerOptions] = useState<Option[]>([]);
  const [combinedTickerData, setCombinedTickerData] =
    // @ts-ignore - empty object allows for dynamic typing/extension
    useState<TCombinedTickerData>({});

  const handleTickerSelect = (newTickerKey: TTickerKey) => {
    const _ticker = SPECS_TICKERS[newTickerKey];

    if (newTickerKey) setTickerKey(newTickerKey);
    if (_ticker) setTicker(_ticker);
    const _selectedTickerOption = tickerOptions.find((option) => option.value === newTickerKey);

    if (_selectedTickerOption) setSelectedTickerOption(_selectedTickerOption);
  };

  const formatCurrency = (amount: number, value: TCurrencyValue) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: value,
    }).format(amount);
  };
  const makePrice = (amount: string, currencyValue: TCurrencyValue) => {
    return formatCurrency(Math.round(+amount * 100) / 100, currencyValue);
  };

  const handleCurrencyChange = (key: TCurrencyKey) => {
    if (key in SPECS_CURRENCIES) {
      const _currency = SPECS_CURRENCIES[key];
      setCurrency(_currency);
      if (key !== currencyKey) {
        setCurrencyKey(key);
      }
    }
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

  const makeTickerOptions = (optionsData: TTicker) => {
    const _tickersOptions: Option[] = Object.entries(optionsData).map(([key, value]) => ({
      label: `${value.split('-')[1].toUpperCase()} - ${value.split('-')[0].toUpperCase()}`,
      value: key,
    }));
    _tickersOptions ? setTickerOptions(() => _tickersOptions) : [];
    _tickersOptions ? setSelectedTickerOption(_tickersOptions[0]) : null;
  };

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
