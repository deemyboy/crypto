import { CURRENCIES } from '@/constants/Api';

export type TOption = {
  label: string;
  value: string;
};

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

export type TCoinsContext = {
  currency: keyof typeof CURRENCIES;
  setCurrency: React.Dispatch<React.SetStateAction<keyof typeof CURRENCIES>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  selectedTickerOption: TOption | null;
  setSelectedTickerOption: React.Dispatch<React.SetStateAction<TOption | null>>;
  ticker: string;
  setTicker: React.Dispatch<React.SetStateAction<string>>;
  reloading: boolean; // Fix for the "reloading" property
  setReloading: React.Dispatch<React.SetStateAction<boolean>>;
  tickerOptions: TOption[] | null;
  setTickerOptions: React.Dispatch<React.SetStateAction<TOption[]>>;
  tickerData?: TTickerData | null;
  setTickerData: React.Dispatch<React.SetStateAction<TTickerData | undefined>>;
  firstTwentyCoinsData: TCoinData[];
  setFirstTwentyCoinsData: React.Dispatch<React.SetStateAction<TCoinData[]>>;
  fetchingData: boolean;
  setFetchingData: React.Dispatch<React.SetStateAction<boolean>>;
  rotating: boolean;
  handleTickerSelect: (value: string) => void;
  handleCurrencyChange: (newCurrency: keyof typeof CURRENCIES) => void;
  formatCurrency: (amount: number, currency: string) => string;
};

export type InputContextType = {
  calculation: string | null;
  pressedKeys: string[];
  result: number | null;
  secondMathFunctionSymbol: string | null;
  memory: number | null;
  updatePressedKeys: (key: string) => void;
  resetUserInput: () => void;
  removeLastPressedKey: () => void;
};
