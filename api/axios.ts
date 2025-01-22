import { dataEndpoint, currencies, tickers } from '@/constants/Api';
import axios from 'axios';

export const fetchTickerData = async (
  ticker: keyof typeof tickers
): Promise<void> => {
  try {
    const response = await axios.get(`${dataEndpoint}${tickers[ticker]}`, {
      params: { currencies },
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
