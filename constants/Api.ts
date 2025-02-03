import { DefaultsType } from '@/types/types';

export const SPECS_TICKERS = {
  btc: 'btc-bitcoin',
  eth: 'eth-ethereum',
  xrp: 'xrp-xrp',
  usdt: 'usdt-tether',
  sol: 'sol-solana',
  bnb: 'bnb-binance-coin',
  usdc: 'usdc-usd-coin',
  // easily extensible
  // doge: 'doge-dogecoin',
} as const;

export const DEFAULT_TICKERS_SELECTED_FOR_UI = {
  btc: true,
  eth: true,
  xrp: false,
  usdt: false,
  sol: false,
  bnb: false,
  usdc: false,
  // doge: false,
};

export const DEFAULT: DefaultsType = {
  ticker: 'btc-bitcoin',
  tickerKey: 'btc',
  currency: 'USD',
  currencyKey: 'usd',
  selectedTickers: [{ btc: 'btc-bitcoin' }, { eth: 'eth-ethereum' }],
};

export const TICKERS_DATA_END_POINT = 'https://api.coinpaprika.com/v1/tickers/';

export const SPECS_CURRENCIES = {
  gbp: 'GBP',
  usd: 'USD',
  eur: 'EUR',
  aud: 'AUD',
} as const;

export const DEFAULT_CURRENCIES_SELECTED_FOR_UI = {
  gbp: true,
  usd: true,
  eur: false,
  aud: false,
} as const;
