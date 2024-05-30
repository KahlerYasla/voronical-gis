import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface Market {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export interface MarketStore {
    markets: Market[];
    setMarkets: (markets: Market[]) => void;
    fetchMarkets: () => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
    markets: [],
    setMarkets: (markets) => set({ markets }),
    fetchMarkets: async () => {
        try {
            const response = await axios.get<Market[]>(`${API_BASE_URL}/markets`);
            set({ markets: response.data });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(axiosError.message);
        }
    },
}));