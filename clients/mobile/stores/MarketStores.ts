import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface Market {
    id: number;
    name: string;
    types: string;
    geom: string;
    reviewCount: number;
    latitude: number;
    longitude: number;
    voronoiScore: number;
}

interface CreateMarketRequest {
    name: string;
    geom: string;
}

export interface MarketStore {
    markets: Market[];
    setMarkets: (markets: Market[]) => Promise<boolean>;
    createMarket: (market: CreateMarketRequest) => Promise<boolean>;
    fetchMarkets: () => Promise<boolean>;
}

export const useMarketStore = create<MarketStore>((set) => ({
    markets: [],


    setMarkets: async (markets) => {
        set({ markets });
        return true;
    },


    createMarket: async (market) => {
        const url = `${API_BASE_URL}/market/create`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const marketData = {
            name: market.name,
            location: market.geom
        };

        try {
            console.log(marketData);
            const response = await axios.post<Market>(url, marketData, { headers });
            console.log(response.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(axiosError.message);
            console.error(axiosError.response?.data);
            console.error(axiosError.response?.status);
        }

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
            const response = await axios.post<Market[]>(url, { headers, data });

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