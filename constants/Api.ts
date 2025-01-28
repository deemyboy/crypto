export const SPECS_CURRENCIES = {
  gbp: 'GBP',
  usd: 'USD',
  // easily extensible
  // eur: 'EUR',
  // aud: 'AUD',
} as const;

export const SPECS_TICKERS = {
  btc: 'btc-bitcoin',
  eth: 'eth-ethereum',
  // easily extensible
  // xrp: 'xrp-xrp',
} as const;

export const TICKERS_DATA_END_POINT = 'https://api.coinpaprika.com/v1/tickers/';
