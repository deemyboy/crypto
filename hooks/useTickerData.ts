import { useState, useEffect } from 'react';
import { useCoins } from '../contexts/coinsContext';
import { Trend, SimplifiedTickerDataType, TickerQuote, TickerKey, CurrencyKey } from '../types/types';
import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import { getTicker, getCurrency } from '@/utils/utils';

export const useTickerData = () => {
  const { coinState, combinedTickerData } = useCoins();

  const [tickerData, setTickerData] = useState<{
    quotes: SimplifiedTickerDataType['quotes'] | undefined;
    timeAgo: string | undefined;
    trends: Trend[];
    price: string;
    tickers: TickerKey[];
    currencies: CurrencyKey[];
  }>({
    quotes: undefined,
    timeAgo: undefined,
    trends: [],
    price: '0',
    tickers: [],
    currencies: [],
  });

  const ticker = getTicker(coinState.tickerKey);
  const currency = getCurrency(coinState.currencyKey);

  useEffect(() => {
    if (!combinedTickerData || !ticker || !currency) {
      return;
    }

    const componentData = combinedTickerData[ticker];

    if (!componentData) {
      return;
    }

    if (combinedTickerData) {
      const componentData = combinedTickerData[ticker];

      if (componentData) {
        const { quotes: currencyQuotes, last_updated: timeAgoData } = componentData;

        const percentChanges: Record<string, string | undefined> = {};

        if (currencyQuotes) {
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
            percentChanges[trimmedKey] = currencyQuotes[currency][key];
          });
        }

        const trends = Object.entries(percentChanges).map(([key, value], index, array) => ({
          key,
          value: value || '0',
          isLast: index === array.length - 1,
        }));

        const price = currencyQuotes?.[currency]?.price ?? '0';

        const tickers = Object.entries(SPECS_TICKERS).map(([key]) => key as TickerKey);

        const currencies = Object.entries(SPECS_CURRENCIES).map(([key]) => key as CurrencyKey);

        setTickerData({
          quotes: currencyQuotes,
          timeAgo: timeAgoData,
          trends,
          price,
          tickers,
          currencies,
        });
      }
    }
  }, [combinedTickerData, coinState]);

  return tickerData;
};
