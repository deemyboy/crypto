import { useState, useEffect } from 'react';
import { useCoins } from '../contexts/coinsContext';
import {
  Trend,
  TSimplifiedTickerData,
  TTickerMap as Tickers,
  TTickerQuote,
  TTickerKeyValue,
  TTickerKey,
  TCurrencyKey,
  TCurrencyKeyValue,
} from '../types/types';
import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

export const useTickerData = () => {
  const { currency, ticker, combinedTickerData } = useCoins();

  const [tickerData, setTickerData] = useState<{
    quotes: TSimplifiedTickerData['quotes'] | undefined;
    timeAgo: string | undefined;
    trends: Trend[];
    price: string;
    tickers: TTickerKeyValue[];
    currencies: TCurrencyKeyValue[];
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
      const componentData = combinedTickerData[ticker];

      if (componentData) {
        const { quotes: componentQuotes, last_updated: timeAgoData } = componentData;

        const percentChanges: Record<string, string | undefined> = {};

        if (componentQuotes && componentQuotes[currency]) {
          const currencyQuotes = componentQuotes[currency] as TTickerQuote;

          const orderedKeys: (keyof TTickerQuote)[] = [
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

        const tickers = Object.entries(SPECS_TICKERS).map(
          ([key, value]) => ({ key: key as TTickerKey, value } as TTickerKeyValue)
        );

        const currencies = Object.entries(SPECS_CURRENCIES).map(
          ([key, value]) => ({ key: key as TCurrencyKey, value } as TCurrencyKeyValue)
        );

        const price = componentQuotes[currency]?.price || '0';

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
  }, [combinedTickerData, ticker, currency]);

  return tickerData;
};
