import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface LineString {
    coordinates: number[][];
}

interface NavigationRequest {
    from: string;
    to: string;
}

export interface NavigationStore {
    navigateToMarket: (from: string, to: string) => Promise<LineString>;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    lineString: { coordinates: [] },

    navigateToMarket: async (from: string, to: string) => {
        console.log(from, to);

        const url = `${API_BASE_URL}/navigation`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const navigationData: NavigationRequest = {
            from,
            to
        };

        axios.post<LineString>(url, navigationData, { headers })
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                const axiosError = error as AxiosError;
                console.error(axiosError.message);
                console.error(axiosError.response?.data);
                console.error(axiosError.response?.status);
            });

        return { coordinates: [] };
    },
}));