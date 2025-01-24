import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { fetchCoinsData, fetchTickerData } from '@/api/axios';
import { CURRENCIES } from '@/constants/Api';
import { TCoinData, TCoinsContext, TOption, TTickerData } from '@/types/types';

const CoinsContext = createContext<TCoinsContext>({
  currency: 'gbp',
  setCurrency: () => {},
  price: '0',
  setPrice: () => {},
  selectedTickerOption: null,
  setSelectedTickerOption: () => {},
  ticker: 'btc',
  setTicker: () => {},
  reloading: false,
  setReloading: () => {},
  tickerOptions: null,
  setTickerOptions: () => {},
  tickerData: null,
  setTickerData: () => {},
  firstTwentyCoinsData: [],
  setFirstTwentyCoinsData: () => {},
  fetchingData: true,
  rotating: false,
  setFetchingData: () => {},
  handleTickerSelect: () => {},
  handleCurrencyChange: () => {},
  formatCurrency: (amount: number, currency: string) => {
    // Example implementation of formatCurrency
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  },
});

export const useCoins = () => {
  return useContext(CoinsContext);
};

export const CoinsProvider = ({ children }: any) => {
  const [currency, setCurrency] = useState<keyof typeof CURRENCIES>('usd');
  const [price, setPrice] = useState<string>('0');
  const [selectedTickerOption, setSelectedTickerOption] =
    useState<TOption | null>(null);
  const [ticker, setTicker] = useState('btc-bitcoin');
  const [reloading, setReloading] = useState(false);
  const [tickerOptions, setTickerOptions] = useState<TOption[]>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [tickerData, setTickerData] = useState<TTickerData>();
  const [firstTwentyCoinsData, setFirstTwentyCoinsData] = useState<TCoinData[]>(
    []
  );
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [rotating, setRotating] = useState<boolean>(true);

  const handleTickerSelect = (value: string) => {
    setTicker(value);
    setFetchingData(true);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const handleCurrencyChange = (newCurrency: keyof typeof CURRENCIES) => {
    setCurrency(newCurrency);
    setFetchingData(true);
  };

  useEffect(() => {
    const _tickerOptions: TOption[] = firstTwentyCoinsData.map((coin) => ({
      label: `${coin.name.toUpperCase()} - ${coin.symbol}`,
      value: coin.id,
    }));

    _tickerOptions ? setTickerOptions(() => _tickerOptions) : [];

    const _tickers: string[] = firstTwentyCoinsData.map((coin) => coin.id);
    _tickers ? setTickers(_tickers) : [];
    console.log(
      '🚀  |  file: coinsContext.tsx:93  |  useEffect  |  _tickers:',
      _tickers
    );
  }, [firstTwentyCoinsData]);

  useEffect(() => {
    const fetchFirstTwentyCoinsData = async () => {
      const _coinsData = await fetchCoinsData();
      const _firstTwentyCoins: [] = _coinsData.slice(0, 20);
      setFirstTwentyCoinsData(_firstTwentyCoins);
    };
    if (firstTwentyCoinsData.length === 0) {
      fetchFirstTwentyCoinsData();
    }
  }, []);

  useEffect(() => {
    const _selectedTickerOption = tickerOptions.find(
      (option) => option.value === ticker
    );
    console.log(
      '🚀  |  file: coinsContext.tsx:119  |  useEffect  |  ticker:',
      ticker
    );
    if (_selectedTickerOption) setSelectedTickerOption(_selectedTickerOption);
  }, [tickerOptions, ticker]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (reloading || fetchingData) {
          setFetchingData(true);
          const _tickerData = await fetchTickerData(ticker, currency);
          console.log(
            '🚀  |  file: coinsContext.tsx:135  |  fetchData  |  _tickerData:',
            _tickerData
          );

          setTickerData(() => _tickerData);
          setPrice(() =>
            _tickerData
              ? formatCurrency(
                  Math.round(
                    _tickerData.quotes[CURRENCIES[currency]].price * 100
                  ) / 100,
                  CURRENCIES[currency]
                )
              : '0'
          );
        }
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
      } finally {
        setTimeout(() => {
          setReloading(false);
          setFetchingData(false);
        }, 750);
      }
    };

    fetchData();
  }, [reloading, fetchingData, tickerOptions]);

  return (
    <CoinsContext.Provider
      value={{
        currency,
        setCurrency,
        price,
        setPrice,
        selectedTickerOption,
        setSelectedTickerOption,
        ticker,
        setTicker,
        reloading,
        setReloading,
        tickerOptions,
        setTickerOptions,
        tickerData,
        setTickerData,
        firstTwentyCoinsData,
        setFirstTwentyCoinsData,
        fetchingData,
        rotating,
        setFetchingData,
        handleTickerSelect,
        handleCurrencyChange,
        formatCurrency,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};
