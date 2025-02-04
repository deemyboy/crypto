import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

/****** api *******/

export type DefaultsType = {
  ticker: TickerValue;
  tickerKey: TickerKey;
  currency: CurrencyValue;
  currencyKey: CurrencyKey;
  selectedTickers: Partial<TickerMap>[];
};

/****** CoinsContext *******/

export type TickerMap = typeof SPECS_TICKERS;
export type TickerKey = keyof TickerMap;
export type TickerValue = TickerMap[TickerKey];

export type CurrencyMap = typeof SPECS_CURRENCIES;
export type CurrencyKey = keyof CurrencyMap; // "gbp" | "usd"
export type CurrencyValue = CurrencyMap[CurrencyKey]; // "GBP" | "USD"

export type CoinDataType = {
  id: string;
  is_active: boolean;
  is_new: boolean;
  name: string;
  rank: number;
  symbol: string;
  type: string;
};

export type TickerData = TickerPriceDataType & {
  beta_value: number;
  first_data_at: string;
  id: string;
  last_updated: string;
  max_supply: number;
  name: string;
  rank: number;
  symbol: string;
  total_supply: number;
};

export type Quotes = {
  [key in CurrencyValue]: {
    ath_date: string;
    ath_price: string;
    market_cap: string;
    market_cap_change_24h: string;
    percent_change_12h: string;
    percent_change_15m: string;
    percent_change_1h: string;
    percent_change_1y: string;
    percent_change_24h: string;
    percent_change_30d: string;
    percent_change_30m: string;
    percent_change_6h: string;
    percent_change_7d: string;
    percent_from_price_ath: string;
    price: string;
    volume_24h: string;
    volume_24h_change_24h: string;
  };
};

export type TickerPriceDataType = {
  quotes: Quotes;
};

export type SimplifiedTickerDataType = {
  name: string;
  symbol: string;
  last_updated: string;
  quotes: Quotes;
};

export type CombinedTickerDataType = {
  [key in TickerValue]: SimplifiedTickerDataType | null;
};

export type PreferencesContextType = {
  isThemeDark: boolean;
  toggleTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Option = {
  label: string;
  value: string;
};

export type CoinState = {
  currencyKey: CurrencyKey;
  tickerKey: TickerKey;
};

export type CoinsContextType = {
  coinState: CoinState;
  setCoinState: React.Dispatch<React.SetStateAction<CoinState>>;
  selectedTickerOption: Option | null;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  tickerOptions: Option[];
  handleTickerSelect: (value: TickerKey) => void;
  handleCurrencyChange: (value: CurrencyKey) => void;
  combinedTickerData: CombinedTickerDataType | null;
  availableTickers: Record<TickerKey, boolean>;
  setAvailableTickers: React.Dispatch<React.SetStateAction<Record<TickerKey, boolean>>>;
  availableCurrencies: Record<CurrencyKey, boolean>;
  setAvailableCurrencies: React.Dispatch<React.SetStateAction<Record<CurrencyKey, boolean>>>;
  selectedCurrenciesForUI: CurrencyKey[]
  setSelectedCurrenciesForUI: React.Dispatch<React.SetStateAction<CurrencyKey[]>>;
  selectedTickersForUI: TickerKey[]]
  setSelectedTickersForUI: React.Dispatch<React.SetStateAction<TickerKey[]>>;
};

export type TickerQuote = {
  percent_change_15m: string;
  percent_change_1h: string;
  percent_change_6h: string;
  percent_change_12h: string;
  percent_change_24h: string;
  percent_change_30m: string;
  percent_change_30d: string;
  percent_change_7d: string;
  percent_change_1y: string;
  price: string;
};

/****** hooks *******/

// useTickerData

export type Trend = {
  key: string;
  value: string;
  isLast: boolean;
};

/****** components *******/

// toggle-panel.tsx
export type TogglePanelProps = {
  trendsPanelOpen: boolean;
  children?: React.ReactNode;
  toggleTrendsPanel: () => void;
};

// trend-box.tsx
export type TrendBoxProps = {
  trendsPanelOpen: boolean;
  trendKey: string;
  trendValue: string | undefined;
  toggleTrendsPanel: () => void;
  isLast: boolean;
};

// time-ago.tsx
export type TimeAgoProps = {
  timestamp: string | number | Date;
  interval?: number;
};
