import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface LineString {
    coordinates: number[][];
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


    navigateToMarket: (from: string, to: string) => {
        console.log(from, to);
    },
}));