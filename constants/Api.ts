import { DefaultsType } from '@/types/types';

export const SPECS_CURRENCIES = {
  gbp: 'GBP',
  usd: 'USD',
  // easily extensible
  // need to verify these currencies are available for that ticker
  // max 4 otherwise currency button breaks
  eur: 'EUR',
  aud: 'AUD',
} as const;

export const SPECS_TICKERS = {
  btc: 'btc-bitcoin',
  eth: 'eth-ethereum',
  xrp: 'xrp-xrp',
  usdt: 'usdt-tether',
  sol: 'sol-solana',
  bnb: 'bnb-binance-coin',
  usdc: 'usdc-usd-coin',
  doge: 'doge-dogecoin',
  // easily extensible
  // xrp: 'xrp-xrp',
} as const;

export const DEFAULT: DefaultsType = {
  ticker: 'btc-bitcoin',
  tickerKey: 'btc',
  currency: 'USD',
  currencyKey: 'usd',
  selectedTickers: [{ btc: 'btc-bitcoin' }, { eth: 'eth-ethereum' }],
};

export const TICKERS_DATA_END_POINT = 'https://api.coinpaprika.com/v1/tickers/';
