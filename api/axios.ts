import { TICKERS_DATA_END_POINT, SPECS_CURRENCIES } from '@/constants/Api';
import { TCoinData } from '@/types/types';
import axios from 'axios';

export const fetchTickerData = async (ticker: string): Promise<any> => {
  // console.log('🚀  |  file: axios.ts:19  |  fetchTickerData  |:');
  try {
    const response = await axios.get(`${TICKERS_DATA_END_POINT}${ticker}`, {
      params: { quotes: Object.values(SPECS_CURRENCIES).join(',') },
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
