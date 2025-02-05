import { TICKERS_DATA_END_POINT } from '@/constants/Api';
import axios from 'axios';
import fakeData from '@/dummy/fake-data.json';

export const fetchTickerData = async (ticker: string, currencies: string): Promise<any> => {
  try {
    const response = await axios.get(`${TICKERS_DATA_END_POINT}${ticker}`, {
      params: { quotes: currencies },
    });
    return response.data;
  } catch (error) {
    console.warn('fetchData error', error);

    const fallback = fakeData.find((item) => item.key === ticker);

    if (fallback) {
      return fallback.data;
    } else {
      console.warn(`No fake data available for ${ticker}`);
      return null;
    }
  }
};
