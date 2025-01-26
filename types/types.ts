import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

export type TTicker = typeof SPECS_TICKERS;
export type TTickerKey = keyof TTicker;
export type TTickerValue = TTicker[TTickerKey];

export type TCurrency = typeof SPECS_CURRENCIES;
export type TCurrencyKey = keyof typeof SPECS_CURRENCIES;
export type TCurrencyValue =
  (typeof SPECS_CURRENCIES)[keyof typeof SPECS_CURRENCIES];

export type TCoinData = {
  id: string;
  is_active: boolean;
  is_new: boolean;
  name: string;
  rank: number;
  symbol: string;
  type: string;
};

export type TTickerData = {
  beta_value: number;
  first_data_at: string;
  id: string;
  last_updated: string;
  max_supply: number;
  name: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
  rank: number;
  symbol: string;
  total_supply: number;
};

export type TSimplifiedTickerData = {
  name: string;
  symbol: string;
  last_updated: string;
  quotes: {
    USD: { price: string };
    GBP: { price: string };
  };
};

export type TCombinedTickerData = {
  'btc-bitcoin': TSimplifiedTickerData | null;
  'eth-ethereum': TSimplifiedTickerData | null;
};

export type TPreferencesContext = {
  isThemeDark: boolean;
  toggleTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Option = {
  label: string;
  value: string;
};

export type TCoinsContext = {
  currency: TCurrencyValue;
  setCurrencyKey: React.Dispatch<React.SetStateAction<TCurrencyKey>>;
  price: string;
  selectedTickerOption: Option | null;
  ticker: TTickerValue;
  tickerKey: TTickerKey;
  setTickerKey: React.Dispatch<React.SetStateAction<TTickerKey>>;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  tickerOptions: Option[];
  tickerData?: TSimplifiedTickerData | null;
  fetchingData: boolean;
  setFetchingData: React.Dispatch<React.SetStateAction<boolean>>;
  handleTickerSelect: (value: TTickerKey) => void;
  handleCurrencyChange: (value: TCurrencyKey) => void;
  combinedTickerData: TCombinedTickerData | null;
};

export type TPrices = {
  gbp: string;
  usd: string;
};
