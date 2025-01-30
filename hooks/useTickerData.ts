import { useState, useEffect } from 'react';
import { useCoins } from '../contexts/coinsContext';
import {
  Trend,
  SimplifiedTickerDataType,
  TickerMap as Tickers,
  TickerQuote,
  TickerValue,
  TickerKey,
  CurrencyKey,
  CurrencyValue,
} from '../types/types';
import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

export const useTickerData = () => {
  const { coinState, combinedTickerData } = useCoins();

  const [tickerData, setTickerData] = useState<{
    quotes: SimplifiedTickerDataType['quotes'] | undefined;
    timeAgo: string | undefined;
    trends: Trend[];
    price: string;
    tickers: { key: TickerKey; value: TickerValue }[];
    currencies: { key: CurrencyKey; value: CurrencyValue }[];
  }>({
    quotes: undefined,
    timeAgo: undefined,
    trends: [],
    price: '0',
    tickers: [],
    currencies: [],
  });

  useEffect(() => {
    if (combinedTickerData) {
      const componentData = combinedTickerData[coinState.ticker];

      if (componentData) {
        const { quotes: componentQuotes, last_updated: timeAgoData } = componentData;

        const percentChanges: Record<string, string | undefined> = {};

        if (componentQuotes && componentQuotes[coinState.currency]) {
          const currencyQuotes = componentQuotes[coinState.currency] as TickerQuote;

          const orderedKeys: (keyof TickerQuote)[] = [
            'percent_change_15m',
            'percent_change_30m',
            'percent_change_1h',
            'percent_change_6h',
            'percent_change_12h',
            'percent_change_24h',
            'percent_change_7d',
            'percent_change_30d',
            'percent_change_1y',
          ];

          orderedKeys.forEach((key) => {
            const trimmedKey = key.replace('percent_change_', '');
            percentChanges[trimmedKey] = currencyQuotes[key];
          });
        }

        const trends = Object.entries(percentChanges).map(([key, value], index, array) => ({
          key,
          value: value || '0',
          isLast: index === array.length - 1,
        }));

        const price = componentQuotes[coinState.currency]?.price || '0';

        const tickers = Object.entries(SPECS_TICKERS).map(([key, value]) => ({
          key: key as TickerKey,
          value: value as TickerValue,
        }));

        const currencies = Object.entries(SPECS_CURRENCIES).map(([key, value]) => ({
          key: key as CurrencyKey,
          value: value as CurrencyValue,
        }));

        setTickerData({
          quotes: componentQuotes,
          timeAgo: timeAgoData,
          trends,
          price,
          tickers,
          currencies,
        });
      }
    }
  }, [combinedTickerData, coinState.ticker, coinState.currency]);

  return tickerData;
};
