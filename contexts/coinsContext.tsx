import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { fetchTickerData } from '@/api/axios';
import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import {
  TCoinData,
  TCoinsContext,
  Option,
  TTickerData,
  TTicker,
  TSimplifiedTickerData,
  TCurrency,
  TCombinedTickerData,
  TCurrencyKey,
  TCurrencyValue,
  TTickerKey,
  TTickerValue,
} from '@/types/types';

const CoinsContext = createContext<TCoinsContext>({
  currency: SPECS_CURRENCIES.usd,
  setCurrencyKey: () => {},
  price: '0',
  selectedTickerOption: null,
  ticker: SPECS_TICKERS.btc,
  tickerKey: 'btc',
  setTickerKey: () => {},
  refreshing: false,
  setRefreshing: () => {},
  tickerOptions: [],
  tickerData: null,
  fetchingData: true,
  setFetchingData: () => {},
  handleTickerSelect: () => {},
  handleCurrencyChange: () => {},
  combinedTickerData: null,
});

export const useCoins = () => {
  return useContext(CoinsContext);
};

export const CoinsProvider = ({ children }: any) => {
  const [currency, setCurrency] = useState<TCurrencyValue>(
    SPECS_CURRENCIES.usd
  );
  const [currencyKey, setCurrencyKey] = useState<TCurrencyKey>('usd');
  const [price, setPrice] = useState<string>('0');
  const [selectedTickerOption, setSelectedTickerOption] =
    useState<Option | null>(null);
  const [ticker, setTicker] = useState<TTickerValue>(SPECS_TICKERS.btc);
  const [tickerKey, setTickerKey] = useState<TTickerKey>('btc');
  const [refreshing, setRefreshing] = useState(false);
  const [tickerOptions, setTickerOptions] = useState<Option[]>([]);
  const [tickerData, setTickerData] = useState<TSimplifiedTickerData>();
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [combinedTickerData, setCombinedTickerData] =
    useState<TCombinedTickerData>({
      'btc-bitcoin': null,
      'eth-ethereum': null,
    });

  const handleTickerSelect = (newTickerKey: TTickerKey) => {
    console.log(
      '🚀  |  file: coinsContext.tsx:69  |  handleTickerSelect  |  newTickerKey:',
      newTickerKey
    );
    const _ticker = SPECS_TICKERS[newTickerKey];
    if (newTickerKey) setTickerKey(newTickerKey);
    const _selectedTickerOption = tickerOptions.find(
      (option) => option.value === _ticker
    );
    console.log(
      '🚀  |  file: coinsContext.tsx:77  |  handleTickerSelect  |  _selectedTickerOption:',
      _selectedTickerOption
    );
    if (_selectedTickerOption) setSelectedTickerOption(_selectedTickerOption);
  };

  const formatCurrency = (amount: number, key: TCurrencyKey) => {
    const _currency = SPECS_CURRENCIES[key];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: _currency,
    }).format(amount);
  };

  const handleCurrencyChange = (value: TCurrencyKey) => {
    if (value === 'gbp' || value === 'usd') {
      if (value !== currencyKey) {
        setCurrencyKey(() => value);
      }
    }
  };

  const makePrice = (amount: string) => {
    return formatCurrency(Math.round(+amount * 100) / 100, currencyKey);
  };

  const fetchPriceData = useCallback(
    async (currentTicker: string) => {
      try {
        const _tickerData = await fetchTickerData(currentTicker);

        return _tickerData;
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
      } finally {
        setTimeout(() => {
          setRefreshing(false);
        }, 100);
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
        (acc, { key, data }) => {
          // console.warn('Key:', key); // Log the key
          // console.warn('Data:', data); // Log the data
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
    const _tickersOptions: Option[] = Object.entries(optionsData).map(
      ([key, value]) => ({
        label: `${value.split('-')[1].toUpperCase()} - ${value
          .split('-')[0]
          .toUpperCase()}`,
        value: key,
      })
    );
    _tickersOptions ? setTickerOptions(() => _tickersOptions) : [];
    _tickersOptions ? setSelectedTickerOption(_tickersOptions[0]) : null;
  };

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    if (combinedTickerData) {
      const _currency = SPECS_CURRENCIES[currencyKey];

      setPrice(
        makePrice(combinedTickerData[ticker]?.quotes[_currency].price || '0')
      );
    }
  }, [currencyKey]);

  useEffect(() => {
    if (combinedTickerData) {
      const _currency = SPECS_CURRENCIES[currencyKey];

      setPrice(
        makePrice(combinedTickerData[ticker]?.quotes[_currency].price || '0')
      );
    }
  }, [combinedTickerData]);

  useEffect(() => {
    if (combinedTickerData) {
      const _currency = SPECS_CURRENCIES[currencyKey];

      setPrice(
        makePrice(combinedTickerData[ticker]?.quotes[_currency].price || '0')
      );
    }
  }, [tickerKey]);

  const initApp = () => {
    makeTickerOptions(SPECS_TICKERS);
    // fetchData();
    if (combinedTickerData) {
      const _currency = SPECS_CURRENCIES[currencyKey];

      setPrice(
        makePrice(combinedTickerData[ticker]?.quotes[_currency].price || '0')
      );
    }
  };

  return (
    <CoinsContext.Provider
      value={{
        currency,
        setCurrencyKey,
        price,
        selectedTickerOption,
        ticker,
        tickerKey,
        setTickerKey,
        refreshing,
        setRefreshing,
        tickerOptions,
        tickerData,
        fetchingData,
        setFetchingData,
        handleTickerSelect,
        handleCurrencyChange,
        combinedTickerData,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};
