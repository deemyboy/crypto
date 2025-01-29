import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

/****** api *******/

export type TDefaults = {
  ticker: TTickerValue;
  tickerKey: TTickerKey;
  currency: TCurrencyValue;
  currencyKey: TCurrencyKey;
};

/****** CoinsContext *******/

export type TTickerMap = typeof SPECS_TICKERS;
export type TTickerKey = keyof TTickerMap;
export type TTickerValue = TTickerMap[TTickerKey];

export type TCurrencyMap = typeof SPECS_CURRENCIES;
export type TCurrencyKey = keyof TCurrencyMap; // "gbp" | "usd"
export type TCurrencyValue = TCurrencyMap[TCurrencyKey]; // "GBP" | "USD"

export type TCoinData = {
  id: string;
  is_active: boolean;
  is_new: boolean;
  name: string;
  rank: number;
  symbol: string;
  type: string;
};

export type TTickerData = TTickerPriceData & {
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

export type TQuotes = {
  [key in TCurrencyValue]: {
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

export type TTickerPriceData = {
  quotes: TQuotes;
};

export type TSimplifiedTickerData = {
  name: string;
  symbol: string;
  last_updated: string;
  quotes: TQuotes;
};

export type TCombinedTickerData = {
  [key in TTickerValue]: TSimplifiedTickerData | null;
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
  selectedTickerOption: Option | null;
  ticker: TTickerValue;
  tickerKey: TTickerKey;
  setTickerKey: React.Dispatch<React.SetStateAction<TTickerKey>>;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  tickerOptions: Option[];
  handleTickerSelect: (value: TTickerKey) => void;
  handleCurrencyChange: (value: TCurrencyKey) => void;
  combinedTickerData: TCombinedTickerData | null;
};

export type TTickerQuote = {
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

export type TPrices = {
  gbp: string;
  usd: string;
};

/****** components *******/

// toggle-panel.tsx
export type TTogglePanelProps = {
  trendsPanelOpen: boolean;
  children?: React.ReactNode;
  toggleTrendsPanel: () => void;
};

// trend-box.tsx
export type TTrendBoxProps = {
  trendsPanelOpen: boolean;
  trendKey: string;
  trendValue: string | undefined;
  toggleTrendsPanel: () => void;
};

// time-ago.tsx
export type TimeAgoProps = {
  timestamp: string | number | Date;
  interval?: number;
};
