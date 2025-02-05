import { TICKERS_DATA_END_POINT } from '@/constants/Api';
import axios from 'axios';

export const fetchTickerData = async (ticker: string, currencies: string): Promise<any> => {
  try {
    const response = await axios.get(`${TICKERS_DATA_END_POINT}${ticker}`, {
      params: { quotes: currencies },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('Axios error:', error.response?.data || error.message);
    } else {
      console.warn('Unexpected error:', error);
    }
  }
};
