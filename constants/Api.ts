import { TDefaults } from '@/types/types';

export const SPECS_CURRENCIES = {
  gbp: 'GBP',
  usd: 'USD',
  // easily extensible - need to verify these currencies are available for that ticker
  // eur: 'EUR',
  // aud: 'AUD',
} as const;

export const SPECS_TICKERS = {
  btc: 'btc-bitcoin',
  eth: 'eth-ethereum',
  // easily extensible
  // xrp: 'xrp-xrp',
} as const;

export const DEFAULT: TDefaults = {
  ticker: 'btc-bitcoin',
  tickerKey: 'btc',
  currency: 'USD',
  currencyKey: 'usd',
};

export const TICKERS_DATA_END_POINT = 'https://api.coinpaprika.com/v1/tickers/';
