import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface Market {
    id: number;
    name: string;
    types: string;
    geom: string;
    review_count: number;
    latitude: number;
    longitude: number;
}

export interface MarketStore {
    markets: Market[];
    setMarkets: (markets: Market[]) => Promise<boolean>;
    fetchMarkets: () => Promise<boolean>;
}

export const useMarketStore = create<MarketStore>((set) => ({
    markets: [],


    setMarkets: async (markets) => {
        set({ markets });
        return true;
    },


    fetchMarkets: async () => {
        const url = `${API_BASE_URL}/market/`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const data = {
            "territory_id": 0
        };

        try {
            const response = await axios.post<Market[]>(url, { headers, data }
            );
            response.data.forEach((market: Market) => {
                market.longitude = parseFloat(market.geom.split(',')[1]);
                market.latitude = parseFloat(market.geom.split(',')[0]);
            });

            set({ markets: response.data });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(axiosError.message);
            console.error(axiosError.response?.data);
            console.error(axiosError.response?.status);
        }

        return true;
    },
}));