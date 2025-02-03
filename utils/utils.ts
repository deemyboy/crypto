import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import { TickerKey, CurrencyKey } from '@/types/types';

export const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const isCurrencyKey = (key: TickerKey | CurrencyKey): key is CurrencyKey => {
  return key in SPECS_CURRENCIES;
};

export const isTickerKey = (key: TickerKey | CurrencyKey): key is TickerKey => {
  return key in SPECS_TICKERS;
};
