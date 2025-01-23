import {
  TICKERS_DATA_END_POINT,
  CURRENCIES,
  COINS_DATA_END_POINT,
} from '@/constants/Api';
import { TCoinData } from '@/types/types';
import axios from 'axios';

export const fetchTickerData = async (
  ticker: string,
  currency: keyof typeof CURRENCIES
): Promise<any> => {
  try {
    console.log('🚀  |  file: axios.ts:16  |  ticker:', ticker);
    const response = await axios.get(`${TICKERS_DATA_END_POINT}${ticker}`, {
      params: { quotes: CURRENCIES[currency] },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

export const fetchCoinsData = async (): Promise<any> => {
  try {
    const response = await axios.get(COINS_DATA_END_POINT);
    return response.data as TCoinData[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

/**const data = {
  "beta_value": 0.932524,
  "first_data_at": "2010-07-17T00:00:00Z",
  "id": "btc-bitcoin",
  "last_updated": "2025-01-22T17:39:28Z",
  "max_supply": 21000000,
  "name": "Bitcoin",
  "quotes": {
    "USD": {
      "ath_date": "2025-01-20T07:11:03Z",
      "ath_price": 109021.48210276755,
      "market_cap": 2070620105381,
      "market_cap_change_24h": -2.49,
      "percent_change_12h": -1.19,
      "percent_change_15m": 0.27,
      "percent_change_1h": 0.8,
      "percent_change_1y": 157.87,
      "percent_change_24h": -2.5,
      "percent_change_30d": 5.18,
      "percent_change_30m": 0.48,
      "percent_change_6h": -0.71,
      "percent_change_7d": 5.53,
      "percent_from_price_ath": -4.27,
      "price": 104504.64368286531,
      "volume_24h": 56876637294.10885,
      "volume_24h_change_24h": -32.03
    }
  },
  "rank": 1,
  "symbol": "BTC",
  "total_supply": 19813666
}; */
